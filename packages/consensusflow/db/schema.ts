import {
  bigint,
  date,
  integer,
  pgTable,
  timestamp,
  varchar,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";

import { v7 } from "uuid";
import { sql } from "drizzle-orm";

export const usersTable = pgTable("users", {
  // this is the primary key of the table and it will be id that is private and only available to the user when they request data and to admins this is sensitive data and should not be exposed to the others. If the account turns into a creator account then the id will be used as the monetization id and it will be used to track the earnings of the creator and it will be used to pay the creator. so the id is very important and it should be unique and it should be random and it should be hard to guess.
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
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

export const otptable = pgTable("otps", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: varchar({ length: 255 }).unique().notNull(),
  otp: varchar({ length: 6 }).notNull(),
  expiresAt: timestamp("expires_at", {
    precision: 3,
    withTimezone: true,
  }).notNull(),
});
