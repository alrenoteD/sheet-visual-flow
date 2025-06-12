
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Save, Plus, Trash2, Edit3 } from 'lucide-react';
import { VisitData } from '@/hooks/useGoogleSheets';

interface DataEditorProps {
  data: VisitData[];
  onUpdateData: (data: VisitData[]) => void;
  loading: boolean;
}

export const DataEditor = ({ data, onUpdateData, loading }: DataEditorProps) => {
  const [editingData, setEditingData] = useState<VisitData[]>(data);
  const [editingId, setEditingId] = useState<string | null>(null);

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
      id: (editingData.length + 1).toString(),
      promotor: '',
      visitas: 0,
      concluidas: 0,
      percentual: 0,
      cidade: '',
      marca: '',
      data: new Date().toISOString().split('T')[0]
    };
    const newData = [...editingData, newItem];
    setEditingData(newData);
    setEditingId(newItem.id);
  };

  const updateField = (id: string, field: keyof VisitData, value: string | number) => {
    setEditingData(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'visitas' || field === 'concluidas') {
          updated.percentual = updated.visitas > 0 ? (updated.concluidas / updated.visitas) * 100 : 0;
        }
        return updated;
      }
      return item;
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5" />
            Editor de Dados
          </div>
          <Button onClick={handleAddNew} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Promotor</TableHead>
                <TableHead>Visitas</TableHead>
                <TableHead>Concluídas</TableHead>
                <TableHead>%</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Data</TableHead>
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
                        className="w-full"
                      />
                    ) : (
                      <span className="font-medium">{item.promotor}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input
                        type="number"
                        value={item.visitas}
                        onChange={(e) => updateField(item.id, 'visitas', parseInt(e.target.value) || 0)}
                        className="w-20"
                      />
                    ) : (
                      item.visitas
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input
                        type="number"
                        value={item.concluidas}
                        onChange={(e) => updateField(item.id, 'concluidas', parseInt(e.target.value) || 0)}
                        className="w-20"
                      />
                    ) : (
                      item.concluidas
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.percentual >= 40 ? "default" : "secondary"}>
                      {item.percentual.toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input
                        value={item.cidade}
                        onChange={(e) => updateField(item.id, 'cidade', e.target.value)}
                        className="w-32"
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
                      />
                    ) : (
                      item.marca
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input
                        type="date"
                        value={item.data}
                        onChange={(e) => updateField(item.id, 'data', e.target.value)}
                        className="w-36"
                      />
                    ) : (
                      new Date(item.data).toLocaleDateString('pt-BR')
                    )}
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
      </CardContent>
    </Card>
  );
};
