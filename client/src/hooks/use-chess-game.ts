import { useState, useCallback, useEffect } from 'react';

// Chess.js types
interface ChessInstance {
  ascii(): string;
  board(): Array<Array<any>>;
  clear(): void;
  fen(): string;
  game_over(): boolean;
  get(square: string): any;
  history(): string[];
  in_check(): boolean;
  in_checkmate(): boolean;
  in_draw(): boolean;
  in_stalemate(): boolean;
  in_threefold_repetition(): boolean;
  insufficient_material(): boolean;
  load(fen: string): boolean;
  move(move: string | { from: string; to: string; promotion?: string }): any;
  moves(options?: { square?: string; verbose?: boolean }): string[] | any[];
  pgn(): string;
  put(piece: any, square: string): boolean;
  remove(square: string): any;
  reset(): void;
  square_color(square: string): 'light' | 'dark';
  turn(): 'w' | 'b';
  undo(): any;
  validate_fen(fen: string): { valid: boolean; error_number: number; error: string };
}

declare global {
  interface Window {
    Chess: new () => ChessInstance;
  }
}

export interface GameState {
  game: ChessInstance | null;
  selectedSquare: string | null;
  possibleMoves: string[];
  gameMode: 'human' | 'bot' | 'online';
  currentTurn: 'w' | 'b';
  gameStatus: 'active' | 'checkmate' | 'draw' | 'check';
  whiteTime: number;
  blackTime: number;
  isTimerRunning: boolean;
  moveHistory: string[];
}

