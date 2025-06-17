import React, { useState } from 'react';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { useTemporalCharts } from '@/hooks/useTemporalCharts';
import { Header } from '@/components/dashboard/Header';
import { ConnectionStatus } from '@/components/dashboard/ConnectionStatus';
import { KPICards } from '@/components/dashboard/KPICards';
import { PerformanceChart } from '@/components/dashboard/charts/PerformanceChart';
import { BrandDistributionChart } from '@/components/dashboard/charts/BrandDistributionChart';
import { CityPerformanceChart } from '@/components/dashboard/charts/CityPerformanceChart';
import { PromoterRankingChart } from '@/components/dashboard/charts/PromoterRankingChart';
import { FinancialChart } from '@/components/dashboard/charts/FinancialChart';
import { MonthlyComplianceChart } from '@/components/dashboard/charts/MonthlyComplianceChart';
import { AdvancedCharts } from '@/components/dashboard/advanced/AdvancedCharts';
import { TabMenu } from '@/components/dashboard/navigation/TabMenu';
import { DashboardFilters } from '@/components/dashboard/filters/DashboardFilters';
import { TemporalFilters } from '@/components/dashboard/filters/TemporalFilters';
import { DasherAssistant } from '@/components/dashboard/chat/DasherAssistant';
import { PromotersPanel } from '@/components/dashboard/promoters/PromotersPanel';
import { AdvancedReports } from '@/components/dashboard/reports/AdvancedReports';
import { ProfessionalInsights } from '@/components/dashboard/insights/ProfessionalInsights';
import { DateTimeWidget } from '@/components/ui/DateTimeWidget';

export default function Index() {
  const { 
    data, 
    allPagesData,
    loading, 
    isConnected, 
    currentMonth, 
    availableMonths, 
    changeMonth 
  } = useGoogleSheets();
  
  const [filteredData, setFilteredData] = useState(data);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activePeriod, setActivePeriod] = useState('todo-periodo');
  const [shouldShowMonthlyCharts, setShouldShowMonthlyCharts] = useState(true);
  
  const { filteredData: temporalFilteredData } = useTemporalCharts(
    allPagesData,
    activePeriod
  );

  React.useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleFilterChange = (filtered: typeof data) => {
    setFilteredData(filtered);
  };

  const handleTemporalFilterChange = (period: string) => {
    setActivePeriod(period);
  };

  const handleChartVisibilityChange = (shouldShow: boolean) => {
    setShouldShowMonthlyCharts(shouldShow);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'promotores', label: 'Promotores', icon: '👥' },
    { id: 'avancado', label: 'Avançado', icon: '🔬' },
    { id: 'relatorios', label: 'Relatórios', icon: '📋' },
    { id: 'insights', label: 'Insights', icon: '💡' },
    { id: 'assistente', label: 'Assistente', icon: '🤖' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <DashboardFilters 
                  data={data}
                  onFilterChange={handleFilterChange}
                  currentMonth={currentMonth}
                  availableMonths={availableMonths}
                  onMonthChange={changeMonth}
                />
              </div>
              <div className="lg:col-span-1">
                <TemporalFilters
                  onFilterChange={handleTemporalFilterChange}
                  activePeriod={activePeriod}
                  onChartVisibilityChange={handleChartVisibilityChange}
                />
              </div>
            </div>

            <KPICards data={filteredData} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PerformanceChart data={temporalFilteredData} />
              <BrandDistributionChart data={temporalFilteredData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CityPerformanceChart data={temporalFilteredData} />
              <PromoterRankingChart data={temporalFilteredData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FinancialChart data={temporalFilteredData} />
              {shouldShowMonthlyCharts && (
                <MonthlyComplianceChart data={allPagesData} />
              )}
            </div>
          </div>
        );

      case 'promotores':
        return <PromotersPanel data={allPagesData} />;

      case 'avancado':
        return <AdvancedCharts data={temporalFilteredData} />;

      case 'relatorios':
        return <AdvancedReports data={temporalFilteredData} />;

      case 'insights':
        return <ProfessionalInsights data={temporalFilteredData} />;

      case 'assistente':
        return <DasherAssistant data={temporalFilteredData} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* DateTime Widget - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <DateTimeWidget />
      </div>

      <div className="container mx-auto px-4 py-6">
        <Header />
        
        <div className="mb-6">
          <ConnectionStatus isConnected={isConnected} loading={loading} />
        </div>

        <div className="mb-6">
          <TabMenu 
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        <main>
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}
