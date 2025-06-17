
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Search, Filter, Calendar, BarChart3, Target, Phone, MapPin } from 'lucide-react';
import { VisitData } from '@/types/VisitData';
import { PromoterDetails } from './PromoterDetails';

interface PromotersPanelProps {
  data: VisitData[];
}

interface PromoterSummary {
  idPromotor: string;
  nome: string;
  totalVisitas: number;
  visitasRealizadas: number;
  percentualGeral: number;
  marcas: string[];
  cidades: string[];
  telefones: string[];
  valorTotal: number;
  registros: VisitData[];
}

export const PromotersPanel = ({ data }: PromotersPanelProps) => {
  const [selectedPromoter, setSelectedPromoter] = useState<PromoterSummary | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'nome' | 'performance' | 'visitas'>('performance');
  const [filterCity, setFilterCity] = useState<string>('');

  const promotersSummary = useMemo(() => {
    const groupedData = data.reduce((acc, item) => {
      const key = item.idPromotor || item.promotor;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {} as Record<string, VisitData[]>);

    return Object.entries(groupedData).map(([key, records]): PromoterSummary => {
      const firstRecord = records[0];
      const totalVisitas = records.reduce((sum, r) => sum + r.visitasPreDefinidas, 0);
      const visitasRealizadas = records.reduce((sum, r) => sum + r.visitasRealizadas, 0);
      const percentualGeral = totalVisitas > 0 ? (visitasRealizadas / totalVisitas) * 100 : 0;
      
      const marcas = [...new Set(records.map(r => r.marca).filter(Boolean))];
      const cidades = [...new Set(records.map(r => r.cidade).filter(Boolean))];
      const telefones = [...new Set(records.flatMap(r => 
        r.telefone ? r.telefone.split(',').map(t => t.trim()) : []
      ).filter(Boolean))];
      const valorTotal = records.reduce((sum, r) => sum + r.valorContrato, 0);

      return {
        idPromotor: firstRecord.idPromotor || key,
        nome: firstRecord.promotor,
        totalVisitas,
        visitasRealizadas,
        percentualGeral,
        marcas,
        cidades,
        telefones,
        valorTotal,
        registros: records
      };
    });
  }, [data]);

  const filteredPromoters = useMemo(() => {
    let filtered = promotersSummary;

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.idPromotor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por cidade
    if (filterCity) {
      filtered = filtered.filter(p => p.cidades.includes(filterCity));
    }

    // Ordenação
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'nome':
          return a.nome.localeCompare(b.nome);
        case 'performance':
          return b.percentualGeral - a.percentualGeral;
        case 'visitas':
          return b.visitasRealizadas - a.visitasRealizadas;
        default:
          return 0;
      }
    });

    return filtered;
  }, [promotersSummary, searchTerm, sortBy, filterCity]);

  const allCities = useMemo(() => {
    return [...new Set(data.map(item => item.cidade).filter(Boolean))].sort();
  }, [data]);

  if (selectedPromoter) {
    return (
      <PromoterDetails 
        promoter={selectedPromoter}
        onBack={() => setSelectedPromoter(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Painel de Promotores</h2>
          <Badge variant="outline">{promotersSummary.length} promotores</Badge>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros e Busca
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="visitas">Visitas Realizadas</SelectItem>
                <SelectItem value="nome">Nome</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCity} onValueChange={setFilterCity}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por cidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as cidades</SelectItem>
                {allCities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setFilterCity('');
                setSortBy('performance');
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Promotores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPromoters.map((promoter) => (
          <Card 
            key={promoter.idPromotor} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedPromoter(promoter)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{promoter.nome}</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {promoter.idPromotor}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Performance */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Performance:</span>
                <Badge 
                  variant={promoter.percentualGeral >= 80 ? "default" : 
                          promoter.percentualGeral >= 60 ? "secondary" : "destructive"}
                >
                  {promoter.percentualGeral.toFixed(1)}%
                </Badge>
              </div>

              {/* Visitas */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Visitas:</span>
                <span className="text-sm font-medium">
                  {promoter.visitasRealizadas}/{promoter.totalVisitas}
                </span>
              </div>

              {/* Marcas */}
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Marcas:</span>
                <div className="flex flex-wrap gap-1">
                  {promoter.marcas.slice(0, 3).map(marca => (
                    <Badge key={marca} variant="outline" className="text-xs">
                      {marca}
                    </Badge>
                  ))}
                  {promoter.marcas.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{promoter.marcas.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Cidades */}
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {promoter.cidades.join(', ')}
                </span>
              </div>

              {/* Telefones */}
              {promoter.telefones.length > 0 && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {promoter.telefones.join(', ')}
                  </span>
                </div>
              )}

              {/* Valor Total */}
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm text-muted-foreground">Valor Total:</span>
                <span className="text-sm font-medium">
                  R$ {promoter.valorTotal.toLocaleString('pt-BR')}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPromoters.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mt-4">Nenhum promotor encontrado</h3>
            <p className="text-muted-foreground mt-2">
              Tente ajustar os filtros ou verificar os dados carregados.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
