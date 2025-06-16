
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Filter } from 'lucide-react';
import { VisitData } from '@/types/VisitData';

interface TemporalFiltersProps {
  data: VisitData[];
  onFilterChange: (filteredData: VisitData[], period: string) => void;
  activePeriod: string;
}

export const TemporalFilters = ({ data, onFilterChange, activePeriod }: TemporalFiltersProps) => {
  const getDateRange = (period: string) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (period) {
      case 'hoje':
        return {
          start: today,
          end: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        };
      case 'esta-semana':
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return { start: startOfWeek, end: endOfWeek };
      case 'este-mes':
        return {
          start: new Date(now.getFullYear(), now.getMonth(), 1),
          end: new Date(now.getFullYear(), now.getMonth() + 1, 0)
        };
      case 'este-ano':
        return {
          start: new Date(now.getFullYear(), 0, 1),
          end: new Date(now.getFullYear(), 11, 31)
        };
      default:
        return null;
    }
  };

  const filterByPeriod = (period: string) => {
    if (period === 'todo-periodo') {
      onFilterChange(data, period);
      return;
    }

    const range = getDateRange(period);
    if (!range) {
      onFilterChange(data, period);
      return;
    }

    const filtered = data.filter(item => {
      return item.datasVisitas.some(visitDate => {
        if (!visitDate) return false;
        
        const date = new Date(visitDate);
        return date >= range.start && date <= range.end;
      });
    });

    onFilterChange(filtered, period);
  };

  const periods = [
    { key: 'hoje', label: 'Hoje', icon: Clock },
    { key: 'esta-semana', label: 'Esta Semana', icon: Calendar },
    { key: 'este-mes', label: 'Este Mês', icon: Calendar },
    { key: 'este-ano', label: 'Este Ano', icon: Calendar },
    { key: 'todo-periodo', label: 'Todo Período', icon: Filter }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filtros Temporais
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {periods.map(period => (
            <Button
              key={period.key}
              variant={activePeriod === period.key ? "default" : "outline"}
              size="sm"
              onClick={() => filterByPeriod(period.key)}
              className="flex items-center gap-1"
            >
              <period.icon className="w-3 h-3" />
              {period.label}
              {activePeriod === period.key && (
                <Badge variant="secondary" className="ml-1 text-xs">Ativo</Badge>
              )}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
