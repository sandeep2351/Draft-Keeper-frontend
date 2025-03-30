
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDraft } from '@/contexts/DraftContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';

const Index = () => {
  const { isAuthenticated, login } = useAuth();
  const { drafts, createDraft } = useDraft();
  const navigate = useNavigate();

  const handleCreateDraft = () => {
    createDraft();
    navigate('/editor');
  };

  return (
    <Layout>
      {!isAuthenticated ? (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          <FileText className="h-16 w-16 text-indigo-600 mb-6" />
          <h1 className="text-4xl font-serif font-medium mb-4">Welcome to Draft Keeper</h1>
          <p className="text-xl text-muted-foreground max-w-md mb-8">
            Create, edit, and save your documents directly to Google Drive.
          </p>
          <Button 
            onClick={() => login()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg py-6 px-8"
            size="lg"
          >
            Sign in with Google to get started
          </Button>
        </div>
      ) : (
        <div className="container max-w-4xl py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-medium mb-4">Your Draft Space</h1>
            <p className="text-xl text-muted-foreground">
              Create, manage, and save your documents with ease.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white border rounded-lg p-8 flex flex-col items-center text-center">
              <FileText className="h-12 w-12 text-indigo-600 mb-4" />
              <h2 className="text-2xl font-medium mb-2">Create New Draft</h2>
              <p className="text-muted-foreground mb-6">
                Start writing a new document from scratch.
              </p>
              <Button onClick={handleCreateDraft} className="mt-auto">
                New Draft <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="bg-white border rounded-lg p-8 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-indigo-600">{drafts.length}</span>
              </div>
              <h2 className="text-2xl font-medium mb-2">Your Drafts</h2>
              <p className="text-muted-foreground mb-6">
                You have {drafts.length} {drafts.length === 1 ? 'draft' : 'drafts'} saved.
              </p>
              <Button 
                onClick={() => navigate('/drafts')} 
                variant="outline" 
                className="mt-auto"
              >
                View All Drafts <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Index;
