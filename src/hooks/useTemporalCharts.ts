
import { useState, useEffect } from 'react';
import { VisitData } from '@/types/VisitData';

interface UseTemporalChartsProps {
  data: VisitData[];
}

export const useTemporalCharts = ({ data }: UseTemporalChartsProps) => {
  const [chartData, setChartData] = useState<VisitData[]>(data);
  const [activePeriod, setActivePeriod] = useState('todo-periodo');

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

  const filterChartData = (period: string) => {
    setActivePeriod(period);
    
    if (period === 'todo-periodo') {
      setChartData(data);
      return;
    }

    const range = getDateRange(period);
    if (!range) {
      setChartData(data);
      return;
    }

    const filtered = data.filter(item => {
      return item.datasVisitas.some(visitDate => {
        if (!visitDate) return false;
        const date = new Date(visitDate);
        return date >= range.start && date <= range.end;
      });
    });

    setChartData(filtered);
  };

  useEffect(() => {
    setChartData(data);
  }, [data]);

  return {
    chartData,
    activePeriod,
    filterChartData
  };
};
