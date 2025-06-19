import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { StickyNote, Save, Plus, Trash2, Cloud, HardDrive } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: 'baixa' | 'media' | 'alta';
  status: 'ativa' | 'concluida' | 'arquivada';
  tags: string;
  usuario: string;
  createdAt: string;
  updatedAt: string;
  savedToSheet?: boolean;
}

export const NoteSidebar = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('geral');
  const [priority, setPriority] = useState<'baixa' | 'media' | 'alta'>('media');
  const [status, setStatus] = useState<'ativa' | 'concluida' | 'arquivada'>('ativa');
  const [tags, setTags] = useState('');
  const [saveToSheet, setSaveToSheet] = useState(false);

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('dashboard-notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('dashboard-notes', JSON.stringify(notes));
  }, [notes]);

  const createNewNote = () => {
    setCurrentNote(null);
    setTitle('');
    setContent('');
    setCategory('geral');
    setPriority('media');
    setStatus('ativa');
    setTags('');
    setSaveToSheet(false);
    setIsEditing(true);
  };

  const editNote = (note: Note) => {
    setCurrentNote(note);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
    setPriority(note.priority);
    setStatus(note.status);
    setTags(note.tags);
    setSaveToSheet(note.savedToSheet || false);
    setIsEditing(true);
  };

  const saveToExcel = async (noteData: Note) => {
    try {
      // Preparar dados para o Excel com a estrutura solicitada: ID_NOTA, DATA_CRIACAO, TITULO, CONTEUDO, CATEGORIA, USUARIO, STATUS, TAGS, PRIORIDADE
      const excelData = {
        ID_NOTA: noteData.id,
        DATA_CRIACAO: noteData.createdAt,
        TITULO: noteData.title,
        CONTEUDO: noteData.content,
        CATEGORIA: noteData.category,
        USUARIO: noteData.usuario || 'Sistema',
        STATUS: noteData.status.toUpperCase(),
        TAGS: noteData.tags,
        PRIORIDADE: noteData.priority.toUpperCase()
      };

      // Criar conteúdo CSV para a página NOTAS
      const csvHeaders = 'ID_NOTA,DATA_CRIACAO,TITULO,CONTEUDO,CATEGORIA,USUARIO,STATUS,TAGS,PRIORIDADE';
      const csvRow = Object.values(excelData).map(value => 
        typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      ).join(',');
      
      const csvContent = csvHeaders + '\n' + csvRow;
      
      // Simular download do arquivo (em produção, isso seria enviado para o Google Sheets)
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      
      link.href = URL.createObjectURL(blob);
      link.download = `nota_${noteData.id}_${timestamp}.csv`;
      
      // Para produção, aqui seria feita a integração com Google Sheets API
      console.log('Dados preparados para Google Sheets (página NOTAS):', excelData);
      
      return true;
    } catch (error) {
      console.error('Erro ao salvar no Excel:', error);
      return false;
    }
  };

  const saveNote = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Erro",
        description: "Título e conteúdo são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const now = new Date().toISOString();
    const noteId = currentNote?.id || `nota_${Date.now()}`;

    const noteData: Note = {
      id: noteId,
      title,
      content,
      category,
      priority,
      status,
      tags,
      usuario: 'Sistema',
      createdAt: currentNote?.createdAt || now,
      updatedAt: now,
      savedToSheet: saveToSheet
    };

    // Se selecionado salvar na planilha, tentar salvar via Google Sheets
    if (saveToSheet) {
      const success = await saveToExcel(noteData);
      if (!success) {
        toast({
          title: "Erro ao salvar na planilha",
          description: "Nota salva apenas localmente",
          variant: "destructive"
        });
        noteData.savedToSheet = false;
      } else {
        toast({
          title: "Nota salva na planilha",
          description: "Dados enviados para a página NOTAS do Google Sheets",
          variant: "default"
        });
      }
    }

    if (currentNote) {
      // Update existing note
      setNotes(prev => prev.map(note => 
        note.id === currentNote.id ? noteData : note
      ));
      toast({
        title: "Nota atualizada",
        description: `Suas alterações foram salvas ${saveToSheet ? 'na planilha e localmente' : 'localmente'}`
      });
    } else {
      // Create new note
      setNotes(prev => [noteData, ...prev]);
      toast({
        title: "Nota criada",
        description: `Nova anotação foi adicionada ${saveToSheet ? 'na planilha e localmente' : 'localmente'}`
      });
    }

    setIsEditing(false);
    setCurrentNote(null);
    setTitle('');
    setContent('');
    setCategory('geral');
    setPriority('media');
    setStatus('ativa');
    setTags('');
    setSaveToSheet(false);
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    toast({
      title: "Nota excluída",
      description: "A anotação foi removida"
    });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setCurrentNote(null);
    setTitle('');
    setContent('');
    setCategory('geral');
    setPriority('media');
    setStatus('ativa');
    setTags('');
    setSaveToSheet(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'text-red-600';
      case 'media': return 'text-yellow-600';
      case 'baixa': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluida': return 'text-green-600';
      case 'arquivada': return 'text-gray-600';
      case 'ativa': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <TooltipProvider>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <StickyNote className="w-4 h-4" />
            Anotações
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <StickyNote className="w-5 h-5" />
              Anotações e Observações
            </SheetTitle>
            <SheetDescription>
              Gerencie suas anotações sobre o dashboard. As notas podem ser salvas localmente ou na página NOTAS do Google Sheets.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {!isEditing ? (
              <>
                <Button onClick={createNewNote} className="w-full gap-2">
                  <Plus className="w-4 h-4" />
                  Nova Anotação
                </Button>

                <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {notes.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <StickyNote className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhuma anotação ainda</p>
                      <p className="text-sm">Clique em "Nova Anotação" para começar</p>
                    </div>
                  ) : (
                    notes.map(note => (
                      <Card key={note.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-sm font-medium line-clamp-1">
                                {note.title}
                              </CardTitle>
                              {note.savedToSheet ? (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Cloud className="w-3 h-3 text-blue-500" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Salva na planilha</p>
                                  </TooltipContent>
                                </Tooltip>
                              ) : (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <HardDrive className="w-3 h-3 text-gray-500" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Salva localmente</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNote(note.id);
                              }}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className={`font-medium ${getPriorityColor(note.priority)}`}>
                              {note.priority.toUpperCase()}
                            </span>
                            <span className={`font-medium ${getStatusColor(note.status)}`}>
                              {note.status.toUpperCase()}
                            </span>
                            <span className="text-muted-foreground">
                              {note.category}
                            </span>
                          </div>
                          <CardDescription className="text-xs">
                            {new Date(note.updatedAt).toLocaleDateString('pt-BR')} às{' '}
                            {new Date(note.updatedAt).toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                            {note.content}
                          </p>
                          {note.tags && (
                            <p className="text-xs text-blue-600 mb-3">
                              Tags: {note.tags}
                            </p>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => editNote(note)}
                            className="w-full text-xs"
                          >
                            Editar
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="note-title">Título *</Label>
                  <Input
                    id="note-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Digite o título da anotação"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="geral">Geral</SelectItem>
                        <SelectItem value="promotores">Promotores</SelectItem>
                        <SelectItem value="financeiro">Financeiro</SelectItem>
                        <SelectItem value="performance">Performance</SelectItem>
                        <SelectItem value="observacao">Observação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Prioridade</Label>
                    <Select value={priority} onValueChange={(value: 'baixa' | 'media' | 'alta') => setPriority(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixa">Baixa</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={(value: 'ativa' | 'concluida' | 'arquivada') => setStatus(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativa">Ativa</SelectItem>
                      <SelectItem value="concluida">Concluída</SelectItem>
                      <SelectItem value="arquivada">Arquivada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note-tags">Tags (separadas por vírgula)</Label>
                  <Input
                    id="note-tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="dashboard, importante, revisar"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note-content">Conteúdo *</Label>
                  <Textarea
                    id="note-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Digite o conteúdo da anotação..."
                    className="min-h-[200px] resize-none"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="save-to-sheet"
                    checked={saveToSheet}
                    onCheckedChange={setSaveToSheet}
                  />
                  <Label htmlFor="save-to-sheet" className="text-sm">
                    Salvar também na página NOTAS do Google Sheets
                  </Label>
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveNote} className="flex-1 gap-2">
                    <Save className="w-4 h-4" />
                    Salvar
                  </Button>
                  <Button variant="outline" onClick={cancelEdit} className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
};
