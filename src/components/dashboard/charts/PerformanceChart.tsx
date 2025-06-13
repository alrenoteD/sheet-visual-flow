
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { VisitData } from '@/types/VisitData';

interface PerformanceChartProps {
  data: VisitData[];
}

export const PerformanceChart = ({ data }: PerformanceChartProps) => {
  const performanceData = [
    { month: 'Jan', preDefinidas: 45, realizadas: 28, valorPago: 14000 },
    { month: 'Feb', preDefinidas: 52, realizadas: 35, valorPago: 17500 },
    { month: 'Mar', preDefinidas: 48, realizadas: 31, valorPago: 15500 },
    { month: 'Apr', preDefinidas: 61, realizadas: 42, valorPago: 21000 },
    { month: 'May', preDefinidas: 55, realizadas: 38, valorPago: 19000 },
    { 
      month: 'Jun', 
      preDefinidas: data.reduce((sum, item) => sum + item.visitasPreDefinidas, 0),
      realizadas: data.reduce((sum, item) => sum + item.visitasRealizadas, 0),
      valorPago: data.reduce((sum, item) => sum + item.valorPago, 0)
    }
  ];

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
