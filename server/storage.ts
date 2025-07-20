import { timelineItems, type TimelineItem, type InsertTimelineItem } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getTimelineItems(): Promise<TimelineItem[]>;
  createTimelineItem(item: InsertTimelineItem): Promise<TimelineItem>;
}

export class DatabaseStorage implements IStorage {
  async getTimelineItems(): Promise<TimelineItem[]> {
    return await db.select().from(timelineItems).orderBy(timelineItems.date);
  }

  async createTimelineItem(insertItem: InsertTimelineItem): Promise<TimelineItem> {
    const [item] = await db
      .insert(timelineItems)
      .values(insertItem)
      .returning();
    return item;
  }
}

export const storage = new DatabaseStorage();