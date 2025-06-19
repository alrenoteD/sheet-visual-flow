
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { DollarSign, TrendingUp, Users, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { VisitData } from '@/types/VisitData';
import { useState } from 'react';

interface FinancialAnalysisProps {
  data: VisitData[];
}

export const FinancialAnalysis = ({ data }: FinancialAnalysisProps) => {
  const [selectedFilter, setSelectedFilter] = useState('geral');

  // Análise financeira por promotor (agrupado por ID_PROMOTOR)
  const financialAnalysis = data.reduce((acc, item) => {
    const key = item.idPromotor || item.promotor;
    if (!acc[key]) {
      acc[key] = {
        idPromotor: key,
        nome: item.promotor,
        totalVisitasPreDefinidas: 0,
        totalVisitasRealizadas: 0,
        valorContrato: 0,
        registros: []
      };
    }
    acc[key].totalVisitasPreDefinidas += item.visitasPreDefinidas;
    acc[key].totalVisitasRealizadas += item.visitasRealizadas;
    acc[key].valorContrato += item.valorContrato;
    acc[key].registros.push(item);
    return acc;
  }, {} as Record<string, any>);

  const financialData = Object.values(financialAnalysis).map((promoter: any) => {
    const valorPorVisita = promoter.totalVisitasPreDefinidas > 0 ? promoter.valorContrato / promoter.totalVisitasPreDefinidas : 0;
    const valorAPagar = promoter.totalVisitasRealizadas * valorPorVisita;
    const valorPendente = promoter.valorContrato - valorAPagar;
    const percentualCumprimento = promoter.totalVisitasPreDefinidas > 0 ? (promoter.totalVisitasRealizadas / promoter.totalVisitasPreDefinidas) * 100 : 0;

    return {
      idPromotor: promoter.idPromotor,
      nome: promoter.nome,
      valorContrato: promoter.valorContrato,
      valorAPagar,
      valorPendente,
      valorPorVisita,
      visitasRealizadas: promoter.totalVisitasRealizadas,
      visitasPreDefinidas: promoter.totalVisitasPreDefinidas,
      percentualCumprimento,
      registros: promoter.registros
    };
  });

  // Filtrar dados baseado na seleção
  const filteredData = selectedFilter === 'geral' ? financialData : 
    financialData.filter(item => 
      item.idPromotor.toLowerCase().includes(selectedFilter.toLowerCase()) ||
      item.nome.toLowerCase().includes(selectedFilter.toLowerCase())
    );

  // Totais gerais
  const totals = filteredData.reduce((acc, item) => {
    acc.valorContrato += item.valorContrato;
    acc.valorAPagar += item.valorAPagar;
    acc.valorPendente += item.valorPendente;
    acc.visitasRealizadas += item.visitasRealizadas;
    acc.visitasPreDefinidas += item.visitasPreDefinidas;
    return acc;
  }, {
    valorContrato: 0,
    valorAPagar: 0,
    valorPendente: 0,
    visitasRealizadas: 0,
    visitasPreDefinidas: 0
  });

  // Dados para gráficos
  const paymentStatusData = [
    { name: 'A Pagar', value: totals.valorAPagar, color: '#22c55e' },
    { name: 'Pendente', value: totals.valorPendente, color: '#f59e0b' }
  ];

  const topEarners = filteredData
    .sort((a, b) => b.valorAPagar - a.valorAPagar)
    .slice(0, 10);

  // Opções de filtro
  const filterOptions = [
    { value: 'geral', label: 'Geral' },
    ...Array.from(new Set(financialData.map(item => item.idPromotor)))
      .map(id => ({ value: id, label: id }))
  ];

  return (
    <div className="space-y-6">
      {/* Filtro */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Análise Financeira
            </span>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Filtrar por..." />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Cards de Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total Contratado</CardTitle>
            <CreditCard className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totals.valorContrato.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">
              {filteredData.length} promotores
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor a Pagar</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">R$ {totals.valorAPagar.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">
              {totals.visitasRealizadas} visitas realizadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Pendente</CardTitle>
            <AlertCircle className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">R$ {totals.valorPendente.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">
              {totals.visitasPreDefinidas - totals.visitasRealizadas} visitas pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">% Cumprimento</CardTitle>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totals.visitasPreDefinidas > 0 ? ((totals.visitasRealizadas / totals.visitasPreDefinidas) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Performance geral
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição de Pagamentos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Valores</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: R$ ${value.toLocaleString('pt-BR')}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status de Pagamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium">A Pagar</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">R$ {totals.valorAPagar.toLocaleString('pt-BR')}</p>
                  <p className="text-sm text-muted-foreground">
                    {((totals.valorAPagar / totals.valorContrato) * 100).toFixed(1)}% do total
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <span className="font-medium">Pendente</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-600">R$ {totals.valorPendente.toLocaleString('pt-BR')}</p>
                  <p className="text-sm text-muted-foreground">
                    {((totals.valorPendente / totals.valorContrato) * 100).toFixed(1)}% do total
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Earners */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Top 10 - Maiores Valores a Receber
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topEarners}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="nome" 
                stroke="hsl(var(--muted-foreground))" 
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={10}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, '']}
              />
              <Bar dataKey="valorAPagar" fill="#22c55e" name="Valor a Pagar" />
              <Bar dataKey="valorPendente" fill="#f59e0b" name="Valor Pendente" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detalhamento por Promotor */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento Financeiro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredData.slice(0, 10).map((promoter) => (
              <div key={promoter.idPromotor} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{promoter.nome}</h4>
                    <p className="text-sm text-muted-foreground">ID: {promoter.idPromotor}</p>
                  </div>
                  <Badge variant={promoter.percentualCumprimento >= 70 ? 'default' : 'secondary'}>
                    {promoter.percentualCumprimento.toFixed(1)}% cumprimento
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Valor Contrato</p>
                    <p className="font-medium">R$ {promoter.valorContrato.toLocaleString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Valor por Visita</p>
                    <p className="font-medium">R$ {promoter.valorPorVisita.toLocaleString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">A Pagar</p>
                    <p className="font-medium text-green-600">R$ {promoter.valorAPagar.toLocaleString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Pendente</p>
                    <p className="font-medium text-orange-600">R$ {promoter.valorPendente.toLocaleString('pt-BR')}</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {promoter.visitasRealizadas}/{promoter.visitasPreDefinidas} visitas realizadas
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
