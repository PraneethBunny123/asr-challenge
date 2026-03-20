import {
  pgTable,
  text,
  timestamp,
  boolean
} from "drizzle-orm/pg-core";


export const usersTable = pgTable("users", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").notNull().default(false),

	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),

	// rbac columns
	role: text("role").default("viewer"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires", { withTimezone: true }),
});


export const sessionsTable = pgTable("sessions", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),

	token: text("token").notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
  
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});


export const accountsTable = pgTable("accounts", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),

	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
	scope: text("scope"),
	idToken: text("id_token"),
	password: text("password"),

	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});


export const verificationsTable = pgTable("verifications", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),

	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt:  timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Inferred types
export type UserRow = typeof usersTable.$inferSelect;
export type NewUserRow = typeof usersTable.$inferInsert;

export type SessionRow = typeof sessionsTable.$inferSelect;