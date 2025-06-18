
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Users } from 'lucide-react';
import { VisitData } from '@/types/VisitData';

interface PromoterPerformanceCorrelationChartProps {
  data: VisitData[];
}

export const PromoterPerformanceCorrelationChart = ({ data }: PromoterPerformanceCorrelationChartProps) => {
  const getPromoterType = (idPromotor: string) => {
    if (!idPromotor) return 'disabled';
    if (idPromotor.startsWith('P')) return 'person';
    if (idPromotor.startsWith('AG')) return 'agency';
    if (idPromotor.startsWith('T')) return 'test';
    return 'disabled';
  };

  const getColorByType = (type: string) => {
    switch (type) {
      case 'person':
        return '#87CEEB'; // Azul claro
      case 'agency':
        return '#FFA500'; // Laranja
      case 'test':
        return '#48D1CC'; // Ciano esverdeado claro
      case 'disabled':
        return '#FFFFFF'; // Branco
      default:
        return '#CCCCCC';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'person':
        return 'Promotor Pessoa';
      case 'agency':
        return 'Agência';
      case 'test':
        return 'Teste';
      case 'disabled':
        return 'Desativado';
      default:
        return 'Indefinido';
    }
  };

  // Processar dados por ID_PROMOTOR
  const processPromoterData = () => {
    if (data.length === 0) return [];

    const promoterMap = data.reduce((acc, item) => {
      const idPromotor = item.idPromotor || item.promotor;
      
      if (!acc[idPromotor]) {
        acc[idPromotor] = {
          idPromotor,
          promotorName: item.promotor,
          totalPreDefinidas: 0,
          totalRealizadas: 0,
          type: getPromoterType(idPromotor)
        };
      }
      
      acc[idPromotor].totalPreDefinidas += item.visitasPreDefinidas;
      acc[idPromotor].totalRealizadas += item.visitasRealizadas;
      
      return acc;
    }, {} as Record<string, any>);

    return Object.values(promoterMap).map((promoter: any, index) => {
      const performance = promoter.totalPreDefinidas > 0 
        ? (promoter.totalRealizadas / promoter.totalPreDefinidas) * 100 
        : 0;

      return {
        x: index + 1,
        y: performance,
        promotor: promoter.promotorName,
        idPromotor: promoter.idPromotor,
        performance: performance,
        totalRealizadas: promoter.totalRealizadas,
        totalPreDefinidas: promoter.totalPreDefinidas,
        type: promoter.type,
        color: getColorByType(promoter.type)
      };
    }).sort((a, b) => b.performance - a.performance);
  };

  const chartData = processPromoterData();

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Correlação: Desempenho × Promotor
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Nenhum dado disponível</p>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-card-foreground">{data.promotor}</p>
          <p className="text-sm text-muted-foreground">ID: {data.idPromotor}</p>
          <p className="text-sm text-muted-foreground">Tipo: {getTypeLabel(data.type)}</p>
          <p className="text-sm">Performance: {data.performance.toFixed(1)}%</p>
          <p className="text-sm">Visitas: {data.totalRealizadas}/{data.totalPreDefinidas}</p>
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={payload.color}
        stroke="#333"
        strokeWidth={1}
        opacity={0.8}
      />
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Correlação: Desempenho × Promotor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart data={chartData} margin={{ top: 20, right: 30, bottom: 60, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              type="number"
              dataKey="x"
              domain={[0.5, chartData.length + 0.5]}
              tick={false}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              domain={[0, 100]}
              stroke="hsl(var(--muted-foreground))"
              label={{ value: 'Performance (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Linhas de referência */}
            <ReferenceLine y={50} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" />
            <ReferenceLine y={75} stroke="hsl(var(--chart-2))" strokeDasharray="3 3" />
            <ReferenceLine y={90} stroke="hsl(var(--chart-1))" strokeDasharray="2 2" />
            
            <Scatter 
              dataKey="performance" 
              shape={<CustomDot />}
            />
          </ScatterChart>
        </ResponsiveContainer>
        
        {/* Legenda dos promotores */}
        <div className="mt-4 max-h-32 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
            {chartData.map((item, index) => (
              <div key={item.idPromotor} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full border border-gray-400"
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate" title={item.promotor}>
                  {item.promotor} ({item.performance.toFixed(0)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Legenda dos tipos */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#87CEEB', border: '1px solid #333' }} />
              <span>Promotor Pessoa (P)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFA500', border: '1px solid #333' }} />
              <span>Agência (AG)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#48D1CC', border: '1px solid #333' }} />
              <span>Teste (T)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFFFFF', border: '1px solid #333' }} />
              <span>Desativado</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
