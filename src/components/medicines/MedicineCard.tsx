import { Pill, Clock, Calendar, Trash2, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MedicineCardProps {
  id: string;
  name: string;
  dosage: string;
  pillCount: number;
  times: string[];
  startDate: string;
  endDate?: string;
  instructions?: string;
  onDelete: (id: string) => void;
}

export function MedicineCard({
  id,
  name,
  dosage,
  pillCount,
  times,
  startDate,
  endDate,
  instructions,
  onDelete,
}: MedicineCardProps) {
  const isLowPills = pillCount <= 10;

  return (
    <div className="bg-card rounded-xl p-5 shadow-md border border-border/50 animate-fade-in hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-3 rounded-xl",
            isLowPills ? "bg-warning/10" : "bg-primary/10"
          )}>
            <Pill className={cn(
              "w-6 h-6",
              isLowPills ? "text-warning" : "text-primary"
            )} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">{name}</h3>
            <p className="text-sm text-muted-foreground">{dosage}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit className="w-4 h-4 text-muted-foreground" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={isLowPills ? "warning" : "secondary"}>
            {pillCount} pills remaining
          </Badge>
          {times.map((time, index) => (
            <Badge key={index} variant="outline" className="gap-1">
              <Clock className="w-3 h-3" />
              {time}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{startDate}</span>
          {endDate && (
            <>
              <span>→</span>
              <span>{endDate}</span>
            </>
          )}
        </div>

        {instructions && (
          <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
            {instructions}
          </p>
        )}
      </div>
    </div>
  );
}