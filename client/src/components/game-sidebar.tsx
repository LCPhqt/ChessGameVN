import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface GameSidebarProps {
  onNewGame: () => void;
  onUndoMove: () => void;
  onSetGameMode: (mode: 'human' | 'bot' | 'online') => void;
  onShowSettings: () => void;
  gameMode: 'human' | 'bot' | 'online';
}

export default function GameSidebar({ 
  onNewGame, 
  onUndoMove, 
  onSetGameMode, 
  onShowSettings,
  gameMode 
}: GameSidebarProps) {
  return (
    <div className="w-80 mr-8 space-y-6">
      {/* Header */}
      <Card className="glass-morphism border-gray-600">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold text-white mb-2">Chess Play</h1>
          <p className="text-gray-300 text-sm">Trò chơi cờ vua trực tuyến</p>
        </CardContent>
      </Card>

      {/* User Profile Section */}
      <Card className="glass-morphism border-gray-600">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">👤</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">Người dùng</h3>
              <p className="text-gray-400 text-sm">Rating: 1200</p>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" style={{width: '60%'}}></div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Cấp độ: Trung cấp</p>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card className="glass-morphism border-gray-600">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-white">Cài đặt</h3>
          <div className="space-y-3">
            <Button
              onClick={onShowSettings}
              variant="secondary"
              className="w-full glass-morphism border-gray-600 hover:bg-gray-700 font-medium"
            >
              Cài đặt
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
