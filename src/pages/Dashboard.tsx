import { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  Clock, 
  Pill, 
  AlertTriangle,
  CalendarDays
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatusCard } from '@/components/dashboard/StatusCard';
import { MedicineScheduleCard } from '@/components/dashboard/MedicineScheduleCard';
import { BoxStatusCard } from '@/components/dashboard/BoxStatusCard';
import { AlarmModal } from '@/components/dashboard/AlarmModal';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  times_per_day: string[];
  pill_count: number;
}

interface ScheduleItem {
  id: string;
  medicineName: string;
  dosage: string;
  scheduledTime: string;
  status: 'taken' | 'missed' | 'upcoming';
  medicineId: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [stats, setStats] = useState({ taken: 0, missed: 0, upcoming: 0 });
  const [alarmOpen, setAlarmOpen] = useState(false);
  const [currentAlarm, setCurrentAlarm] = useState<ScheduleItem | null>(null);

  useEffect(() => {
    if (user) {
      fetchMedicines();
    }
  }, [user]);

  const fetchMedicines = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching medicines:', error);
      return;
    }

    setMedicines(data || []);
    generateTodaySchedule(data || []);
  };

  const generateTodaySchedule = (meds: Medicine[]) => {
    const today = new Date();
    const currentTime = format(today, 'HH:mm');
    
    const scheduleItems: ScheduleItem[] = [];
    let takenCount = 0;
    let missedCount = 0;
    let upcomingCount = 0;

    meds.forEach((med) => {
      med.times_per_day.forEach((time, index) => {
        // Determine status based on time
        let status: 'taken' | 'missed' | 'upcoming';
        
        if (time < currentTime) {
          // Past time - randomly assign taken/missed for demo
          status = Math.random() > 0.3 ? 'taken' : 'missed';
        } else {
          status = 'upcoming';
        }

        if (status === 'taken') takenCount++;
        else if (status === 'missed') missedCount++;
        else upcomingCount++;

        scheduleItems.push({
          id: `${med.id}-${index}`,
          medicineName: med.name,
          dosage: med.dosage,
          scheduledTime: time,
          status,
          medicineId: med.id,
        });
      });
    });

    // Sort by time
    scheduleItems.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
    
    setSchedule(scheduleItems);
    setStats({ taken: takenCount, missed: missedCount, upcoming: upcomingCount });
  };

  const handleTakeDose = (item: ScheduleItem) => {
    setSchedule((prev) =>
      prev.map((s) =>
        s.id === item.id ? { ...s, status: 'taken' as const } : s
      )
    );
    setStats((prev) => ({
      ...prev,
      taken: prev.taken + 1,
      upcoming: prev.upcoming - 1,
    }));
    toast({
      title: 'Dose Confirmed',
      description: `${item.medicineName} has been marked as taken.`,
    });
  };

  const handleMissDose = (item: ScheduleItem) => {
    setSchedule((prev) =>
      prev.map((s) =>
        s.id === item.id ? { ...s, status: 'missed' as const } : s
      )
    );
    setStats((prev) => ({
      ...prev,
      missed: prev.missed + 1,
      upcoming: prev.upcoming - 1,
    }));
    toast({
      title: 'Dose Missed',
      description: `${item.medicineName} has been marked as missed.`,
      variant: 'destructive',
    });
  };

  const triggerAlarm = (item: ScheduleItem) => {
    setCurrentAlarm(item);
    setAlarmOpen(true);
  };

  const nextUpcoming = schedule.find((s) => s.status === 'upcoming');

  return (
    <AppLayout>
      <div className="space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}!
            </h1>
            <p className="text-muted-foreground mt-1">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
          {nextUpcoming && (
            <div className="bg-primary/10 rounded-xl p-4 flex items-center gap-3 animate-pulse-gentle">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-primary font-medium">Next Dose</p>
                <p className="text-foreground font-semibold">
                  {nextUpcoming.medicineName} at {nextUpcoming.scheduledTime}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard
            title="Doses Taken"
            value={stats.taken}
            icon={<Check className="w-6 h-6" />}
            variant="success"
            subtitle="Today"
          />
          <StatusCard
            title="Doses Missed"
            value={stats.missed}
            icon={<X className="w-6 h-6" />}
            variant="destructive"
            subtitle="Today"
          />
          <StatusCard
            title="Upcoming"
            value={stats.upcoming}
            icon={<Clock className="w-6 h-6" />}
            variant="warning"
            subtitle="Today"
          />
          <StatusCard
            title="Medications"
            value={medicines.length}
            icon={<Pill className="w-6 h-6" />}
            subtitle="Active"
          />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary" />
                Today's Schedule
              </h2>
            </div>

            {schedule.length === 0 ? (
              <div className="bg-card rounded-xl p-8 text-center border border-border/50">
                <Pill className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Medications Scheduled</h3>
                <p className="text-muted-foreground">
                  Add your medications to see your daily schedule
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {schedule.map((item) => (
                  <MedicineScheduleCard
                    key={item.id}
                    medicineName={item.medicineName}
                    dosage={item.dosage}
                    scheduledTime={item.scheduledTime}
                    status={item.status}
                    onTake={() => {
                      triggerAlarm(item);
                    }}
                    onMiss={() => handleMissDose(item)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Box Status */}
            <BoxStatusCard
              isConnected={true}
              batteryLevel={85}
              pillsLow={medicines.some((m) => m.pill_count <= 10)}
            />

            {/* Low Pill Alert */}
            {medicines.some((m) => m.pill_count <= 10) && (
              <div className="bg-warning/10 rounded-xl p-4 border border-warning/20 animate-fade-in">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-warning">Low Pill Alert</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Some medications are running low. Please refill soon.
                    </p>
                    <ul className="mt-2 space-y-1">
                      {medicines
                        .filter((m) => m.pill_count <= 10)
                        .map((m) => (
                          <li key={m.id} className="text-sm text-foreground">
                            • {m.name} ({m.pill_count} left)
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alarm Modal */}
      {currentAlarm && (
        <AlarmModal
          isOpen={alarmOpen}
          onClose={() => setAlarmOpen(false)}
          medicineName={currentAlarm.medicineName}
          dosage={currentAlarm.dosage}
          onConfirmTaken={() => handleTakeDose(currentAlarm)}
          onMissed={() => handleMissDose(currentAlarm)}
        />
      )}
    </AppLayout>
  );
}