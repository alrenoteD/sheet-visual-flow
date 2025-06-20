import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { VisitData, GoogleSheetsConfig } from '@/types/VisitData';

export const useGoogleSheets = () => {
  const [data, setData] = useState<VisitData[]>([]);
  const [allPagesData, setAllPagesData] = useState<VisitData[]>([]);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<GoogleSheetsConfig | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<string>('');
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
    const spreadsheetId = import.meta.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID;
    const range = import.meta.env.VITE_GOOGLE_SHEETS_RANGE || 'Dados!A1:AZ1000';

    console.log('🔍 Verificando configurações do Google Sheets...');
    
    if (apiKey && spreadsheetId) {
      const envConfig = { apiKey, spreadsheetId, range };
      setConfig(envConfig);
      setCurrentMonth(getCurrentMonthSheet());
      console.log('🚀 Iniciando conexão com Google Sheets...');
      loadAvailableMonths(envConfig).then(() => {
        loadData(envConfig);
      });
    } else {
      console.log('❌ Configuração incompleta - Dashboard aguardando variáveis de ambiente');
      setIsConnected(false);
      setData([]);
    }
  }, []);

  const getCurrentMonthSheet = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  const loadAvailableMonths = async (configToUse?: GoogleSheetsConfig) => {
    const currentConfig = configToUse || config;
    if (!currentConfig) return;

    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${currentConfig.spreadsheetId}?key=${currentConfig.apiKey}`;
      const response = await fetch(url);
      
      if (response.ok) {
        const result = await response.json();
        const sheets = result.sheets || [];
        const monthSheets = sheets
          .map((sheet: any) => sheet.properties.title)
          .filter((title: string) => /^\d{4}-\d{2}$/.test(title))
          .sort();
        
        setAvailableMonths(monthSheets);
        console.log('📅 Páginas mensais disponíveis:', monthSheets);
      }
    } catch (error) {
      console.warn('⚠️ Erro ao carregar páginas mensais:', error);
    }
  };

  const loadAllPagesData = async (configToUse?: GoogleSheetsConfig) => {
    const currentConfig = configToUse || config;
    if (!currentConfig || availableMonths.length === 0) return;

    try {
      const allData: VisitData[] = [];
      
      for (const month of availableMonths) {
        try {
          const range = `${month}!A1:AZ1000`;
          const url = `https://sheets.googleapis.com/v4/spreadsheets/${currentConfig.spreadsheetId}/values/${range}?key=${currentConfig.apiKey}`;
          const response = await fetch(url);
          
          if (response.ok) {
            const result = await response.json();
            if (result.values && result.values.length > 1) {
              const [headers, ...rows] = result.values;
              
              const monthData: VisitData[] = rows.map((row: string[], index: number) => {
                const idPromotor = row[0] || `AUTO_${index + 1}`;
                const promotor = row[1] || '';
                const rede = row[2] || '';
                const cidade = row[3] || '';
                const marca = row[4] || '';
                const visitasPreDefinidas = parseInt(row[5]) || 0;
                const telefone = row[6] || '';
                const dataInicio = row[7] || '';
                const valorContrato = parseFloat(row[8]) || 0;
                
                const visitDates = processVisitDates(row, 9);
                const visitasRealizadas = visitDates.count;
                const percentual = visitasPreDefinidas > 0 ? (visitasRealizadas / visitasPreDefinidas) * 100 : 0;
                const valorPorVisita = visitasPreDefinidas > 0 ? valorContrato / visitasPreDefinidas : 0;
                const valorPago = visitasRealizadas * valorPorVisita;

                return {
                  id: `${month}-${idPromotor}-${index + 1}`,
                  idPromotor,
                  promotor,
                  rede,
                  cidade,
                  marca,
                  visitasPreDefinidas,
                  visitasRealizadas,
                  percentual,
                  telefone,
                  dataInicio,
                  valorContrato,
                  valorPorVisita,
                  valorPago,
                  datasVisitas: visitDates.dates
                };
              }).filter(item => item.promotor.trim() !== '');
              
              allData.push(...monthData);
            }
          }
        } catch (error) {
          console.warn(`Erro ao carregar página ${month}:`, error);
        }
      }
      
      setAllPagesData(allData);
      console.log(`📊 Dados de todas as páginas carregados: ${allData.length} registros`);
    } catch (error) {
      console.error('Erro ao carregar dados de todas as páginas:', error);
    }
  };

  const processVisitDates = (row: string[], startIndex: number = 9): { dates: string[], count: number } => {
    const dates: string[] = [];
    for (let i = startIndex; i < row.length; i++) {
      if (row[i] && row[i].trim() !== '') {
        const dateStr = row[i].trim();
        // Verificar se está no formato dd/mm/yyyy
        const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
        if (dateRegex.test(dateStr)) {
          dates.push(dateStr);
        } else {
          // Tentar outros formatos para compatibilidade
          dates.push(dateStr);
        }
      }
    }
    return { dates, count: dates.length };
  };

  const loadData = async (configToUse?: GoogleSheetsConfig, monthSheet?: string) => {
    const currentConfig = configToUse || config;
    const targetMonth = monthSheet || currentMonth;
    
    if (!currentConfig) {
      console.log('⏳ Aguardando configuração das variáveis de ambiente do Google Sheets');
      return;
    }

    setLoading(true);
    console.log(`📊 Carregando dados da planilha - Página: ${targetMonth}`);
    
    try {
      const range = `${targetMonth}!A1:AZ1000`;
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${currentConfig.spreadsheetId}/values/${range}?key=${currentConfig.apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 400) {
          console.warn(`⚠️ Página '${targetMonth}' não existe na planilha`);
          setData([]);
          setIsConnected(true);
          toast({
            title: "Página não encontrada",
            description: `A página '${targetMonth}' não existe. Crie uma nova página na planilha.`,
            variant: "destructive"
          });
          return;
        }
        throw new Error(`Erro ao carregar dados: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(`📥 Resposta da API Google Sheets recebida para ${targetMonth}:`, result);
      
      if (result.values && result.values.length > 1) {
        const [headers, ...rows] = result.values;
        console.log('📋 Headers encontrados:', headers);
        console.log('📊 Linhas de dados brutos:', rows.length);
        
        const rawData: VisitData[] = rows.map((row: string[], index: number) => {
          const idPromotor = row[0] || `AUTO_${index + 1}`;
          const promotor = row[1] || '';
          const rede = row[2] || '';
          const cidade = row[3] || '';
          const marca = row[4] || '';
          const visitasPreDefinidas = parseInt(row[5]) || 0;
          const telefone = row[6] || '';
          const dataInicio = row[7] || '';
          const valorContrato = parseFloat(row[8]) || 0;
          
          const visitDates = processVisitDates(row, 9);
          const visitasRealizadas = visitDates.count;
          
          // Nova fórmula de performance para item individual
          const currentDate = new Date();
          const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
          const daysPassed = currentDate.getDate();
          const expectedVisitsSoFar = visitasPreDefinidas > 0 ? (visitasPreDefinidas / daysInMonth) * daysPassed : 0;
          const percentual = expectedVisitsSoFar > 0 ? (visitasRealizadas / expectedVisitsSoFar) * 100 : 0;
          
          const valorPorVisita = visitasPreDefinidas > 0 ? valorContrato / visitasPreDefinidas : 0;
          const valorPago = visitasRealizadas * valorPorVisita;

          return {
            id: `${targetMonth}-${idPromotor}-${index + 1}`,
            idPromotor,
            promotor,
            rede,
            cidade,
            marca,
            visitasPreDefinidas,
            visitasRealizadas,
            percentual,
            telefone,
            dataInicio,
            valorContrato,
            valorPorVisita,
            valorPago,
            datasVisitas: visitDates.dates
          };
        }).filter(item => item.promotor.trim() !== '');
        
        const uniquePromotersCount = getUniquePromoters(rawData).length;
        
        setData(rawData);
        setIsConnected(true);
        console.log(`✅ Dados carregados para ${targetMonth}: ${rawData.length} registros (${uniquePromotersCount} promotores únicos)`);
        
        loadAllPagesData(currentConfig);
        
        toast({
          title: "Dados Carregados",
          description: `${rawData.length} registros de ${uniquePromotersCount} promotores únicos - ${targetMonth}`
        });
      } else {
        console.warn(`⚠️ Nenhum dado encontrado na página '${targetMonth}'`);
        setData([]);
        setIsConnected(true);
        
        toast({
          title: "Página Vazia",
          description: `A página '${targetMonth}' está vazia`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(`❌ Erro ao carregar dados da página '${targetMonth}':`, error);
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

  const getUniquePromoters = (data: VisitData[]): string[] => {
    const uniqueIds = new Set(data.map(item => item.idPromotor?.toLowerCase() || item.promotor.trim().toLowerCase()));
    return Array.from(uniqueIds);
  };

  const updateData = async (updatedData: VisitData[]) => {
    if (!config) {
      console.error('❌ Configuração do Google Sheets não disponível para atualização');
      return;
    }

    setLoading(true);
    console.log(`💾 Iniciando atualização da planilha - Página: ${currentMonth}`);
    
    try {
      const values = [
        [
          'ID_PROMOTOR', 'PROMOTOR/AGÊNCIA', 'REDE', 'CIDADE', 'MARCA', 'VISITAS PRÉ-DEFINIDAS', 
          'TELEFONE', 'DATA INÍCIO', 'VALOR CONTRATO',
          ...Array.from({length: 50}, (_, i) => `DATA VISITA ${i + 1}`)
        ],
        ...updatedData.map(item => {
          const row = [
            item.idPromotor || '',
            item.promotor,
            item.rede,
            item.cidade,
            item.marca,
            item.visitasPreDefinidas.toString(),
            item.telefone,
            item.dataInicio,
            item.valorContrato.toString()
          ];
          
          for (let i = 0; i < 50; i++) {
            row.push(item.datasVisitas[i] || '');
          }
          
          return row;
        })
      ];

      const range = `${currentMonth}!A1:AZ${values.length}`;
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${range}?valueInputOption=RAW&key=${config.apiKey}`;
      
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
      console.log(`✅ Planilha atualizada com sucesso - Página: ${currentMonth}`);
      
      toast({
        title: "Sucesso",
        description: `Dados salvos na página '${currentMonth}' do Google Sheets`
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

  const changeMonth = (month: string) => {
    setCurrentMonth(month);
    if (config) {
      loadData(config, month);
    }
  };

  return {
    data,
    allPagesData,
    loading,
    config,
    isConnected,
    currentMonth,
    availableMonths,
    loadData: () => loadData(),
    updateData,
    changeMonth,
    getUniquePromoters: () => getUniquePromoters(data)
  };
};
