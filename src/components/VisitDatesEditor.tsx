
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface VisitDatesEditorProps {
  dates: string[];
  onDatesChange: (newDates: string[]) => void;
  promotorName: string;
}

export const VisitDatesEditor = ({ dates, onDatesChange, promotorName }: VisitDatesEditorProps) => {
  const [newDate, setNewDate] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const addDate = () => {
    if (newDate && !dates.includes(newDate)) {
      const updatedDates = [...dates, newDate].sort();
      onDatesChange(updatedDates);
      setNewDate('');
    }
  };

  const removeDate = (dateToRemove: string) => {
    const updatedDates = dates.filter(date => date !== dateToRemove);
    onDatesChange(updatedDates);
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateStr;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Calendar className="w-4 h-4 mr-2" />
          {dates.length} visitas
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Visitas - {promotorName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              placeholder="Nova data de visita"
            />
            <Button onClick={addDate} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            <p className="text-sm font-medium">Datas de Visitas ({dates.length}):</p>
            {dates.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma visita registrada</p>
            ) : (
              dates.map((date, index) => (
                <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                  <Badge variant="outline">{formatDate(date)}</Badge>
                  <Button
                    onClick={() => removeDate(date)}
                    size="sm"
                    variant="ghost"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
