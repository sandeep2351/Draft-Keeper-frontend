
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, FileText, Save, Loader2 } from 'lucide-react';
import { useDraft } from '@/contexts/DraftContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  const { createDraft, currentDraft, saveDraftToCloud } = useDraft();

  return (
    <header className="border-b border-border bg-background">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <FileText className="h-6 w-6 text-indigo-600 mr-2" />
            <h1 className="text-xl font-semibold">Draft Keeper</h1>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          {isLoading ? (
            <Button 
              variant="outline" 
              size="sm"
              disabled
              className="flex items-center gap-2"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </Button>
          ) : isAuthenticated ? (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => createDraft()}
              >
                New Draft
              </Button>
              
              {currentDraft && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => saveDraftToCloud(currentDraft.id)}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save to Drive
                </Button>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full overflow-hidden">
                    {user?.picture ? (
                      <img 
                        src={user.picture} 
                        alt={user.name} 
                        className="h-8 w-8 rounded-full" 
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user?.name && <p className="font-medium">{user.name}</p>}
                      {user?.email && <p className="text-sm text-muted-foreground">{user.email}</p>}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/drafts" className="w-full cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" />
                      My Drafts
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button 
              onClick={() => login()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Sign in with Google
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
