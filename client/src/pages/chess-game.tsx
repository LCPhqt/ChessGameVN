import { useState } from 'react';
import { useChessGame } from '@/hooks/use-chess-game';
import ChessBoard from '@/components/chess-board';
import GameSidebar from '@/components/game-sidebar';
import SettingsModal from '@/components/settings-modal';

export default function ChessGame() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const {
    gameState,
    getPieceAt,
    selectSquare,
    newGame,
    undoMove,
    setGameMode,
  } = useChessGame();

  return (
    <div className="min-h-screen chess-pattern">
      <div className="container mx-auto px-4 py-6 min-h-screen flex">
        <GameSidebar
          onNewGame={newGame}
          onUndoMove={undoMove}
          onSetGameMode={setGameMode}
          onShowSettings={() => setIsSettingsOpen(true)}
          gameMode={gameState.gameMode}
        />
        
        <div className="flex-1 flex items-center justify-center relative">
          <ChessBoard
            gameState={gameState}
            getPieceAt={getPieceAt}
            selectSquare={selectSquare}
          />
        </div>
        
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </div>
    </div>
  );
}
