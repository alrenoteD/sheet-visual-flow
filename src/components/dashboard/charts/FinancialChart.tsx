
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign } from 'lucide-react';
import { VisitData } from '@/types/VisitData';

interface FinancialChartProps {
  data: VisitData[];
}

export const FinancialChart = ({ data }: FinancialChartProps) => {
  const financialData = data.map(item => ({
    promotor: item.promotor.split(' ')[0],
    valorContrato: item.valorContrato,
    valorPago: item.valorPago,
    pendente: item.valorContrato - item.valorPago
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Análise Financeira
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={financialData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="promotor" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, '']}
            />
            <Bar dataKey="valorContrato" fill="hsl(var(--primary))" name="Valor Contrato" />
            <Bar dataKey="valorPago" fill="hsl(var(--chart-1))" name="Valor Pago" />
            <Bar dataKey="pendente" fill="hsl(var(--chart-2))" name="Pendente" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
