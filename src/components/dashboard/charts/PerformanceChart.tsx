
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { VisitData } from '@/types/VisitData';

interface PerformanceChartProps {
  data: VisitData[];
}

export const PerformanceChart = ({ data }: PerformanceChartProps) => {
  // Agrupar dados por mês baseado nas datas de visitas reais
  const monthlyData = data.reduce((acc, item) => {
    item.datasVisitas.forEach(dateStr => {
      if (!dateStr) return;
      
      const date = new Date(dateStr);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      
      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthName,
          preDefinidas: 0,
          realizadas: 0,
          valorPago: 0
        };
      }
      
      acc[monthKey].preDefinidas += item.visitasPreDefinidas;
      acc[monthKey].realizadas += item.visitasRealizadas;
      acc[monthKey].valorPago += item.valorPago;
    });
    
    return acc;
  }, {} as Record<string, any>);

  // Converter para array e ordenar por data
  const performanceData = Object.entries(monthlyData)
    .map(([key, value]) => value)
    .sort((a, b) => {
      // Ordenar pelos nomes dos meses
      const aDate = new Date(a.month);
      const bDate = new Date(b.month);
      return aDate.getTime() - bDate.getTime();
    });

  // Se não há dados agrupados por mês, mostrar dados atuais
  if (performanceData.length === 0) {
    const currentData = [{
      month: 'Atual',
      preDefinidas: data.reduce((sum, item) => sum + item.visitasPreDefinidas, 0),
      realizadas: data.reduce((sum, item) => sum + item.visitasRealizadas, 0),
      valorPago: data.reduce((sum, item) => sum + item.valorPago, 0)
    }];
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Performance por Período
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Legend />
              <Line type="monotone" dataKey="preDefinidas" stroke="hsl(var(--primary))" strokeWidth={3} name="Visitas Pré-definidas" />
              <Line type="monotone" dataKey="realizadas" stroke="hsl(var(--chart-1))" strokeWidth={3} name="Visitas Realizadas" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Performance Mensal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Legend />
            <Line type="monotone" dataKey="preDefinidas" stroke="hsl(var(--primary))" strokeWidth={3} name="Visitas Pré-definidas" />
            <Line type="monotone" dataKey="realizadas" stroke="hsl(var(--chart-1))" strokeWidth={3} name="Visitas Realizadas" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
