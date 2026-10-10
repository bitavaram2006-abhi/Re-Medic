import { Pill, Clock, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MedicineScheduleCardProps {
  medicineName: string;
  dosage: string;
  scheduledTime: string;
  status: 'taken' | 'missed' | 'upcoming';
  onTake?: () => void;
  onMiss?: () => void;
}

export function MedicineScheduleCard({
  medicineName,
  dosage,
  scheduledTime,
  status,
  onTake,
  onMiss,
}: MedicineScheduleCardProps) {
  return (
    <div className={cn(
      "bg-card rounded-xl p-4 shadow-sm border border-border/50 transition-all duration-300",
      "hover:shadow-md animate-fade-in",
      status === 'upcoming' && "border-l-4 border-l-warning",
      status === 'taken' && "border-l-4 border-l-success opacity-75",
      status === 'missed' && "border-l-4 border-l-destructive opacity-75"
    )}>
      <div className="flex items-center gap-4">
        <div className={cn(
          "p-3 rounded-xl",
          status === 'taken' && "bg-success/10",
          status === 'missed' && "bg-destructive/10",
          status === 'upcoming' && "bg-primary/10"
        )}>
          <Pill className={cn(
            "w-6 h-6",
            status === 'taken' && "text-success",
            status === 'missed' && "text-destructive",
            status === 'upcoming' && "text-primary"
          )} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground truncate">{medicineName}</h4>
          <p className="text-sm text-muted-foreground">{dosage}</p>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{scheduledTime}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={status}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
          
          {status === 'upcoming' && (
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="success"
                className="h-8 w-8"
                onClick={onTake}
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={onMiss}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}