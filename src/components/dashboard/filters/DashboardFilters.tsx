
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RotateCcw, Filter } from 'lucide-react';
import { VisitData } from '@/types/VisitData';

interface DashboardFiltersProps {
  data: VisitData[];
  onFiltersChange: (filteredData: VisitData[]) => void;
}

export interface Filters {
  cidade: string;
  promotor: string;
  rede: string;
  marca: string;
  percentualMin: string;
  percentualMax: string;
}

export const DashboardFilters = ({ data, onFiltersChange }: DashboardFiltersProps) => {
  const [filters, setFilters] = useState<Filters>({
    cidade: '',
    promotor: '',
    rede: '',
    marca: '',
    percentualMin: '',
    percentualMax: ''
  });

  const cidades = [...new Set(data.map(item => item.cidade))].sort();
  const promotores = [...new Set(data.map(item => item.promotor))].sort();
  const redes = [...new Set(data.map(item => item.rede))].sort();
  const marcas = [...new Set(data.map(item => item.marca))].sort();

  const applyFilters = () => {
    let filteredData = data;

    if (filters.cidade) {
      filteredData = filteredData.filter(item => item.cidade === filters.cidade);
    }
    if (filters.promotor) {
      filteredData = filteredData.filter(item => item.promotor === filters.promotor);
    }
    if (filters.rede) {
      filteredData = filteredData.filter(item => item.rede === filters.rede);
    }
    if (filters.marca) {
      filteredData = filteredData.filter(item => item.marca === filters.marca);
    }
    if (filters.percentualMin) {
      filteredData = filteredData.filter(item => item.percentual >= parseFloat(filters.percentualMin));
    }
    if (filters.percentualMax) {
      filteredData = filteredData.filter(item => item.percentual <= parseFloat(filters.percentualMax));
    }

    onFiltersChange(filteredData);
  };

  const clearFilters = () => {
    setFilters({
      cidade: '',
      promotor: '',
      rede: '',
      marca: '',
      percentualMin: '',
      percentualMax: ''
    });
    onFiltersChange(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtros Avançados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
          <Select value={filters.cidade} onValueChange={(value) => setFilters(prev => ({ ...prev, cidade: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Cidade" />
            </SelectTrigger>
            <SelectContent>
              {cidades.map(cidade => (
                <SelectItem key={cidade} value={cidade}>{cidade}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.promotor} onValueChange={(value) => setFilters(prev => ({ ...prev, promotor: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Promotor" />
            </SelectTrigger>
            <SelectContent>
              {promotores.map(promotor => (
                <SelectItem key={promotor} value={promotor}>{promotor.split(' ')[0]}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.rede} onValueChange={(value) => setFilters(prev => ({ ...prev, rede: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Rede" />
            </SelectTrigger>
            <SelectContent>
              {redes.map(rede => (
                <SelectItem key={rede} value={rede}>{rede}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.marca} onValueChange={(value) => setFilters(prev => ({ ...prev, marca: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Marca" />
            </SelectTrigger>
            <SelectContent>
              {marcas.map(marca => (
                <SelectItem key={marca} value={marca}>{marca}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.percentualMin} onValueChange={(value) => setFilters(prev => ({ ...prev, percentualMin: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="% Mín" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0%</SelectItem>
              <SelectItem value="25">25%</SelectItem>
              <SelectItem value="50">50%</SelectItem>
              <SelectItem value="75">75%</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.percentualMax} onValueChange={(value) => setFilters(prev => ({ ...prev, percentualMax: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="% Máx" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25%</SelectItem>
              <SelectItem value="50">50%</SelectItem>
              <SelectItem value="75">75%</SelectItem>
              <SelectItem value="100">100%</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button onClick={applyFilters} className="flex-1">
            Aplicar Filtros
          </Button>
          <Button variant="outline" onClick={clearFilters}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
