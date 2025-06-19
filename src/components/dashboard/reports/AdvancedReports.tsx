
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Settings, Calendar } from 'lucide-react';
import { VisitData } from '@/types/VisitData';

interface AdvancedReportsProps {
  data: VisitData[];
  getUniquePromoters: () => string[];
}

interface ReportConfig {
  includePromoter: boolean;
  includeRede: boolean;
  includeCidade: boolean;
  includeMarca: boolean;
  includeVisitas: boolean;
  includePerformance: boolean;
  includeFinanceiro: boolean;
  includeDatasVisitas: boolean;
  format: 'csv' | 'xlsx';
  type: 'completo' | 'consolidado';
  // New filters
  filterRede: string;
  filterPromotor: string;
  filterIdPromotor: string;
  filterCidade: string;
  filterMarca: string;
  dateStart: string;
  dateEnd: string;
}

export const AdvancedReports = ({ data, getUniquePromoters }: AdvancedReportsProps) => {
  const [config, setConfig] = useState<ReportConfig>({
    includePromoter: true,
    includeRede: true,
    includeCidade: true,
    includeMarca: true,
    includeVisitas: true,
    includePerformance: true,
    includeFinanceiro: true,
    includeDatasVisitas: false,
    format: 'csv',
    type: 'completo',
    filterRede: '',
    filterPromotor: '',
    filterIdPromotor: '',
    filterCidade: '',
    filterMarca: '',
    dateStart: '',
    dateEnd: ''
  });

  // Get unique values for filters
  const uniqueRedes = [...new Set(data.map(item => item.rede))].sort();
  const uniquePromoters = getUniquePromoters();
  const uniqueCidades = [...new Set(data.map(item => item.cidade))].sort();
  const uniqueMarcas = [...new Set(data.map(item => item.marca))].sort();

  const isDateInRange = (dateString: string, startDate: string, endDate: string) => {
    if (!startDate || !endDate || !dateString) return true;
    
    const date = new Date(dateString);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return date >= start && date <= end;
  };

  const filterData = (originalData: VisitData[]) => {
    let filtered = [...originalData];

    // Apply filters
    if (config.filterRede) {
      filtered = filtered.filter(item => item.rede === config.filterRede);
    }
    if (config.filterPromotor) {
      filtered = filtered.filter(item => item.promotor === config.filterPromotor);
    }
    if (config.filterIdPromotor) {
      filtered = filtered.filter(item => item.idPromotor === config.filterIdPromotor);
    }
    if (config.filterCidade) {
      filtered = filtered.filter(item => item.cidade === config.filterCidade);
    }
    if (config.filterMarca) {
      filtered = filtered.filter(item => item.marca === config.filterMarca);
    }

    // Apply date range filter to datasVisitas
    if (config.dateStart && config.dateEnd) {
      filtered = filtered.filter(item => {
        if (!item.datasVisitas || item.datasVisitas.length === 0) return false;
        
        return item.datasVisitas.some(date => 
          isDateInRange(date, config.dateStart, config.dateEnd)
        );
      });
    }

    return filtered;
  };

  const generateReport = () => {
    const filteredData = filterData(data);
    
    if (filteredData.length === 0) {
      alert('Nenhum dado encontrado com os filtros aplicados.');
      return;
    }

    const headers = [];
    if (config.includePromoter) headers.push('PROMOTOR/AGÊNCIA');
    if (config.includeRede) headers.push('REDE');
    if (config.includeCidade) headers.push('CIDADE');
    if (config.includeMarca) headers.push('MARCA');
    if (config.includeVisitas) {
      headers.push('VISITAS PRÉ-DEFINIDAS');
      headers.push('VISITAS REALIZADAS');
    }
    if (config.includePerformance) headers.push('PERCENTUAL (%)');
    if (config.includeFinanceiro) {
      headers.push('VALOR CONTRATO');
      headers.push('VALOR PAGO');
      headers.push('VALOR POR VISITA');
    }
    if (config.includeDatasVisitas) {
      headers.push('DATAS DAS VISITAS NO PERÍODO');
    }

    let reportData: any[] = [];

    if (config.type === 'consolidado') {
      // Consolidar por promotor único
      const uniquePromoters = [...new Set(filteredData.map(item => item.promotor.toLowerCase()))];
      reportData = uniquePromoters.map(promoterName => {
        const promoterData = filteredData.filter(item => 
          item.promotor.toLowerCase() === promoterName.toLowerCase()
        );
        
        const consolidated = {
          promotor: promoterName,
          redes: [...new Set(promoterData.map(item => item.rede))].join(', '),
          cidades: [...new Set(promoterData.map(item => item.cidade))].join(', '),
          marcas: [...new Set(promoterData.map(item => item.marca))].join(', '),
          visitasPreDefinidas: promoterData.reduce((sum, item) => sum + item.visitasPreDefinidas, 0),
          visitasRealizadas: promoterData.reduce((sum, item) => sum + item.visitasRealizadas, 0),
          valorContrato: promoterData.reduce((sum, item) => sum + item.valorContrato, 0),
          valorPago: promoterData.reduce((sum, item) => sum + item.valorPago, 0),
          datasVisitas: [],
          percentual: 0,
          valorPorVisita: 0
        };

        // Filter visit dates within period
        if (config.dateStart && config.dateEnd) {
          consolidated.datasVisitas = promoterData
            .flatMap(item => item.datasVisitas)
            .filter(date => date && isDateInRange(date, config.dateStart, config.dateEnd))
            .sort();
        } else {
          consolidated.datasVisitas = promoterData.flatMap(item => item.datasVisitas).filter(date => date);
        }

        consolidated.percentual = consolidated.visitasPreDefinidas > 0 
          ? (consolidated.visitasRealizadas / consolidated.visitasPreDefinidas) * 100 
          : 0;
        consolidated.valorPorVisita = consolidated.visitasPreDefinidas > 0 
          ? consolidated.valorContrato / consolidated.visitasPreDefinidas 
          : 0;

        return consolidated;
      });
    } else {
      reportData = filteredData.map(item => ({
        ...item,
        datasVisitasFiltered: config.dateStart && config.dateEnd 
          ? item.datasVisitas.filter(date => isDateInRange(date, config.dateStart, config.dateEnd))
          : item.datasVisitas
      }));
    }

    // Gerar linhas do CSV
    const csvRows = [headers.join(',')];
    
    reportData.forEach(item => {
      const row = [];
      if (config.includePromoter) row.push(`"${item.promotor || item.promotor}"`);
      if (config.includeRede) row.push(`"${item.rede || item.redes || ''}"`);
      if (config.includeCidade) row.push(`"${item.cidade || item.cidades || ''}"`);
      if (config.includeMarca) row.push(`"${item.marca || item.marcas || ''}"`);
      if (config.includeVisitas) {
        row.push(item.visitasPreDefinidas || 0);
        row.push(item.visitasRealizadas || 0);
      }
      if (config.includePerformance) row.push((item.percentual || 0).toFixed(2));
      if (config.includeFinanceiro) {
        row.push(item.valorContrato || 0);
        row.push(item.valorPago || 0);
        row.push((item.valorPorVisita || 0).toFixed(2));
      }
      if (config.includeDatasVisitas) {
        const dates = item.datasVisitasFiltered || item.datasVisitas || [];
        row.push(`"${dates.join(', ')}"`);
      }
      csvRows.push(row.join(','));
    });

    // Download do arquivo
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `relatorio_${config.type}_${timestamp}.${config.format}`;
    
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Filtros de Data e Conteúdo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Filtros de Dados e Período
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <Label>Rede (Loja)</Label>
              <Select value={config.filterRede} onValueChange={(value) => setConfig(prev => ({ ...prev, filterRede: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as redes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as redes</SelectItem>
                  {uniqueRedes.map(rede => (
                    <SelectItem key={rede} value={rede}>{rede}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Promotor</Label>
              <Select value={config.filterPromotor} onValueChange={(value) => setConfig(prev => ({ ...prev, filterPromotor: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os promotores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os promotores</SelectItem>
                  {uniquePromoters.map(promotor => (
                    <SelectItem key={promotor} value={promotor}>{promotor.split(' ')[0]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>ID Promotor</Label>
              <Input
                value={config.filterIdPromotor}
                onChange={(e) => setConfig(prev => ({ ...prev, filterIdPromotor: e.target.value }))}
                placeholder="ID específico"
              />
            </div>

            <div>
              <Label>Cidade</Label>
              <Select value={config.filterCidade} onValueChange={(value) => setConfig(prev => ({ ...prev, filterCidade: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as cidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as cidades</SelectItem>
                  {uniqueCidades.map(cidade => (
                    <SelectItem key={cidade} value={cidade}>{cidade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Marca</Label>
              <Select value={config.filterMarca} onValueChange={(value) => setConfig(prev => ({ ...prev, filterMarca: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as marcas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as marcas</SelectItem>
                  {uniqueMarcas.map(marca => (
                    <SelectItem key={marca} value={marca}>{marca}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Data Início (Filtro de Visitas)</Label>
              <Input
                type="date"
                value={config.dateStart}
                onChange={(e) => setConfig(prev => ({ ...prev, dateStart: e.target.value }))}
              />
            </div>
            <div>
              <Label>Data Fim (Filtro de Visitas)</Label>
              <Input
                type="date"
                value={config.dateEnd}
                onChange={(e) => setConfig(prev => ({ ...prev, dateEnd: e.target.value }))}
              />
            </div>
          </div>

          {config.dateStart && config.dateEnd && (
            <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
              <strong>Filtro de Período Ativo:</strong> Serão incluídas apenas as visitas realizadas entre {new Date(config.dateStart).toLocaleDateString('pt-BR')} e {new Date(config.dateEnd).toLocaleDateString('pt-BR')}.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuração do Relatório */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuração do Relatório
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Tipo de Relatório</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="completo"
                    checked={config.type === 'completo'}
                    onCheckedChange={() => setConfig(prev => ({ ...prev, type: 'completo' }))}
                  />
                  <label htmlFor="completo" className="text-sm">Relatório Completo (todas as linhas)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="consolidado"
                    checked={config.type === 'consolidado'}
                    onCheckedChange={() => setConfig(prev => ({ ...prev, type: 'consolidado' }))}
                  />
                  <label htmlFor="consolidado" className="text-sm">Relatório Consolidado (por promotor)</label>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Formato</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="csv"
                    checked={config.format === 'csv'}
                    onCheckedChange={() => setConfig(prev => ({ ...prev, format: 'csv' }))}
                  />
                  <label htmlFor="csv" className="text-sm">CSV</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="xlsx"
                    checked={config.format === 'xlsx'}
                    onCheckedChange={() => setConfig(prev => ({ ...prev, format: 'xlsx' }))}
                  />
                  <label htmlFor="xlsx" className="text-sm">XLSX (Excel)</label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Informações a Incluir</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { key: 'includePromoter', label: 'Promotor' },
                { key: 'includeRede', label: 'Rede' },
                { key: 'includeCidade', label: 'Cidade' },
                { key: 'includeMarca', label: 'Marca' },
                { key: 'includeVisitas', label: 'Visitas' },
                { key: 'includePerformance', label: 'Performance' },
                { key: 'includeFinanceiro', label: 'Financeiro' },
                { key: 'includeDatasVisitas', label: 'Datas das Visitas' }
              ].map(option => (
                <div key={option.key} className="flex items-center space-x-2">
                  <Checkbox 
                    id={option.key}
                    checked={config[option.key as keyof ReportConfig] as boolean}
                    onCheckedChange={(checked) => 
                      setConfig(prev => ({ ...prev, [option.key]: checked }))
                    }
                  />
                  <label htmlFor={option.key} className="text-sm">{option.label}</label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gerar Relatório */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Gerar Relatório
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Relatório {config.type === 'completo' ? 'Completo' : 'Consolidado'}
                {(config.dateStart && config.dateEnd) && ` - Período: ${new Date(config.dateStart).toLocaleDateString('pt-BR')} a ${new Date(config.dateEnd).toLocaleDateString('pt-BR')}`}
              </p>
              <p className="text-xs text-muted-foreground">
                {filterData(data).length} registros filtrados • Formato: {config.format.toUpperCase()}
              </p>
            </div>
            <Button onClick={generateReport} className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Baixar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
