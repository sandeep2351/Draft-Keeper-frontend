
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useDraft } from '../contexts/DraftContext';
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2,
  Underline
} from 'lucide-react';

export function Editor() {
  const { currentDraft, updateDraft } = useDraft();
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your draft here...',
      }),
    ],
    content: currentDraft?.content || '',
    onUpdate: ({ editor }) => {
      if (currentDraft) {
        updateDraft(currentDraft.id, { 
          content: editor.getHTML() 
        });
      }
    },
  });

  if (!currentDraft) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-md border border-border p-6">
        <h3 className="font-medium text-lg mb-2">No draft selected</h3>
        <p className="text-muted-foreground text-center">
          Select a draft from the sidebar or create a new one to start writing.
        </p>
      </div>
    );
  }

  return (
    <div className="editor-container border rounded-md bg-white">
      <div className="border-b p-2 flex items-center gap-2 bg-gray-50">
        <input
          type="text"
          value={currentDraft.title}
          onChange={(e) => updateDraft(currentDraft.id, { title: e.target.value })}
          className="flex-1 bg-transparent border-none text-lg font-medium focus:outline-none px-2"
          placeholder="Untitled Draft"
        />
      </div>
      
      <div className="border-b p-2">
        <ToggleGroup type="multiple" className="justify-start">
          <ToggleGroupItem value="bold" aria-label="Toggle bold" onClick={() => editor?.chain().focus().toggleBold().run()}>
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic" onClick={() => editor?.chain().focus().toggleItalic().run()}>
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Toggle underline" onClick={() => editor?.chain().focus().toggleMark('underline').run()}>
            <Underline className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="h1" aria-label="Toggle heading 1" onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}>
            <Heading1 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="h2" aria-label="Toggle heading 2" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
            <Heading2 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="bullet" aria-label="Toggle bullet list" onClick={() => editor?.chain().focus().toggleBulletList().run()}>
            <List className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="ordered" aria-label="Toggle ordered list" onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
            <ListOrdered className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      <EditorContent editor={editor} className="prose prose-sm max-w-none p-4 min-h-[400px]" />
    </div>
  );
}
