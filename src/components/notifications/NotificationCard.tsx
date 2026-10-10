import { Bell, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface NotificationCardProps {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  isRead: boolean;
  createdAt: string;
  onDismiss: (id: string) => void;
  onMarkRead: (id: string) => void;
}

const typeConfig = {
  info: {
    icon: Info,
    bgColor: 'bg-primary/10',
    iconColor: 'text-primary',
    borderColor: 'border-l-primary',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-warning/10',
    iconColor: 'text-warning',
    borderColor: 'border-l-warning',
  },
  alert: {
    icon: Bell,
    bgColor: 'bg-destructive/10',
    iconColor: 'text-destructive',
    borderColor: 'border-l-destructive',
  },
  success: {
    icon: CheckCircle,
    bgColor: 'bg-success/10',
    iconColor: 'text-success',
    borderColor: 'border-l-success',
  },
};

export function NotificationCard({
  id,
  title,
  message,
  type,
  isRead,
  createdAt,
  onDismiss,
  onMarkRead,
}: NotificationCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div 
      className={cn(
        "bg-card rounded-xl p-4 shadow-sm border border-border/50 border-l-4 transition-all animate-fade-in",
        config.borderColor,
        !isRead && "bg-primary/5"
      )}
      onClick={() => !isRead && onMarkRead(id)}
    >
      <div className="flex items-start gap-4">
        <div className={cn("p-2 rounded-xl", config.bgColor)}>
          <Icon className={cn("w-5 h-5", config.iconColor)} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className={cn(
                "font-semibold text-foreground",
                !isRead && "font-bold"
              )}>
                {title}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">{message}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onDismiss(id);
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );
}