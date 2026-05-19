import { createContext, useContext } from 'react';
import type {
  AIBlockAction,
  AIBlockKind,
  AIBlockStatus,
} from './nodes/AIBlockNode';

export interface AIBlockActionEvent {
  id: string;
  action: AIBlockAction;
  kind: AIBlockKind;
  status: AIBlockStatus;
  title: string;
  invocationId?: string;
  runId?: string;
  meta?: Record<string, unknown>;
}

export type AIBlockActionHandler = (event: AIBlockActionEvent) => void;

export const AIBlockActionContext =
  createContext<AIBlockActionHandler | null>(null);

let currentAIBlockActionHandler: AIBlockActionHandler | null = null;

export function setAIBlockActionHandler(
  handler: AIBlockActionHandler | null
) {
  currentAIBlockActionHandler = handler;
}

export function emitAIBlockAction(event: AIBlockActionEvent) {
  currentAIBlockActionHandler?.(event);
}

export function useAIBlockActionHandler() {
  return useContext(AIBlockActionContext) || currentAIBlockActionHandler;
}
