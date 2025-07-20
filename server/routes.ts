import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, registerSchema, type LoginData, type RegisterData } from "@shared/schema";
import { authenticateUser, createUserSession, hashPassword, validateSession, destroySession } from "./auth";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Login endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const loginData = loginSchema.parse(req.body) as LoginData;
      
      const user = await authenticateUser(loginData.emailOrUsername, loginData.password);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      if (!user.isActive) {
        return res.status(401).json({ message: "Account is inactive" });
      }
      
      const { token, expiresAt } = await createUserSession(user);
      
      // Set HTTP-only cookie
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: expiresAt,
      });
      
      res.json({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        token,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Register endpoint
  app.post("/api/auth/register", async (req, res) => {
    try {
      const registerData = registerSchema.parse(req.body) as RegisterData;
      
      // Check if user already exists
      const existingUserByEmail = await storage.getUserByEmail(registerData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      const existingUserByUsername = await storage.getUserByUsername(registerData.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      // Hash password
      const hashedPassword = await hashPassword(registerData.password);
      
      // Create user
      const user = await storage.createUser({
        ...registerData,
        password: hashedPassword,
      });
      
      const { token, expiresAt } = await createUserSession(user);
      
      // Set HTTP-only cookie
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: expiresAt,
      });
      
      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        token,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", async (req, res) => {
    try {
      const token = req.cookies.auth_token;
      if (token) {
        await destroySession(token);
        res.clearCookie("auth_token");
      }
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get current user
  app.get("/api/auth/me", async (req, res) => {
    try {
      const token = req.cookies.auth_token;
      if (!token) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const user = await validateSession(token);
      if (!user) {
        res.clearCookie("auth_token");
        return res.status(401).json({ message: "Invalid session" });
      }
      
      res.json({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Zitadel OAuth endpoints
  app.get("/api/auth/zitadel", (req, res) => {
    const zitadelDomain = process.env.ZITADEL_DOMAIN || "https://your-zitadel-domain.com";
    const clientId = process.env.ZITADEL_CLIENT_ID || "your-client-id";
    const redirectUri = encodeURIComponent(`${req.protocol}://${req.get("host")}/api/auth/zitadel/callback`);
    
    const authUrl = `${zitadelDomain}/oauth/v2/authorize?` +
      `client_id=${clientId}&` +
      `response_type=code&` +
      `scope=openid%20profile%20email&` +
      `redirect_uri=${redirectUri}`;
    
    res.redirect(authUrl);
  });

  app.get("/api/auth/zitadel/callback", async (req, res) => {
    try {
      const { code } = req.query;
      if (!code) {
        return res.status(400).json({ message: "Authorization code missing" });
      }
      
      const zitadelDomain = process.env.ZITADEL_DOMAIN || "https://your-zitadel-domain.com";
      const clientId = process.env.ZITADEL_CLIENT_ID || "your-client-id";
      const clientSecret = process.env.ZITADEL_CLIENT_SECRET || "your-client-secret";
      const redirectUri = `${req.protocol}://${req.get("host")}/api/auth/zitadel/callback`;
      
      // Exchange code for token
      const tokenResponse = await fetch(`${zitadelDomain}/oauth/v2/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: code as string,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
        }),
      });
      
      if (!tokenResponse.ok) {
        throw new Error("Failed to exchange code for token");
      }
      
      const tokenData = await tokenResponse.json();
      
      // Get user info
      const userResponse = await fetch(`${zitadelDomain}/oidc/v1/userinfo`, {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });
      
      if (!userResponse.ok) {
        throw new Error("Failed to get user info");
      }
      
      const zitadelUser = await userResponse.json();
      
      // Find or create user
      let user = await storage.getUserByZitadelId(zitadelUser.sub);
      if (!user) {
        user = await storage.createUser({
          email: zitadelUser.email,
          username: zitadelUser.preferred_username || zitadelUser.email,
          zitadelId: zitadelUser.sub,
          firstName: zitadelUser.given_name || "",
          lastName: zitadelUser.family_name || "",
        });
      }
      
      const { token, expiresAt } = await createUserSession(user);
      
      // Set HTTP-only cookie
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: expiresAt,
      });
      
      // Redirect to dashboard
      res.redirect("/dashboard");
    } catch (error) {
      console.error("Zitadel callback error:", error);
      res.redirect("/login?error=oauth_failed");
    }
  });

  // Timeline API endpoints
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
