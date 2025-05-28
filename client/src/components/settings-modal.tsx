import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [volume, setVolume] = useState([70]);
  const [effectsEnabled, setEffectsEnabled] = useState(true);
  const [timeControl, setTimeControl] = useState('rapid');

  const handleSave = () => {
    // Save settings logic here
    console.log('Settings saved:', { volume: volume[0], effectsEnabled, timeControl });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass-morphism border-gray-600 bg-gray-900/90 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Cài đặt</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="volume" className="text-sm font-medium text-white">
              Âm thanh
            </Label>
            <div className="flex items-center space-x-3">
              <Slider
                id="volume"
                min={0}
                max={100}
                step={1}
                value={volume}
                onValueChange={setVolume}
                className="flex-1"
              />
              <span className="text-sm text-gray-400 min-w-[3rem]">{volume[0]}%</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="effects"
              checked={effectsEnabled}
              onCheckedChange={setEffectsEnabled}
              className="border-gray-400"
            />
            <Label htmlFor="effects" className="text-sm font-medium text-white cursor-pointer">
              Bật hiệu ứng di chuyển
            </Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timeControl" className="text-sm font-medium text-white">
              Thời gian suy nghĩ
            </Label>
            <Select value={timeControl} onValueChange={setTimeControl}>
              <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Chọn thời gian" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="blitz" className="text-white hover:bg-gray-600">
                  Blitz (5 phút)
                </SelectItem>
                <SelectItem value="rapid" className="text-white hover:bg-gray-600">
                  Rapid (10 phút)
                </SelectItem>
                <SelectItem value="classical" className="text-white hover:bg-gray-600">
                  Classical (30 phút)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 font-medium"
          >
            Lưu
          </Button>
          <Button
            onClick={onClose}
            variant="secondary"
            className="flex-1 glass-morphism border-gray-600 hover:bg-gray-700 font-medium"
          >
            Hủy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
