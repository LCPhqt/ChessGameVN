import { useCallback } from 'react';
import { useChessGame } from '@/hooks/use-chess-game';

interface ChessBoardProps {
  gameState: ReturnType<typeof useChessGame>['gameState'];
  getPieceAt: (square: string) => string;
  selectSquare: (square: string) => void;
}

export default function ChessBoard({ gameState, getPieceAt, selectSquare }: ChessBoardProps) {
  // Generate board squares
  const squares = [];
  for (let rank = 8; rank >= 1; rank--) {
    for (let file = 0; file < 8; file++) {
      const square = String.fromCharCode(97 + file) + rank; // a-h, 1-8
      const isLight = (rank + file) % 2 === 0;
      const piece = getPieceAt(square);
      const isSelected = gameState.selectedSquare === square;
      const isValidMove = gameState.possibleMoves.includes(square);
      
      squares.push({
        square,
        isLight,
        piece,
        isSelected,
        isValidMove,
      });
    }
  }

  const handleSquareClick = useCallback((square: string) => {
    selectSquare(square);
  }, [selectSquare]);

  const getGameStatusText = () => {
    if (!gameState.game) return '';
    
    switch (gameState.gameStatus) {
      case 'checkmate':
        return gameState.currentTurn === 'w' ? 'Quân đen thắng!' : 'Quân trắng thắng!';
      case 'draw':
        return 'Hòa cờ';
      case 'check':
        return gameState.currentTurn === 'w' ? 'Quân trắng bị chiếu!' : 'Quân đen bị chiếu!';
      default:
        return gameState.currentTurn === 'w' ? 'Lượt của quân trắng' : 'Lượt của quân đen';
    }
  };

  const getStatusColor = () => {
    switch (gameState.gameStatus) {
      case 'checkmate':
        return 'bg-gradient-to-r from-red-500 to-orange-500';
      case 'draw':
        return 'bg-gradient-to-r from-gray-500 to-gray-600';
      case 'check':
        return 'bg-gradient-to-r from-red-500 to-pink-500';
      default:
        return 'bg-gradient-to-r from-blue-500 to-purple-600';
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative">
      {/* Floating Chess Pieces Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-piece absolute top-20 left-10 text-6xl">♔</div>
        <div className="floating-piece absolute top-40 right-20 text-5xl" style={{animationDelay: '-2s'}}>♛</div>
        <div className="floating-piece absolute bottom-32 left-20 text-4xl" style={{animationDelay: '-4s'}}>♝</div>
        <div className="floating-piece absolute bottom-20 right-10 text-5xl" style={{animationDelay: '-1s'}}>♞</div>
      </div>

      {/* Chess Board Container */}
      <div className="glass-morphism rounded-3xl p-8 shadow-2xl">


        {/* Chess Board */}
        <div className="chess-board grid grid-cols-8 gap-0 border-4 border-gray-700 rounded-xl overflow-hidden shadow-2xl">
          {squares.map(({ square, isLight, piece, isSelected, isValidMove }) => (
            <div
              key={square}
              className={`
                chess-square w-16 h-16 flex items-center justify-center text-4xl cursor-pointer
                ${isLight ? 'bg-amber-100' : 'bg-amber-800'}
                ${isSelected ? 'highlight' : ''}
                ${isValidMove ? 'valid-move' : ''}
              `}
              onClick={() => handleSquareClick(square)}
            >
              {piece && (
                <span className="chess-piece select-none">
                  {piece}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Board Coordinates */}
        <div className="flex justify-between mt-2 px-2">
          {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(file => (
            <span key={file} className="text-xs text-gray-400">{file}</span>
          ))}
        </div>


      </div>
    </div>
  );
}
