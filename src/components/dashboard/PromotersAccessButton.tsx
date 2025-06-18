
import { Button } from '@/components/ui/button';
import { Users, ChevronRight } from 'lucide-react';

interface PromotersAccessButtonProps {
  onClick: () => void;
}

export const PromotersAccessButton = ({ onClick }: PromotersAccessButtonProps) => {
  return (
    <div className="fixed top-1/2 right-0 transform -translate-y-1/2 z-30">
      <Button
        onClick={onClick}
        className="rounded-l-full rounded-r-none px-6 py-8 bg-primary/90 hover:bg-primary shadow-lg backdrop-blur-sm border-l border-t border-b border-primary/20"
        size="lg"
      >
        <div className="flex flex-col items-center gap-2">
          <Users className="w-6 h-6" />
          <span className="text-xs font-medium">Promotores</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </Button>
    </div>
  );
};
