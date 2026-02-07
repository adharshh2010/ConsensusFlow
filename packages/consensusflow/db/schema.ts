import {
  bigint,
  date,
  integer,
  pgTable,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";

import { v7 } from "uuid";

export const usersTable = pgTable("users", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  uuid: varchar({ length: 255 })
    .unique()
    .notNull()
    .$defaultFn(() => v7()),
  username: varchar({ length: 255 }).unique(),

  name: varchar({ length: 255 }),
  age: integer().default(0),
  email: varchar({ length: 255 }).notNull().unique(),
  emailVerifiedAt: timestamp("email_verified_at", {
    precision: 3,
    withTimezone: true,
  }),
  isEmailVerified: boolean("is_email_verified").notNull().default(false),

  phone: varchar({ length: 16 }).unique(),
  phoneVerifiedAt: timestamp("phone_verified_at", {
    precision: 3,
    withTimezone: true,
  }),
  isPhoneVerified: boolean("is_phone_verified").notNull().default(false),

  password: varchar({ length: 255 }),

  twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
  twoFactorVerifiedAt: timestamp("two_factor_verified_at", {
    precision: 3,
    withTimezone: true,
  }),

  created_at: timestamp("created_at", { precision: 3, withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { precision: 3, withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
