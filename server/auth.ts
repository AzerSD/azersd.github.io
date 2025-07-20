import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import type { User } from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = "7d";

export interface AuthTokenPayload {
  userId: number;
  email: string;
  username: string;
}

export async function generateAuthToken(user: User): Promise<string> {
  const payload: AuthTokenPayload = {
    userId: user.id,
    email: user.email,
    username: user.username,
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export async function verifyAuthToken(token: string): Promise<AuthTokenPayload | null> {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    return payload;
  } catch (error) {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function authenticateUser(emailOrUsername: string, password: string): Promise<User | null> {
  return storage.validatePassword(emailOrUsername, password);
}

export async function createUserSession(user: User): Promise<{ token: string; expiresAt: Date }> {
  const token = await generateAuthToken(user);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  await storage.createSession(user.id, token, expiresAt);
  
  return { token, expiresAt };
}

export async function validateSession(token: string): Promise<User | null> {
  const session = await storage.getSessionByToken(token);
  if (!session) return null;
  
  const user = await storage.getUser(session.userId);
  return user || null;
}

export async function destroySession(token: string): Promise<void> {
  await storage.deleteSession(token);
}
