import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const relayEvents = sqliteTable('relayEvents', {
  id: integer().primaryKey({ autoIncrement: true }),
  moderator: text().notNull(),
  name: text().notNull(),
  slug: text().notNull().unique(),
});

export const relaySubmissions = sqliteTable('relaySubmissions', {
  id: integer().primaryKey({ autoIncrement: true }),
  eventId: integer().notNull().references(() => relayEvents.id, { onDelete: 'cascade' }),
  name: text().notNull(),
  twitch: text().notNull(),
  order: integer().notNull(),
});

export const relayCursors = sqliteTable('relayCursors', {
  eventId: integer().primaryKey().references(() => relayEvents.id, { onDelete: 'cascade' }),
  currentSubmissionId: integer().notNull().references(() => relaySubmissions.id, { onDelete: 'cascade' }),
  raidedAt: integer({ mode: 'timestamp' }),
});
