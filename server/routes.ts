import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Timeline API endpoint - serves data from database
  app.get("/api/timeline", async (req, res) => {
    try {
      const items = await storage.getTimelineItems();
      res.json(items);
    } catch (error) {
      console.error("Get timeline error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}