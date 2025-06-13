
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Database, Clock } from 'lucide-react';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { GoogleSheetsConfigComponent } from '@/components/GoogleSheetsConfig';
import { DataEditor } from '@/components/DataEditor';
import { KPICards } from '@/components/dashboard/KPICards';
import { PerformanceChart } from '@/components/dashboard/charts/PerformanceChart';
import { FinancialChart } from '@/components/dashboard/charts/FinancialChart';
import { VisitData } from '@/types/VisitData';

const Index = () => {
  const { data, loading, config, saveConfig, loadData, updateData } = useGoogleSheets();

  // Dados de exemplo para quando não há dados do Google Sheets
  const fallbackData: VisitData[] = [
    { 
      id: '1', 
      promotor: 'CLAUDIA NEGOSKI', 
      rede: 'SUPERMERCADOS ALFA',
      cidade: 'LAGUNA', 
      marca: 'ALBA', 
      visitasPreDefinidas: 8,
      visitasRealizadas: 3,
      percentual: 37.5,
      telefone: '(48) 99999-1234',
      dataInicio: '2024-01-15',
      valorContrato: 2400,
      valorPorVisita: 300,
      valorPago: 900,
      datasVisitas: ['2024-06-01', '2024-06-05', '2024-06-10']
    },
    { 
      id: '2', 
      promotor: 'NATASHA DOS SANTOS ORTIZ', 
      rede: 'REDE BETA',
      cidade: 'BALNEÁRIO CAMBORIÚ', 
      marca: 'ALFAJOR', 
      visitasPreDefinidas: 8,
      visitasRealizadas: 1,
      percentual: 12.5,
      telefone: '(47) 88888-5678',
      dataInicio: '2024-02-01',
      valorContrato: 3200,
      valorPorVisita: 400,
      valorPago: 400,
      datasVisitas: ['2024-06-12']
    },
    { 
      id: '3', 
      promotor: 'EMILIANO MARTINS KAISER', 
      rede: 'DISTRIBUIDORA GAMA',
      cidade: 'CHAPECÓ', 
      marca: 'AQUAFAST', 
      visitasPreDefinidas: 8,
      visitasRealizadas: 3,
      percentual: 37.5,
      telefone: '(49) 77777-9012',
      dataInicio: '2024-01-20',
      valorContrato: 2800,
      valorPorVisita: 350,
      valorPago: 1050,
      datasVisitas: ['2024-06-02', '2024-06-08', '2024-06-15']
    }
  ];

  const currentData = data.length > 0 ? data : fallbackData;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
            DASHBOARD DE CONTROLE DE VISITAS
          </h1>
          <p className="text-muted-foreground text-lg">
            Sistema Completo de Gestão | Promotores • Agências • Pagamentos
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
        <KPICards data={currentData} isConnected={data.length > 0} />

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
            <TabsTrigger value="promoters">Promotores</TabsTrigger>
            <TabsTrigger value="editor">Editor</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PerformanceChart data={currentData} />
              <FinancialChart data={currentData} />
            </div>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <FinancialChart data={currentData} />
          </TabsContent>

          <TabsContent value="promoters" className="space-y-6">
            <PerformanceChart data={currentData} />
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
            <span>Dashboard sincronizado com Google Sheets - Modelo Avançado de Controle</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
