import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatusCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  subtitle?: string;
}

export function StatusCard({ title, value, icon, variant = 'default', subtitle }: StatusCardProps) {
  return (
    <div className={cn(
      "bg-card rounded-xl p-5 shadow-md border border-border/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
      "animate-fade-in"
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={cn(
            "text-3xl font-bold",
            variant === 'success' && "text-success",
            variant === 'warning' && "text-warning",
            variant === 'destructive' && "text-destructive",
            variant === 'default' && "text-foreground"
          )}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-xl",
          variant === 'success' && "bg-success/10 text-success",
          variant === 'warning' && "bg-warning/10 text-warning",
          variant === 'destructive' && "bg-destructive/10 text-destructive",
          variant === 'default' && "bg-primary/10 text-primary"
        )}>
          {icon}
        </div>
      </div>
    </div>
  );
}