
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { VisitData, GoogleSheetsConfig } from '@/types/VisitData';

export const useGoogleSheets = () => {
  const [data, setData] = useState<VisitData[]>([]);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<GoogleSheetsConfig | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Verificar se as variáveis de ambiente estão configuradas
    const apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
    const spreadsheetId = import.meta.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID;
    const range = import.meta.env.VITE_GOOGLE_SHEETS_RANGE || 'Dados!A1:AZ1000';

    console.log('🔍 Verificando configurações do Google Sheets...');
    
    if (!apiKey) {
      console.warn('⚠️ VITE_GOOGLE_SHEETS_API_KEY não configurada');
    } else {
      console.log('✅ VITE_GOOGLE_SHEETS_API_KEY configurada');
    }
    
    if (!spreadsheetId) {
      console.warn('⚠️ VITE_GOOGLE_SHEETS_SPREADSHEET_ID não configurada');
    } else {
      console.log('✅ VITE_GOOGLE_SHEETS_SPREADSHEET_ID configurada');
    }

    if (apiKey && spreadsheetId) {
      const envConfig = { apiKey, spreadsheetId, range };
      setConfig(envConfig);
      console.log('🚀 Iniciando conexão com Google Sheets...');
      loadData(envConfig);
    } else {
      console.log('❌ Configuração incompleta - aguardando variáveis de ambiente');
      setIsConnected(false);
      setData([]);
    }
  }, []);

  const processVisitDates = (row: string[], startIndex: number = 8): { dates: string[], count: number } => {
    const dates: string[] = [];
    for (let i = startIndex; i < row.length; i++) {
      if (row[i] && row[i].trim() !== '') {
        dates.push(row[i].trim());
      }
    }
    return { dates, count: dates.length };
  };

  const loadData = async (configToUse?: GoogleSheetsConfig) => {
    const currentConfig = configToUse || config;
    if (!currentConfig) {
      console.log('⏳ Aguardando configuração das variáveis de ambiente do Google Sheets');
      return;
    }

    setLoading(true);
    console.log('📊 Carregando dados da planilha...');
    
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${currentConfig.spreadsheetId}/values/${currentConfig.range}?key=${currentConfig.apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error('❌ Erro na requisição:', response.status, response.statusText);
        throw new Error(`Erro ao carregar dados: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('📥 Resposta da API recebida:', result);
      
      if (result.values && result.values.length > 1) {
        const [headers, ...rows] = result.values;
        console.log('📋 Headers encontrados:', headers);
        console.log('📊 Linhas de dados:', rows.length);
        
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
        setIsConnected(true);
        console.log('✅ Dados carregados com sucesso:', formattedData.length, 'registros');
        
        toast({
          title: "Sucesso",
          description: `${formattedData.length} registros carregados da planilha`
        });
      } else {
        console.warn('⚠️ Nenhum dado encontrado na planilha');
        setData([]);
        setIsConnected(false);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      setIsConnected(false);
      setData([]);
      
      toast({
        title: "Erro de Conexão",
        description: "Falha ao conectar com Google Sheets. Verifique as variáveis de ambiente.",
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
    isConnected,
    loadData: () => loadData(),
    updateData
  };
};
