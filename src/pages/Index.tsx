
import { useState, useEffect } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, BarChart3 } from 'lucide-react';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';
import { useTemporalCharts } from '@/hooks/useTemporalCharts';
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
import { AdvancedCharts } from '@/components/dashboard/advanced/AdvancedCharts';
import { TabMenu } from '@/components/dashboard/navigation/TabMenu';
import { PromotersPanel } from '@/components/dashboard/promoters/PromotersPanel';
import { VisitData } from '@/types/VisitData';

const Index = () => {
  const { 
    data, 
    allPagesData,
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
  const { chartData, activePeriod, filterChartData } = useTemporalCharts({ data: filteredData });
  const [currentTab, setCurrentTab] = useState('overview');
  const [showMonthlyCharts, setShowMonthlyCharts] = useState(true);
  
  const [chartVisibility, setChartVisibility] = useState({
    performance: true,
    financial: true,
    compliance: true,
    cityPerformance: true,
    brandDistribution: true,
    promoterRanking: true
  });

  const { forceUpdate } = useRealTimeUpdates({
    isConnected,
    loadData,
    currentMonth
  });

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleFiltersChange = (newFilteredData: VisitData[]) => {
    setFilteredData(newFilteredData);
  };

  const toggleChartVisibility = (chartKey: keyof typeof chartVisibility) => {
    setChartVisibility(prev => ({
      ...prev,
      [chartKey]: !prev[chartKey]
    }));
  };

  const handleChartVisibilityChange = (shouldShow: boolean) => {
    setShowMonthlyCharts(shouldShow);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Enhanced Header with Auth */}
        <DashboardHeader isConnected={isConnected} onRefresh={forceUpdate} />

        {/* Connection Status */}
        <ConnectionStatus
          isConnected={isConnected}
          loading={loading}
          dataCount={data.length}
          onRefresh={loadData}
        />

        {/* Instruções para Webhook (apenas se conectado) */}
        {isConnected && (
          <div className="text-sm text-muted-foreground text-center p-4 bg-muted/50 rounded-lg">
            <p className="font-medium">📡 Refresh Manual ou via Webhook</p>
            <p className="mt-1">
              Para refresh automático via N8N/webhook, use: <code className="bg-background px-2 py-1 rounded">window.triggerDashboardRefresh()</code>
            </p>
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
                  onFilterChange={filterChartData}
                  activePeriod={activePeriod}
                  onChartVisibilityChange={handleChartVisibilityChange}
                />
              </div>
            )}

            {/* KPI Cards */}
            <KPICards 
              data={filteredData} 
              isConnected={isConnected}
              getUniquePromoters={getUniquePromoters}
            />

            {/* Main Dashboard com Menu de Abas */}
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
              {/* Menu de Abas */}
              <TabMenu currentTab={currentTab} onTabChange={setCurrentTab} />

              <TabsContent value="overview" className="space-y-6">
                {filteredData.length > 0 ? (
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
                          <PerformanceChart data={chartData} />
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

                      {chartVisibility.compliance && showMonthlyCharts && (
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 z-10"
                            onClick={() => toggleChartVisibility('compliance')}
                          >
                            <EyeOff className="w-4 h-4" />
                          </Button>
                          <MonthlyComplianceChart data={chartData} />
                        </div>
                      )}

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
                          <FinancialChart data={chartData} />
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
                          <CityPerformanceChart data={chartData} />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                          <BrandDistributionChart data={chartData} />
                        </div>
                      )}

                      {chartVisibility.promoterRanking && (
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 z-10"
                            onClick={() => toggleChartVisibility('promoterRanking')}
                          >
                            <EyeOff className="w-4 h-4" />
                          </Button>
                          <PromoterRankingChart data={chartData} />
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
                {filteredData.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <PerformanceChart data={chartData} />
                    {showMonthlyCharts && <MonthlyComplianceChart data={chartData} />}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum dado de performance disponível para o mês selecionado.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="promoters" className="space-y-6">
                <PromotersPanel data={filteredData} />
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                {filteredData.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <CityPerformanceChart data={chartData} />
                    <BrandDistributionChart data={chartData} />
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum dado analítico disponível para o mês selecionado.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="advanced" className="space-y-6">
                {allPagesData.length > 0 ? (
                  <AdvancedCharts data={allPagesData} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Carregando dados de todas as páginas...</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="ranking" className="space-y-6">
                {filteredData.length > 0 ? (
                  <PromoterRankingChart data={chartData} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum dado de ranking disponível para o mês selecionado.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="financial" className="space-y-6">
                {filteredData.length > 0 ? (
                  <FinancialChart data={chartData} />
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

              <TabsContent value="reports" className="space-y-6">
                <AdvancedReports data={filteredData} getUniquePromoters={getUniquePromoters} />
              </TabsContent>

              <TabsContent value="assistant" className="space-y-6">
                <DasherAssistant data={filteredData} />
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
            <span>Dashboard sincronizado com Google Sheets - Controle Manual</span>
            <span className="text-xs opacity-50">| Powered by Deylith.dev</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
