
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Trophy } from 'lucide-react';
import { VisitData } from '@/types/VisitData';
import { Badge } from '@/components/ui/badge';

interface PromoterRankingChartProps {
  data: VisitData[];
}

export const PromoterRankingChart = ({ data }: PromoterRankingChartProps) => {
  const currentDate = new Date();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const daysPassed = currentDate.getDate();

  // Agrupar por ID_PROMOTOR
  const groupedData = data.reduce((acc, item) => {
    const idPromotor = item.idPromotor || 'N/A';
    if (!acc[idPromotor]) {
      acc[idPromotor] = {
        idPromotor,
        promotor: item.promotor,
        visitasPreDefinidas: 0,
        visitasRealizadas: 0,
        valorPago: 0
      };
    }
    acc[idPromotor].visitasPreDefinidas += item.visitasPreDefinidas;
    acc[idPromotor].visitasRealizadas += item.visitasRealizadas;
    acc[idPromotor].valorPago += item.valorPago;
    return acc;
  }, {} as Record<string, any>);

  // Calcular performance e ordenar
  const promotersData = Object.values(groupedData).map((promoter: any) => {
    const expectedDaily = promoter.visitasPreDefinidas / daysInMonth;
    const expectedSoFar = expectedDaily * daysPassed;
    const performance = promoter.visitasPreDefinidas > 0 ? (promoter.visitasRealizadas / promoter.visitasPreDefinidas) * 100 : 0;
    
    return {
      ...promoter,
      performance,
      visitasEsperadas: Math.round(expectedSoFar),
      deficit: Math.max(0, Math.round(expectedSoFar) - promoter.visitasRealizadas)
    };
  }).sort((a, b) => b.performance - a.performance).slice(0, 10);

  const getPerformanceBadge = (percentual: number) => {
    if (percentual >= 90) return { color: 'bg-green-600', label: 'Excelente' };
    if (percentual >= 70) return { color: 'bg-blue-600', label: 'Bom' };
    if (percentual >= 50) return { color: 'bg-yellow-600', label: 'Regular' };
    return { color: 'bg-red-600', label: 'Baixo' };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Top 10 Promotores
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={promotersData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
              <YAxis 
                dataKey="promotor" 
                type="category" 
                stroke="hsl(var(--muted-foreground))" 
                width={100}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value, name) => {
                  if (name === 'visitasRealizadas') return [value, 'Visitas Realizadas'];
                  if (name === 'deficit') return [value, 'Déficit'];
                  return [value, name];
                }}
              />
              <Bar dataKey="visitasRealizadas" stackId="a" fill="hsl(var(--chart-1))" />
              <Bar dataKey="deficit" stackId="a" fill="hsl(var(--muted))" />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {promotersData.slice(0, 6).map((promoter, index) => {
              const badge = getPerformanceBadge(promoter.performance);
              return (
                <div key={promoter.idPromotor} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">#{index + 1}</span>
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium truncate">{promoter.promotor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={badge.color}>{badge.label}</Badge>
                    <span className="text-sm font-bold">{promoter.performance.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
