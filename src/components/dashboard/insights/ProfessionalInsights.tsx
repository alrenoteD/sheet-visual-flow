
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Target, Users } from 'lucide-react';
import { VisitData } from '@/types/VisitData';

interface ProfessionalInsightsProps {
  data: VisitData[];
}

export const ProfessionalInsights = ({ data }: ProfessionalInsightsProps) => {
  const totalVisitasPreDefinidas = data.reduce((sum, item) => sum + item.visitasPreDefinidas, 0);
  const totalVisitasRealizadas = data.reduce((sum, item) => sum + item.visitasRealizadas, 0);
  const averageCompletion = totalVisitasPreDefinidas > 0 ? (totalVisitasRealizadas / totalVisitasPreDefinidas) * 100 : 0;

  // Cálculo de cumprimento mensal
  const currentDate = new Date();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const daysPassed = currentDate.getDate();
  const expectedDaily = totalVisitasPreDefinidas / daysInMonth;
  const expectedSoFar = expectedDaily * daysPassed;
  const monthlyCompliance = expectedSoFar > 0 ? (totalVisitasRealizadas / expectedSoFar) * 100 : 0;

  // Análise de performance por promotor
  const promotorPerformance = data.map(item => ({
    ...item,
    efficiency: item.percentual
  })).sort((a, b) => b.efficiency - a.efficiency);

  const topPerformers = promotorPerformance.slice(0, 3);
  const underPerformers = promotorPerformance.filter(p => p.efficiency < 50);

  // Análise financeira
  const totalValorContrato = data.reduce((sum, item) => sum + item.valorContrato, 0);
  const totalValorPago = data.reduce((sum, item) => sum + item.valorPago, 0);
  const pendingPayment = totalValorContrato - totalValorPago;

  const insights = [
    {
      type: monthlyCompliance >= 100 ? 'success' : monthlyCompliance >= 80 ? 'warning' : 'danger',
      icon: monthlyCompliance >= 100 ? CheckCircle : monthlyCompliance >= 80 ? Target : AlertTriangle,
      title: 'Cumprimento Mensal',
      description: `${monthlyCompliance.toFixed(1)}% do planejado para o período`,
      recommendation: monthlyCompliance < 80 ? 
        'Acelerar ritmo de visitas para atingir meta mensal' : 
        monthlyCompliance < 100 ? 
        'Manter ritmo atual para atingir meta' : 
        'Excelente! Meta sendo superada'
    },
    {
      type: averageCompletion >= 75 ? 'success' : averageCompletion >= 50 ? 'warning' : 'danger',
      icon: averageCompletion >= 75 ? TrendingUp : TrendingDown,
      title: 'Performance Geral',
      description: `${averageCompletion.toFixed(1)}% de conclusão média`,
      recommendation: averageCompletion < 50 ? 
        'Revisar estratégia e capacitação da equipe' : 
        averageCompletion < 75 ? 
        'Focar nos promotores com menor performance' : 
        'Manter estratégia atual'
    },
    {
      type: underPerformers.length === 0 ? 'success' : underPerformers.length <= 2 ? 'warning' : 'danger',
      icon: Users,
      title: 'Análise da Equipe',
      description: `${underPerformers.length} promotor(es) com performance abaixo de 50%`,
      recommendation: underPerformers.length > 0 ? 
        'Implementar plano de desenvolvimento para promotores com baixa performance' : 
        'Equipe com performance consistente'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <Card key={index} className={`border-l-4 ${
            insight.type === 'success' ? 'border-l-green-500' : 
            insight.type === 'warning' ? 'border-l-yellow-500' : 
            'border-l-red-500'
          }`}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <insight.icon className={`w-4 h-4 ${
                  insight.type === 'success' ? 'text-green-500' : 
                  insight.type === 'warning' ? 'text-yellow-500' : 
                  'text-red-500'
                }`} />
                {insight.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
              <p className="text-xs">{insight.recommendation}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topPerformers.map((performer, index) => (
              <div key={performer.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <div>
                  <span className="font-medium">{performer.promotor.split(' ')[0]}</span>
                  <span className="text-sm text-muted-foreground ml-2">{performer.marca}</span>
                </div>
                <Badge variant={index === 0 ? 'default' : 'secondary'}>
                  {performer.efficiency.toFixed(1)}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Financeiro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">R$ {totalValorContrato.toLocaleString('pt-BR')}</p>
              <p className="text-sm text-muted-foreground">Total Contratado</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-500">R$ {totalValorPago.toLocaleString('pt-BR')}</p>
              <p className="text-sm text-muted-foreground">Já Pago</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-500">R$ {pendingPayment.toLocaleString('pt-BR')}</p>
              <p className="text-sm text-muted-foreground">Pendente</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
