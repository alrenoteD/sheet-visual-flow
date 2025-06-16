
import { Button } from '@/components/ui/button';
import { RefreshCw, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { NoteSidebar } from './NoteSidebar';

interface DashboardHeaderProps {
  isConnected: boolean;
  onRefresh: () => void;
}

export const DashboardHeader = ({ isConnected, onRefresh }: DashboardHeaderProps) => {
  const { user, logout } = useAuth();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Brand and Logo Section */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Deylith.dev
            </h1>
            <p className="text-xs text-muted-foreground">
              Agência de automações e Soluções Inteligentes com IA
            </p>
          </div>
          
          {/* Logo placeholder */}
          <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
            <span className="text-xs text-gray-400">Logo</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* User Info */}
        {user && (
          <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full">
            <User className="w-4 h-4" />
            <span className="text-sm font-medium">{user.displayName}</span>
          </div>
        )}

        {/* Notes Sidebar */}
        <NoteSidebar />

        {/* Refresh Button */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={!isConnected}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Sincronizar
        </Button>

        {/* Logout Button */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={logout}
          className="gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </Button>
      </div>
    </div>
  );
};
