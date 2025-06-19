
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, Target, Calendar, MapPin } from 'lucide-react';
import { VisitData } from '@/types/VisitData';

interface AnalyticsReportsProps {
  data: VisitData[];
}

export const AnalyticsReports = ({ data }: AnalyticsReportsProps) => {
  // Análise por promotor
  const promoterAnalysis = data.reduce((acc, item) => {
    const key = item.idPromotor || item.promotor;
    if (!acc[key]) {
      acc[key] = {
        nome: item.promotor,
        visitasPreDefinidas: 0,
        visitasRealizadas: 0,
        valorContrato: 0,
        cidades: new Set(),
        marcas: new Set()
      };
    }
    acc[key].visitasPreDefinidas += item.visitasPreDefinidas;
    acc[key].visitasRealizadas += item.visitasRealizadas;
    acc[key].valorContrato += item.valorContrato;
    acc[key].cidades.add(item.cidade);
    acc[key].marcas.add(item.marca);
    return acc;
  }, {} as Record<string, any>);

  const promoterData = Object.values(promoterAnalysis).map((p: any) => ({
    nome: p.nome,
    performance: p.visitasPreDefinidas > 0 ? (p.visitasRealizadas / p.visitasPreDefinidas) * 100 : 0,
    visitasRealizadas: p.visitasRealizadas,
    visitasPreDefinidas: p.visitasPreDefinidas,
    valorContrato: p.valorContrato,
    cidadesCount: p.cidades.size,
    marcasCount: p.marcas.size
  })).sort((a, b) => b.performance - a.performance);

  // Análise por cidade
  const cityAnalysis = data.reduce((acc, item) => {
    if (!acc[item.cidade]) {
      acc[item.cidade] = {
        visitasPreDefinidas: 0,
        visitasRealizadas: 0,
        promotores: new Set()
      };
    }
    acc[item.cidade].visitasPreDefinidas += item.visitasPreDefinidas;
    acc[item.cidade].visitasRealizadas += item.visitasRealizadas;
    acc[item.cidade].promotores.add(item.promotor);
    return acc;
  }, {} as Record<string, any>);

  const cityData = Object.entries(cityAnalysis).map(([cidade, data]: [string, any]) => ({
    cidade,
    performance: data.visitasPreDefinidas > 0 ? (data.visitasRealizadas / data.visitasPreDefinidas) * 100 : 0,
    visitasRealizadas: data.visitasRealizadas,
    visitasPreDefinidas: data.visitasPreDefinidas,
    promotoresCount: data.promotores.size
  })).sort((a, b) => b.performance - a.performance);

  // Análise por marca
  const brandAnalysis = data.reduce((acc, item) => {
    if (!acc[item.marca]) {
      acc[item.marca] = {
        visitasPreDefinidas: 0,
        visitasRealizadas: 0,
        valorContrato: 0
      };
    }
    acc[item.marca].visitasPreDefinidas += item.visitasPreDefinidas;
    acc[item.marca].visitasRealizadas += item.visitasRealizadas;
    acc[item.marca].valorContrato += item.valorContrato;
    return acc;
  }, {} as Record<string, any>);

  const brandData = Object.entries(brandAnalysis).map(([marca, data]: [string, any]) => ({
    marca,
    performance: data.visitasPreDefinidas > 0 ? (data.visitasRealizadas / data.visitasPreDefinidas) * 100 : 0,
    visitasRealizadas: data.visitasRealizadas,
    visitasPreDefinidas: data.visitasPreDefinidas,
    valorContrato: data.valorContrato
  })).sort((a, b) => b.performance - a.performance);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff7f', '#ff6b6b', '#4ecdc4', '#95a5a6'];

  return (
    <div className="space-y-6">
      {/* Análise de Performance por Promotor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Análise de Performance - Promotores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={promoterData.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="nome" 
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
                formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Performance']}
              />
              <Bar dataKey="performance" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Análise Comparativa por Cidade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Análise Comparativa - Cidades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={cityData.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="cidade" 
                  stroke="hsl(var(--muted-foreground))" 
                  angle={-45}
                  textAnchor="end"
                  height={60}
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
              {cityData.slice(0, 6).map((city, index) => (
                <div key={city.cidade} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <div>
                    <span className="font-medium">{city.cidade}</span>
                    <p className="text-xs text-muted-foreground">
                      {city.promotoresCount} promotores
                    </p>
                  </div>
                  <Badge variant={city.performance >= 70 ? 'default' : 'secondary'}>
                    {city.performance.toFixed(1)}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Análise Financeira por Marca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Análise Financeira - Marcas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={brandData.slice(0, 8)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ marca, performance }) => `${marca}: ${performance.toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="valorContrato"
                >
                  {brandData.slice(0, 8).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Valor Contrato']}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-2">
              {brandData.slice(0, 6).map((brand, index) => (
                <div key={brand.marca} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <div>
                    <span className="font-medium">{brand.marca}</span>
                    <p className="text-xs text-muted-foreground">
                      R$ {brand.valorContrato.toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <Badge variant={brand.performance >= 70 ? 'default' : 'secondary'}>
                    {brand.performance.toFixed(1)}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
