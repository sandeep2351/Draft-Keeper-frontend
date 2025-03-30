
import React from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { Editor } from '@/components/Editor';
import { useDraft } from '@/contexts/DraftContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Save, ArrowLeft, ExternalLink } from 'lucide-react';

const DraftEditor = () => {
  const { isAuthenticated } = useAuth();
  const { currentDraft, saveDraftToCloud, openDraftInDrive } = useDraft();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleOpenInDrive = () => {
    if (currentDraft?.webViewLink) {
      openDraftInDrive(currentDraft.webViewLink);
    }
  };

  return (
    <Layout>
      <div className="container max-w-4xl py-8">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/drafts')}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-serif font-medium">Edit Draft</h1>
          </div>
          
          {currentDraft && (
            <div className="flex gap-2">
              {currentDraft.webViewLink && (
                <Button 
                  variant="outline"
                  onClick={handleOpenInDrive}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open in Drive
                </Button>
              )}
              <Button 
                onClick={() => saveDraftToCloud(currentDraft.id)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Save className="mr-2 h-4 w-4" />
                Save to Drive
              </Button>
            </div>
          )}
        </div>
        
        <Editor />
      </div>
    </Layout>
  );
};

export default DraftEditor;
