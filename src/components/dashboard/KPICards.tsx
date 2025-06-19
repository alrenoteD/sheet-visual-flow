
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Target, TrendingUp, DollarSign, MapPin, Award } from 'lucide-react';
import { VisitData } from '@/types/VisitData';

interface KPICardsProps {
  data: VisitData[];
  isConnected: boolean;
  getUniquePromoters?: () => string[];
}

interface PromoterSummary {
  totalVisitasPreDefinidas: number;
  totalVisitasRealizadas: number;
  totalValorContrato: number;
  totalValorPago: number;
}

export const KPICards = ({ data, isConnected, getUniquePromoters }: KPICardsProps) => {
  if (!isConnected || data.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="opacity-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aguardando dados...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Configure as variáveis de ambiente</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Calcular promotores únicos
  const uniquePromotersCount = getUniquePromoters ? getUniquePromoters().length : 
    new Set(data.map(item => item.promotor.toLowerCase())).size;

  // Calcular marcas únicas
  const uniqueBrands = new Set(data.map(item => item.marca)).size;
  
  // Calcular cidades únicas
  const uniqueCities = new Set(data.map(item => item.cidade)).size;
  
  // Calcular redes únicas
  const uniqueNetworks = new Set(data.map(item => item.rede)).size;

  // Calcular totais por promotor único para métricas
  const promoterSummary = data.reduce((acc, item) => {
    const key = item.promotor.toLowerCase();
    if (!acc[key]) {
      acc[key] = {
        totalVisitasPreDefinidas: 0,
        totalVisitasRealizadas: 0,
        totalValorContrato: 0,
        totalValorPago: 0
      };
    }
    
    acc[key].totalVisitasPreDefinidas += item.visitasPreDefinidas;
    acc[key].totalVisitasRealizadas += item.visitasRealizadas;
    acc[key].totalValorContrato += item.valorContrato;
    acc[key].totalValorPago += item.valorPago;
    
    return acc;
  }, {} as Record<string, PromoterSummary>);

  const totals = Object.values(promoterSummary).reduce((acc, promoter) => {
    acc.visitasPreDefinidas += promoter.totalVisitasPreDefinidas;
    acc.visitasRealizadas += promoter.totalVisitasRealizadas;
    acc.valorContrato += promoter.totalValorContrato;
    acc.valorPago += promoter.totalValorPago;
    return acc;
  }, {
    visitasPreDefinidas: 0,
    visitasRealizadas: 0,
    valorContrato: 0,
    valorPago: 0
  });

  // Nova fórmula para performance média baseada no desempenho geral
  const currentDate = new Date();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const daysPassed = currentDate.getDate();
  
  // Calcular meta esperada até o momento (visitas pré-definidas / dias do mês * dias corridos)
  const expectedVisitsSoFar = totals.visitasPreDefinidas > 0 
    ? (totals.visitasPreDefinidas / daysInMonth) * daysPassed 
    : 0;
  
  // Performance média = (visitas realizadas / visitas pré-definidas) * 100
  const performanceMedia = totals.visitasPreDefinidas > 0 
    ? (totals.visitasRealizadas / totals.visitasPreDefinidas) * 100 
    : 0;

  const getPerformanceColor = (percentage: number): "default" | "secondary" | "destructive" => {
    if (percentage >= 80) return 'default';
    if (percentage >= 60) return 'secondary';
    return 'destructive';
  };

  const kpis = [
    {
      title: 'Equipe Ativa',
      value: uniquePromotersCount,
      subtitle: `${uniqueBrands} marcas • ${uniqueCities} cidades`,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Performance Média',
      value: `${performanceMedia.toFixed(1)}%`,
      subtitle: `${totals.visitasRealizadas} de ${totals.visitasPreDefinidas} visitas`,
      icon: Target,
      color: 'text-green-600',
      badge: getPerformanceColor(performanceMedia)
    },
    {
      title: 'Meta Alcançada',
      value: `${Math.round((totals.visitasRealizadas / totals.visitasPreDefinidas) * 100)}%`,
      subtitle: `${uniqueNetworks} redes ativas`,
      icon: TrendingUp,
      color: 'text-purple-600',
      badge: getPerformanceColor(performanceMedia)
    },
    {
      title: 'Valor Processado',
      value: `R$ ${totals.valorPago.toLocaleString('pt-BR')}`,
      subtitle: `de R$ ${totals.valorContrato.toLocaleString('pt-BR')} contratados`,
      icon: DollarSign,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{kpi.value}</div>
              {kpi.badge && (
                <Badge variant={kpi.badge} className="text-xs">
                  {performanceMedia >= 80 ? 'Excelente' : 
                   performanceMedia >= 60 ? 'Boa' : 'Atenção'}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{kpi.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
