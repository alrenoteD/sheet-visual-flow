
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { VisitData, GoogleSheetsConfig } from '@/types/VisitData';

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

  const processVisitDates = (row: string[], startIndex: number = 8): { dates: string[], count: number } => {
    const dates: string[] = [];
    for (let i = startIndex; i < row.length; i++) {
      if (row[i] && row[i].trim() !== '') {
        dates.push(row[i].trim());
      }
    }
    return { dates, count: dates.length };
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
        const formattedData: VisitData[] = rows.map((row: string[], index: number) => {
          const visitasPreDefinidas = parseInt(row[4]) || 0;
          const visitDates = processVisitDates(row, 8);
          const visitasRealizadas = visitDates.count;
          const percentual = visitasPreDefinidas > 0 ? (visitasRealizadas / visitasPreDefinidas) * 100 : 0;
          const valorContrato = parseFloat(row[7]) || 0;
          const valorPorVisita = visitasPreDefinidas > 0 ? valorContrato / visitasPreDefinidas : 0;
          const valorPago = visitasRealizadas * valorPorVisita;

          return {
            id: (index + 1).toString(),
            promotor: row[0] || '',
            rede: row[1] || '',
            cidade: row[2] || '',
            marca: row[3] || '',
            visitasPreDefinidas,
            visitasRealizadas,
            percentual,
            telefone: row[5] || '',
            dataInicio: row[6] || '',
            valorContrato,
            valorPorVisita,
            valorPago,
            datasVisitas: visitDates.dates
          };
        });
        
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
      const maxDates = Math.max(...updatedData.map(item => item.datasVisitas.length));
      const dateColumns = Math.max(maxDates, 10);
      
      const values = [
        [
          'PROMOTOR/AGÊNCIA', 'REDE', 'CIDADE', 'MARCA', 'VISITAS PRÉ-DEFINIDAS', 
          'TELEFONE', 'DATA INÍCIO', 'VALOR CONTRATO',
          ...Array.from({length: dateColumns}, (_, i) => `DATA VISITA ${i + 1}`)
        ],
        ...updatedData.map(item => {
          const row = [
            item.promotor,
            item.rede,
            item.cidade,
            item.marca,
            item.visitasPreDefinidas.toString(),
            item.telefone,
            item.dataInicio,
            item.valorContrato.toString()
          ];
          
          // Adicionar datas de visitas
          for (let i = 0; i < dateColumns; i++) {
            row.push(item.datasVisitas[i] || '');
          }
          
          return row;
        })
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
