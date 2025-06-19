
import { VisitData } from '@/types/VisitData';
import { PerformanceChart } from '@/components/dashboard/charts/PerformanceChart';
import { CityPerformanceChart } from '@/components/dashboard/charts/CityPerformanceChart';
import { PromoterPerformanceCorrelationChart } from '@/components/dashboard/charts/PromoterPerformanceCorrelationChart';

interface AdvancedChartsProps {
  data: VisitData[];
}

export const AdvancedCharts = ({ data }: AdvancedChartsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart data={data} />
        <CityPerformanceChart data={data} />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <PromoterPerformanceCorrelationChart data={data} />
      </div>
    </div>
  );
};
