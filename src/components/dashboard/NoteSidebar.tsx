
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StickyNote, Save, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const NoteSidebar = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

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
    setIsEditing(true);
  };

  const editNote = (note: Note) => {
    setCurrentNote(note);
    setTitle(note.title);
    setContent(note.content);
    setIsEditing(true);
  };

  const saveNote = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Erro",
        description: "Título e conteúdo são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const now = new Date().toISOString();

    if (currentNote) {
      // Update existing note
      setNotes(prev => prev.map(note => 
        note.id === currentNote.id 
          ? { ...note, title, content, updatedAt: now }
          : note
      ));
      toast({
        title: "Nota atualizada",
        description: "Suas alterações foram salvas"
      });
    } else {
      // Create new note
      const newNote: Note = {
        id: Date.now().toString(),
        title,
        content,
        createdAt: now,
        updatedAt: now
      };
      setNotes(prev => [newNote, ...prev]);
      toast({
        title: "Nota criada",
        description: "Nova anotação foi adicionada"
      });
    }

    setIsEditing(false);
    setCurrentNote(null);
    setTitle('');
    setContent('');
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
  };

  return (
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
            Gerencie suas anotações sobre o dashboard. As notas são salvas localmente no navegador.
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
                          <CardTitle className="text-sm font-medium line-clamp-1">
                            {note.title}
                          </CardTitle>
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
                <Label htmlFor="note-title">Título</Label>
                <Input
                  id="note-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Digite o título da anotação"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="note-content">Conteúdo</Label>
                <Textarea
                  id="note-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Digite o conteúdo da anotação..."
                  className="min-h-[300px] resize-none"
                />
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
  );
};
