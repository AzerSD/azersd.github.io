import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Portfolio timeline schema
export const timelineItems = pgTable("timeline_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // "project", "event", "hackathon"
  link: text("link"),
  date: timestamp("date").notNull(),
  technologies: text("technologies").array(), // Array of tech used
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTimelineItemSchema = createInsertSchema(timelineItems).omit({
  id: true,
  createdAt: true,
});

export type TimelineItem = typeof timelineItems.$inferSelect;
export type InsertTimelineItem = z.infer<typeof insertTimelineItemSchema>;
