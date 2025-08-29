import type { AppLoadContext } from 'react-router';
import * as schema from '../../../../database/schema';
import { eq } from 'drizzle-orm';
import chunk from 'lodash.chunk';

export type CreateEventData = {
  name: string;
  slug: string;
  submissions: Array<{
    name: string;
    twitch: string;
    order: number;
  }>;
};

export const createRelayEvent = async (
  context: AppLoadContext,
  moderatorId: string,
  eventData: CreateEventData,
) => {
  const [createdEvent] = await context.db
    .insert(schema.relayEvents)
    .values({
      name: eventData.name,
      slug: eventData.slug,
      moderator: moderatorId,
    })
    .returning();

  const chunkedSubmissions = chunk(eventData.submissions, 20);

  for (const submissionChunk of chunkedSubmissions) {
    await context.db.insert(schema.relaySubmissions).values(
      submissionChunk.map(submission => ({
        eventId: createdEvent.id,
        name: submission.name,
        twitch: submission.twitch,
        order: submission.order,
      })),
    );
  }

  const firstSubmission = await context.db.query.relaySubmissions.findFirst({
    where: (submissions, { eq, and }) => and(
      eq(submissions.eventId, createdEvent.id),
      eq(submissions.order, 1),
    ),
  });

  if (firstSubmission) {
    await context.db.insert(schema.relayCursors).values({
      eventId: createdEvent.id,
      currentSubmissionId: firstSubmission.id,
      raidedAt: null,
    });
  }

  return createdEvent;
};

export const getRelayEventWithSubmissions = async (
  context: AppLoadContext,
  eventId: number,
) => {
  const event = await context.db.query.relayEvents.findFirst({
    where: (events, { eq }) => eq(events.id, eventId),
  });

  if (!event) {
    return null;
  }

  const submissions = await context.db.query.relaySubmissions.findMany({
    where: (submissions, { eq }) => eq(submissions.eventId, eventId),
    orderBy: (submissions, { asc }) => asc(submissions.order),
  });

  return {
    ...event,
    submissions,
  };
};

export const updateRelayEvent = async (
  context: AppLoadContext,
  eventId: number,
  moderatorId: string,
  eventData: CreateEventData,
) => {
  const existingEvent = await context.db.query.relayEvents.findFirst({
    where: (events, { eq, and }) => and(
      eq(events.id, eventId),
      eq(events.moderator, moderatorId),
    ),
  });

  if (!existingEvent) {
    throw new Error('Event not found or unauthorized');
  }

  await context.db
    .update(schema.relayEvents)
    .set({ name: eventData.name, slug: eventData.slug })
    .where(eq(schema.relayEvents.id, eventId));

  await context.db
    .delete(schema.relaySubmissions)
    .where(eq(schema.relaySubmissions.eventId, eventId));

  const chunkedSubmissions = chunk(eventData.submissions, 20);

  for (const submissionChunk of chunkedSubmissions) {
    await context.db.insert(schema.relaySubmissions).values(
      submissionChunk.map(submission => ({
        eventId: eventId,
        name: submission.name,
        twitch: submission.twitch,
        order: submission.order,
      })),
    );
  }

  return existingEvent;
};

export const getRelayEventsByModerator = async (
  context: AppLoadContext,
  moderatorId: string,
) => {
  const events = await context.db.query.relayEvents.findMany({
    where: (events, { eq }) => eq(events.moderator, moderatorId),
    orderBy: (events, { desc }) => desc(events.id),
  });

  return events;
};

export const getRelayEventBySlug = async (
  context: AppLoadContext,
  slug: string,
) => {
  const event = await context.db.query.relayEvents.findFirst({
    where: (events, { eq }) => eq(events.slug, slug),
  });

  if (!event) {
    return null;
  }

  const submissions = await context.db.query.relaySubmissions.findMany({
    where: (submissions, { eq }) => eq(submissions.eventId, event.id),
    orderBy: (submissions, { asc }) => asc(submissions.order),
  });

  return {
    ...event,
    submissions,
  };
};

export const isSlugAvailable = async (
  context: AppLoadContext,
  slug: string,
  excludeEventId?: number,
) => {
  const existingEvent = await context.db.query.relayEvents.findFirst({
    where: (events, { eq, and, ne }) =>
      excludeEventId
        ? and(eq(events.slug, slug), ne(events.id, excludeEventId))
        : eq(events.slug, slug),
  });

  return !existingEvent;
};

export const getRelayEventsByTwitchId = async (
  context: AppLoadContext,
  twitchId: string,
) => {
  const events = await context.db
    .select({
      id: schema.relayEvents.id,
      name: schema.relayEvents.name,
      slug: schema.relayEvents.slug,
      moderator: schema.relayEvents.moderator,
    })
    .from(schema.relayEvents)
    .innerJoin(
      schema.relaySubmissions,
      eq(schema.relayEvents.id, schema.relaySubmissions.eventId),
    )
    .where(eq(schema.relaySubmissions.twitch, twitchId))
    .orderBy(schema.relayEvents.id);

  return events;
};

export const getRelayCursor = async (
  context: AppLoadContext,
  eventId: number,
) => {
  const cursor = await context.db.query.relayCursors.findFirst({
    where: (cursors, { eq }) => eq(cursors.eventId, eventId),
  });

  return cursor;
};

export const initializeRelayCursor = async (
  context: AppLoadContext,
  eventId: number,
) => {
  // イベントの最初の参加者を取得
  const firstSubmission = await context.db.query.relaySubmissions.findFirst({
    where: (submissions, { eq }) => eq(submissions.eventId, eventId),
    orderBy: (submissions, { asc }) => asc(submissions.order),
  });

  if (!firstSubmission) {
    throw new Error('No submissions found for this event');
  }

  // カーソルを初期化
  await context.db.insert(schema.relayCursors).values({
    eventId: eventId,
    currentSubmissionId: firstSubmission.id,
    raidedAt: null,
  }).onConflictDoNothing();

  return firstSubmission;
};

export const updateRelayCursor = async (
  context: AppLoadContext,
  eventId: number,
  targetSubmissionId: number,
  raidedAt?: Date,
) => {
  await context.db
    .update(schema.relayCursors)
    .set({
      currentSubmissionId: targetSubmissionId,
      raidedAt: raidedAt || null,
    })
    .where(eq(schema.relayCursors.eventId, eventId));

  return true;
};
