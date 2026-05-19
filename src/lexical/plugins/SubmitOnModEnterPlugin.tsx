import { useEffect } from 'react';
import { COMMAND_PRIORITY_LOW, KEY_ENTER_COMMAND } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

interface SubmitOnModEnterPluginProps {
  onSubmit(): void;
}

export default function SubmitOnModEnterPlugin({
  onSubmit,
}: SubmitOnModEnterPluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand<KeyboardEvent>(
      KEY_ENTER_COMMAND,
      event => {
        if (!event.metaKey && !event.ctrlKey) return false;
        event.preventDefault();
        onSubmit();
        return true;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor, onSubmit]);

  return null;
}
