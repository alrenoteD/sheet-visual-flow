
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface VisitInfo {
  date: string;
  marca: string;
  cidade: string;
  rede: string;
}

interface VisitCalendarProps {
  visits: VisitInfo[];
}

export const VisitCalendar = ({ visits }: VisitCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Primeiro dia do mês
    const firstDay = new Date(year, month, 1);
    // Último dia do mês
    const lastDay = new Date(year, month + 1, 0);
    
    // Primeiro domingo da semana que contém o primeiro dia do mês
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    
    // Último sábado da semana que contém o último dia do mês
    const endDate = new Date(lastDay);
    endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
    
    const days = [];
    const currentDay = new Date(startDate);
    
    while (currentDay <= endDate) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  }, [currentDate]);

  const visitsByDate = useMemo(() => {
    const visitMap: { [key: string]: VisitInfo[] } = {};
    
    visits.forEach(visit => {
      if (!visit.date) return;
      
      try {
        const date = new Date(visit.date);
        if (isNaN(date.getTime())) return;
        
        const dateKey = date.toISOString().split('T')[0];
        if (!visitMap[dateKey]) {
          visitMap[dateKey] = [];
        }
        visitMap[dateKey].push(visit);
      } catch (error) {
        // Ignorar datas inválidas
      }
    });
    
    return visitMap;
  }, [visits]);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="space-y-4">
      {/* Header do Calendário */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <h3 className="text-lg font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        
        <Button variant="outline" size="sm" onClick={goToNextMonth}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Calendário */}
      <div className="grid grid-cols-7 gap-1">
        {/* Cabeçalho dos dias da semana */}
        {weekDays.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        
        {/* Dias do calendário */}
        {calendarData.map((date, index) => {
          const dateKey = date.toISOString().split('T')[0];
          const dayVisits = visitsByDate[dateKey] || [];
          const isCurrentMonthDay = isCurrentMonth(date);
          const isTodayDate = isToday(date);
          
          return (
            <div
              key={index}
              className={`
                min-h-20 p-1 border rounded-lg relative cursor-pointer transition-colors
                ${isCurrentMonthDay ? 'bg-background' : 'bg-muted/30'}
                ${isTodayDate ? 'ring-2 ring-primary' : ''}
                ${dayVisits.length > 0 ? 'hover:bg-accent' : ''}
              `}
              title={`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}
            >
              {/* Número do dia */}
              <div className={`
                text-sm font-medium
                ${isCurrentMonthDay ? 'text-foreground' : 'text-muted-foreground'}
                ${isTodayDate ? 'font-bold' : ''}
              `}>
                {date.getDate()}
              </div>
              
              {/* Indicadores de visitas */}
              {dayVisits.length > 0 && (
                <div className="space-y-1 mt-1">
                  {dayVisits.slice(0, 2).map((visit, visitIndex) => (
                    <div
                      key={visitIndex}
                      className="w-full h-1.5 bg-blue-500 rounded-full opacity-80"
                      title={`${visit.marca} - ${visit.cidade}`}
                    />
                  ))}
                  {dayVisits.length > 2 && (
                    <div className="text-xs text-center text-muted-foreground">
                      +{dayVisits.length - 2}
                    </div>
                  )}
                </div>
              )}
              
              {/* Badge com contagem de visitas */}
              {dayVisits.length > 0 && (
                <Badge 
                  variant="secondary" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {dayVisits.length}
                </Badge>
              )}
            </div>
          );
        })}
      </div>

      {/* Legenda */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-1.5 bg-blue-500 rounded-full" />
          <span>Visita realizada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-primary rounded" />
          <span>Hoje</span>
        </div>
      </div>

      {/* Resumo do mês */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <div className="text-2xl font-bold">{visits.length}</div>
          <div className="text-sm text-muted-foreground">Total de Visitas</div>
        </div>
        
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <div className="text-2xl font-bold">
            {Object.keys(visitsByDate).length}
          </div>
          <div className="text-sm text-muted-foreground">Dias com Visitas</div>
        </div>
        
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <div className="text-2xl font-bold">
            {[...new Set(visits.map(v => v.marca))].length}
          </div>
          <div className="text-sm text-muted-foreground">Marcas Visitadas</div>
        </div>
      </div>
    </div>
  );
};
