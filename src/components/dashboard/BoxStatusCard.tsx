import { Wifi, WifiOff, Battery, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BoxStatusCardProps {
  isConnected: boolean;
  batteryLevel?: number;
  pillsLow?: boolean;
  lastSync?: string;
}

export function BoxStatusCard({ 
  isConnected, 
  batteryLevel = 85, 
  pillsLow = false,
  lastSync = '2 min ago'
}: BoxStatusCardProps) {
  return (
    <div className="bg-card rounded-xl p-5 shadow-md border border-border/50 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-foreground">Smart Box Status</h3>
        <Badge variant={isConnected ? "success" : "destructive"}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          {isConnected ? (
            <Wifi className="w-5 h-5 text-success" />
          ) : (
            <WifiOff className="w-5 h-5 text-destructive" />
          )}
          <div>
            <p className="text-sm font-medium text-foreground">Connection</p>
            <p className="text-xs text-muted-foreground">
              {isConnected ? `Last sync: ${lastSync}` : 'Check your WiFi connection'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Battery className={cn(
            "w-5 h-5",
            batteryLevel > 50 ? "text-success" : batteryLevel > 20 ? "text-warning" : "text-destructive"
          )} />
          <div>
            <p className="text-sm font-medium text-foreground">Battery</p>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all",
                    batteryLevel > 50 ? "bg-success" : batteryLevel > 20 ? "bg-warning" : "bg-destructive"
                  )}
                  style={{ width: `${batteryLevel}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{batteryLevel}%</span>
            </div>
          </div>
        </div>

        {pillsLow && (
          <div className="flex items-center gap-3 p-3 bg-warning/10 rounded-lg border border-warning/20">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <div>
              <p className="text-sm font-medium text-warning">Pills Running Low</p>
              <p className="text-xs text-muted-foreground">Please refill your medicine box</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}