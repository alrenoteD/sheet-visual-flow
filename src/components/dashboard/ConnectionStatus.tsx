
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConnectionStatusProps {
  isConnected: boolean;
  loading: boolean;
  dataCount: number;
  onRefresh: () => void;
}

export const ConnectionStatus = ({ 
  isConnected, 
  loading, 
  dataCount, 
  onRefresh 
}: ConnectionStatusProps) => {
  return (
    <Card className={`border-2 ${isConnected ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Status da Conexão Google Sheets
          {isConnected ? (
            <Badge variant="default" className="bg-green-600">
              <Wifi className="w-3 h-3 mr-1" />
              Conectado
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-amber-600 text-white">
              <WifiOff className="w-3 h-3 mr-1" />
              Desconectado
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected ? (
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-green-700">
                ✅ Conectado ao Google Sheets com sucesso
              </p>
              <p className="text-xs text-muted-foreground">
                {dataCount} registros carregados
              </p>
            </div>
            <Button onClick={onRefresh} disabled={loading} variant="outline" size="sm">
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-amber-700">
              ⚠️ Configure as variáveis de ambiente no EasyPanel:
            </p>
            <ul className="text-xs text-muted-foreground space-y-1 ml-4">
              <li>• VITE_GOOGLE_SHEETS_API_KEY</li>
              <li>• VITE_GOOGLE_SHEETS_SPREADSHEET_ID</li>
              <li>• VITE_GOOGLE_SHEETS_RANGE (opcional)</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
