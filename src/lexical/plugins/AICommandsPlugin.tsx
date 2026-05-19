import { useEffect } from 'react';
import {
  $createTextNode,
  $getRoot,
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  LexicalNode,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  INSERT_AI_BLOCK_COMMAND,
  INSERT_AI_CHIP_COMMAND,
  INSERT_IMAGE_COMMAND,
  UPDATE_AI_BLOCK_COMMAND,
  UPDATE_IMAGE_COMMAND,
} from '../commands';
import {
  $createAIBlockNode,
  $isAIBlockNode,
  AIBlockPayload,
  UpdateAIBlockPayload,
} from '../nodes/AIBlockNode';
import { $createAIChipNode, AIChipPayload } from '../nodes/AIChipNode';
import {
  $createImageNode,
  $isImageNode,
  ImagePayload,
  UpdateImagePayload,
} from '../nodes/ImageNode';

function updateNodeById(id: string, update: (node: LexicalNode) => boolean) {
  // The editor trees here are tiny composer documents; a targeted traversal is
  // clearer than maintaining an external id index.
  const visit = (node: LexicalNode & { getChildren?: () => LexicalNode[] }): boolean => {
    const children = node.getChildren?.() || [];
    for (const child of children) {
      if (update(child)) return true;
      if (visit(child as LexicalNode & { getChildren?: () => LexicalNode[] })) return true;
    }
    return false;
  };

  return { id, visit };
}

export default function AICommandsPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const unregisterChipCommand = editor.registerCommand<AIChipPayload>(
      INSERT_AI_CHIP_COMMAND,
      payload => {
        const selection = $getSelection();
        const nodes = [$createAIChipNode(payload), $createTextNode(' ')];

        if ($isRangeSelection(selection)) {
          selection.insertNodes(nodes);
          return true;
        }

        $insertNodes(nodes);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );

    const unregisterBlockCommand = editor.registerCommand<AIBlockPayload>(
      INSERT_AI_BLOCK_COMMAND,
      payload => {
        $insertNodes([$createAIBlockNode(payload)]);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );

    const unregisterImageCommand = editor.registerCommand<ImagePayload>(
      INSERT_IMAGE_COMMAND,
      payload => {
        $insertNodes([$createImageNode(payload)]);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );

    const unregisterUpdateAIBlockCommand =
      editor.registerCommand<UpdateAIBlockPayload>(
        UPDATE_AI_BLOCK_COMMAND,
        payload => {
          const traversal = updateNodeById(payload.id, node => {
            if (!$isAIBlockNode(node)) return false;
            if (node.__id !== payload.id) return false;
            node.update(payload);
            return true;
          });
          traversal.visit($getRoot() as LexicalNode & { getChildren: () => LexicalNode[] });

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      );

    const unregisterUpdateImageCommand =
      editor.registerCommand<UpdateImagePayload>(
        UPDATE_IMAGE_COMMAND,
        payload => {
          const traversal = updateNodeById(payload.id, node => {
            if (!$isImageNode(node)) return false;
            if (node.__id !== payload.id) return false;
            node.update(payload);
            return true;
          });
          traversal.visit($getRoot() as LexicalNode & { getChildren: () => LexicalNode[] });

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      );

    return () => {
      unregisterChipCommand();
      unregisterBlockCommand();
      unregisterImageCommand();
      unregisterUpdateAIBlockCommand();
      unregisterUpdateImageCommand();
    };
  }, [editor]);

  return null;
}
