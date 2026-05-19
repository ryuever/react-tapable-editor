import { useEffect } from 'react';
import { LexicalEditor } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

interface RegisterEditorPluginProps {
  onReady(editor: LexicalEditor): void;
}

export default function RegisterEditorPlugin({
  onReady,
}: RegisterEditorPluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    onReady(editor);
  }, [editor, onReady]);

  return null;
}
