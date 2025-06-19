
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Table, Settings, Calendar, Filter } from 'lucide-react';
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
  filterByRede: string;
  filterByPromotor: string;
  filterByIdPromotor: string;
  filterByCidade: string;
  filterByMarca: string;
  dateFrom: string;
  dateTo: string;
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
    filterByRede: '',
    filterByPromotor: '',
    filterByIdPromotor: '',
    filterByCidade: '',
    filterByMarca: '',
    dateFrom: '',
    dateTo: ''
  });

  // Get unique values for filters
  const uniqueRedes = [...new Set(data.map(item => item.rede))].filter(Boolean);
  const uniquePromoters = [...new Set(data.map(item => item.promotor))].filter(Boolean);
  const uniqueIdPromoters = [...new Set(data.map(item => item.idPromotor))].filter(Boolean);
  const uniqueCidades = [...new Set(data.map(item => item.cidade))].filter(Boolean);
  const uniqueMarcas = [...new Set(data.map(item => item.marca))].filter(Boolean);

  const filterData = (data: VisitData[]) => {
    let filtered = [...data];

    // Apply filters
    if (config.filterByRede) {
      filtered = filtered.filter(item => item.rede === config.filterByRede);
    }
    if (config.filterByPromotor) {
      filtered = filtered.filter(item => item.promotor === config.filterByPromotor);
    }
    if (config.filterByIdPromotor) {
      filtered = filtered.filter(item => item.idPromotor === config.filterByIdPromotor);
    }
    if (config.filterByCidade) {
      filtered = filtered.filter(item => item.cidade === config.filterByCidade);
    }
    if (config.filterByMarca) {
      filtered = filtered.filter(item => item.marca === config.filterByMarca);
    }

    // Date range filter
    if (config.dateFrom || config.dateTo) {
      filtered = filtered.filter(item => {
        if (!item.datasVisitas || item.datasVisitas.length === 0) return false;
        
        return item.datasVisitas.some(date => {
          if (!date) return false;
          const visitDate = new Date(date);
          const fromDate = config.dateFrom ? new Date(config.dateFrom) : new Date('1900-01-01');
          const toDate = config.dateTo ? new Date(config.dateTo) : new Date('2099-12-31');
          
          return visitDate >= fromDate && visitDate <= toDate;
        });
      });
    }

    return filtered;
  };

  const generateReport = () => {
    const filteredData = filterData(data);

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
      const maxVisits = Math.max(...filteredData.map(item => item.datasVisitas?.length || 0));
      for (let i = 1; i <= maxVisits; i++) {
        headers.push(`DATA VISITA ${i}`);
      }
    }

    let reportData: any[] = [];

    if (config.type === 'consolidado') {
      // Consolidar por promotor único
      const uniquePromoters = [...new Set(filteredData.map(item => item.idPromotor || item.promotor))];
      reportData = uniquePromoters.map(promoterId => {
        const promoterData = filteredData.filter(item => 
          (item.idPromotor || item.promotor) === promoterId
        );
        
        const consolidated = {
          promotor: promoterData[0]?.promotor || '',
          redes: [...new Set(promoterData.map(item => item.rede))].join(', '),
          cidades: [...new Set(promoterData.map(item => item.cidade))].join(', '),
          marcas: [...new Set(promoterData.map(item => item.marca))].join(', '),
          visitasPreDefinidas: promoterData.reduce((sum, item) => sum + item.visitasPreDefinidas, 0),
          visitasRealizadas: promoterData.reduce((sum, item) => sum + item.visitasRealizadas, 0),
          valorContrato: promoterData.reduce((sum, item) => sum + item.valorContrato, 0),
          valorPago: promoterData.reduce((sum, item) => sum + item.valorPago, 0),
          datasVisitas: promoterData.flatMap(item => item.datasVisitas || []).filter(date => date),
          percentual: 0,
          valorPorVisita: 0
        };

        consolidated.percentual = consolidated.visitasPreDefinidas > 0 
          ? (consolidated.visitasRealizadas / consolidated.visitasPreDefinidas) * 100 
          : 0;
        consolidated.valorPorVisita = consolidated.visitasPreDefinidas > 0 
          ? consolidated.valorContrato / consolidated.visitasPreDefinidas 
          : 0;

        return consolidated;
      });
    } else {
      reportData = filteredData;
    }

    // Gerar linhas do CSV
    const csvRows = [headers.join(',')];
    
    reportData.forEach(item => {
      const row = [];
      if (config.includePromoter) row.push(`"${item.promotor || ''}"`);
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
        const dates = item.datasVisitas || [];
        const maxVisits = Math.max(...filteredData.map(d => d.datasVisitas?.length || 0));
        for (let i = 0; i < maxVisits; i++) {
          row.push(`"${dates[i] || ''}"`);
        }
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

  const filteredCount = filterData(data).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros do Relatório
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Filtrar por Rede</Label>
              <Select value={config.filterByRede} onValueChange={(value) => setConfig(prev => ({ ...prev, filterByRede: value }))}>
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

            <div className="space-y-2">
              <Label>Filtrar por Promotor</Label>
              <Select value={config.filterByPromotor} onValueChange={(value) => setConfig(prev => ({ ...prev, filterByPromotor: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os promotores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os promotores</SelectItem>
                  {uniquePromoters.map(promotor => (
                    <SelectItem key={promotor} value={promotor}>{promotor}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Filtrar por ID Promotor</Label>
              <Select value={config.filterByIdPromotor} onValueChange={(value) => setConfig(prev => ({ ...prev, filterByIdPromotor: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os IDs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os IDs</SelectItem>
                  {uniqueIdPromoters.map(id => (
                    <SelectItem key={id} value={id}>{id}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Filtrar por Cidade</Label>
              <Select value={config.filterByCidade} onValueChange={(value) => setConfig(prev => ({ ...prev, filterByCidade: value }))}>
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

            <div className="space-y-2">
              <Label>Filtrar por Marca</Label>
              <Select value={config.filterByMarca} onValueChange={(value) => setConfig(prev => ({ ...prev, filterByMarca: value }))}>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data Início</Label>
              <Input
                type="date"
                value={config.dateFrom}
                onChange={(e) => setConfig(prev => ({ ...prev, dateFrom: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Data Fim</Label>
              <Input
                type="date"
                value={config.dateTo}
                onChange={(e) => setConfig(prev => ({ ...prev, dateTo: e.target.value }))}
              />
            </div>
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm">
              <strong>Registros filtrados:</strong> {filteredCount} de {data.length} registros
            </p>
          </div>
        </CardContent>
      </Card>

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
                  <label htmlFor="xlsx" className="text-sm">XLSX</label>
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
              <p className="text-sm font-medium">Relatório {config.type === 'completo' ? 'Completo' : 'Consolidado'}</p>
              <p className="text-xs text-muted-foreground">
                {filteredCount} registros • Formato: {config.format.toUpperCase()}
                {(config.dateFrom || config.dateTo) && (
                  <span> • Período: {config.dateFrom || 'início'} a {config.dateTo || 'hoje'}</span>
                )}
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
