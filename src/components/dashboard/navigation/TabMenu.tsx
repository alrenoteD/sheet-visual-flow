
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Lightbulb,
  FileText,
  Bot,
  Edit,
  Activity
} from 'lucide-react';

interface TabMenuItem {
  value: string;
  label: string;
  icon: any;
  description?: string;
}

interface TabMenuProps {
  currentTab: string;
  onTabChange: (value: string) => void;
}

export const TabMenu = ({ currentTab, onTabChange }: TabMenuProps) => {
  const allTabs: TabMenuItem[] = [
    { value: "overview", label: "Visão Geral", icon: BarChart3 },
    { value: "performance", label: "Performance", icon: TrendingUp },
    { value: "promoters", label: "Promotores", icon: Users },
    { value: "assistant", label: "Dasher", icon: Bot },
    { value: "analytics", label: "Análises", icon: Activity },
    { value: "ranking", label: "Rankings", icon: Users },
    { value: "financial", label: "Financeiro", icon: DollarSign },
    { value: "insights", label: "Insights", icon: Lightbulb },
    { value: "reports", label: "Relatórios", icon: FileText },
    { value: "editor", label: "Editor", icon: Edit },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {allTabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <Button
            key={tab.value}
            variant={currentTab === tab.value ? "default" : "ghost"}
            size="sm"
            onClick={() => onTabChange(tab.value)}
            className="flex items-center gap-2"
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </Button>
        );
      })}
    </div>
  );
};
