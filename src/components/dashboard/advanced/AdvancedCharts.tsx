import { VisitData } from '@/types/VisitData';
import { PromoterPerformanceCorrelationChart } from '../charts/PromoterPerformanceCorrelationChart';

interface AdvancedChartsProps {
  data: VisitData[];
}

export const AdvancedCharts = ({ data }: AdvancedChartsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PromoterPerformanceCorrelationChart data={data} />
      </div>
    </div>
  );
};
