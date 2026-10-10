import { useState, useEffect, useRef } from 'react';
import { FileText, Upload, Trash2, Download, File, Image } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface MedicalRecord {
  id: string;
  name: string;
  file_url: string;
  file_type: string;
  uploaded_at: string;
}

export default function MedicalRecords() {
  const { user } = useAuth();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      fetchRecords();
    }
  }, [user]);

  const fetchRecords = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('medical_records')
      .select('*')
      .eq('user_id', user.id)
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Error fetching records:', error);
    } else {
      setRecords(data || []);
    }
    setLoading(false);
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF or image file.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload a file smaller than 10MB.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('medical-records')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('medical-records')
        .getPublicUrl(fileName);

      // Save record to database
      const { error: dbError } = await supabase.from('medical_records').insert({
        user_id: user.id,
        name: file.name,
        file_url: publicUrl,
        file_type: file.type,
      });

      if (dbError) throw dbError;

      toast({
        title: 'File uploaded',
        description: 'Your medical record has been uploaded successfully.',
      });

      fetchRecords();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (record: MedicalRecord) => {
    if (!user) return;

    try {
      // Extract file path from URL
      const urlParts = record.file_url.split('/');
      const filePath = `${user.id}/${urlParts[urlParts.length - 1]}`;

      // Delete from storage
      await supabase.storage.from('medical-records').remove([filePath]);

      // Delete from database
      const { error } = await supabase
        .from('medical_records')
        .delete()
        .eq('id', record.id);

      if (error) throw error;

      setRecords((prev) => prev.filter((r) => r.id !== record.id));
      toast({
        title: 'Record deleted',
        description: 'The medical record has been removed.',
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Delete failed',
        description: 'There was an error deleting the file.',
        variant: 'destructive',
      });
    }
  };

  const isImage = (fileType: string) => fileType.startsWith('image/');

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Medical Records</h1>
            <p className="text-muted-foreground mt-1">
              Store and access your prescriptions and reports
            </p>
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={handleUpload}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              {uploading ? 'Uploading...' : 'Upload File'}
            </Button>
          </div>
        </div>

        {/* Records Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-xl p-4 animate-pulse border border-border/50">
                <div className="aspect-video bg-muted rounded-lg mb-3" />
                <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : records.length === 0 ? (
          <div className="bg-card rounded-xl p-12 text-center border border-border/50 border-dashed">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Records Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Upload your prescriptions, lab reports, and other medical documents for easy access
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload Your First File
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {records.map((record) => (
              <div
                key={record.id}
                className="bg-card rounded-xl overflow-hidden shadow-md border border-border/50 hover:shadow-lg transition-all animate-fade-in group"
              >
                {/* Preview */}
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {isImage(record.file_type) ? (
                    <img
                      src={record.file_url}
                      alt={record.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <File className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      asChild
                    >
                      <a href={record.file_url} target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4" />
                      </a>
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(record)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "p-2 rounded-lg shrink-0",
                      isImage(record.file_type) ? "bg-primary/10" : "bg-destructive/10"
                    )}>
                      {isImage(record.file_type) ? (
                        <Image className="w-4 h-4 text-primary" />
                      ) : (
                        <FileText className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-foreground truncate">{record.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(record.uploaded_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}