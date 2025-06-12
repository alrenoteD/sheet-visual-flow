
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Users, 
  MapPin, 
  TrendingUp, 
  Calendar, 
  Target, 
  Activity,
  Building2,
  Clock,
  Database
} from 'lucide-react';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { GoogleSheetsConfigComponent } from '@/components/GoogleSheetsConfig';
import { DataEditor } from '@/components/DataEditor';

const Index = () => {
  const { data, loading, config, saveConfig, loadData, updateData } = useGoogleSheets();

  // Dados de exemplo para quando não há dados do Google Sheets
  const fallbackData = [
    { id: '1', promotor: 'CLAUDIA NEGOSKI', visitas: 8, concluidas: 3, percentual: 37.5, cidade: 'LAGUNA', marca: 'ALBA', data: '2024-06-12' },
    { id: '2', promotor: 'NATASHA DOS SANTOS ORTIZ', visitas: 8, concluidas: 1, percentual: 12.5, cidade: 'AQUAFAST', marca: 'ALFAJOR', data: '2024-06-12' },
    { id: '3', promotor: 'EMILIANO MARTINS KAISER', visitas: 8, concluidas: 3, percentual: 37.5, cidade: 'CHAPECÓ', marca: 'AQUAFAST', data: '2024-06-12' },
    { id: '4', promotor: 'KALVYN HENRIQUE VEIGA', visitas: 8, concluidas: 4, percentual: 50.0, cidade: 'PORTO ALEGRE', marca: 'ARARAS', data: '2024-06-12' },
    { id: '5', promotor: 'LILIANE', visitas: 8, concluidas: 2, percentual: 25.0, cidade: 'TORRES', marca: 'BELL', data: '2024-06-12' },
    { id: '6', promotor: 'PALOMA', visitas: 8, concluidas: 4, percentual: 50.0, cidade: 'LAGUNA', marca: 'ALBA', data: '2024-06-12' }
  ];

  const currentData = data.length > 0 ? data : fallbackData;

  // Processar dados para os gráficos
  const cityData = currentData.reduce((acc, item) => {
    const existing = acc.find(c => c.city === item.cidade);
    if (existing) {
      existing.visits += item.visitas;
    } else {
      acc.push({ city: item.cidade, visits: item.visitas, percentage: 0 });
    }
    return acc;
  }, [] as { city: string; visits: number; percentage: number }[]);

  const totalVisits = cityData.reduce((sum, city) => sum + city.visits, 0);
  cityData.forEach(city => {
    city.percentage = Math.round((city.visits / totalVisits) * 100);
  });

  const brandData = currentData.reduce((acc, item) => {
    const existing = acc.find(b => b.name === item.marca);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: item.marca, value: 1, color: `hsl(${Math.random() * 360}, 70%, 50%)` });
    }
    return acc;
  }, [] as { name: string; value: number; color: string }[]);

  const totalBrands = brandData.reduce((sum, brand) => sum + brand.value, 0);
  brandData.forEach(brand => {
    brand.value = Math.round((brand.value / totalBrands) * 100);
  });

  const performanceData = [
    { month: 'Jan', visitas: 45, concluidas: 28 },
    { month: 'Feb', visitas: 52, concluidas: 35 },
    { month: 'Mar', visitas: 48, concluidas: 31 },
    { month: 'Apr', visitas: 61, concluidas: 42 },
    { month: 'May', visitas: 55, concluidas: 38 },
    { month: 'Jun', visitas: currentData.reduce((sum, item) => sum + item.visitas, 0), 
      concluidas: currentData.reduce((sum, item) => sum + item.concluidas, 0) }
  ];

  const totalVisitas = currentData.reduce((sum, item) => sum + item.visitas, 0);
  const totalConcluidas = currentData.reduce((sum, item) => sum + item.concluidas, 0);
  const averageCompletion = totalVisitas > 0 ? (totalConcluidas / totalVisitas) * 100 : 0;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
            DASHBOARD DE VISITAS REALIZADAS
          </h1>
          <p className="text-muted-foreground text-lg">
            Análise Profissional de Performance | Dados Integrados com Google Sheets
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Atualizado em: {new Date().toLocaleDateString('pt-BR')}</span>
            {data.length > 0 && (
              <Badge variant="default" className="ml-2">
                <Database className="w-3 h-3 mr-1" />
                Conectado ao Google Sheets
              </Badge>
            )}
          </div>
        </div>

        {/* Google Sheets Configuration */}
        <GoogleSheetsConfigComponent
          config={config}
          onSaveConfig={saveConfig}
          onLoadData={loadData}
          loading={loading}
          dataCount={data.length}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary/20 to-chart-1/20 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Visitas</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVisitas}</div>
              <p className="text-xs text-muted-foreground">
                {data.length > 0 ? 'Dados do Google Sheets' : 'Dados de exemplo'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-1/20 to-chart-2/20 border-chart-1/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visitas Concluídas</CardTitle>
              <Activity className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalConcluidas}</div>
              <p className="text-xs text-muted-foreground">
                {averageCompletion.toFixed(1)}% taxa de conclusão
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-2/20 to-chart-3/20 border-chart-2/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promotores Ativos</CardTitle>
              <Users className="h-4 w-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentData.length}</div>
              <p className="text-xs text-muted-foreground">
                Equipe de vendas
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-3/20 to-chart-4/20 border-chart-3/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cidades Cobertas</CardTitle>
              <MapPin className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cityData.length}</div>
              <p className="text-xs text-muted-foreground">
                Área de atuação
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="promoters">Promotores</TabsTrigger>
            <TabsTrigger value="locations">Localidades</TabsTrigger>
            <TabsTrigger value="brands">Marcas</TabsTrigger>
            <TabsTrigger value="editor">Editor</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Performance Mensal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Line type="monotone" dataKey="visitas" stroke="hsl(var(--primary))" strokeWidth={3} name="Visitas Planejadas" />
                      <Line type="monotone" dataKey="concluidas" stroke="hsl(var(--chart-1))" strokeWidth={3} name="Visitas Concluídas" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Brand Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Distribuição por Marcas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={brandData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {brandData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="promoters" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Promoter Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance dos Promotores</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={currentData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                      <YAxis dataKey="promotor" type="category" width={150} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="visitas" fill="hsl(var(--primary))" name="Total Visitas" />
                      <Bar dataKey="concluidas" fill="hsl(var(--chart-1))" name="Concluídas" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Promoter Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes dos Promotores</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentData.map((promoter, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{promoter.promotor}</span>
                        <Badge variant={promoter.percentual >= 40 ? "default" : "secondary"}>
                          {promoter.percentual}%
                        </Badge>
                      </div>
                      <Progress value={promoter.percentual} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {promoter.concluidas}/{promoter.visitas} visitas concluídas
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="locations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Distribuição Geográfica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={cityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="city" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="visits" fill="hsl(var(--chart-2))" />
                    </BarChart>
                  </ResponsiveContainer>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Top Cidades</h3>
                    {cityData.map((city, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                        <div>
                          <div className="font-medium">{city.city}</div>
                          <div className="text-sm text-muted-foreground">{city.visits} visitas</div>
                        </div>
                        <Badge variant="outline">{city.percentage}%</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="brands" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {brandData.map((brand, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <CardTitle className="text-lg" style={{ color: brand.color }}>
                      {brand.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">{brand.value}%</div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${brand.value}%`,
                          backgroundColor: brand.color 
                        }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Participação no mercado
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="editor" className="space-y-6">
            <DataEditor
              data={currentData}
              onUpdateData={updateData}
              loading={loading}
            />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground border-t border-border pt-6">
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Dashboard sincronizado com Google Sheets</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
