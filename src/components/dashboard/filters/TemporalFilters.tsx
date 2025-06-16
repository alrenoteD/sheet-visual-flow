
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Filter, BarChart3 } from 'lucide-react';

interface TemporalFiltersProps {
  onFilterChange: (period: string) => void;
  activePeriod: string;
}

export const TemporalFilters = ({ onFilterChange, activePeriod }: TemporalFiltersProps) => {
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
          <BarChart3 className="w-4 h-4" />
          Filtros Temporais dos Gráficos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {periods.map(period => (
            <Button
              key={period.key}
              variant={activePeriod === period.key ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange(period.key)}
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
        <p className="text-xs text-muted-foreground mt-2">
          * Filtros aplicados apenas aos gráficos, não afetam KPIs nem outras métricas
        </p>
      </CardContent>
    </Card>
  );
};
