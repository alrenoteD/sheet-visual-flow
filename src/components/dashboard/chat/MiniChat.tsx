
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';

interface MiniChatProps {
  data: any;
}

export const MiniChat = ({ data }: MiniChatProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-full p-3"
        size="lg"
      >
        <MessageCircle className="w-5 h-5" />
      </Button>
    );
  }

  if (isMinimized) {
    return (
      <div className="flex gap-2">
        <Button
          onClick={() => setIsMinimized(false)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-full p-3"
          size="lg"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => setIsVisible(false)}
          variant="outline"
          className="rounded-full p-3"
          size="lg"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="w-80 shadow-xl border-2 border-blue-200 bg-white/95 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          <CardTitle className="text-sm font-medium">Chat Rápido</CardTitle>
          <Badge variant="secondary" className="text-xs">Beta</Badge>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setIsMinimized(true)}
          >
            <Minimize2 className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setIsVisible(false)}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground">
          💬 Converse rapidamente com o assistente sobre seus dados
        </div>
        
        <div className="bg-muted/50 rounded-lg p-3 text-sm">
          <p className="text-center text-muted-foreground">
            🔧 Chat rápido em desenvolvimento
          </p>
          <p className="text-xs text-center text-muted-foreground mt-1">
            Use a aba "Assistente" para chat completo
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <p className="text-lg font-bold text-blue-600">{data?.length || 0}</p>
            <p className="text-xs text-muted-foreground">Registros</p>
          </div>
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <p className="text-lg font-bold text-green-600">
              {data ? Math.round((data.reduce((sum: number, item: any) => sum + item.visitasRealizadas, 0) / data.reduce((sum: number, item: any) => sum + item.visitasPreDefinidas, 0)) * 100) || 0 : 0}%
            </p>
            <p className="text-xs text-muted-foreground">Performance</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
