
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Calendar } from 'lucide-react';
import { VisitData } from '@/types/VisitData';

interface MonthlyComplianceChartProps {
  data: VisitData[];
}

export const MonthlyComplianceChart = ({ data }: MonthlyComplianceChartProps) => {
  const currentDate = new Date();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const daysPassed = currentDate.getDate();
  
  // Agrupar por promotor para evitar duplicatas e calcular totais corretos
  const promoterMap = data.reduce((acc, item) => {
    const key = item.idPromotor || item.promotor;
    if (!acc[key]) {
      acc[key] = {
        visitasPreDefinidas: 0,
        visitasRealizadas: 0
      };
    }
    acc[key].visitasPreDefinidas += item.visitasPreDefinidas;
    acc[key].visitasRealizadas += item.visitasRealizadas;
    return acc;
  }, {} as Record<string, any>);

  const totalVisitasPreDefinidas = Object.values(promoterMap).reduce((sum: number, item: any) => sum + item.visitasPreDefinidas, 0);
  const totalVisitasRealizadas = Object.values(promoterMap).reduce((sum: number, item: any) => sum + item.visitasRealizadas, 0);
  
  // Calcular meta diária baseada no total de visitas pré-definidas dividido pelos dias do mês
  const metaDiaria = totalVisitasPreDefinidas > 0 ? Math.round(totalVisitasPreDefinidas / daysInMonth) : 0;
  
  // Calcular o que deveria ter sido realizado até agora
  const esperadoAteMomento = metaDiaria * daysPassed;
  
  // Calcular percentual de cumprimento baseado no progresso real vs esperado
  const percentualCumprimento = esperadoAteMomento > 0 ? (totalVisitasRealizadas / esperadoAteMomento) * 100 : 0;

  // Simular dados históricos para os últimos 6 meses com valores mais realistas
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
  const historicalData = months.map((month, index) => ({
    month,
    cumprimento: index === 5 ? percentualCumprimento : Math.random() * 30 + 70, // Mês atual + dados simulados entre 70-100%
    meta: 100
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Cumprimento Mensal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Cumprimento']}
            />
            <ReferenceLine y={100} stroke="hsl(var(--destructive))" strokeDasharray="5 5" />
            <Bar 
              dataKey="cumprimento" 
              fill="hsl(var(--primary))" 
              name="Cumprimento"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold">{percentualCumprimento.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">Mês Atual</p>
            </div>
            <div>
              <p className="text-lg font-bold">{metaDiaria}</p>
              <p className="text-xs text-muted-foreground">Meta Diária</p>
            </div>
            <div>
              <p className="text-lg font-bold">{daysPassed}/{daysInMonth}</p>
              <p className="text-xs text-muted-foreground">Dias Decorridos</p>
            </div>
          </div>
          <div className="mt-2 text-center">
            <p className="text-xs text-muted-foreground">
              Realizadas: {totalVisitasRealizadas} | Esperado: {esperadoAteMomento} | Total: {totalVisitasPreDefinidas}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
