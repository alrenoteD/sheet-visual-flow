
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { BarChart3, TrendingUp, Users, Target } from 'lucide-react';
import { VisitData } from '@/types/VisitData';

interface AdvancedChartsProps {
  data: VisitData[];
}

export const AdvancedCharts = ({ data }: AdvancedChartsProps) => {
  // 1. Histograma de Frequência de Visitas por Colaborador
  const getVisitFrequencyHistogram = () => {
    const promoterVisits = data.reduce((acc, item) => {
      const key = item.promotor.toLowerCase();
      acc[key] = (acc[key] || 0) + item.visitasRealizadas;
      return acc;
    }, {} as Record<string, number>);

    const frequencies = Object.values(promoterVisits);
    const maxVisits = Math.max(...frequencies, 1);
    const buckets = Math.min(10, Math.max(5, Math.ceil(maxVisits / 5)));
    const bucketSize = Math.ceil(maxVisits / buckets);

    const histogram = Array.from({ length: buckets }, (_, i) => {
      const min = i * bucketSize;
      const max = (i + 1) * bucketSize;
      const count = frequencies.filter(f => f >= min && f < max).length;
      return { range: `${min}-${max-1}`, count, promotores: count };
    });

    return histogram;
  };

  // 2. Performance por Marca (Boxplot simulado com barras)
  const getBrandPerformance = () => {
    const brandData = data.reduce((acc, item) => {
      if (!acc[item.marca]) {
        acc[item.marca] = { visitas: [], percentuais: [] };
      }
      acc[item.marca].visitas.push(item.visitasRealizadas);
      acc[item.marca].percentuais.push(item.percentual);
      return acc;
    }, {} as Record<string, any>);

    return Object.entries(brandData).map(([marca, data]) => {
      const visitas = data.visitas.sort((a: number, b: number) => a - b);
      const percentuais = data.percentuais.sort((a: number, b: number) => a - b);
      
      return {
        marca: marca.substring(0, 10) + (marca.length > 10 ? '...' : ''),
        min: Math.min(...visitas),
        max: Math.max(...visitas),
        median: visitas[Math.floor(visitas.length / 2)] || 0,
        avgPercentual: percentuais.reduce((sum, p) => sum + p, 0) / percentuais.length || 0
      };
    });
  };

  // 3. Correlação Visitas vs Performance
  const getCorrelationData = () => {
    return data.map(item => ({
      visitas: item.visitasRealizadas,
      percentual: item.percentual,
      valor: item.valorPago,
      promotor: item.promotor.substring(0, 15)
    }));
  };

  // 4. Heatmap de Cumprimento por Cidade
  const getCityHeatmap = () => {
    const cityData = data.reduce((acc, item) => {
      if (!acc[item.cidade]) {
        acc[item.cidade] = { total: 0, cumprimento: 0, count: 0 };
      }
      acc[item.cidade].total += item.visitasPreDefinidas;
      acc[item.cidade].cumprimento += item.visitasRealizadas;
      acc[item.cidade].count++;
      return acc;
    }, {} as Record<string, any>);

    return Object.entries(cityData).map(([cidade, data]) => ({
      cidade: cidade.substring(0, 12),
      percentual: data.total > 0 ? (data.cumprimento / data.total) * 100 : 0,
      status: data.total > 0 ? (data.cumprimento / data.total) * 100 >= 80 ? 'Excelente' : 
              (data.cumprimento / data.total) * 100 >= 60 ? 'Bom' : 'Atenção' : 'Sem dados'
    }));
  };

  // 5. Performance Individual (Radar)
  const getTopPromotersRadar = () => {
    const promoterStats = data.reduce((acc, item) => {
      const key = item.promotor.toLowerCase();
      if (!acc[key]) {
        acc[key] = {
          nome: item.promotor.substring(0, 15),
          visitasTotal: 0,
          percentualMedio: 0,
          valorTotal: 0,
          count: 0
        };
      }
      acc[key].visitasTotal += item.visitasRealizadas;
      acc[key].percentualMedio += item.percentual;
      acc[key].valorTotal += item.valorPago;
      acc[key].count++;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(promoterStats)
      .map((promoter: any) => ({
        nome: promoter.nome,
        visitas: Math.min(100, (promoter.visitasTotal / 50) * 100), // Normalizado para 100
        performance: Math.min(100, promoter.percentualMedio / promoter.count),
        valor: Math.min(100, (promoter.valorTotal / 10000) * 100), // Normalizado
        consistencia: Math.min(100, (promoter.count / data.length) * 100 * 10) // Baseado na frequência
      }))
      .sort((a, b) => b.performance - a.performance)
      .slice(0, 5);
  };

  const histogramData = getVisitFrequencyHistogram();
  const brandData = getBrandPerformance();
  const correlationData = getCorrelationData();
  const cityHeatmapData = getCityHeatmap();
  const radarData = getTopPromotersRadar();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
  const HEAT_COLORS = { 'Excelente': '#22c55e', 'Bom': '#eab308', 'Atenção': '#ef4444', 'Sem dados': '#64748b' };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Histograma de Frequência */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Histograma - Visitas por Promotor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={histogramData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="promotores" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 2. Performance por Marca */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Análise por Marca (Min/Méd/Max)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={brandData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="marca" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="min" fill="#ff7c7c" name="Mínimo" />
                <Bar dataKey="median" fill="#ffd93d" name="Mediana" />
                <Bar dataKey="max" fill="#6bcf7f" name="Máximo" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3. Correlação Performance vs Visitas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Correlação: Visitas × Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <ScatterChart data={correlationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="visitas" name="Visitas" />
                <YAxis dataKey="percentual" name="Performance %" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter dataKey="percentual" fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 4. Heatmap de Cidades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Cumprimento por Cidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={cityHeatmapData}
                  dataKey="percentual"
                  nameKey="cidade"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ cidade, percentual }) => `${cidade}: ${percentual.toFixed(1)}%`}
                >
                  {cityHeatmapData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={HEAT_COLORS[entry.status as keyof typeof HEAT_COLORS] || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 5. Radar Chart dos Top Promotores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Performance Multidimensional - Top 5 Promotores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="nome" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Visitas"
                dataKey="visitas"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
              />
              <Radar
                name="Performance"
                dataKey="performance"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.3}
              />
              <Radar
                name="Valor"
                dataKey="valor"
                stroke="#ffc658"
                fill="#ffc658"
                fillOpacity={0.3}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
