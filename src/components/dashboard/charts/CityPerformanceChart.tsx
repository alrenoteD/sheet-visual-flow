
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MapPin } from 'lucide-react';
import { VisitData } from '@/types/VisitData';

interface CityPerformanceChartProps {
  data: VisitData[];
}

export const CityPerformanceChart = ({ data }: CityPerformanceChartProps) => {
  const cityData = data.reduce((acc, item) => {
    const cidade = item.cidade || 'Não informado';
    if (!acc[cidade]) {
      acc[cidade] = {
        cidade,
        visitasPreDefinidas: 0,
        visitasRealizadas: 0,
        valorTotal: 0,
        valorPago: 0
      };
    }
    acc[cidade].visitasPreDefinidas += item.visitasPreDefinidas;
    acc[cidade].visitasRealizadas += item.visitasRealizadas;
    acc[cidade].valorTotal += item.valorContrato;
    acc[cidade].valorPago += item.valorPago;
    return acc;
  }, {} as Record<string, any>);

  const chartData = Object.values(cityData).map((city: any) => ({
    ...city,
    performance: city.visitasPreDefinidas > 0 ? (city.visitasRealizadas / city.visitasPreDefinidas) * 100 : 0
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Performance por Cidade
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="cidade" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Legend />
            <Bar dataKey="visitasRealizadas" fill="hsl(var(--chart-1))" name="Visitas Realizadas" />
            <Bar dataKey="visitasPreDefinidas" fill="hsl(var(--chart-2))" name="Visitas Pré-definidas" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
