
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { VisitData } from '@/types/VisitData';

interface PromoterPerformanceCorrelationChartProps {
  data: VisitData[];
}

export const PromoterPerformanceCorrelationChart = ({ data }: PromoterPerformanceCorrelationChartProps) => {
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
        tipo: 'desativado' // default
      };
    }
    acc[idPromotor].visitasPreDefinidas += item.visitasPreDefinidas;
    acc[idPromotor].visitasRealizadas += item.visitasRealizadas;
    
    // Determinar tipo baseado no ID_PROMOTOR
    if (idPromotor.startsWith('P')) acc[idPromotor].tipo = 'pessoa';
    else if (idPromotor.startsWith('AG')) acc[idPromotor].tipo = 'agencia';
    else if (idPromotor.startsWith('T')) acc[idPromotor].tipo = 'teste';
    
    return acc;
  }, {} as Record<string, any>);

  // Calcular performance e preparar dados para o scatter
  const scatterData = Object.values(groupedData).map((promoter: any, index) => {
    const performance = promoter.visitasPreDefinidas > 0 ? (promoter.visitasRealizadas / promoter.visitasPreDefinidas) * 100 : 0;
    
    return {
      x: index + 1,
      y: performance,
      promotor: promoter.promotor,
      idPromotor: promoter.idPromotor,
      tipo: promoter.tipo,
      visitasRealizadas: promoter.visitasRealizadas,
      visitasPreDefinidas: promoter.visitasPreDefinidas
    };
  }).sort((a, b) => b.y - a.y);

  const getColor = (tipo: string) => {
    switch (tipo) {
      case 'pessoa': return '#87CEEB'; // Azul claro
      case 'agencia': return '#FFA500'; // Laranja
      case 'teste': return '#40E0D0'; // Ciano esverdeado claro
      default: return '#FFFFFF'; // Branco
    }
  };

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    return (
      <circle 
        cx={cx} 
        cy={cy} 
        r={6} 
        fill={getColor(payload.tipo)}
        stroke="#374151"
        strokeWidth={2}
      />
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Correlação: Desempenho × Promotor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart data={scatterData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              type="number" 
              dataKey="x"
              domain={[0, scatterData.length + 1]}
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(value) => {
                const promoter = scatterData[value - 1];
                return promoter ? promoter.promotor.split(' ')[0] : '';
              }}
            />
            <YAxis 
              type="number"
              domain={[0, 120]}
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value, name, props) => [
                `${Number(value).toFixed(1)}%`,
                'Performance'
              ]}
              labelFormatter={(value, payload) => {
                if (payload && payload[0]) {
                  const data = payload[0].payload;
                  return `${data.promotor} (${data.idPromotor})`;
                }
                return '';
              }}
            />
            <ReferenceLine y={100} stroke="hsl(var(--destructive))" strokeDasharray="5 5" />
            <ReferenceLine y={80} stroke="hsl(var(--warning))" strokeDasharray="3 3" />
            <Scatter dataKey="y" fill="#8884d8" shape={<CustomDot />} />
          </ScatterChart>
        </ResponsiveContainer>
        
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#87CEEB' }}></div>
            <span>Pessoa (P)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#FFA500' }}></div>
            <span>Agência (AG)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#40E0D0' }}></div>
            <span>Teste (T)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#FFFFFF', border: '1px solid #374151' }}></div>
            <span>Desativado</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
