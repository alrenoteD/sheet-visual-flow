
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Package } from 'lucide-react';
import { VisitData } from '@/types/VisitData';

interface BrandDistributionChartProps {
  data: VisitData[];
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export const BrandDistributionChart = ({ data }: BrandDistributionChartProps) => {
  const brandData = data.reduce((acc, item) => {
    const marca = item.marca || 'Não informado';
    if (!acc[marca]) {
      acc[marca] = {
        marca,
        visitasTotal: 0,
        valorTotal: 0,
        performance: 0,
        count: 0
      };
    }
    acc[marca].visitasTotal += item.visitasRealizadas;
    acc[marca].valorTotal += item.valorPago;
    acc[marca].performance += item.percentual;
    acc[marca].count += 1;
    return acc;
  }, {} as Record<string, any>);

  const chartData = Object.values(brandData).map((brand: any) => ({
    ...brand,
    performanceMedia: brand.count > 0 ? brand.performance / brand.count : 0
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Distribuição por Marca
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ marca, percent }) => `${marca} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="visitasTotal"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
