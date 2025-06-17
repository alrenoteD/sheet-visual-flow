
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { VisitData } from '@/types/VisitData';

interface PerformanceChartProps {
  data: VisitData[];
}

export const PerformanceChart = ({ data }: PerformanceChartProps) => {
  // Processar dados do mês atual apenas
  const processCurrentMonthData = () => {
    if (data.length === 0) return [];

    // Agrupar por dia no mês atual
    const dailyData = data.reduce((acc, item) => {
      item.datasVisitas.forEach(dateStr => {
        if (!dateStr) return;
        
        try {
          const date = new Date(dateStr);
          const dayKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
          const dayLabel = date.getDate().toString();
          
          if (!acc[dayKey]) {
            acc[dayKey] = {
              day: dayLabel,
              visitas: 0,
              promotores: new Set(),
              date: date
            };
          }
          
          acc[dayKey].visitas++;
          acc[dayKey].promotores.add(item.promotor.toLowerCase());
        } catch (error) {
          console.warn('Data inválida:', dateStr);
        }
      });
      
      return acc;
    }, {} as Record<string, any>);

    // Converter para array e ordenar por data
    return Object.values(dailyData)
      .map((item: any) => ({
        day: item.day,
        visitas: item.visitas,
        promotores: item.promotores.size,
        date: item.date
      }))
      .sort((a: any, b: any) => a.date.getTime() - b.date.getTime())
      .slice(0, 31); // Máximo 31 dias
  };

  const chartData = processCurrentMonthData();

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Performance por Dia
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Nenhum dado de performance disponível</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Performance Diária - Mês Atual
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="day" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              labelFormatter={(value) => `Dia ${value}`}
            />
            <Legend />
            <Bar 
              dataKey="visitas" 
              fill="hsl(var(--primary))" 
              name="Visitas Realizadas"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="promotores" 
              fill="hsl(var(--chart-1))" 
              name="Promotores Ativos"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
