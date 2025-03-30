
import React from 'react';
import { useDraft } from '@/contexts/DraftContext';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Trash2, Save } from 'lucide-react';

const Sidebar = () => {
  const { drafts, currentDraft, setCurrentDraft, deleteDraft, saveDraftToCloud } = useDraft();

  if (drafts.length === 0) {
    return (
      <div className="w-64 border-r border-border h-full p-4 flex flex-col">
        <h2 className="font-semibold mb-4">My Drafts</h2>
        <div className="flex-1 flex items-center justify-center text-center text-muted-foreground">
          <p className="text-sm">No drafts yet. Create your first draft to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 border-r border-border h-full p-4 flex flex-col">
      <h2 className="font-semibold mb-4">My Drafts</h2>
      <div className="flex-1 overflow-y-auto">
        {drafts.map((draft) => (
          <div 
            key={draft.id}
            className={cn(
              "p-3 mb-2 rounded-md cursor-pointer border",
              currentDraft?.id === draft.id 
                ? "bg-indigo-50 border-indigo-200" 
                : "hover:bg-gray-50 border-transparent"
            )}
            onClick={() => setCurrentDraft(draft)}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-sm truncate flex-1">{draft.title}</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      saveDraftToCloud(draft.id);
                    }}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save to Drive
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDraft(draft.id);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(draft.updatedAt), { addSuffix: true })}
              </span>
              {draft.savedToCloud && (
                <span className="text-xs text-indigo-600 flex items-center">
                  <Save className="h-3 w-3 mr-1" />
                  Saved
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
