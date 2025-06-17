
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Calendar, 
  BarChart3, 
  Target, 
  DollarSign, 
  MapPin,
  Phone,
  Building,
  Package
} from 'lucide-react';
import { VisitData } from '@/types/VisitData';
import { VisitCalendar } from './VisitCalendar';

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

interface PromoterDetailsProps {
  promoter: PromoterSummary;
  onBack: () => void;
}

export const PromoterDetails = ({ promoter, onBack }: PromoterDetailsProps) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('todas');

  const filteredVisits = useMemo(() => {
    if (selectedBrand === 'todas') {
      return promoter.registros.flatMap(registro => 
        registro.datasVisitas.map(data => ({
          date: data,
          marca: registro.marca,
          cidade: registro.cidade,
          rede: registro.rede
        }))
      );
    }
    
    return promoter.registros
      .filter(registro => registro.marca === selectedBrand)
      .flatMap(registro => 
        registro.datasVisitas.map(data => ({
          date: data,
          marca: registro.marca,
          cidade: registro.cidade,
          rede: registro.rede
        }))
      );
  }, [promoter.registros, selectedBrand]);

  const brandPerformance = useMemo(() => {
    return promoter.marcas.map(marca => {
      const brandRecords = promoter.registros.filter(r => r.marca === marca);
      const totalVisitas = brandRecords.reduce((sum, r) => sum + r.visitasPreDefinidas, 0);
      const visitasRealizadas = brandRecords.reduce((sum, r) => sum + r.visitasRealizadas, 0);
      const percentual = totalVisitas > 0 ? (visitasRealizadas / totalVisitas) * 100 : 0;
      const valor = brandRecords.reduce((sum, r) => sum + r.valorContrato, 0);
      
      return {
        marca,
        totalVisitas,
        visitasRealizadas,
        percentual,
        valor
      };
    });
  }, [promoter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{promoter.nome}</h2>
          <p className="text-muted-foreground">ID: {promoter.idPromotor}</p>
        </div>
      </div>

      {/* Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="w-4 h-4" />
              Performance Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {promoter.percentualGeral.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {promoter.visitasRealizadas}/{promoter.totalVisitas} visitas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Package className="w-4 h-4" />
              Marcas Atendidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promoter.marcas.length}</div>
            <p className="text-xs text-muted-foreground">
              {promoter.marcas.slice(0, 2).join(', ')}
              {promoter.marcas.length > 2 && '...'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Cidades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promoter.cidades.length}</div>
            <p className="text-xs text-muted-foreground">
              {promoter.cidades.slice(0, 2).join(', ')}
              {promoter.cidades.length > 2 && '...'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Valor Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {(promoter.valorTotal / 1000).toFixed(0)}k
            </div>
            <p className="text-xs text-muted-foreground">
              Contratos ativos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Informações de Contato */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Informações de Contato
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Telefones:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {promoter.telefones.map((tel, index) => (
                  <Badge key={index} variant="outline">
                    {tel}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Cidades de Atuação:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {promoter.cidades.map((cidade, index) => (
                  <Badge key={index} variant="secondary">
                    {cidade}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance por Marca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Performance por Marca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {brandPerformance.map((brand) => (
              <div key={brand.marca} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{brand.marca}</h4>
                  <Badge 
                    variant={brand.percentual >= 80 ? "default" : 
                            brand.percentual >= 60 ? "secondary" : "destructive"}
                  >
                    {brand.percentual.toFixed(1)}%
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Visitas:</span>
                    <div className="font-medium">
                      {brand.visitasRealizadas}/{brand.totalVisitas}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Valor:</span>
                    <div className="font-medium">
                      R$ {brand.valor.toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(brand.percentual, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Calendário de Visitas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Calendário de Visitas
          </CardTitle>
          <div className="flex items-center gap-4 mt-4">
            <span className="text-sm">Filtrar por marca:</span>
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as marcas</SelectItem>
                {promoter.marcas.map(marca => (
                  <SelectItem key={marca} value={marca}>{marca}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <VisitCalendar visits={filteredVisits} />
        </CardContent>
      </Card>
    </div>
  );
};
