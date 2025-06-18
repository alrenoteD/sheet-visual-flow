
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Package } from 'lucide-react';
import { VisitData } from '@/types/VisitData';

interface BrandDistributionChartProps {
  data: VisitData[];
}

const COLORS = [
  'hsl(var(--chart-1))', 
  'hsl(var(--chart-2))', 
  'hsl(var(--chart-3))', 
  'hsl(var(--chart-4))', 
  'hsl(var(--chart-5))',
  '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444',
  '#84CC16', '#EC4899', '#6366F1', '#14B8A6', '#F97316'
];

export const BrandDistributionChart = ({ data }: BrandDistributionChartProps) => {
  const brandData = data.reduce((acc, item) => {
    const marca = item.marca || 'Não informado';
    if (!acc[marca]) {
      acc[marca] = {
        marca,
        visitasTotal: 0,
        visitasRealizadas: 0,
        visitasPreDefinidas: 0,
        count: 0
      };
    }
    acc[marca].visitasTotal += item.visitasRealizadas;
    acc[marca].visitasRealizadas += item.visitasRealizadas;
    acc[marca].visitasPreDefinidas += item.visitasPreDefinidas;
    acc[marca].count += 1;
    return acc;
  }, {} as Record<string, any>);

  const chartData = Object.values(brandData).map((brand: any, index) => ({
    ...brand,
    percentualCumprimento: brand.visitasPreDefinidas > 0 ? (brand.visitasRealizadas / brand.visitasPreDefinidas) * 100 : 0,
    color: COLORS[index % COLORS.length]
  }));

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, marca }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Não mostrar label se for muito pequeno

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

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
              label={CustomLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="visitasRealizadas"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value, name) => [
                `${value} visitas realizadas`,
                'Visitas'
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Legenda personalizada com scroll */}
        <div className="mt-4 max-h-32 overflow-y-auto border rounded-lg p-2">
          <div className="space-y-2">
            {chartData.map((entry, index) => (
              <div key={entry.marca} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 flex-1">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="truncate" title={entry.marca}>
                    {entry.marca}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium">
                    {entry.percentualCumprimento.toFixed(1)}%
                  </span>
                  <span>
                    {entry.visitasRealizadas}/{entry.visitasPreDefinidas}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
