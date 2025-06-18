
import { Button } from '@/components/ui/button';
import { Users, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PromotersAccessButtonProps {
  onClick: () => void;
  promotersCount: number;
}

export const PromotersAccessButton = ({ onClick, promotersCount }: PromotersAccessButtonProps) => {
  return (
    <div className="fixed bottom-20 right-4 z-30">
      <Button
        onClick={onClick}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-6 py-3 rounded-full"
        size="lg"
      >
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5" />
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold">Painel de Promotores</span>
            <Badge variant="secondary" className="text-xs mt-1">
              {promotersCount} ativos
            </Badge>
          </div>
          <ArrowRight className="w-4 h-4" />
        </div>
      </Button>
    </div>
  );
};
