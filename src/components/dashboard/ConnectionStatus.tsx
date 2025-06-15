
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Wifi, WifiOff, RefreshCw, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
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
  // Verificar variáveis de ambiente
  const apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
  const spreadsheetId = import.meta.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID;
  const range = import.meta.env.VITE_GOOGLE_SHEETS_RANGE;
  const chatbotUrl = import.meta.env.VITE_CHATBOT_WEBHOOK_URL;

  const missingCredentials = [];
  if (!apiKey) missingCredentials.push('VITE_GOOGLE_SHEETS_API_KEY');
  if (!spreadsheetId) missingCredentials.push('VITE_GOOGLE_SHEETS_SPREADSHEET_ID');

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
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-amber-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Status das Credenciais:
              </p>
              
              <div className="space-y-1 ml-6">
                <div className="flex items-center gap-2 text-xs">
                  {apiKey ? (
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  ) : (
                    <XCircle className="w-3 h-3 text-red-600" />
                  )}
                  <span>VITE_GOOGLE_SHEETS_API_KEY</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs">
                  {spreadsheetId ? (
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  ) : (
                    <XCircle className="w-3 h-3 text-red-600" />
                  )}
                  <span>VITE_GOOGLE_SHEETS_SPREADSHEET_ID</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs">
                  {range ? (
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                  )}
                  <span>VITE_GOOGLE_SHEETS_RANGE (opcional)</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs">
                  {chatbotUrl ? (
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                  )}
                  <span>VITE_CHATBOT_WEBHOOK_URL (opcional)</span>
                </div>
              </div>
            </div>
            
            {missingCredentials.length > 0 && (
              <div className="p-3 bg-amber-100 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-800 font-medium">
                  ⚠️ Configure no EasyPanel:
                </p>
                <ul className="text-xs text-amber-700 mt-1 space-y-1">
                  {missingCredentials.map(cred => (
                    <li key={cred}>• {cred}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
