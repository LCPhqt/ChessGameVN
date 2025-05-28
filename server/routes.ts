import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User management routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.json({ id: user.id, username: user.username, rating: user.rating });
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ id: user.id, username: user.username, rating: user.rating });
    } catch (error) {
      res.status(400).json({ message: "Invalid user ID" });
    }
  });

  // Game management routes
  app.post("/api/games", async (req, res) => {
    try {
      const gameData = insertGameSchema.parse(req.body);
      const game = await storage.createGame(gameData);
      res.json(game);
    } catch (error) {
      res.status(400).json({ message: "Invalid game data" });
    }
  });

  app.get("/api/games/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const game = await storage.getGame(id);
      
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      res.json(game);
    } catch (error) {
      res.status(400).json({ message: "Invalid game ID" });
    }
  });

  app.put("/api/games/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const game = await storage.updateGame(id, updates);
      
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      res.json(game);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  app.get("/api/games", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : null;
      
      if (userId) {
        const games = await storage.getUserGames(userId);
        res.json(games);
      } else {
        const games = await storage.getActiveGames();
        res.json(games);
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid query parameters" });
    }
  });

  // Game move endpoint
  app.post("/api/games/:id/move", async (req, res) => {
    try {
      const gameId = parseInt(req.params.id);
      const { move, gameState, timeRemaining } = req.body;
      
      const game = await storage.getGame(gameId);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      // Update game with new move
      const moves = game.moves ? `${game.moves} ${move}` : move;
      const updates: any = {
        moves,
        gameState,
      };
      
      if (timeRemaining) {
        if (timeRemaining.white !== undefined) {
          updates.whiteTimeRemaining = timeRemaining.white;
        }
        if (timeRemaining.black !== undefined) {
          updates.blackTimeRemaining = timeRemaining.black;
        }
      }
      
      const updatedGame = await storage.updateGame(gameId, updates);
      res.json(updatedGame);
    } catch (error) {
      res.status(400).json({ message: "Invalid move data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
