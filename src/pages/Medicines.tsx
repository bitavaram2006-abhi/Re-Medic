import { useState, useEffect } from 'react';
import { Plus, Pill, Search } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MedicineCard } from '@/components/medicines/MedicineCard';
import { AddMedicineDialog } from '@/components/medicines/AddMedicineDialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  pill_count: number;
  times_per_day: string[];
  start_date: string;
  end_date: string | null;
  instructions: string | null;
}

export default function Medicines() {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMedicines();
    }
  }, [user]);

  const fetchMedicines = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching medicines:', error);
      toast({
        title: 'Error',
        description: 'Failed to load medicines.',
        variant: 'destructive',
      });
    } else {
      setMedicines(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('medicines')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete medicine.',
        variant: 'destructive',
      });
    } else {
      setMedicines((prev) => prev.filter((m) => m.id !== id));
      toast({
        title: 'Medicine Removed',
        description: 'The medicine has been removed from your schedule.',
      });
    }
  };

  const filteredMedicines = medicines.filter((med) =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Medicines</h1>
            <p className="text-muted-foreground mt-1">
              Manage your medications and schedules
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Medicine
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search medicines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Medicines Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-xl p-5 animate-pulse border border-border/50">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-muted rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-muted rounded w-32" />
                    <div className="h-4 bg-muted rounded w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredMedicines.length === 0 ? (
          <div className="bg-card rounded-xl p-12 text-center border border-border/50">
            <Pill className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {searchQuery ? 'No medicines found' : 'No medicines added yet'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Start by adding your first medication'
              }
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Your First Medicine
              </Button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredMedicines.map((medicine) => (
              <MedicineCard
                key={medicine.id}
                id={medicine.id}
                name={medicine.name}
                dosage={medicine.dosage}
                pillCount={medicine.pill_count}
                times={medicine.times_per_day}
                startDate={format(new Date(medicine.start_date), 'MMM d, yyyy')}
                endDate={medicine.end_date ? format(new Date(medicine.end_date), 'MMM d, yyyy') : undefined}
                instructions={medicine.instructions || undefined}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <AddMedicineDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={fetchMedicines}
      />
    </AppLayout>
  );
}