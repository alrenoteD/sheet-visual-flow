
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download, FileText, Table } from 'lucide-react';
import { VisitData } from '@/types/VisitData';
import { toast } from '@/hooks/use-toast';

interface MonthSelectorProps {
  currentMonth: string;
  availableMonths: string[];
  onMonthChange: (month: string) => void;
  data: VisitData[];
  getUniquePromoters: () => string[];
}

export const MonthSelector = ({ 
  currentMonth, 
  availableMonths, 
  onMonthChange, 
  data,
  getUniquePromoters 
}: MonthSelectorProps) => {
  const [downloading, setDownloading] = useState(false);

  const formatMonthDisplay = (month: string) => {
    const [year, monthNum] = month.split('-');
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${monthNames[parseInt(monthNum) - 1]} ${year}`;
  };

  const downloadCSV = () => {
    if (data.length === 0) {
      toast({
        title: "Nenhum Dado",
        description: "Não há dados para exportar no mês selecionado",
        variant: "destructive"
      });
      return;
    }

    setDownloading(true);
    
    try {
      // Cabeçalhos do CSV
      const headers = [
        'Promotor/Agência',
        'Rede',
        'Cidade', 
        'Marca',
        'Visitas Pré-definidas',
        'Visitas Realizadas',
        'Percentual (%)',
        'Telefone',
        'Data Início',
        'Valor Contrato',
        'Valor por Visita',
        'Valor Pago',
        'Datas de Visitas'
      ];

      // Dados do CSV
      const csvData = data.map(item => [
        item.promotor,
        item.rede,
        item.cidade,
        item.marca,
        item.visitasPreDefinidas,
        item.visitasRealizadas,
        item.percentual.toFixed(2),
        item.telefone,
        item.dataInicio,
        item.valorContrato.toFixed(2),
        item.valorPorVisita.toFixed(2),
        item.valorPago.toFixed(2),
        item.datasVisitas.join('; ')
      ]);

      // Criar conteúdo CSV
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Download do arquivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `relatorio-visitas-${currentMonth}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download Concluído",
        description: `Relatório CSV de ${formatMonthDisplay(currentMonth)} baixado com sucesso`
      });
    } catch (error) {
      console.error('Erro ao gerar CSV:', error);
      toast({
        title: "Erro no Download",
        description: "Falha ao gerar arquivo CSV",
        variant: "destructive"
      });
    } finally {
      setDownloading(false);
    }
  };

  const downloadSummaryCSV = () => {
    if (data.length === 0) {
      toast({
        title: "Nenhum Dado",
        description: "Não há dados para exportar no mês selecionado",
        variant: "destructive"
      });
      return;
    }

    setDownloading(true);
    
    try {
      // Resumo por promotor
      const promoterSummary = data.reduce((acc, item) => {
        const key = item.promotor.toLowerCase();
        if (!acc[key]) {
          acc[key] = {
            promotor: item.promotor,
            telefone: item.telefone,
            totalVisitasPreDefinidas: 0,
            totalVisitasRealizadas: 0,
            totalValorContrato: 0,
            totalValorPago: 0,
            marcas: new Set(),
            redes: new Set(),
            cidades: new Set(),
            todasDataVisitas: []
          };
        }
        
        acc[key].totalVisitasPreDefinidas += item.visitasPreDefinidas;
        acc[key].totalVisitasRealizadas += item.visitasRealizadas;
        acc[key].totalValorContrato += item.valorContrato;
        acc[key].totalValorPago += item.valorPago;
        acc[key].marcas.add(item.marca);
        acc[key].redes.add(item.rede);
        acc[key].cidades.add(item.cidade);
        acc[key].todasDataVisitas.push(...item.datasVisitas);
        
        return acc;
      }, {} as any);

      const headers = [
        'Promotor',
        'Telefone',
        'Total Visitas Pré-definidas',
        'Total Visitas Realizadas',
        'Percentual Total (%)',
        'Total Valor Contrato',
        'Total Valor Pago',
        'Marcas',
        'Redes',
        'Cidades',
        'Todas Datas de Visitas'
      ];

      const csvData = Object.values(promoterSummary).map((summary: any) => {
        const percentualTotal = summary.totalVisitasPreDefinidas > 0 
          ? (summary.totalVisitasRealizadas / summary.totalVisitasPreDefinidas) * 100 
          : 0;
        
        return [
          summary.promotor,
          summary.telefone,
          summary.totalVisitasPreDefinidas,
          summary.totalVisitasRealizadas,
          percentualTotal.toFixed(2),
          summary.totalValorContrato.toFixed(2),
          summary.totalValorPago.toFixed(2),
          Array.from(summary.marcas).join('; '),
          Array.from(summary.redes).join('; '),
          Array.from(summary.cidades).join('; '),
          [...new Set(summary.todasDataVisitas)].sort().join('; ')
        ];
      });

      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `resumo-promotores-${currentMonth}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download Concluído",
        description: `Resumo consolidado de ${formatMonthDisplay(currentMonth)} baixado com sucesso`
      });
    } catch (error) {
      console.error('Erro ao gerar resumo CSV:', error);
      toast({
        title: "Erro no Download",
        description: "Falha ao gerar resumo CSV",
        variant: "destructive"
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Controle Mensal de Dados
          </div>
          <Badge variant="outline">
            {getUniquePromoters().length} promotores únicos
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Selecionar Mês:</label>
            <Select value={currentMonth} onValueChange={onMonthChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o mês" />
              </SelectTrigger>
              <SelectContent>
                {availableMonths.map((month) => (
                  <SelectItem key={month} value={month}>
                    {formatMonthDisplay(month)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p><strong>Registros:</strong> {data.length}</p>
            <p><strong>Mês Atual:</strong> {formatMonthDisplay(currentMonth)}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={downloadCSV} 
            disabled={downloading || data.length === 0}
            size="sm"
            variant="outline"
          >
            <FileText className="w-4 h-4 mr-2" />
            Relatório Completo (CSV)
          </Button>
          
          <Button 
            onClick={downloadSummaryCSV} 
            disabled={downloading || data.length === 0}
            size="sm"
            variant="outline"
          >
            <Table className="w-4 h-4 mr-2" />
            Resumo Consolidado (CSV)
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          💡 <strong>Dica:</strong> O relatório completo mostra todos os registros. 
          O resumo consolidado agrupa dados por promotor único.
        </div>
      </CardContent>
    </Card>
  );
};
