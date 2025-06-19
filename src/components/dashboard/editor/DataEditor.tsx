import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, Upload } from 'lucide-react';
import { VisitData } from '@/types/VisitData';
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface DataEditorProps {
  data: VisitData[];
  onDataUpdate: (newData: VisitData[]) => void;
}

interface PromoterForm {
  idPromotor: string;
  promotor: string;
  rede: string;
  cidade: string;
  marca: string;
  visitasPreDefinidas: number;
  telefone: string;
  dataInicio: string;
  valorContrato: number;
}

export const DataEditor = ({ data, onDataUpdate }: DataEditorProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VisitData | null>(null);
  const [formData, setFormData] = useState<PromoterForm>({
    idPromotor: '',
    promotor: '',
    rede: '',
    cidade: '',
    marca: '',
    visitasPreDefinidas: 0,
    telefone: '',
    dataInicio: '',
    valorContrato: 0
  });

  const resetForm = useCallback(() => {
    setFormData({
      idPromotor: '',
      promotor: '',
      rede: '',
      cidade: '',
      marca: '',
      visitasPreDefinidas: 0,
      telefone: '',
      dataInicio: '',
      valorContrato: 0
    });
  }, []);

  const handleFormChange = useCallback((field: keyof PromoterForm, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleAdd = useCallback(() => {
    if (!formData.idPromotor || !formData.promotor || !formData.rede || !formData.cidade || !formData.marca || !formData.telefone) {
      toast({
        title: "Campos Obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const newItem: VisitData = {
      id: `new-${Date.now()}`,
      idPromotor: formData.idPromotor,
      promotor: formData.promotor,
      rede: formData.rede,
      cidade: formData.cidade,
      marca: formData.marca,
      visitasPreDefinidas: formData.visitasPreDefinidas,
      visitasRealizadas: 0,
      percentual: 0,
      telefone: formData.telefone,
      dataInicio: formData.dataInicio,
      valorContrato: formData.valorContrato,
      valorPorVisita: formData.visitasPreDefinidas > 0 ? formData.valorContrato / formData.visitasPreDefinidas : 0,
      valorPago: 0,
      datasVisitas: []
    };

    onDataUpdate([...data, newItem]);
    resetForm();
    setIsAddDialogOpen(false);
    
    toast({
      title: "Sucesso",
      description: "Promotor adicionado com sucesso"
    });
  }, [formData, data, onDataUpdate, resetForm]);

  const handleEdit = useCallback((item: VisitData) => {
    setEditingItem(item);
    setFormData({
      idPromotor: item.idPromotor || '',
      promotor: item.promotor,
      rede: item.rede,
      cidade: item.cidade,
      marca: item.marca,
      visitasPreDefinidas: item.visitasPreDefinidas,
      telefone: item.telefone,
      dataInicio: item.dataInicio,
      valorContrato: item.valorContrato
    });
    setIsEditDialogOpen(true);
  }, []);

  const handleUpdate = () => {
    if (!editingItem) return;

    const updatedData = data.map(item => 
      item.id === editingItem.id 
        ? {
            ...item,
            idPromotor: formData.idPromotor,
            promotor: formData.promotor,
            rede: formData.rede,
            cidade: formData.cidade,
            marca: formData.marca,
            visitasPreDefinidas: formData.visitasPreDefinidas,
            telefone: formData.telefone,
            dataInicio: formData.dataInicio,
            valorContrato: formData.valorContrato,
            valorPorVisita: formData.visitasPreDefinidas > 0 ? formData.valorContrato / formData.visitasPreDefinidas : 0,
            percentual: formData.visitasPreDefinidas > 0 ? (item.visitasRealizadas / formData.visitasPreDefinidas) * 100 : 0
          }
        : item
    );

    onDataUpdate(updatedData);
    resetForm();
    setIsEditDialogOpen(false);
    setEditingItem(null);
    
    toast({
      title: "Sucesso",
      description: "Dados atualizados com sucesso"
    });
  };

  const handleDelete = (id: string) => {
    const updatedData = data.filter(item => item.id !== id);
    onDataUpdate(updatedData);
    
    toast({
      title: "Sucesso",
      description: "Item removido com sucesso"
    });
  };

  // Agrupar dados por ID_PROMOTOR para evitar duplicatas na visualização
  const groupedData = data.reduce((acc, item) => {
    const key = item.idPromotor || item.promotor;
    if (!acc[key]) {
      acc[key] = {
        ...item,
        totalVisitasPreDefinidas: 0,
        totalVisitasRealizadas: 0,
        totalValorContrato: 0,
        registros: []
      };
    }
    acc[key].totalVisitasPreDefinidas += item.visitasPreDefinidas;
    acc[key].totalVisitasRealizadas += item.visitasRealizadas;
    acc[key].totalValorContrato += item.valorContrato;
    acc[key].registros.push(item);
    return acc;
  }, {} as Record<string, any>);

  const displayData = Object.values(groupedData);

  const FormDialog = ({ isOpen, onOpenChange, title, onSubmit }: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    onSubmit: () => void;
  }) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="idPromotor">ID Promotor *</Label>
            <Input
              id="idPromotor"
              value={formData.idPromotor}
              onChange={(e) => handleFormChange('idPromotor', e.target.value)}
              placeholder="ID único do promotor"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="promotor">Promotor/Agência *</Label>
            <Input
              id="promotor"
              value={formData.promotor}
              onChange={(e) => handleFormChange('promotor', e.target.value)}
              placeholder="Nome do promotor"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rede">Rede *</Label>
            <Input
              id="rede"
              value={formData.rede}
              onChange={(e) => handleFormChange('rede', e.target.value)}
              placeholder="Nome da rede"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cidade">Cidade *</Label>
            <Input
              id="cidade"
              value={formData.cidade}
              onChange={(e) => handleFormChange('cidade', e.target.value)}
              placeholder="Nome da cidade"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="marca">Marca *</Label>
            <Input
              id="marca"
              value={formData.marca}
              onChange={(e) => handleFormChange('marca', e.target.value)}
              placeholder="Nome da marca"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone *</Label>
            <Input
              id="telefone"
              value={formData.telefone}
              onChange={(e) => handleFormChange('telefone', e.target.value)}
              placeholder="Número de telefone"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="visitasPreDefinidas">Visitas Pré-Definidas *</Label>
            <Input
              id="visitasPreDefinidas"
              type="number"
              value={formData.visitasPreDefinidas}
              onChange={(e) => handleFormChange('visitasPreDefinidas', parseInt(e.target.value) || 0)}
              placeholder="Número de visitas"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="valorContrato">Valor Contrato</Label>
            <Input
              id="valorContrato"
              type="number"
              step="0.01"
              value={formData.valorContrato}
              onChange={(e) => handleFormChange('valorContrato', parseFloat(e.target.value) || 0)}
              placeholder="Valor do contrato"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="dataInicio">Data Início</Label>
            <Input
              id="dataInicio"
              type="date"
              value={formData.dataInicio}
              onChange={(e) => handleFormChange('dataInicio', e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSubmit}>
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Header com ações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Editor de Dados
            </span>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Promotor
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{displayData.length}</p>
              <p className="text-sm text-muted-foreground">Promotores Únicos</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{data.length}</p>
              <p className="text-sm text-muted-foreground">Total de Registros</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{new Set(data.map(item => item.cidade)).size}</p>
              <p className="text-sm text-muted-foreground">Cidades Ativas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de dados */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Promotores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Promotor</TableHead>
                  <TableHead>Rede</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Visitas</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayData.map((item: any) => {
                  const performance = item.totalVisitasPreDefinidas > 0 ? 
                    (item.totalVisitasRealizadas / item.totalVisitasPreDefinidas) * 100 : 0;
                  
                  return (
                    <TableRow key={item.idPromotor || item.id}>
                      <TableCell className="font-mono text-sm">{item.idPromotor}</TableCell>
                      <TableCell className="font-medium">{item.promotor}</TableCell>
                      <TableCell>{item.rede}</TableCell>
                      <TableCell>{item.cidade}</TableCell>
                      <TableCell>{item.marca}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{item.totalVisitasRealizadas}/{item.totalVisitasPreDefinidas}</div>
                          <div className="text-muted-foreground">
                            {item.registros.length} registro(s)
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={performance >= 70 ? 'default' : 'secondary'}>
                          {performance.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>R$ {item.totalValorContrato.toLocaleString('pt-BR')}</div>
                          <div className="text-muted-foreground">
                            R$ {(item.totalValorContrato / item.totalVisitasPreDefinidas).toFixed(2)}/visita
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(item.registros[0])}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(item.registros[0].id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <FormDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        title="Adicionar Novo Promotor"
        onSubmit={handleAdd}
      />

      <FormDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="Editar Promotor"
        onSubmit={handleUpdate}
      />
    </div>
  );
};
