import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "sonner";
import { useAuth } from './AuthContext';
import { api } from '../services/api';

interface Draft {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  savedToCloud: boolean;
  googleFileId?: string;
  webViewLink?: string;
  fromDrive?: boolean;
}

interface DraftContextType {
  drafts: Draft[];
  currentDraft: Draft | null;
  googleDriveDrafts: Draft[];
  isLoading: boolean;
  isDriveLoading: boolean;
  setCurrentDraft: (draft: Draft) => void;
  createDraft: () => void;
  updateDraft: (id: string, data: Partial<Draft>) => void;
  deleteDraft: (id: string) => void;
  saveDraftToCloud: (id: string) => Promise<void>;
  loadDraftsFromDrive: () => Promise<void>;
  openDraftInDrive: (webViewLink: string) => void;
}

const DraftContext = createContext<DraftContextType>({
  drafts: [],
  currentDraft: null,
  googleDriveDrafts: [],
  isLoading: false,
  isDriveLoading: false,
  setCurrentDraft: () => {},
  createDraft: () => {},
  updateDraft: () => {},
  deleteDraft: () => {},
  saveDraftToCloud: async () => {},
  loadDraftsFromDrive: async () => {},
  openDraftInDrive: () => {},
});

export const DraftProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [googleDriveDrafts, setGoogleDriveDrafts] = useState<Draft[]>([]);
  const [currentDraft, setCurrentDraft] = useState<Draft | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDriveLoading, setIsDriveLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchDrafts = async () => {
      if (!isAuthenticated) {
        setDrafts([]);
        setCurrentDraft(null);
        return;
      }

      setIsLoading(true);
      try {
        const fetchedDrafts = await api.drafts.getAllDrafts();
        setDrafts(fetchedDrafts);

        if (fetchedDrafts.length > 0 && !currentDraft) {
          setCurrentDraft(fetchedDrafts[0]);
        }

        loadDraftsFromDrive();
      } catch (error) {
        console.error("Error fetching drafts:", error);
        toast.error("Failed to load your drafts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDrafts();
  }, [isAuthenticated, user]);

  const createDraft = async () => {
    if (!isAuthenticated) {
      toast.error("You need to sign in to create drafts");
      return;
    }

    setIsLoading(true);
    try {
      const newDraft = await api.drafts.createDraft({
        title: "Untitled Draft",
        content: "",
      });

      setDrafts(prev => [newDraft, ...prev]);
      setCurrentDraft(newDraft);
      toast.success("New draft created");
    } catch (error) {
      console.error("Error creating draft:", error);
      toast.error("Failed to create new draft");
    } finally {
      setIsLoading(false);
    }
  };

  const updateDraft = async (id: string, data: Partial<Draft>) => {
    if (!isAuthenticated) return;

    setDrafts(prev =>
      prev.map(draft =>
        draft.id === id
          ? { ...draft, ...data, updatedAt: new Date().toISOString() }
          : draft
      )
    );

    if (currentDraft?.id === id) {
      setCurrentDraft(prev => prev ? { ...prev, ...data, updatedAt: new Date().toISOString() } : null);
    }

    try {
      await api.drafts.updateDraft(id, data);
    } catch (error) {
      console.error("Error updating draft:", error);
      toast.error("Failed to update draft");
    }
  };

  const deleteDraft = async (id: string) => {
    if (!isAuthenticated) return;

    try {
      await api.drafts.deleteDraft(id);

      setDrafts(prev => prev.filter(draft => draft.id !== id));

      if (currentDraft?.id === id) {
        const remainingDrafts = drafts.filter(draft => draft.id !== id);
        setCurrentDraft(remainingDrafts.length > 0 ? remainingDrafts[0] : null);
      }

      toast.success("Draft deleted");
    } catch (error) {
      console.error("Error deleting draft:", error);
      toast.error("Failed to delete draft");
    }
  };

  const saveDraftToCloud = async (id: string) => {
    if (!isAuthenticated) {
      toast.error("You need to sign in to save to Drive");
      return;
    }

    try {
      const response = await api.drafts.saveToDrive(id);

      setDrafts(prev =>
        prev.map(draft =>
          draft.id === id
            ? {
                ...draft,
                savedToCloud: true,
                googleFileId: response.draft.googleFileId,
                webViewLink: response.draft.webViewLink
              }
            : draft
        )
      );

      if (currentDraft?.id === id) {
        setCurrentDraft(prev =>
          prev ? {
            ...prev,
            savedToCloud: true,
            googleFileId: response.draft.googleFileId,
            webViewLink: response.draft.webViewLink
          } : null
        );
      }

      toast.success("Draft saved to Google Drive");

      loadDraftsFromDrive();
    } catch (error) {
      console.error("Error saving to Drive:", error);
      toast.error("Failed to save draft to Google Drive");
    }
  };

  const loadDraftsFromDrive = async () => {
    if (!isAuthenticated) {
      return;
    }

    setIsDriveLoading(true);
    try {
      const fetchedDriveDrafts = await api.drafts.getDraftsFromDrive();

      const formattedDrafts = fetchedDriveDrafts.map(draft => ({
        id: draft.id,
        title: draft.title,
        content: draft.content || '',
        createdAt: draft.createdAt,
        updatedAt: draft.updatedAt,
        userId: user?.id || '',
        savedToCloud: true,
        googleFileId: draft.id,
        webViewLink: draft.webViewLink,
        fromDrive: true
      }));

      setGoogleDriveDrafts(formattedDrafts);
    } catch (error) {
      console.error("Error loading drafts from Drive:", error);
      toast.error("Failed to load drafts from Google Drive");
    } finally {
      setIsDriveLoading(false);
    }
  };

  const openDraftInDrive = (webViewLink: string) => {
    if (!webViewLink) {
      toast.error("No Google Drive link available");
      return;
    }

    window.open(webViewLink, '_blank');
  };

  return (
    <DraftContext.Provider
      value={{
        drafts,
        currentDraft,
        googleDriveDrafts,
        isLoading,
        isDriveLoading,
        setCurrentDraft,
        createDraft,
        updateDraft,
        deleteDraft,
        saveDraftToCloud,
        loadDraftsFromDrive,
        openDraftInDrive
      }}
    >
      {children}
    </DraftContext.Provider>
  );
};

export const useDraft = () => useContext(DraftContext);
