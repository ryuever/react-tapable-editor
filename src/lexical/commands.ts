import { createCommand, LexicalCommand } from 'lexical';
import { AIBlockPayload, UpdateAIBlockPayload } from './nodes/AIBlockNode';
import { AIChipPayload } from './nodes/AIChipNode';
import { ImagePayload, UpdateImagePayload } from './nodes/ImageNode';

export const INSERT_AI_CHIP_COMMAND: LexicalCommand<AIChipPayload> =
  createCommand('INSERT_AI_CHIP_COMMAND');

export const INSERT_AI_BLOCK_COMMAND: LexicalCommand<AIBlockPayload> =
  createCommand('INSERT_AI_BLOCK_COMMAND');

export const INSERT_IMAGE_COMMAND: LexicalCommand<ImagePayload> =
  createCommand('INSERT_IMAGE_COMMAND');

export const UPDATE_AI_BLOCK_COMMAND: LexicalCommand<UpdateAIBlockPayload> =
  createCommand('UPDATE_AI_BLOCK_COMMAND');

export const UPDATE_IMAGE_COMMAND: LexicalCommand<UpdateImagePayload> =
  createCommand('UPDATE_IMAGE_COMMAND');
