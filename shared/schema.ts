import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull(),
  photoUrl: text("photo_url").default(""),
  fcmToken: text("fcm_token").default(""),
  profileComplete: boolean("profile_complete").default(false),
  isActive: boolean("is_active").default(true),
  lastActive: timestamp("last_active").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").default(""),
  status: text("status").notNull().default("pending"),
  priority: text("priority").default("medium"),
  assignedTo: text("assigned_to"),
  createdBy: text("created_by").notNull(),
  createdByName: text("created_by_name").notNull(),
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const adminProfiles = pgTable("admin_profiles", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  privileges: text("privileges").array().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAdminProfileSchema = createInsertSchema(adminProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type AdminProfile = typeof adminProfiles.$inferSelect;
export type InsertAdminProfile = z.infer<typeof insertAdminProfileSchema>;
