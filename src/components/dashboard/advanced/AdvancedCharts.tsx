
import { useState } from 'react';
import { VisitData } from '@/types/VisitData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter, ComposedChart, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Target, Users, DollarSign, Calendar, BarChart3, PieChart as PieChartIcon, Activity, Zap } from 'lucide-react';

interface AdvancedChartsProps {
  data: VisitData[];
}

export const AdvancedCharts = ({ data }: AdvancedChartsProps) => {
  const [selectedMetricX, setSelectedMetricX] = useState('visitasPreDefinidas');
  const [selectedMetricY, setSelectedMetricY] = useState('visitasRealizadas');
  const [selectedPromoter, setSelectedPromoter] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [chartType, setChartType] = useState('bar');

  // Get unique values for filters
  const uniquePromoters = [...new Set(data.map(item => item.promotor))].sort();
  const uniqueBrands = [...new Set(data.map(item => item.marca))].sort();

  // Filter data based on selections
  const filteredData = data.filter(item => {
    if (selectedPromoter && item.promotor !== selectedPromoter) return false;
    if (selectedBrand && item.marca !== selectedBrand) return false;
    return true;
  });

  // Calculate comprehensive metrics
  const totalVisitasPreDefinidas = filteredData.reduce((sum, item) => sum + item.visitasPreDefinidas, 0);
  const totalVisitasRealizadas = filteredData.reduce((sum, item) => sum + item.visitasRealizadas, 0);
  const totalValorContrato = filteredData.reduce((sum, item) => sum + item.valorContrato, 0);
  const totalValorPago = filteredData.reduce((sum, item) => sum + item.valorPago, 0);
  
  const performanceGeral = totalVisitasPreDefinidas > 0 ? (totalVisitasRealizadas / totalVisitasPreDefinidas) * 100 : 0;
  const eficienciaFinanceira = totalValorContrato > 0 ? (totalValorPago / totalValorContrato) * 100 : 0;
  const metaCumprimento = performanceGeral >= 80 ? 100 : (performanceGeral / 80) * 100;

  // Prepare data for different chart types
  const chartData = filteredData.map(item => ({
    nome: item.promotor.split(' ')[0],
    visitasPreDefinidas: item.visitasPreDefinidas,
    visitasRealizadas: item.visitasRealizadas,
    percentual: item.percentual,
    valorContrato: item.valorContrato,
    valorPago: item.valorPago,
    cidade: item.cidade,
    marca: item.marca,
    eficiencia: item.visitasPreDefinidas > 0 ? (item.visitasRealizadas / item.visitasPreDefinidas) * 100 : 0
  }));

  // Performance by city data
  const cityPerformance = Object.values(
    filteredData.reduce((acc, item) => {
      if (!acc[item.cidade]) {
        acc[item.cidade] = {
          cidade: item.cidade,
          visitasPreDefinidas: 0,
          visitasRealizadas: 0,
          valorTotal: 0,
          count: 0
        };
      }
      acc[item.cidade].visitasPreDefinidas += item.visitasPreDefinidas;
      acc[item.cidade].visitasRealizadas += item.visitasRealizadas;
      acc[item.cidade].valorTotal += item.valorContrato;
      acc[item.cidade].count += 1;
      return acc;
    }, {} as any)
  ).map((city: any) => ({
    ...city,
    performance: city.visitasPreDefinidas > 0 ? (city.visitasRealizadas / city.visitasPreDefinidas) * 100 : 0
  }));

  // Brand distribution data
  const brandData = Object.values(
    filteredData.reduce((acc, item) => {
      if (!acc[item.marca]) {
        acc[item.marca] = {
          marca: item.marca,
          value: 0,
          performance: 0,
          totalPreDefinidas: 0,
          totalRealizadas: 0
        };
      }
      acc[item.marca].value += item.valorContrato;
      acc[item.marca].totalPreDefinidas += item.visitasPreDefinidas;
      acc[item.marca].totalRealizadas += item.visitasRealizadas;
      return acc;
    }, {} as any)
  ).map((brand: any) => ({
    ...brand,
    performance: brand.totalPreDefinidas > 0 ? (brand.totalRealizadas / brand.totalPreDefinidas) * 100 : 0
  }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff7f', '#ff6b6b', '#4ecdc4', '#95a5a6'];

  const renderChart = () => {
    switch (chartType) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={brandData.slice(0, 8)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ marca, performance }) => `${marca}: ${performance.toFixed(1)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {brandData.slice(0, 8).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Valor Contrato']} />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData.slice(0, 15)}>
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
              />
              <Line type="monotone" dataKey={selectedMetricY} stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey={selectedMetricX} stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                type="number" 
                dataKey={selectedMetricX} 
                name={selectedMetricX}
                stroke="hsl(var(--muted-foreground))" 
              />
              <YAxis 
                type="number" 
                dataKey={selectedMetricY} 
                name={selectedMetricY}
                stroke="hsl(var(--muted-foreground))" 
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value, name) => [value, name]}
                labelFormatter={(label, payload) => payload?.[0]?.payload?.nome || 'Promotor'}
              />
              <Scatter dataKey={selectedMetricY} fill="hsl(var(--primary))" />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData.slice(0, 15)}>
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
              />
              <Area type="monotone" dataKey={selectedMetricY} stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
              <Area type="monotone" dataKey={selectedMetricX} stackId="2" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        );

      default: // bar chart
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData.slice(0, 15)}>
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
              />
              <Bar dataKey={selectedMetricY} fill="hsl(var(--primary))" />
              <Bar dataKey={selectedMetricX} fill="hsl(var(--chart-2))" />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Dashboard Números */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Performance Geral</p>
                <p className="text-2xl font-bold text-blue-600">{performanceGeral.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">{totalVisitasRealizadas}/{totalVisitasPreDefinidas}</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Eficiência Financeira</p>
                <p className="text-2xl font-bold text-green-600">{eficienciaFinanceira.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">R$ {totalValorPago.toLocaleString('pt-BR')}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Meta Cumprimento</p>
                <p className="text-2xl font-bold text-purple-600">{metaCumprimento.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Meta: 80%</p>
              </div>
              <Zap className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Promotores Ativos</p>
                <p className="text-2xl font-bold text-orange-600">{uniquePromoters.length}</p>
                <p className="text-xs text-muted-foreground">{uniqueBrands.length} marcas</p>
              </div>
              <Users className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Controles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Controles Avançados de Visualização
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <Label>Tipo de Gráfico</Label>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Colunas</SelectItem>
                  <SelectItem value="line">Linha</SelectItem>
                  <SelectItem value="area">Área</SelectItem>
                  <SelectItem value="scatter">Pontos (Scatter)</SelectItem>
                  <SelectItem value="pie">Pizza</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Métrica X</Label>
              <Select value={selectedMetricX} onValueChange={setSelectedMetricX}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visitasPreDefinidas">Visitas Pré-Definidas</SelectItem>
                  <SelectItem value="visitasRealizadas">Visitas Realizadas</SelectItem>
                  <SelectItem value="valorContrato">Valor Contrato</SelectItem>
                  <SelectItem value="valorPago">Valor Pago</SelectItem>
                  <SelectItem value="percentual">Percentual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Métrica Y</Label>
              <Select value={selectedMetricY} onValueChange={setSelectedMetricY}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visitasRealizadas">Visitas Realizadas</SelectItem>
                  <SelectItem value="visitasPreDefinidas">Visitas Pré-Definidas</SelectItem>
                  <SelectItem value="valorContrato">Valor Contrato</SelectItem>
                  <SelectItem value="valorPago">Valor Pago</SelectItem>
                  <SelectItem value="percentual">Percentual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Filtrar Promotor</Label>
              <Select value={selectedPromoter} onValueChange={setSelectedPromoter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os Promotores</SelectItem>
                  {uniquePromoters.map(promoter => (
                    <SelectItem key={promoter} value={promoter}>
                      {promoter.split(' ')[0]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Filtrar Marca</Label>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as Marcas</SelectItem>
                  {uniqueBrands.map(brand => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {selectedPromoter && (
              <Badge variant="secondary">
                Promotor: {selectedPromoter.split(' ')[0]}
              </Badge>
            )}
            {selectedBrand && (
              <Badge variant="secondary">
                Marca: {selectedBrand}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Gráfico Principal Dinâmico */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Visualização Dinâmica: {selectedMetricY} vs {selectedMetricX}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderChart()}
        </CardContent>
      </Card>

      {/* Performance por Cidade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Performance por Cidade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cityPerformance.slice(0, 10)}>
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
              <Bar dataKey="performance" fill="hsl(var(--chart-1))" name="Performance %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Métricas Detalhadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5" />
              Distribuição por Marca (Valor)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={brandData.slice(0, 6)}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {brandData.slice(0, 6).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Valor']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {chartData
                .sort((a, b) => b.eficiencia - a.eficiencia)
                .slice(0, 5)
                .map((promoter, index) => (
                  <div key={promoter.nome} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{promoter.nome}</p>
                        <p className="text-xs text-muted-foreground">{promoter.cidade} - {promoter.marca}</p>
                      </div>
                    </div>
                    <Badge variant={promoter.eficiencia >= 80 ? 'default' : 'secondary'}>
                      {promoter.eficiencia.toFixed(1)}%
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
