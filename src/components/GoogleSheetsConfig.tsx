
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Database, RefreshCw } from 'lucide-react';
import { GoogleSheetsConfig } from '@/types/VisitData';

interface GoogleSheetsConfigProps {
  config: GoogleSheetsConfig | null;
  onSaveConfig: (config: GoogleSheetsConfig) => void;
  onLoadData: () => void;
  loading: boolean;
  dataCount: number;
}

export const GoogleSheetsConfigComponent = ({ 
  config, 
  onSaveConfig, 
  onLoadData, 
  loading, 
  dataCount 
}: GoogleSheetsConfigProps) => {
  const [formData, setFormData] = useState({
    apiKey: config?.apiKey || '',
    spreadsheetId: config?.spreadsheetId || '',
    range: config?.range || 'Dados!A1:AZ1000'
  });

  const handleSave = () => {
    if (!formData.apiKey || !formData.spreadsheetId) {
      return;
    }
    onSaveConfig(formData);
  };

  const isConfigured = config?.apiKey && config?.spreadsheetId;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configuração Google Sheets
          {isConfigured && <Badge variant="default">Conectado</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key do Google</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Sua API Key do Google"
              value={formData.apiKey}
              onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="spreadsheetId">ID da Planilha</Label>
            <Input
              id="spreadsheetId"
              placeholder="ID da planilha Google Sheets"
              value={formData.spreadsheetId}
              onChange={(e) => setFormData({ ...formData, spreadsheetId: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="range">Intervalo (Range)</Label>
          <Input
            id="range"
            placeholder="Ex: Dados!A1:AZ1000"
            value={formData.range}
            onChange={(e) => setFormData({ ...formData, range: e.target.value })}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={!formData.apiKey || !formData.spreadsheetId}>
            <Database className="w-4 h-4 mr-2" />
            Salvar Configuração
          </Button>
          
          {isConfigured && (
            <Button onClick={onLoadData} disabled={loading} variant="outline">
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Carregar Dados ({dataCount} registros)
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
