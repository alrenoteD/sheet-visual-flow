
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Package } from 'lucide-react';
import { VisitData } from '@/types/VisitData';

interface BrandDistributionChartProps {
  data: VisitData[];
}

const BRAND_COLORS = [
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#10b981', // Green
  '#f59e0b', // Yellow
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#84cc16', // Lime
  '#ec4899', // Pink
  '#6b7280'  // Gray
];

export const BrandDistributionChart = ({ data }: BrandDistributionChartProps) => {
  const brandData = data.reduce((acc, item) => {
    const marca = item.marca || 'Não informado';
    if (!acc[marca]) {
      acc[marca] = {
        marca,
        visitasPreDefinidas: 0,
        visitasRealizadas: 0,
        valorTotal: 0,
        count: 0
      };
    }
    acc[marca].visitasPreDefinidas += item.visitasPreDefinidas;
    acc[marca].visitasRealizadas += item.visitasRealizadas;
    acc[marca].valorTotal += item.valorPago;
    acc[marca].count += 1;
    return acc;
  }, {} as Record<string, any>);

  const chartData = Object.values(brandData).map((brand: any, index) => ({
    ...brand,
    percentualCumprimento: brand.visitasPreDefinidas > 0 ? (brand.visitasRealizadas / brand.visitasPreDefinidas) * 100 : 0,
    color: BRAND_COLORS[index % BRAND_COLORS.length]
  }));

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
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
              formatter={(value, name, props) => [
                `${value} visitas (${props.payload.percentualCumprimento.toFixed(1)}% cumprimento)`,
                'Visitas Realizadas'
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="mt-4 space-y-2">
          {chartData.map((brand, index) => (
            <div key={brand.marca} className="flex items-center justify-between p-2 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded" 
                  style={{ backgroundColor: brand.color }}
                />
                <span className="text-sm font-medium">{brand.marca}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">{brand.percentualCumprimento.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">
                  {brand.visitasRealizadas}/{brand.visitasPreDefinidas} visitas
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
