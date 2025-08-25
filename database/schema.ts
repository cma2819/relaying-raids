import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const relayEvents = sqliteTable("relayEvents", {
  id: integer().primaryKey({ autoIncrement: true }),
  moderator: text().notNull(),
  name: text().notNull(),
});

export const relaySubmissions = sqliteTable("relaySubmissions", {
  id: integer().primaryKey({ autoIncrement: true }),
  eventId: integer().notNull().references(() => relayEvents.id, { onDelete: "cascade" }),
  name: text().notNull(),
  twitch: text().notNull()
});