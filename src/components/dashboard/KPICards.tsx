
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MapPin, 
  Target, 
  Activity,
  Building2,
  DollarSign,
  Database
} from 'lucide-react';
import { VisitData } from '@/types/VisitData';

interface KPICardsProps {
  data: VisitData[];
  isConnected: boolean;
}

export const KPICards = ({ data, isConnected }: KPICardsProps) => {
  const totalVisitasPreDefinidas = data.reduce((sum, item) => sum + item.visitasPreDefinidas, 0);
  const totalVisitasRealizadas = data.reduce((sum, item) => sum + item.visitasRealizadas, 0);
  const averageCompletion = totalVisitasPreDefinidas > 0 ? (totalVisitasRealizadas / totalVisitasPreDefinidas) * 100 : 0;
  const totalValorContratos = data.reduce((sum, item) => sum + item.valorContrato, 0);
  const totalValorPago = data.reduce((sum, item) => sum + item.valorPago, 0);
  const cidadesUnicas = [...new Set(data.map(item => item.cidade))].length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      <Card className="bg-gradient-to-br from-primary/20 to-chart-1/20 border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Visitas Pré-definidas</CardTitle>
          <Target className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalVisitasPreDefinidas}</div>
          <p className="text-xs text-muted-foreground">
            {isConnected ? 'Dados do Google Sheets' : 'Dados de exemplo'}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-chart-1/20 to-chart-2/20 border-chart-1/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Visitas Realizadas</CardTitle>
          <Activity className="h-4 w-4 text-chart-1" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalVisitasRealizadas}</div>
          <p className="text-xs text-muted-foreground">
            {averageCompletion.toFixed(1)}% taxa de conclusão
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-chart-2/20 to-chart-3/20 border-chart-2/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Promotores/Agências</CardTitle>
          <Users className="h-4 w-4 text-chart-2" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.length}</div>
          <p className="text-xs text-muted-foreground">
            Equipe ativa
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-chart-3/20 to-chart-4/20 border-chart-3/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cidades</CardTitle>
          <MapPin className="h-4 w-4 text-chart-3" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{cidadesUnicas}</div>
          <p className="text-xs text-muted-foreground">
            Área de cobertura
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-chart-4/20 to-chart-5/20 border-chart-4/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Contratos</CardTitle>
          <DollarSign className="h-4 w-4 text-chart-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ {totalValorContratos.toLocaleString('pt-BR')}</div>
          <p className="text-xs text-muted-foreground">
            Total contratado
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-chart-5/20 to-primary/20 border-chart-5/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Pago</CardTitle>
          <DollarSign className="h-4 w-4 text-chart-5" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ {totalValorPago.toLocaleString('pt-BR')}</div>
          <p className="text-xs text-muted-foreground">
            Pagamentos realizados
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
