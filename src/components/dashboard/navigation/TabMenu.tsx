
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Menu, 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Lightbulb,
  FileText,
  Bot,
  Edit,
  Activity,
  Brain
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
  const visibleTabs: TabMenuItem[] = [
    { value: "overview", label: "Visão Geral", icon: BarChart3 },
    { value: "performance", label: "Performance", icon: TrendingUp },
    { value: "promoters", label: "Promotores", icon: Users },
    { value: "assistant", label: "Dasher", icon: Bot },
  ];

  const menuTabs: TabMenuItem[] = [
    { value: "analytics", label: "Análises", icon: Activity, description: "Gráficos analíticos" },
    { value: "advanced", label: "Avançado", icon: Brain, description: "Dashboard para nerds" },
    { value: "ranking", label: "Rankings", icon: Users, description: "Ranking de promotores" },
    { value: "financial", label: "Financeiro", icon: DollarSign, description: "Análise financeira" },
    { value: "insights", label: "Insights", icon: Lightbulb, description: "Insights profissionais" },
    { value: "reports", label: "Relatórios", icon: FileText, description: "Relatórios avançados" },
    { value: "editor", label: "Editor", icon: Edit, description: "Editar dados" },
  ];

  const getCurrentTabLabel = () => {
    const allTabs = [...visibleTabs, ...menuTabs];
    const tab = allTabs.find(t => t.value === currentTab);
    return tab?.label || 'Desconhecido';
  };

  return (
    <div className="flex items-center gap-2">
      {/* Abas Visíveis */}
      <div className="flex">
        {visibleTabs.map((tab) => {
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

      {/* Menu Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Menu className="w-4 h-4" />
            Mais
            {!visibleTabs.some(tab => tab.value === currentTab) && (
              <span className="text-xs opacity-70">({getCurrentTabLabel()})</span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {menuTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <DropdownMenuItem
                key={tab.value}
                onClick={() => onTabChange(tab.value)}
                className={`flex items-center gap-2 cursor-pointer ${
                  currentTab === tab.value ? 'bg-accent' : ''
                }`}
              >
                <Icon className="w-4 h-4" />
                <div className="flex flex-col">
                  <span>{tab.label}</span>
                  {tab.description && (
                    <span className="text-xs text-muted-foreground">{tab.description}</span>
                  )}
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
