import type { Express } from "express";
import { createServer, type Server } from "http";
import { promises as fs } from "fs";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Timeline API endpoint - serves data from JSON file
  app.get("/api/timeline", async (req, res) => {
    try {
      const timelineFilePath = path.join(process.cwd(), "data", "timeline.json");
      const timelineData = await fs.readFile(timelineFilePath, "utf8");
      const timelineItems = JSON.parse(timelineData);
      res.json(timelineItems);
    } catch (error) {
      console.error("Get timeline error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}