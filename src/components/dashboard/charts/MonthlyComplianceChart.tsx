
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
  
  const totalVisitasPreDefinidas = data.reduce((sum, item) => sum + item.visitasPreDefinidas, 0);
  const totalVisitasRealizadas = data.reduce((sum, item) => sum + item.visitasRealizadas, 0);
  
  const expectedDaily = totalVisitasPreDefinidas / daysInMonth;
  const expectedSoFar = expectedDaily * daysPassed;
  const monthlyCompliance = expectedSoFar > 0 ? (totalVisitasRealizadas / expectedSoFar) * 100 : 0;

  // Simular dados históricos para os últimos 6 meses
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
  const historicalData = months.map((month, index) => ({
    month,
    cumprimento: index === 5 ? monthlyCompliance : Math.random() * 40 + 70, // Mês atual + dados simulados
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
              formatter={(value) => [`${Number(value).toFixed(1)}%`, '']}
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
              <p className="text-lg font-bold">{monthlyCompliance.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">Mês Atual</p>
            </div>
            <div>
              <p className="text-lg font-bold">{Math.round(expectedDaily)}</p>
              <p className="text-xs text-muted-foreground">Meta Diária</p>
            </div>
            <div>
              <p className="text-lg font-bold">{daysPassed}/{daysInMonth}</p>
              <p className="text-xs text-muted-foreground">Dias Decorridos</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
