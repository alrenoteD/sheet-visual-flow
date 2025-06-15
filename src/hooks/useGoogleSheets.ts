
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
      console.warn('⚠️ VITE_GOOGLE_SHEETS_API_KEY não configurada nas variáveis de ambiente');
      console.log('📋 Configure no EasyPanel: Variáveis de Ambiente > VITE_GOOGLE_SHEETS_API_KEY');
    } else {
      console.log('✅ VITE_GOOGLE_SHEETS_API_KEY configurada');
    }
    
    if (!spreadsheetId) {
      console.warn('⚠️ VITE_GOOGLE_SHEETS_SPREADSHEET_ID não configurada nas variáveis de ambiente');
      console.log('📋 Configure no EasyPanel: Variáveis de Ambiente > VITE_GOOGLE_SHEETS_SPREADSHEET_ID');
    } else {
      console.log('✅ VITE_GOOGLE_SHEETS_SPREADSHEET_ID configurada');
    }

    if (apiKey && spreadsheetId) {
      const envConfig = { apiKey, spreadsheetId, range };
      setConfig(envConfig);
      console.log('🚀 Iniciando conexão com Google Sheets...');
      loadData(envConfig);
    } else {
      console.log('❌ Configuração incompleta - Dashboard aguardando variáveis de ambiente');
      console.log('📖 Consulte: public/CONFIGURACAO_EASYPANEL.md para instruções');
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

  const consolidatePromoters = (rawData: VisitData[]): VisitData[] => {
    const consolidatedMap = new Map<string, VisitData>();

    rawData.forEach((item) => {
      const promotorKey = item.promotor.trim().toLowerCase();
      
      if (consolidatedMap.has(promotorKey)) {
        // Promotor já existe - consolidar dados
        const existing = consolidatedMap.get(promotorKey)!;
        
        // Combinar visitas
        existing.visitasPreDefinidas += item.visitasPreDefinidas;
        existing.valorContrato += item.valorContrato;
        
        // Combinar datas de visitas (evitando duplicatas)
        const allDates = [...existing.datasVisitas, ...item.datasVisitas];
        existing.datasVisitas = [...new Set(allDates)].sort();
        existing.visitasRealizadas = existing.datasVisitas.length;
        
        // Recalcular percentual e valores
        existing.percentual = existing.visitasPreDefinidas > 0 
          ? (existing.visitasRealizadas / existing.visitasPreDefinidas) * 100 
          : 0;
        existing.valorPorVisita = existing.visitasPreDefinidas > 0 
          ? existing.valorContrato / existing.visitasPreDefinidas 
          : 0;
        existing.valorPago = existing.visitasRealizadas * existing.valorPorVisita;
        
        // Manter outras informações do primeiro registro ou atualizar
        if (!existing.telefone && item.telefone) existing.telefone = item.telefone;
        if (!existing.rede && item.rede) existing.rede = item.rede;
        if (!existing.cidade && item.cidade) existing.cidade = item.cidade;
        if (!existing.marca && item.marca) existing.marca = item.marca;
        
        console.log(`🔄 Consolidado promotor: ${item.promotor} (${existing.visitasRealizadas} visitas)`);
      } else {
        // Novo promotor
        consolidatedMap.set(promotorKey, { ...item });
      }
    });

    return Array.from(consolidatedMap.values());
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
        console.error('❌ Erro na requisição Google Sheets:', response.status, response.statusText);
        throw new Error(`Erro ao carregar dados: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('📥 Resposta da API Google Sheets recebida:', result);
      
      if (result.values && result.values.length > 1) {
        const [headers, ...rows] = result.values;
        console.log('📋 Headers encontrados:', headers);
        console.log('📊 Linhas de dados brutos:', rows.length);
        
        const rawData: VisitData[] = rows.map((row: string[], index: number) => {
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
        
        // Consolidar promotores com nomes idênticos
        const consolidatedData = consolidatePromoters(rawData);
        
        setData(consolidatedData);
        setIsConnected(true);
        console.log(`✅ Dados carregados e consolidados com sucesso: ${consolidatedData.length} promotores únicos (${rawData.length} registros originais)`);
        
        toast({
          title: "Conexão Estabelecida",
          description: `${consolidatedData.length} promotores carregados (${rawData.length} registros consolidados)`
        });
      } else {
        console.warn('⚠️ Nenhum dado encontrado na planilha ou planilha vazia');
        setData([]);
        setIsConnected(false);
        
        toast({
          title: "Planilha Vazia",
          description: "Nenhum dado encontrado na planilha configurada",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ Erro ao carregar dados do Google Sheets:', error);
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
    if (!config) {
      console.error('❌ Configuração do Google Sheets não disponível para atualização');
      toast({
        title: "Erro de Configuração",
        description: "Configuração do Google Sheets não encontrada",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    console.log('💾 Iniciando atualização da planilha...');
    
    try {
      // Expandir dados consolidados de volta para linhas individuais
      const expandedData: any[] = [];
      
      updatedData.forEach(item => {
        // Para cada promotor, criar uma linha na planilha
        // Se houver múltiplas visitas, todas vão na mesma linha
        const maxDates = Math.max(item.datasVisitas.length, 1);
        
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
        
        // Adicionar todas as datas de visita
        for (let i = 0; i < 50; i++) { // Reservar 50 colunas para datas
          row.push(item.datasVisitas[i] || '');
        }
        
        expandedData.push(row);
      });

      const values = [
        [
          'PROMOTOR/AGÊNCIA', 'REDE', 'CIDADE', 'MARCA', 'VISITAS PRÉ-DEFINIDAS', 
          'TELEFONE', 'DATA INÍCIO', 'VALOR CONTRATO',
          ...Array.from({length: 50}, (_, i) => `DATA VISITA ${i + 1}`)
        ],
        ...expandedData
      ];

      console.log('📤 Enviando dados para Google Sheets...', values.length, 'linhas');

      const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${config.range}?valueInputOption=RAW&key=${config.apiKey}`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values })
      });

      if (!response.ok) {
        throw new Error(`Falha ao atualizar dados: ${response.statusText}`);
      }

      setData(updatedData);
      console.log('✅ Planilha atualizada com sucesso');
      
      toast({
        title: "Sucesso",
        description: "Dados salvos na planilha do Google Sheets"
      });
    } catch (error) {
      console.error('❌ Erro ao atualizar dados na planilha:', error);
      toast({
        title: "Erro ao Salvar",
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
