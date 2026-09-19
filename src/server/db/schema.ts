import { pgTable, uuid, text, timestamp, index, pgEnum } from "drizzle-orm/pg-core";

/**
 * How an entry left the typewriter.
 *  - "stamped" → sealed into the envelope folder
 *  - "planted" → became a sunflower in the garden
 * The garden is derived from a count of "planted" rows, so there is no
 * separate garden table to keep in sync.
 */
export const entryKind = pgEnum("entry_kind", ["stamped", "planted"]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("users_email_idx").on(t.email)],
);

export const entries = pgTable(
  "entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    kind: entryKind("kind").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("entries_user_created_idx").on(t.userId, t.createdAt)],
);

export type User = typeof users.$inferSelect;
export type Entry = typeof entries.$inferSelect;
export type NewEntry = typeof entries.$inferInsert;
