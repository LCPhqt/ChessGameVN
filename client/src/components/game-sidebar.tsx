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

      {/* Game Mode Selection */}
      <Card className="glass-morphism border-gray-600">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-white">Chế độ chơi</h3>
          <div className="space-y-3">
            <Button
              onClick={() => onSetGameMode('human')}
              variant={gameMode === 'human' ? 'default' : 'secondary'}
              className={`w-full glass-morphism border-gray-600 text-left p-4 h-auto ${
                gameMode === 'human' ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">👥</span>
                </div>
                <div className="text-left">
                  <p className="font-medium text-white">Chơi với bạn</p>
                  <p className="text-sm text-gray-400">Người vs Người</p>
                </div>
              </div>
            </Button>
            
            <Button
              onClick={() => onSetGameMode('bot')}
              variant={gameMode === 'bot' ? 'default' : 'secondary'}
              className={`w-full glass-morphism border-gray-600 text-left p-4 h-auto ${
                gameMode === 'bot' ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">🤖</span>
                </div>
                <div className="text-left">
                  <p className="font-medium text-white">Chơi với bot</p>
                  <p className="text-sm text-gray-400">Người vs Máy</p>
                </div>
              </div>
            </Button>
            
            <Button
              onClick={() => onSetGameMode('online')}
              variant={gameMode === 'online' ? 'default' : 'secondary'}
              className={`w-full glass-morphism border-gray-600 text-left p-4 h-auto ${
                gameMode === 'online' ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">🌐</span>
                </div>
                <div className="text-left">
                  <p className="font-medium text-white">Chơi trực tuyến</p>
                  <p className="text-sm text-gray-400">Tìm đối thủ</p>
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Game Controls */}
      <Card className="glass-morphism border-gray-600">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-white">Điều khiển</h3>
          <div className="space-y-3">
            <Button
              variant="secondary"
              className="w-full glass-morphism border-gray-600 hover:bg-gray-700 font-medium"
            >
              Thông tin người chơi
            </Button>
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
