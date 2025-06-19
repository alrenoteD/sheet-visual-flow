
import React, { useState } from 'react';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { useTemporalCharts } from '@/hooks/useTemporalCharts';
import { DashboardHeader } from '@/components/dashboard/Header';
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
import { MiniChat } from '@/components/dashboard/chat/MiniChat';
import { RankingAnalysis } from '@/components/dashboard/ranking/RankingAnalysis';
import { FinancialAnalysis } from '@/components/dashboard/financial/FinancialAnalysis';
import { DataEditor } from '@/components/dashboard/editor/DataEditor';
import { AnalyticsReports } from '@/components/dashboard/analytics/AnalyticsReports';
import { Button } from '@/components/ui/button';
import { Users, Trophy, DollarSign, Edit } from 'lucide-react';

export default function Index() {
  const { 
    data, 
    allPagesData,
    loading, 
    isConnected, 
    currentMonth, 
    availableMonths, 
    changeMonth,
    loadData,
    updateData
  } = useGoogleSheets();
  
  const [filteredData, setFilteredData] = useState(data);
  const [activeTab, setActiveTab] = useState('overview');
  const [activePeriod, setActivePeriod] = useState('todo-periodo');
  const [shouldShowMonthlyCharts, setShouldShowMonthlyCharts] = useState(true);
  
  const { chartData } = useTemporalCharts({ data: allPagesData });

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

  const getUniquePromoters = () => {
    return Array.from(new Set(data.map(item => item.promotor.toLowerCase())));
  };

  const handleBackToMain = () => {
    setActiveTab('overview');
  };

  const handleAccessPromoters = () => {
    setActiveTab('promoters');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <DashboardFilters 
                  data={data}
                  onFiltersChange={handleFilterChange}
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

            <KPICards data={filteredData} isConnected={isConnected} getUniquePromoters={getUniquePromoters} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PerformanceChart data={filteredData} />
              <BrandDistributionChart data={filteredData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CityPerformanceChart data={filteredData} />
              <PromoterRankingChart data={filteredData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FinancialChart data={filteredData} />
              {shouldShowMonthlyCharts && (
                <MonthlyComplianceChart data={filteredData} />
              )}
            </div>
          </div>
        );

      case 'promoters':
        return <PromotersPanel data={data} onBackToMain={handleBackToMain} />;

      case 'performance':
        return <AdvancedCharts data={filteredData} />;

      case 'analytics':
        return <AnalyticsReports data={filteredData} />;

      case 'insights':
        return <ProfessionalInsights data={filteredData} />;

      case 'ranking':
        return <RankingAnalysis data={filteredData} />;

      case 'financial':
        return <FinancialAnalysis data={filteredData} />;

      case 'editor':
        return <DataEditor data={data} onDataUpdate={updateData} />;

      case 'assistant':
        return <DasherAssistant data={filteredData} />;

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

      {/* Mini Chat - Fixed Position */}
      <div className="fixed bottom-4 left-4 z-40">
        <MiniChat data={chartData} />
      </div>

      {/* Floating Access Buttons - Only show on overview tab */}
      {activeTab === 'overview' && (
        <div className="fixed bottom-4 right-4 z-30 flex flex-col gap-3">
          <Button
            onClick={handleAccessPromoters}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-full p-4"
            size="lg"
          >
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="hidden sm:inline">Promotores</span>
            </div>
          </Button>
          
          <Button
            onClick={() => setActiveTab('ranking')}
            className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-full p-4"
            size="lg"
          >
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              <span className="hidden sm:inline">Ranking</span>
            </div>
          </Button>
          
          <Button
            onClick={() => setActiveTab('financial')}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-full p-4"
            size="lg"
          >
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              <span className="hidden sm:inline">Financeiro</span>
            </div>
          </Button>
          
          <Button
            onClick={() => setActiveTab('editor')}
            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-full p-4"
            size="lg"
          >
            <div className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              <span className="hidden sm:inline">Editor</span>
            </div>
          </Button>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        <DashboardHeader 
          isConnected={isConnected} 
          onRefresh={loadData}
        />
        
        <div className="mb-6">
          <ConnectionStatus 
            isConnected={isConnected} 
            loading={loading} 
            dataCount={data.length}
            onRefresh={loadData}
          />
        </div>

        <div className="mb-6">
          <TabMenu 
            currentTab={activeTab}
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