export function useChessGame() {
  const [gameState, setGameState] = useState<GameState>({
    game: null,
    selectedSquare: null,
    possibleMoves: [],
    gameMode: 'human',
    currentTurn: 'w',
    gameStatus: 'active',
    whiteTime: 600, // 10 minutes
    blackTime: 600,
    isTimerRunning: false,
    moveHistory: [],
  });

  // Chess piece Unicode mapping
  const pieceUnicode = {
    'wK': '♔', 'wQ': '♕', 'wR': '♖', 'wB': '♗', 'wN': '♘', 'wP': '♙',
    'bK': '♚', 'bQ': '♛', 'bR': '♜', 'bB': '♝', 'bN': '♞', 'bP': '♟'
  };

  // Initialize game
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/chess.js/1.0.0-beta.6/chess.min.js';
    script.onload = () => {
      if (window.Chess) {
        const game = new window.Chess();
        setGameState(prev => ({
          ...prev,
          game,
          currentTurn: game.turn(),
          moveHistory: game.history(),
        }));
      }
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState.isTimerRunning && gameState.game && !gameState.game.game_over()) {
      interval = setInterval(() => {
        setGameState(prev => {
          const newState = { ...prev };
          
          if (prev.currentTurn === 'w') {
            newState.whiteTime = Math.max(0, prev.whiteTime - 1);
          } else {
            newState.blackTime = Math.max(0, prev.blackTime - 1);
          }
          
          // Check for timeout
          if (newState.whiteTime <= 0 || newState.blackTime <= 0) {
            newState.isTimerRunning = false;
            newState.gameStatus = 'checkmate';
          }
          
          return newState;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.isTimerRunning, gameState.currentTurn, gameState.game]);

  // Get piece at square
  const getPieceAt = useCallback((square: string): string => {
    if (!gameState.game) return '';
    
    const piece = gameState.game.get(square);
    if (!piece) return '';
    
    const pieceKey = piece.color + piece.type.toUpperCase() as keyof typeof pieceUnicode;
    return pieceUnicode[pieceKey] || '';
  }, [gameState.game]);

  // Select square
  const selectSquare = useCallback((square: string) => {
    if (!gameState.game) return;
    
    const piece = gameState.game.get(square);
    
    // If selecting the same square, deselect
    if (gameState.selectedSquare === square) {
      setGameState(prev => ({
        ...prev,
        selectedSquare: null,
        possibleMoves: [],
      }));
      return;
    }
    
    // If a square is already selected, try to make a move
    if (gameState.selectedSquare && gameState.possibleMoves.includes(square)) {
      makeMove(gameState.selectedSquare, square);
      return;
    }
    
    // Select new square if it has a piece of the current player
    if (piece && piece.color === gameState.currentTurn) {
      const moves = gameState.game.moves({
        square,
        verbose: true,
      });
      
      setGameState(prev => ({
        ...prev,
        selectedSquare: square,
        possibleMoves: moves.map((move: any) => move.to),
      }));
    } else {
      // Clear selection
      setGameState(prev => ({
        ...prev,
        selectedSquare: null,
        possibleMoves: [],
      }));
    }
  }, [gameState.game, gameState.selectedSquare, gameState.possibleMoves, gameState.currentTurn]);

  // Make move
  const makeMove = useCallback((from: string, to: string) => {
    if (!gameState.game) return false;
    
    try {
      const move = gameState.game.move({
        from,
        to,
        promotion: 'q', // Auto-promote to queen
      });
      
      if (move) {
        const newGameStatus = gameState.game.in_checkmate() ? 'checkmate' :
                            gameState.game.in_draw() ? 'draw' :
                            gameState.game.in_check() ? 'check' : 'active';
        
        setGameState(prev => ({
          ...prev,
          selectedSquare: null,
          possibleMoves: [],
          currentTurn: gameState.game!.turn(),
          gameStatus: newGameStatus,
          moveHistory: gameState.game!.history(),
          isTimerRunning: newGameStatus === 'active',
        }));
        
        // Make bot move if in bot mode
        if (gameState.gameMode === 'bot' && !gameState.game.game_over()) {
          setTimeout(() => {
            makeBotMove();
          }, 500);
        }
        
        return true;
      }
    } catch (error) {
      console.error('Invalid move:', error);
    }
    
    return false;
  }, [gameState.game, gameState.gameMode]);

  // Make bot move (simple random)
  const makeBotMove = useCallback(() => {
    if (!gameState.game || gameState.game.game_over()) return;
    
    const moves = gameState.game.moves();
    if (moves.length > 0) {
      const randomMove = moves[Math.floor(Math.random() * moves.length)];
      gameState.game.move(randomMove);
      
      const newGameStatus = gameState.game.in_checkmate() ? 'checkmate' :
                          gameState.game.in_draw() ? 'draw' :
                          gameState.game.in_check() ? 'check' : 'active';
      
      setGameState(prev => ({
        ...prev,
        currentTurn: gameState.game!.turn(),
        gameStatus: newGameStatus,
        moveHistory: gameState.game!.history(),
        isTimerRunning: newGameStatus === 'active',
      }));
    }
  }, [gameState.game]);

  // New game
  const newGame = useCallback(() => {
    if (!gameState.game) return;
    
    gameState.game.reset();
    setGameState(prev => ({
      ...prev,
      selectedSquare: null,
      possibleMoves: [],
      currentTurn: 'w',
      gameStatus: 'active',
      whiteTime: 600,
      blackTime: 600,
      isTimerRunning: true,
      moveHistory: [],
    }));
  }, [gameState.game]);

  // Undo move
  const undoMove = useCallback(() => {
    if (!gameState.game) return;
    
    gameState.game.undo();
    if (gameState.gameMode === 'bot') {
      gameState.game.undo(); // Undo bot move too
    }
    
    setGameState(prev => ({
      ...prev,
      selectedSquare: null,
      possibleMoves: [],
      currentTurn: gameState.game!.turn(),
      gameStatus: 'active',
      moveHistory: gameState.game!.history(),
    }));
  }, [gameState.game, gameState.gameMode]);

  // Set game mode
  const setGameMode = useCallback((mode: 'human' | 'bot' | 'online') => {
    setGameState(prev => ({
      ...prev,
      gameMode: mode,
    }));
  }, []);

  // Toggle timer
  const toggleTimer = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isTimerRunning: !prev.isTimerRunning,
    }));
  }, []);

  return {
    gameState,
    getPieceAt,
    selectSquare,
    makeMove,
    newGame,
    undoMove,
    setGameMode,
    toggleTimer,
    pieceUnicode,
  };
}
