
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { ConnectionStatus } from '@/components/dashboard/ConnectionStatus';
import { DataEditor } from '@/components/DataEditor';
import { KPICards } from '@/components/dashboard/KPICards';
import { PerformanceChart } from '@/components/dashboard/charts/PerformanceChart';
import { FinancialChart } from '@/components/dashboard/charts/FinancialChart';
import { MonthlyComplianceChart } from '@/components/dashboard/charts/MonthlyComplianceChart';
import { CityPerformanceChart } from '@/components/dashboard/charts/CityPerformanceChart';
import { BrandDistributionChart } from '@/components/dashboard/charts/BrandDistributionChart';
import { PromoterRankingChart } from '@/components/dashboard/charts/PromoterRankingChart';
import { DashboardFilters } from '@/components/dashboard/filters/DashboardFilters';
import { ProfessionalInsights } from '@/components/dashboard/insights/ProfessionalInsights';
import { MiniChat } from '@/components/dashboard/chat/MiniChat';
import { MonthSelector } from '@/components/dashboard/MonthSelector';
import { VisitData } from '@/types/VisitData';

const Index = () => {
  const { 
    data, 
    loading, 
    isConnected, 
    loadData, 
    updateData, 
    currentMonth, 
    availableMonths, 
    changeMonth,
    getUniquePromoters 
  } = useGoogleSheets();
  const [filteredData, setFilteredData] = useState<VisitData[]>([]);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleFiltersChange = (newFilteredData: VisitData[]) => {
    setFilteredData(newFilteredData);
  };

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
            {isConnected && (
              <Badge variant="default" className="ml-2">
                Conectado ao Google Sheets
              </Badge>
            )}
          </div>
        </div>

        {/* Connection Status */}
        <ConnectionStatus
          isConnected={isConnected}
          loading={loading}
          dataCount={data.length}
          onRefresh={loadData}
        />

        {/* Mostrar conteúdo apenas se conectado */}
        {isConnected ? (
          <>
            {/* Seletor de Mês e Downloads */}
            <MonthSelector
              currentMonth={currentMonth}
              availableMonths={availableMonths}
              onMonthChange={changeMonth}
              data={data}
              getUniquePromoters={getUniquePromoters}
            />

            {/* Filtros */}
            {data.length > 0 && (
              <DashboardFilters data={data} onFiltersChange={handleFiltersChange} />
            )}

            {/* KPI Cards */}
            <KPICards 
              data={filteredData} 
              isConnected={isConnected}
              getUniquePromoters={getUniquePromoters}
            />

            {/* Main Dashboard Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-8">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="analytics">Análises</TabsTrigger>
                <TabsTrigger value="ranking">Rankings</TabsTrigger>
                <TabsTrigger value="financial">Financeiro</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="chat">Assistente</TabsTrigger>
                <TabsTrigger value="editor">Editor</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {filteredData.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <PerformanceChart data={filteredData} />
                      <MonthlyComplianceChart data={filteredData} />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <FinancialChart data={filteredData} />
                      <MiniChat data={filteredData} />
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <div className="text-6xl opacity-20">📊</div>
                    <h3 className="text-xl font-semibold text-muted-foreground">
                      Nenhum Dado Encontrado
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      A página '{currentMonth}' não possui dados. Adicione dados via editor ou crie uma nova página na planilha.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                {filteredData.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <PerformanceChart data={filteredData} />
                    <MonthlyComplianceChart data={filteredData} />
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum dado de performance disponível para o mês selecionado.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                {filteredData.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <CityPerformanceChart data={filteredData} />
                    <BrandDistributionChart data={filteredData} />
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum dado analítico disponível para o mês selecionado.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="ranking" className="space-y-6">
                {filteredData.length > 0 ? (
                  <PromoterRankingChart data={filteredData} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum dado de ranking disponível para o mês selecionado.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="financial" className="space-y-6">
                {filteredData.length > 0 ? (
                  <FinancialChart data={filteredData} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum dado financeiro disponível para o mês selecionado.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="insights" className="space-y-6">
                {filteredData.length > 0 ? (
                  <ProfessionalInsights data={filteredData} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum insight disponível para o mês selecionado.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="chat" className="space-y-6">
                <MiniChat data={filteredData} />
              </TabsContent>

              <TabsContent value="editor" className="space-y-6">
                <DataEditor
                  data={data}
                  onUpdateData={updateData}
                  loading={loading}
                />
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="text-center py-12 space-y-4">
            <div className="text-6xl opacity-20">📊</div>
            <h3 className="text-xl font-semibold text-muted-foreground">
              Aguardando Conexão
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Configure as variáveis de ambiente no EasyPanel para conectar com sua planilha do Google Sheets e visualizar seus dados.
            </p>
          </div>
        )}

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
