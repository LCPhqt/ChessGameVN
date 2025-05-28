import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  rating: integer("rating").default(1200),
  gamesPlayed: integer("games_played").default(0),
  gamesWon: integer("games_won").default(0),
});

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  whitePlayerId: integer("white_player_id").references(() => users.id),
  blackPlayerId: integer("black_player_id").references(() => users.id),
  gameState: text("game_state").notNull(), // FEN notation
  moves: text("moves").notNull().default(""), // PGN format
  status: text("status").notNull().default("active"), // active, completed, abandoned
  winner: text("winner"), // white, black, draw
  timeControl: integer("time_control").default(600), // seconds
  whiteTimeRemaining: integer("white_time_remaining").default(600),
  blackTimeRemaining: integer("black_time_remaining").default(600),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGameSchema = createInsertSchema(games).pick({
  whitePlayerId: true,
  blackPlayerId: true,
  gameState: true,
  moves: true,
  timeControl: true,
}).extend({
  whitePlayerId: z.number().nullable().optional(),
  blackPlayerId: z.number().nullable().optional(),
  moves: z.string().optional(),
  timeControl: z.number().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;
