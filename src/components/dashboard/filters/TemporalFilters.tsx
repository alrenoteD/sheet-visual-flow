
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';

interface TemporalFiltersProps {
  onFilterChange: (period: string) => void;
  activePeriod: string;
  onChartVisibilityChange?: (shouldShowMonthlyCharts: boolean) => void;
}

export const TemporalFilters = ({ 
  onFilterChange, 
  activePeriod, 
  onChartVisibilityChange 
}: TemporalFiltersProps) => {
  const periods = [
    { key: 'todo-periodo', label: 'Todo Período', icon: Calendar },
    { key: 'este-ano', label: 'Este Ano', icon: Calendar },
    { key: 'este-mes', label: 'Este Mês', icon: Calendar },
    { key: 'esta-semana', label: 'Esta Semana', icon: Clock },
    { key: 'hoje', label: 'Hoje', icon: Clock },
  ];

  const handlePeriodChange = (period: string) => {
    onFilterChange(period);
    
    // Notificar sobre visibilidade dos gráficos mensais
    const shouldShowMonthlyCharts = period === 'este-ano' || period === 'todo-periodo';
    if (onChartVisibilityChange) {
      onChartVisibilityChange(shouldShowMonthlyCharts);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Filtros Temporais para Gráficos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {periods.map((period) => {
            const Icon = period.icon;
            return (
              <Button
                key={period.key}
                variant={activePeriod === period.key ? "default" : "outline"}
                size="sm"
                onClick={() => handlePeriodChange(period.key)}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {period.label}
              </Button>
            );
          })}
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            ℹ️ Filtros temporais aplicam-se apenas aos gráficos. 
            {activePeriod !== 'este-ano' && activePeriod !== 'todo-periodo' && (
              <span className="text-orange-600"> Gráficos de comparação mensal estão ocultos neste filtro.</span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
