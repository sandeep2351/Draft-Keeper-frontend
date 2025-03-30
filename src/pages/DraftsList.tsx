import React, { useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useDraft } from '@/contexts/DraftContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { formatDistanceToNow } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Edit2, 
  Trash2, 
  Save,
  Plus,
  ExternalLink,
  Loader2
} from 'lucide-react';

const DraftsList = () => {
  const { isAuthenticated } = useAuth();
  const { 
    drafts, 
    googleDriveDrafts,
    setCurrentDraft, 
    deleteDraft, 
    saveDraftToCloud, 
    createDraft, 
    loadDraftsFromDrive,
    openDraftInDrive,
    isLoading,
    isDriveLoading
  } = useDraft();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      loadDraftsFromDrive();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleEditDraft = (draftId: string) => {
    const draft = drafts.find(d => d.id === draftId);
    if (draft) {
      setCurrentDraft(draft);
      navigate('/editor');
    }
  };

  const handleCreateDraft = () => {
    createDraft();
    navigate('/editor');
  };

  const handleOpenInDrive = (webViewLink: string) => {
    openDraftInDrive(webViewLink);
  };

  const handleRefreshDriveDrafts = () => {
    loadDraftsFromDrive();
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-serif font-medium">My Drafts</h1>
          <Button onClick={handleCreateDraft}>
            <Plus className="mr-2 h-4 w-4" />
            New Draft
          </Button>
        </div>

        <Tabs defaultValue="local" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="local">Local Drafts</TabsTrigger>
            <TabsTrigger value="drive">Google Drive</TabsTrigger>
          </TabsList>
          
          <TabsContent value="local">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : drafts.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-medium mb-2">No drafts yet</h2>
                <p className="text-muted-foreground mb-6">
                  Create your first draft to get started.
                </p>
                <Button onClick={handleCreateDraft}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Draft
                </Button>
              </div>
            ) : (
              <div className="bg-white rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[400px]">Title</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {drafts.map((draft) => (
                      <TableRow key={draft.id}>
                        <TableCell className="font-medium">{draft.title}</TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(draft.updatedAt), { addSuffix: true })}
                        </TableCell>
                        <TableCell>
                          {draft.savedToCloud ? (
                            <span className="inline-flex items-center text-green-600 text-xs font-medium">
                              <Save className="h-3 w-3 mr-1" />
                              Saved to Drive
                            </span>
                          ) : (
                            <span className="text-amber-600 text-xs">Not saved to Drive</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditDraft(draft.id)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => saveDraftToCloud(draft.id)}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            {draft.webViewLink && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleOpenInDrive(draft.webViewLink!)}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => deleteDraft(draft.id)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="drive">
            <div className="flex justify-end mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefreshDriveDrafts}
                disabled={isDriveLoading}
              >
                {isDriveLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Refresh Drive Drafts
              </Button>
            </div>
            
            {isDriveLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : googleDriveDrafts.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-medium mb-2">No drafts in Google Drive</h2>
                <p className="text-muted-foreground mb-6">
                  Save drafts to Google Drive to see them here.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[400px]">Title</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {googleDriveDrafts.map((draft) => (
                      <TableRow key={draft.id}>
                        <TableCell className="font-medium">{draft.title}</TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(draft.updatedAt), { addSuffix: true })}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenInDrive(draft.webViewLink!)}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Open in Drive
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DraftsList;
