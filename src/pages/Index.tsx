import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, BarChart3 } from 'lucide-react';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';
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
import { TemporalFilters } from '@/components/dashboard/filters/TemporalFilters';
import { ProfessionalInsights } from '@/components/dashboard/insights/ProfessionalInsights';
import { DasherAssistant } from '@/components/dashboard/chat/DasherAssistant';
import { MonthSelector } from '@/components/dashboard/MonthSelector';
import { DashboardHeader } from '@/components/dashboard/Header';
import { AdvancedReports } from '@/components/dashboard/reports/AdvancedReports';
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
  const [temporalFilteredData, setTemporalFilteredData] = useState<VisitData[]>([]);
  const [activePeriod, setActivePeriod] = useState('todo-periodo');
  const [chartVisibility, setChartVisibility] = useState({
    performance: true,
    financial: true,
    compliance: true,
    cityPerformance: false,
    brandDistribution: false,
    promoterRanking: false
  });

  // Real-time updates with fixed interval
  const { forceUpdate, intervalMinutes } = useRealTimeUpdates({
    isConnected,
    loadData,
    currentMonth
  });

  useEffect(() => {
    setFilteredData(data);
    setTemporalFilteredData(data);
  }, [data]);

  const handleFiltersChange = (newFilteredData: VisitData[]) => {
    setFilteredData(newFilteredData);
  };

  const handleTemporalFiltersChange = (newFilteredData: VisitData[], period: string) => {
    setTemporalFilteredData(newFilteredData);
    setActivePeriod(period);
  };

  const toggleChartVisibility = (chartKey: keyof typeof chartVisibility) => {
    setChartVisibility(prev => ({
      ...prev,
      [chartKey]: !prev[chartKey]
    }));
  };

  const finalData = temporalFilteredData.length > 0 ? temporalFilteredData : filteredData;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Enhanced Header with Auth */}
        <DashboardHeader isConnected={isConnected} onRefresh={forceUpdate} />

        {/* Connection Status with Update Interval Info */}
        <ConnectionStatus
          isConnected={isConnected}
          loading={loading}
          dataCount={data.length}
          onRefresh={loadData}
        />

        {isConnected && (
          <div className="text-sm text-muted-foreground text-center">
            Atualização automática a cada {intervalMinutes} minutos
          </div>
        )}

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
              <div className="space-y-4">
                <DashboardFilters data={data} onFiltersChange={handleFiltersChange} />
                <TemporalFilters 
                  data={filteredData} 
                  onFilterChange={handleTemporalFiltersChange}
                  activePeriod={activePeriod}
                />
              </div>
            )}

            {/* KPI Cards */}
            <KPICards 
              data={finalData} 
              isConnected={isConnected}
              getUniquePromoters={getUniquePromoters}
            />

            {/* Main Dashboard Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-9">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="analytics">Análises</TabsTrigger>
                <TabsTrigger value="ranking">Rankings</TabsTrigger>
                <TabsTrigger value="financial">Financeiro</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="reports">Relatórios</TabsTrigger>
                <TabsTrigger value="assistant">Dasher</TabsTrigger>
                <TabsTrigger value="editor">Editor</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {finalData.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {chartVisibility.performance && (
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 z-10"
                            onClick={() => toggleChartVisibility('performance')}
                          >
                            <EyeOff className="w-4 h-4" />
                          </Button>
                          <PerformanceChart data={finalData} />
                        </div>
                      )}
                      {!chartVisibility.performance && (
                        <div className="border-2 border-dashed border-muted rounded-lg p-4 flex items-center justify-center">
                          <Button
                            variant="outline"
                            onClick={() => toggleChartVisibility('performance')}
                            className="flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Mostrar Performance Chart
                          </Button>
                        </div>
                      )}

                      {chartVisibility.compliance && (
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 z-10"
                            onClick={() => toggleChartVisibility('compliance')}
                          >
                            <EyeOff className="w-4 h-4" />
                          </Button>
                          <MonthlyComplianceChart data={finalData} />
                        </div>
                      )}
                      {!chartVisibility.compliance && (
                        <div className="border-2 border-dashed border-muted rounded-lg p-4 flex items-center justify-center">
                          <Button
                            variant="outline"
                            onClick={() => toggleChartVisibility('compliance')}
                            className="flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Mostrar Compliance Chart
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {chartVisibility.financial && (
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 z-10"
                            onClick={() => toggleChartVisibility('financial')}
                          >
                            <EyeOff className="w-4 h-4" />
                          </Button>
                          <FinancialChart data={finalData} />
                        </div>
                      )}
                      {!chartVisibility.financial && (
                        <div className="border-2 border-dashed border-muted rounded-lg p-4 flex items-center justify-center">
                          <Button
                            variant="outline"
                            onClick={() => toggleChartVisibility('financial')}
                            className="flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Mostrar Financial Chart
                          </Button>
                        </div>
                      )}

                      {chartVisibility.cityPerformance && (
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 z-10"
                            onClick={() => toggleChartVisibility('cityPerformance')}
                          >
                            <EyeOff className="w-4 h-4" />
                          </Button>
                          <CityPerformanceChart data={finalData} />
                        </div>
                      )}
                      {!chartVisibility.cityPerformance && (
                        <div className="border-2 border-dashed border-muted rounded-lg p-4 flex items-center justify-center">
                          <Button
                            variant="outline"
                            onClick={() => toggleChartVisibility('cityPerformance')}
                            className="flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Mostrar City Performance
                          </Button>
                        </div>
                      )}
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
                {finalData.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {chartVisibility.performance && (
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 z-10"
                          onClick={() => toggleChartVisibility('performance')}
                        >
                          <EyeOff className="w-4 h-4" />
                        </Button>
                        <PerformanceChart data={finalData} />
                      </div>
                    )}
                    {!chartVisibility.performance && (
                      <div className="border-2 border-dashed border-muted rounded-lg p-4 flex items-center justify-center">
                        <Button
                          variant="outline"
                          onClick={() => toggleChartVisibility('performance')}
                          className="flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Mostrar Performance Chart
                        </Button>
                      </div>
                    )}

                    {chartVisibility.compliance && (
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 z-10"
                          onClick={() => toggleChartVisibility('compliance')}
                        >
                          <EyeOff className="w-4 h-4" />
                        </Button>
                        <MonthlyComplianceChart data={finalData} />
                      </div>
                    )}
                    {!chartVisibility.compliance && (
                      <div className="border-2 border-dashed border-muted rounded-lg p-4 flex items-center justify-center">
                        <Button
                          variant="outline"
                          onClick={() => toggleChartVisibility('compliance')}
                          className="flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Mostrar Compliance Chart
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum dado de performance disponível para o mês selecionado.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                {finalData.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {chartVisibility.cityPerformance && (
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 z-10"
                          onClick={() => toggleChartVisibility('cityPerformance')}
                        >
                          <EyeOff className="w-4 h-4" />
                        </Button>
                        <CityPerformanceChart data={finalData} />
                      </div>
                    )}
                    {!chartVisibility.cityPerformance && (
                      <div className="border-2 border-dashed border-muted rounded-lg p-4 flex items-center justify-center">
                        <Button
                          variant="outline"
                          onClick={() => toggleChartVisibility('cityPerformance')}
                          className="flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Mostrar City Performance
                        </Button>
                      </div>
                    )}

                    {chartVisibility.brandDistribution && (
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 z-10"
                          onClick={() => toggleChartVisibility('brandDistribution')}
                        >
                          <EyeOff className="w-4 h-4" />
                        </Button>
                        <BrandDistributionChart data={finalData} />
                      </div>
                    )}
                    {!chartVisibility.brandDistribution && (
                      <div className="border-2 border-dashed border-muted rounded-lg p-4 flex items-center justify-center">
                        <Button
                          variant="outline"
                          onClick={() => toggleChartVisibility('brandDistribution')}
                          className="flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Mostrar Brand Distribution
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum dado analítico disponível para o mês selecionado.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="ranking" className="space-y-6">
                {finalData.length > 0 ? (
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 z-10"
                      onClick={() => toggleChartVisibility('promoterRanking')}
                    >
                      <EyeOff className="w-4 h-4" />
                    </Button>
                    <PromoterRankingChart data={finalData} />
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum dado de ranking disponível para o mês selecionado.</p>
                  </div>
                )}
                {!chartVisibility.promoterRanking && (
                  <div className="border-2 border-dashed border-muted rounded-lg p-4 flex items-center justify-center">
                    <Button
                      variant="outline"
                      onClick={() => toggleChartVisibility('promoterRanking')}
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Mostrar Promoter Ranking
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="financial" className="space-y-6">
                {finalData.length > 0 ? (
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 z-10"
                      onClick={() => toggleChartVisibility('financial')}
                    >
                      <EyeOff className="w-4 h-4" />
                    </Button>
                    <FinancialChart data={finalData} />
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum dado financeiro disponível para o mês selecionado.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="insights" className="space-y-6">
                {finalData.length > 0 ? (
                  <ProfessionalInsights data={finalData} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum insight disponível para o mês selecionado.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="reports" className="space-y-6">
                <AdvancedReports data={finalData} getUniquePromoters={getUniquePromoters} />
              </TabsContent>

              <TabsContent value="assistant" className="space-y-6">
                <DasherAssistant data={finalData} />
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
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard sincronizado com Google Sheets - Modelo Avançado de Controle</span>
            <span className="text-xs opacity-50">| Powered by Deylith.dev</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
