import { users, sessions, timelineItems, type User, type InsertUser, type Session, type TimelineItem, type InsertTimelineItem } from "@shared/schema";
import bcrypt from "bcryptjs";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByZitadelId(zitadelId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  // Authentication operations
  validatePassword(emailOrUsername: string, password: string): Promise<User | null>;
  
  // Session operations
  createSession(userId: number, token: string, expiresAt: Date): Promise<Session>;
  getSessionByToken(token: string): Promise<Session | undefined>;
  deleteSession(token: string): Promise<void>;
  deleteUserSessions(userId: number): Promise<void>;
  
  // Timeline operations
  getTimelineItems(): Promise<TimelineItem[]>;
  createTimelineItem(item: InsertTimelineItem): Promise<TimelineItem>;
  updateTimelineItem(id: number, updates: Partial<TimelineItem>): Promise<TimelineItem | undefined>;
  deleteTimelineItem(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private sessions: Map<string, Session>;
  private timelineItems: Map<number, TimelineItem>;
  private currentUserId: number;
  private currentSessionId: number;
  private currentTimelineId: number;

  constructor() {
    this.users = new Map();
    this.sessions = new Map();
    this.timelineItems = new Map();
    this.currentUserId = 1;
    this.currentSessionId = 1;
    this.currentTimelineId = 1;
    
    // Add some sample timeline items
    this.addSampleTimelineItems();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByZitadelId(zitadelId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.zitadelId === zitadelId,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
      isActive: true,
      password: insertUser.password || null,
      zitadelId: insertUser.zitadelId || null,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async validatePassword(emailOrUsername: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(emailOrUsername) || 
                 await this.getUserByUsername(emailOrUsername);
    
    if (!user || !user.password) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  async createSession(userId: number, token: string, expiresAt: Date): Promise<Session> {
    const session: Session = {
      id: this.currentSessionId++,
      userId,
      token,
      expiresAt,
      createdAt: new Date(),
    };
    this.sessions.set(token, session);
    return session;
  }

  async getSessionByToken(token: string): Promise<Session | undefined> {
    const session = this.sessions.get(token);
    if (!session) return undefined;
    
    // Check if session is expired
    if (session.expiresAt < new Date()) {
      this.sessions.delete(token);
      return undefined;
    }
    
    return session;
  }

  async deleteSession(token: string): Promise<void> {
    this.sessions.delete(token);
  }

  async deleteUserSessions(userId: number): Promise<void> {
    const sessionsToDelete: string[] = [];
    for (const [token, session] of this.sessions.entries()) {
      if (session.userId === userId) {
        sessionsToDelete.push(token);
      }
    }
    for (const token of sessionsToDelete) {
      this.sessions.delete(token);
    }
  }

  // Timeline operations
  async getTimelineItems(): Promise<TimelineItem[]> {
    return Array.from(this.timelineItems.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createTimelineItem(insertItem: InsertTimelineItem): Promise<TimelineItem> {
    const id = this.currentTimelineId++;
    const item: TimelineItem = {
      ...insertItem,
      id,
      createdAt: new Date(),
      technologies: insertItem.technologies || [],
    };
    this.timelineItems.set(id, item);
    return item;
  }

  async updateTimelineItem(id: number, updates: Partial<TimelineItem>): Promise<TimelineItem | undefined> {
    const item = this.timelineItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...updates };
    this.timelineItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteTimelineItem(id: number): Promise<void> {
    this.timelineItems.delete(id);
  }

  private addSampleTimelineItems(): void {
    const sampleItems: Array<Omit<TimelineItem, 'id' | 'createdAt'>> = [
      {
        title: "AI-Powered Portfolio Website",
        description: "Built a modern portfolio website with vertical timeline showcasing projects, events, and hackathons. Features beautiful animations and responsive design.",
        category: "project",
        link: "https://github.com/yourusername/portfolio",
        date: new Date("2024-12-01"),
        technologies: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
      },
      {
        title: "TechCrunch Disrupt Hackathon 2024",
        description: "Developed an innovative fintech solution for micro-investments. Won 2nd place in the fintech category with a team of 4 developers.",
        category: "hackathon",
        link: "https://devpost.com/software/micro-invest",
        date: new Date("2024-10-15"),
        technologies: ["React Native", "Node.js", "PostgreSQL", "Stripe API"],
      },
      {
        title: "Full-Stack E-commerce Platform",
        description: "Created a complete e-commerce solution with user authentication, payment processing, inventory management, and admin dashboard.",
        category: "project",
        link: "https://github.com/yourusername/ecommerce",
        date: new Date("2024-09-20"),
        technologies: ["Next.js", "Prisma", "MySQL", "PayPal API", "AWS"],
      },
      {
        title: "React Conference 2024 Speaker",
        description: "Presented on 'Modern State Management Patterns in React' to an audience of 500+ developers. Shared insights on Zustand and React Query best practices.",
        category: "event",
        link: "https://reactconf2024.com/speakers",
        date: new Date("2024-08-12"),
        technologies: ["React", "Zustand", "React Query", "Performance Optimization"],
      },
      {
        title: "NASA Space Apps Challenge",
        description: "Built a web application to visualize climate data from NASA satellites. Created interactive 3D globe showing temperature and precipitation patterns.",
        category: "hackathon",
        link: "https://github.com/team/climate-viz",
        date: new Date("2024-07-28"),
        technologies: ["Three.js", "D3.js", "Python", "NASA APIs", "WebGL"],
      },
      {
        title: "Open Source Contribution",
        description: "Major contributor to a popular React component library. Added accessibility features and improved TypeScript definitions for better developer experience.",
        category: "project",
        link: "https://github.com/component-library/react-components",
        date: new Date("2024-06-10"),
        technologies: ["React", "TypeScript", "Jest", "Storybook", "ARIA"],
      }
    ];

    sampleItems.forEach(item => {
      const id = this.currentTimelineId++;
      const timelineItem: TimelineItem = {
        ...item,
        id,
        createdAt: new Date(),
      };
      this.timelineItems.set(id, timelineItem);
    });
  }
}

export const storage = new MemStorage();
