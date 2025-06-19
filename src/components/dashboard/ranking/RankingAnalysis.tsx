
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Trophy, Users, MapPin, Target, TrendingUp, Award } from 'lucide-react';
import { VisitData } from '@/types/VisitData';

interface RankingAnalysisProps {
  data: VisitData[];
}

export const RankingAnalysis = ({ data }: RankingAnalysisProps) => {
  // Análise por promotor (agrupado por ID_PROMOTOR)
  const promoterAnalysis = data.reduce((acc, item) => {
    const key = item.idPromotor || item.promotor;
    if (!acc[key]) {
      acc[key] = {
        idPromotor: key,
        nome: item.promotor,
        totalVisitasPreDefinidas: 0,
        totalVisitasRealizadas: 0,
        valorContrato: 0,
        cidades: new Set(),
        marcas: new Set()
      };
    }
    acc[key].totalVisitasPreDefinidas += item.visitasPreDefinidas;
    acc[key].totalVisitasRealizadas += item.visitasRealizadas;
    acc[key].valorContrato += item.valorContrato;
    acc[key].cidades.add(item.cidade);
    acc[key].marcas.add(item.marca);
    return acc;
  }, {} as Record<string, any>);

  const promoterRanking = Object.values(promoterAnalysis).map((p: any) => {
    const performance = p.totalVisitasPreDefinidas > 0 ? (p.totalVisitasRealizadas / p.totalVisitasPreDefinidas) * 100 : 0;
    return {
      nome: p.nome,
      idPromotor: p.idPromotor,
      performance,
      visitasRealizadas: p.totalVisitasRealizadas,
      visitasPreDefinidas: p.totalVisitasPreDefinidas,
      valorContrato: p.valorContrato,
      cidadesCount: p.cidades.size,
      marcasCount: p.marcas.size
    };
  }).sort((a, b) => b.performance - a.performance);

  // Análise por cidade
  const cityAnalysis = data.reduce((acc, item) => {
    if (!acc[item.cidade]) {
      acc[item.cidade] = {
        totalVisitasPreDefinidas: 0,
        totalVisitasRealizadas: 0,
        promoteres: new Set(),
        valorTotal: 0
      };
    }
    acc[item.cidade].totalVisitasPreDefinidas += item.visitasPreDefinidas;
    acc[item.cidade].totalVisitasRealizadas += item.visitasRealizadas;
    acc[item.cidade].promoteres.add(item.idPromotor || item.promotor);
    acc[item.cidade].valorTotal += item.valorContrato;
    return acc;
  }, {} as Record<string, any>);

  const cityRanking = Object.entries(cityAnalysis).map(([cidade, data]: [string, any]) => {
    const performance = data.totalVisitasPreDefinidas > 0 ? (data.totalVisitasRealizadas / data.totalVisitasPreDefinidas) * 100 : 0;
    return {
      cidade,
      performance,
      visitasRealizadas: data.totalVisitasRealizadas,
      visitasPreDefinidas: data.totalVisitasPreDefinidas,
      promotoresCount: data.promoteres.size,
      valorTotal: data.valorTotal
    };
  }).sort((a, b) => b.performance - a.performance);

  // Análise por marca
  const brandAnalysis = data.reduce((acc, item) => {
    if (!acc[item.marca]) {
      acc[item.marca] = {
        totalVisitasPreDefinidas: 0,
        totalVisitasRealizadas: 0,
        valorTotal: 0
      };
    }
    acc[item.marca].totalVisitasPreDefinidas += item.visitasPreDefinidas;
    acc[item.marca].totalVisitasRealizadas += item.visitasRealizadas;
    acc[item.marca].valorTotal += item.valorContrato;
    return acc;
  }, {} as Record<string, any>);

  const brandRanking = Object.entries(brandAnalysis).map(([marca, data]: [string, any]) => {
    const performance = data.totalVisitasPreDefinidas > 0 ? (data.totalVisitasRealizadas / data.totalVisitasPreDefinidas) * 100 : 0;
    return {
      marca,
      performance,
      visitasRealizadas: data.totalVisitasRealizadas,
      visitasPreDefinidas: data.totalVisitasPreDefinidas,
      valorTotal: data.valorTotal
    };
  }).sort((a, b) => b.performance - a.performance);

  const getPerformanceBadge = (performance: number) => {
    if (performance >= 90) return { variant: 'default' as const, label: 'Excelente' };
    if (performance >= 70) return { variant: 'secondary' as const, label: 'Bom' };
    if (performance >= 50) return { variant: 'outline' as const, label: 'Regular' };
    return { variant: 'destructive' as const, label: 'Baixo' };
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff7f', '#ff6b6b', '#4ecdc4', '#95a5a6'];

  return (
    <div className="space-y-6">
      {/* Ranking de Promotores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Ranking de Promotores por Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={promoterRanking.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="nome" 
                  stroke="hsl(var(--muted-foreground))" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  fontSize={10}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Performance']}
                />
                <Bar dataKey="performance" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
            
            <div className="space-y-3">
              {promoterRanking.slice(0, 8).map((promoter, index) => {
                const badge = getPerformanceBadge(promoter.performance);
                return (
                  <div key={promoter.idPromotor} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">#{index + 1}</span>
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-medium">{promoter.nome}</span>
                        <p className="text-xs text-muted-foreground">
                          {promoter.visitasRealizadas}/{promoter.visitasPreDefinidas} visitas
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                      <p className="text-sm font-bold mt-1">{promoter.performance.toFixed(1)}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ranking de Cidades */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Ranking de Cidades por Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cityRanking.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="cidade" 
                  stroke="hsl(var(--muted-foreground))" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={10}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="visitasRealizadas" fill="hsl(var(--chart-1))" name="Realizadas" />
                <Bar dataKey="visitasPreDefinidas" fill="hsl(var(--chart-3))" name="Pré-Definidas" />
              </BarChart>
            </ResponsiveContainer>
            
            <div className="space-y-2">
              {cityRanking.slice(0, 6).map((city, index) => {
                const badge = getPerformanceBadge(city.performance);
                return (
                  <div key={city.cidade} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      <div>
                        <span className="font-medium">{city.cidade}</span>
                        <p className="text-xs text-muted-foreground">
                          {city.promotoresCount} promotores
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={badge.variant} className="text-xs">{badge.label}</Badge>
                      <p className="text-sm font-bold">{city.performance.toFixed(1)}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Análise de Marcas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            Performance por Marca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={brandRanking.slice(0, 8)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ marca, performance }) => `${marca}: ${performance.toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="valorTotal"
                >
                  {brandRanking.slice(0, 8).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Valor Total']}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-2">
              {brandRanking.slice(0, 6).map((brand, index) => {
                const badge = getPerformanceBadge(brand.performance);
                return (
                  <div key={brand.marca} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div>
                        <span className="font-medium">{brand.marca}</span>
                        <p className="text-xs text-muted-foreground">
                          {brand.visitasRealizadas}/{brand.visitasPreDefinidas} visitas
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={badge.variant} className="text-xs">{badge.label}</Badge>
                      <p className="text-sm font-bold">{brand.performance.toFixed(1)}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
