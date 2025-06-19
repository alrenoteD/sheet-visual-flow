
import { useState } from 'react';
import { VisitData } from '@/types/VisitData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, ScatterChart, Scatter, Area, AreaChart } from 'recharts';
import { TrendingUp, BarChart2, PieChart as PieChartIcon, Activity, Target } from 'lucide-react';

interface AdvancedChartsProps {
  data: VisitData[];
}

export const AdvancedCharts = ({ data }: AdvancedChartsProps) => {
  const [chartType, setChartType] = useState('bar');
  const [dataComparison, setDataComparison] = useState('visitas-vs-predefinidas');
  const [filterMarca, setFilterMarca] = useState('');
  const [filterPromotor, setFilterPromotor] = useState('');

  // Filtrar dados
  const filteredData = data.filter(item => {
    if (filterMarca && item.marca !== filterMarca) return false;
    if (filterPromotor && item.promotor !== filterPromotor) return false;
    return true;
  });

  // Preparar dados baseado na comparação selecionada
  const prepareChartData = () => {
    switch (dataComparison) {
      case 'visitas-vs-predefinidas':
        return filteredData.map(item => ({
          name: item.promotor.substring(0, 10) + '...',
          'Visitas Realizadas': item.visitasRealizadas,
          'Visitas Pré-definidas': item.visitasPreDefinidas,
          promotor: item.promotor
        }));
      
      case 'performance-por-cidade':
        const cidadePerf = filteredData.reduce((acc, item) => {
          if (!acc[item.cidade]) {
            acc[item.cidade] = { total: 0, realizadas: 0, count: 0 };
          }
          acc[item.cidade].total += item.visitasPreDefinidas;
          acc[item.cidade].realizadas += item.visitasRealizadas;
          acc[item.cidade].count += 1;
          return acc;
        }, {} as Record<string, any>);
        
        return Object.entries(cidadePerf).map(([cidade, data]: [string, any]) => ({
          name: cidade,
          'Performance (%)': data.total > 0 ? ((data.realizadas / data.total) * 100).toFixed(1) : 0,
          'Promotores': data.count
        }));
      
      case 'financeiro-por-marca':
        const marcaFinanceiro = filteredData.reduce((acc, item) => {
          if (!acc[item.marca]) {
            acc[item.marca] = { contrato: 0, pago: 0 };
          }
          acc[item.marca].contrato += item.valorContrato;
          acc[item.marca].pago += item.valorPago;
          return acc;
        }, {} as Record<string, any>);
        
        return Object.entries(marcaFinanceiro).map(([marca, data]: [string, any]) => ({
          name: marca,
          'Valor Contrato': data.contrato,
          'Valor Pago': data.pago
        }));
      
      default:
        return [];
    }
  };

  const chartData = prepareChartData();
  const uniqueMarcas = [...new Set(data.map(item => item.marca))];
  const uniquePromoters = [...new Set(data.map(item => item.promotor))];

  // Calcular métricas importantes
  const totalVisitasRealizadas = filteredData.reduce((sum, item) => sum + item.visitasRealizadas, 0);
  const totalVisitasPreDefinidas = filteredData.reduce((sum, item) => sum + item.visitasPreDefinidas, 0);
  const performanceGeral = totalVisitasPreDefinidas > 0 ? (totalVisitasRealizadas / totalVisitasPreDefinidas) * 100 : 0;
  const totalValorContrato = filteredData.reduce((sum, item) => sum + item.valorContrato, 0);
  const totalValorPago = filteredData.reduce((sum, item) => sum + item.valorPago, 0);
  const metaCumprimento = performanceGeral >= 80 ? 'Meta Atingida' : 'Abaixo da Meta';

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(chartData[0] || {}).filter(key => key !== 'name' && key !== 'promotor').map((key, index) => (
                <Bar key={key} dataKey={key} fill={COLORS[index % COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        const pieData = chartData.map((item, index) => ({
          name: item.name,
          value: parseFloat(item[Object.keys(item).find(k => k !== 'name' && k !== 'promotor') || ''] || 0),
          fill: COLORS[index % COLORS.length]
        }));
        
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(chartData[0] || {}).filter(key => key !== 'name' && key !== 'promotor').map((key, index) => (
                <Line key={key} type="monotone" dataKey={key} stroke={COLORS[index % COLORS.length]} strokeWidth={2} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(chartData[0] || {}).filter(key => key !== 'name' && key !== 'promotor').map((key, index) => (
                <Area key={key} type="monotone" dataKey={key} stackId="1" stroke={COLORS[index % COLORS.length]} fill={COLORS[index % COLORS.length]} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'scatter':
        const scatterData = filteredData.map(item => ({
          x: item.visitasPreDefinidas,
          y: item.visitasRealizadas,
          name: item.promotor.substring(0, 15) + '...'
        }));
        
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={scatterData}>
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name="Visitas Pré-definidas" />
              <YAxis type="number" dataKey="y" name="Visitas Realizadas" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Promotores" data={scatterData} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Geral</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceGeral.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {totalVisitasRealizadas} de {totalVisitasPreDefinidas} visitas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meta de Cumprimento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant={performanceGeral >= 80 ? 'default' : 'destructive'}>
                {metaCumprimento}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Meta: 80% de conclusão
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Percentual Financeiro</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalValorContrato > 0 ? ((totalValorPago / totalValorContrato) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              R$ {totalValorPago.toLocaleString('pt-BR')} de R$ {totalValorContrato.toLocaleString('pt-BR')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promotores Ativos</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredData.length}</div>
            <p className="text-xs text-muted-foreground">
              {new Set(filteredData.map(item => item.cidade)).size} cidades
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Controles de Filtro */}
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Avançado - Para Nerds 🤓</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Gráfico</Label>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Gráfico de Barras</SelectItem>
                  <SelectItem value="pie">Gráfico de Pizza</SelectItem>
                  <SelectItem value="line">Gráfico de Linha</SelectItem>
                  <SelectItem value="area">Gráfico de Área</SelectItem>
                  <SelectItem value="scatter">Scatter Plot</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Dados para Comparar</Label>
              <Select value={dataComparison} onValueChange={setDataComparison}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visitas-vs-predefinidas">Visitas vs Pré-definidas</SelectItem>
                  <SelectItem value="performance-por-cidade">Performance por Cidade</SelectItem>
                  <SelectItem value="financeiro-por-marca">Financeiro por Marca</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Filtrar por Marca</Label>
              <Select value={filterMarca} onValueChange={setFilterMarca}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as marcas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as marcas</SelectItem>
                  {uniqueMarcas.map(marca => (
                    <SelectItem key={marca} value={marca}>{marca}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Filtrar por Promotor</Label>
              <Select value={filterPromotor} onValueChange={setFilterPromotor}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os promotores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os promotores</SelectItem>
                  {uniquePromoters.slice(0, 20).map(promotor => (
                    <SelectItem key={promotor} value={promotor}>{promotor.substring(0, 30)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="w-5 h-5" />
            Análise Visual - {dataComparison.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? renderChart() : (
            <div className="h-96 flex items-center justify-center text-muted-foreground">
              Nenhum dado disponível para os filtros selecionados
            </div>
          )}
        </CardContent>
      </Card>

      {/* Métricas Detalhadas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Análise de Desempenho</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Taxa de Conclusão:</span>
              <span className="font-medium">{performanceGeral.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Promotores Acima de 80%:</span>
              <span className="font-medium">
                {filteredData.filter(item => item.percentual >= 80).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Média de Visitas/Promotor:</span>
              <span className="font-medium">
                {filteredData.length > 0 ? (totalVisitasRealizadas / filteredData.length).toFixed(1) : 0}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Análise Financeira</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Valor Total Contratado:</span>
              <span className="font-medium">R$ {totalValorContrato.toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Valor Pago:</span>
              <span className="font-medium">R$ {totalValorPago.toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Valor Pendente:</span>
              <span className="font-medium text-orange-600">
                R$ {(totalValorContrato - totalValorPago).toLocaleString('pt-BR')}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Análise Geográfica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Cidades Ativas:</span>
              <span className="font-medium">{new Set(filteredData.map(item => item.cidade)).size}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Redes Atendidas:</span>
              <span className="font-medium">{new Set(filteredData.map(item => item.rede)).size}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Marcas Trabalhadas:</span>
              <span className="font-medium">{new Set(filteredData.map(item => item.marca)).size}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
