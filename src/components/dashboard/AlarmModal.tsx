import { useState, useEffect } from 'react';
import { Bell, Pill, Check, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicineName: string;
  dosage: string;
  onConfirmTaken: () => void;
  onMissed: () => void;
}

export function AlarmModal({
  isOpen,
  onClose,
  medicineName,
  dosage,
  onConfirmTaken,
  onMissed,
}: AlarmModalProps) {
  const [countdown, setCountdown] = useState(30);
  const [boxState, setBoxState] = useState<'ringing' | 'open' | 'waiting'>('ringing');

  useEffect(() => {
    if (isOpen) {
      setCountdown(30);
      setBoxState('ringing');
      
      // Simulate box opening after 2 seconds
      const openTimeout = setTimeout(() => {
        setBoxState('open');
      }, 2000);

      // After box opens, wait for button press
      const waitTimeout = setTimeout(() => {
        setBoxState('waiting');
      }, 4000);

      return () => {
        clearTimeout(openTimeout);
        clearTimeout(waitTimeout);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && boxState === 'waiting' && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (countdown === 0) {
      onMissed();
      onClose();
    }
  }, [isOpen, boxState, countdown, onMissed, onClose]);

  const handleConfirm = () => {
    onConfirmTaken();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className={cn(
              "p-3 rounded-full",
              boxState === 'ringing' && "bg-warning/20 animate-pulse",
              boxState === 'open' && "bg-primary/20",
              boxState === 'waiting' && "bg-success/20"
            )}>
              {boxState === 'ringing' ? (
                <Bell className="w-8 h-8 text-warning animate-pulse" />
              ) : (
                <Pill className="w-8 h-8 text-primary" />
              )}
            </div>
            <span>Medicine Time!</span>
          </DialogTitle>
          <DialogDescription className="text-base">
            It's time to take your medication
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Medicine Info */}
          <div className="bg-muted/50 rounded-xl p-4 text-center">
            <h3 className="text-2xl font-bold text-foreground">{medicineName}</h3>
            <p className="text-lg text-muted-foreground">{dosage}</p>
          </div>

          {/* Box Status */}
          <div className="space-y-3">
            <div className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-all",
              boxState === 'ringing' && "bg-warning/10 border border-warning/20",
              boxState !== 'ringing' && "bg-muted/30"
            )}>
              <div className={cn(
                "w-3 h-3 rounded-full",
                boxState === 'ringing' ? "bg-warning animate-pulse" : "bg-muted-foreground"
              )} />
              <span className="text-sm">Alarm ringing on smart box</span>
            </div>

            <div className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-all",
              boxState === 'open' && "bg-primary/10 border border-primary/20",
              boxState !== 'open' && boxState !== 'ringing' && "bg-muted/30",
              boxState === 'ringing' && "opacity-50"
            )}>
              <div className={cn(
                "w-3 h-3 rounded-full",
                boxState === 'open' ? "bg-primary animate-pulse" : "bg-muted-foreground"
              )} />
              <span className="text-sm">Box lid opening...</span>
            </div>

            <div className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-all",
              boxState === 'waiting' && "bg-success/10 border border-success/20",
              boxState !== 'waiting' && "bg-muted/30 opacity-50"
            )}>
              <div className={cn(
                "w-3 h-3 rounded-full",
                boxState === 'waiting' ? "bg-success animate-pulse" : "bg-muted-foreground"
              )} />
              <span className="text-sm">
                {boxState === 'waiting' 
                  ? `Take pills & press green button (${countdown}s)`
                  : 'Waiting for pills to be taken...'
                }
              </span>
            </div>
          </div>

          {/* Countdown Warning */}
          {boxState === 'waiting' && countdown <= 10 && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <span className="text-sm text-destructive font-medium">
                Dose will be marked as missed in {countdown} seconds
              </span>
            </div>
          )}

          {/* Action Buttons */}
          {boxState === 'waiting' && (
            <Button
              size="xl"
              variant="success"
              className="w-full gap-2"
              onClick={handleConfirm}
            >
              <Check className="w-6 h-6" />
              Confirm Pills Taken
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}