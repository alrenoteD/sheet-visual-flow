
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Save, Plus, Trash2, Edit3 } from 'lucide-react';
import { VisitData } from '@/types/VisitData';
import { VisitDatesEditor } from './VisitDatesEditor';

interface DataEditorProps {
  data: VisitData[];
  onUpdateData: (data: VisitData[]) => void;
  loading: boolean;
}

export const DataEditor = ({ data, onUpdateData, loading }: DataEditorProps) => {
  const [editingData, setEditingData] = useState<VisitData[]>(data);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Atualizar editingData quando data mudar
  useState(() => {
    setEditingData(data);
  });

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleSave = (id: string) => {
    setEditingId(null);
    onUpdateData(editingData);
  };

  const handleCancel = () => {
    setEditingData(data);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    const newData = editingData.filter(item => item.id !== id);
    setEditingData(newData);
    onUpdateData(newData);
  };

  const handleAddNew = () => {
    const newItem: VisitData = {
      id: Date.now().toString(), // Usar timestamp para ID único
      promotor: '',
      rede: '',
      cidade: '',
      marca: '',
      visitasPreDefinidas: 0,
      visitasRealizadas: 0,
      percentual: 0,
      telefone: '',
      dataInicio: new Date().toISOString().split('T')[0],
      valorContrato: 0,
      valorPorVisita: 0,
      valorPago: 0,
      datasVisitas: []
    };
    const newData = [...editingData, newItem];
    setEditingData(newData);
    setEditingId(newItem.id);
  };

  const updateField = (id: string, field: keyof VisitData, value: string | number | string[]) => {
    setEditingData(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        
        // Recalcular campos dependentes
        if (field === 'visitasPreDefinidas' || field === 'valorContrato') {
          updated.valorPorVisita = updated.visitasPreDefinidas > 0 ? updated.valorContrato / updated.visitasPreDefinidas : 0;
        }
        
        if (field === 'datasVisitas') {
          updated.visitasRealizadas = updated.datasVisitas.length;
          updated.percentual = updated.visitasPreDefinidas > 0 ? (updated.visitasRealizadas / updated.visitasPreDefinidas) * 100 : 0;
        }
        
        updated.valorPago = updated.visitasRealizadas * updated.valorPorVisita;
        
        return updated;
      }
      return item;
    }));
  };

  const updateVisitDates = (id: string, newDates: string[]) => {
    updateField(id, 'datasVisitas', newDates);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5" />
            Editor de Dados - Controle Completo
          </div>
          <Button onClick={handleAddNew} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Promotores consolidados:</strong> Registros com nomes idênticos são tratados como a mesma pessoa.
            Edite as datas de visitas clicando no botão de visitas.
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Promotor/Agência</TableHead>
                <TableHead>Rede</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Pré-def.</TableHead>
                <TableHead>Realiz.</TableHead>
                <TableHead>%</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Valor Contrato</TableHead>
                <TableHead>Valor Pago</TableHead>
                <TableHead>Visitas</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {editingData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input
                        value={item.promotor}
                        onChange={(e) => updateField(item.id, 'promotor', e.target.value)}
                        className="w-40"
                        placeholder="Nome do promotor"
                      />
                    ) : (
                      <span className="font-medium">{item.promotor}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input
                        value={item.rede}
                        onChange={(e) => updateField(item.id, 'rede', e.target.value)}
                        className="w-32"
                        placeholder="Rede"
                      />
                    ) : (
                      item.rede
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input
                        value={item.cidade}
                        onChange={(e) => updateField(item.id, 'cidade', e.target.value)}
                        className="w-32"
                        placeholder="Cidade"
                      />
                    ) : (
                      item.cidade
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input
                        value={item.marca}
                        onChange={(e) => updateField(item.id, 'marca', e.target.value)}
                        className="w-24"
                        placeholder="Marca"
                      />
                    ) : (
                      item.marca
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input
                        type="number"
                        value={item.visitasPreDefinidas}
                        onChange={(e) => updateField(item.id, 'visitasPreDefinidas', parseInt(e.target.value) || 0)}
                        className="w-20"
                        min="0"
                      />
                    ) : (
                      item.visitasPreDefinidas
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.visitasRealizadas >= item.visitasPreDefinidas ? "default" : "secondary"}>
                      {item.visitasRealizadas}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.percentual >= 80 ? "default" : item.percentual >= 50 ? "secondary" : "destructive"}>
                      {item.percentual.toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input
                        value={item.telefone}
                        onChange={(e) => updateField(item.id, 'telefone', e.target.value)}
                        className="w-32"
                        placeholder="Telefone"
                      />
                    ) : (
                      item.telefone
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input
                        type="number"
                        value={item.valorContrato}
                        onChange={(e) => updateField(item.id, 'valorContrato', parseFloat(e.target.value) || 0)}
                        className="w-32"
                        min="0"
                        step="0.01"
                      />
                    ) : (
                      `R$ ${item.valorContrato.toLocaleString('pt-BR')}`
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      R$ {item.valorPago.toLocaleString('pt-BR')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <VisitDatesEditor
                      dates={item.datasVisitas}
                      onDatesChange={(newDates) => updateVisitDates(item.id, newDates)}
                      promotorName={item.promotor}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {editingId === item.id ? (
                        <>
                          <Button size="sm" onClick={() => handleSave(item.id)} disabled={loading}>
                            <Save className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancel}>
                            ✕
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(item.id)}>
                            <Edit3 className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {editingData.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhum promotor encontrado. Clique em "Adicionar" para criar o primeiro registro.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
