import { z } from "zod";

// Portfolio timeline interface (matches JSON structure)
export interface TimelineItem {
  id: number;
  title: string;
  description: string;
  category: "project" | "event" | "hackathon";
  link?: string;
  date: string;
  technologies: string[];
}
