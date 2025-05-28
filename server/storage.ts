import { users, games, type User, type InsertUser, type Game, type InsertGame } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createGame(game: InsertGame): Promise<Game>;
  getGame(id: number): Promise<Game | undefined>;
  updateGame(id: number, updates: Partial<Game>): Promise<Game | undefined>;
  getActiveGames(): Promise<Game[]>;
  getUserGames(userId: number): Promise<Game[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private games: Map<number, Game>;
  private currentUserId: number;
  private currentGameId: number;

  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.currentUserId = 1;
    this.currentGameId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      rating: 1200,
      gamesPlayed: 0,
      gamesWon: 0
    };
    this.users.set(id, user);
    return user;
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const id = this.currentGameId++;
    const game: Game = {
      id,
      whitePlayerId: insertGame.whitePlayerId || null,
      blackPlayerId: insertGame.blackPlayerId || null,
      gameState: insertGame.gameState,
      moves: insertGame.moves || '',
      status: 'active',
      winner: null,
      timeControl: insertGame.timeControl || 600,
      whiteTimeRemaining: insertGame.timeControl || 600,
      blackTimeRemaining: insertGame.timeControl || 600,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.games.set(id, game);
    return game;
  }

  async getGame(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async updateGame(id: number, updates: Partial<Game>): Promise<Game | undefined> {
    const game = this.games.get(id);
    if (!game) return undefined;

    const updatedGame = {
      ...game,
      ...updates,
      updatedAt: new Date(),
    };
    this.games.set(id, updatedGame);
    return updatedGame;
  }

  async getActiveGames(): Promise<Game[]> {
    return Array.from(this.games.values()).filter(
      (game) => game.status === 'active'
    );
  }

  async getUserGames(userId: number): Promise<Game[]> {
    return Array.from(this.games.values()).filter(
      (game) => game.whitePlayerId === userId || game.blackPlayerId === userId
    );
  }
}

export const storage = new MemStorage();
