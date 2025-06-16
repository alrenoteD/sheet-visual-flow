
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  isConnected: boolean;
  onRefresh: () => void;
}

export const DashboardHeader = ({ isConnected, onRefresh }: HeaderProps) => {
  return (
    <div className="text-center space-y-4 mb-8">
      {/* Brand Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-primary/10 to-chart-1/10 p-4 rounded-lg border">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              Deylith.dev
            </h1>
            <p className="text-sm text-muted-foreground">
              Agência de automações e Soluções Inteligentes com IA
            </p>
          </div>
        </div>
        <div className="w-16 h-16 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
          <span className="text-xs text-muted-foreground text-center">Logo<br/>Aqui</span>
        </div>
      </div>

      {/* Dashboard Title */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
          DASHBOARD DE CONTROLE DE VISITAS
        </h2>
        <p className="text-muted-foreground text-lg">
          Sistema Completo de Gestão | Promotores • Agências • Pagamentos
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Atualizado: {new Date().toLocaleString('pt-BR')}</span>
          </div>
          {isConnected && (
            <>
              <Badge variant="default" className="bg-green-600">
                📊 Conectado ao Google Sheets
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Sincronizar
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
