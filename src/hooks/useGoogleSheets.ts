
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export interface VisitData {
  id: string;
  promotor: string;
  visitas: number;
  concluidas: number;
  percentual: number;
  cidade: string;
  marca: string;
  data: string;
}

export interface GoogleSheetsConfig {
  apiKey: string;
  spreadsheetId: string;
  range: string;
}

export const useGoogleSheets = () => {
  const [data, setData] = useState<VisitData[]>([]);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<GoogleSheetsConfig | null>(null);

  useEffect(() => {
    const savedConfig = localStorage.getItem('googleSheetsConfig');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  const saveConfig = (newConfig: GoogleSheetsConfig) => {
    setConfig(newConfig);
    localStorage.setItem('googleSheetsConfig', JSON.stringify(newConfig));
  };

  const loadData = async () => {
    if (!config) {
      toast({
        title: "Erro",
        description: "Configure primeiro a conexão com Google Sheets",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${config.range}?key=${config.apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erro ao carregar dados: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.values && result.values.length > 1) {
        const [headers, ...rows] = result.values;
        const formattedData: VisitData[] = rows.map((row: string[], index: number) => ({
          id: (index + 1).toString(),
          promotor: row[0] || '',
          visitas: parseInt(row[1]) || 0,
          concluidas: parseInt(row[2]) || 0,
          percentual: parseFloat(row[3]) || 0,
          cidade: row[4] || '',
          marca: row[5] || '',
          data: row[6] || new Date().toISOString().split('T')[0]
        }));
        
        setData(formattedData);
        toast({
          title: "Sucesso",
          description: `${formattedData.length} registros carregados da planilha`
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar dados do Google Sheets",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateData = async (updatedData: VisitData[]) => {
    if (!config) return;

    setLoading(true);
    try {
      const values = [
        ['Promotor', 'Visitas', 'Concluídas', 'Percentual', 'Cidade', 'Marca', 'Data'],
        ...updatedData.map(item => [
          item.promotor,
          item.visitas.toString(),
          item.concluidas.toString(),
          item.percentual.toString(),
          item.cidade,
          item.marca,
          item.data
        ])
      ];

      const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${config.range}?valueInputOption=RAW&key=${config.apiKey}`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values })
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar dados');
      }

      setData(updatedData);
      toast({
        title: "Sucesso",
        description: "Dados atualizados na planilha"
      });
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar dados no Google Sheets",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    config,
    saveConfig,
    loadData,
    updateData
  };
};
