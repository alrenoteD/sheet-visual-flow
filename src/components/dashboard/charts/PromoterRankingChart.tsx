
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Trophy } from 'lucide-react';
import { VisitData } from '@/types/VisitData';
import { Badge } from '@/components/ui/badge';

interface PromoterRankingChartProps {
  data: VisitData[];
}

export const PromoterRankingChart = ({ data }: PromoterRankingChartProps) => {
  // Agrupar por ID_PROMOTOR
  const groupedData = data.reduce((acc, item) => {
    const key = item.idPromotor || item.promotor;
    if (!acc[key]) {
      acc[key] = {
        idPromotor: key,
        promotor: item.promotor,
        totalVisitasPreDefinidas: 0,
        totalVisitasRealizadas: 0,
        registros: []
      };
    }
    acc[key].totalVisitasPreDefinidas += item.visitasPreDefinidas;
    acc[key].totalVisitasRealizadas += item.visitasRealizadas;
    acc[key].registros.push(item);
    return acc;
  }, {} as Record<string, any>);

  // Calcular performance e criar dados para o gráfico
  const currentDate = new Date();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const daysPassed = currentDate.getDate();

  const chartData = Object.values(groupedData).map((group: any) => {
    const metaDiaria = group.totalVisitasPreDefinidas / daysInMonth;
    const metaEsperada = metaDiaria * daysPassed;
    const percentualPerformance = group.totalVisitasPreDefinidas > 0 ? 
      (group.totalVisitasRealizadas / group.totalVisitasPreDefinidas) * 100 : 0;
    
    return {
      promotor: group.promotor,
      idPromotor: group.idPromotor,
      visitasRealizadas: group.totalVisitasRealizadas,
      visitasPendentes: Math.max(0, group.totalVisitasPreDefinidas - group.totalVisitasRealizadas),
      totalVisitas: group.totalVisitasPreDefinidas,
      percentual: percentualPerformance
    };
  })
  .sort((a, b) => b.percentual - a.percentual)
  .slice(0, 10);

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
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
              <YAxis 
                dataKey="promotor" 
                type="category" 
                stroke="hsl(var(--muted-foreground))" 
                width={120}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value, name) => {
                  if (name === 'visitasRealizadas') return [`${value} realizadas`, 'Visitas Realizadas'];
                  if (name === 'visitasPendentes') return [`${value} pendentes`, 'Visitas Pendentes'];
                  return [value, name];
                }}
              />
              <Bar 
                dataKey="visitasRealizadas" 
                stackId="a" 
                fill="hsl(var(--chart-1))" 
                name="Visitas Realizadas"
              />
              <Bar 
                dataKey="visitasPendentes" 
                stackId="a" 
                fill="hsl(var(--chart-3))" 
                name="Visitas Pendentes"
              />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {chartData.slice(0, 6).map((promoter, index) => {
              const badge = getPerformanceBadge(promoter.percentual);
              return (
                <div key={promoter.idPromotor} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">#{index + 1}</span>
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium truncate" title={promoter.promotor}>
                      {promoter.promotor}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={badge.color}>{badge.label}</Badge>
                    <span className="text-sm font-bold">{promoter.percentual.toFixed(1)}%</span>
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
