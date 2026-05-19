import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { PromptInputPayload } from '../lexical/types';
import { createPromptInputMessage } from './adapters';
import type {
  PromptInputAttachment,
  PromptInputController,
  PromptInputControllerState,
  PromptInputMessage,
  PromptInputMessageOptions,
  PromptInputProviderProps,
  PromptInputStatus,
} from './types';

const PromptInputContext = createContext<
  (PromptInputControllerState & PromptInputController) | null
>(null);

export function PromptInputProvider({
  children,
  initialAttachments = [],
  initialStatus = 'idle',
  initialText = '',
  onSubmit,
}: PromptInputProviderProps) {
  const [attachments, setAttachments] =
    useState<PromptInputAttachment[]>(initialAttachments);
  const [error, setError] = useState<Error | null>(null);
  const [lastSubmittedMessage, setLastSubmittedMessage] =
    useState<PromptInputMessage | null>(null);
  const [message, setMessage] = useState<PromptInputMessage | null>(null);
  const [status, setStatus] = useState<PromptInputStatus>(initialStatus);
  const [text, setText] = useState(initialText);

  const addAttachments = useCallback((next: PromptInputAttachment[]) => {
    setAttachments(current => current.concat(next));
  }, []);

  const removeAttachment = useCallback((id: string) => {
    setAttachments(current => current.filter(item => item.id !== id));
  }, []);

  const clear = useCallback(() => {
    setAttachments([]);
    setError(null);
    setMessage(null);
    setStatus('idle');
    setText('');
  }, []);

  const setPayload = useCallback((payload: PromptInputPayload | null) => {
    if (!payload) {
      setMessage(null);
      setText('');
      return;
    }

    const nextMessage = createPromptInputMessage(payload);
    setAttachments(nextMessage.attachments);
    setMessage(nextMessage);
    setText(nextMessage.text);
    setStatus(current => (current === 'idle' ? 'ready' : current));
  }, []);

  const submitPayload = useCallback(
    (payload: PromptInputPayload, options?: PromptInputMessageOptions) => {
      const nextMessage = createPromptInputMessage(payload, options);
      setAttachments(nextMessage.attachments);
      setError(null);
      setLastSubmittedMessage(nextMessage);
      setMessage(nextMessage);
      setStatus('submitted');
      setText(nextMessage.text);
      onSubmit?.(nextMessage);
      return nextMessage;
    },
    [onSubmit]
  );

  const value = useMemo(
    () => ({
      addAttachments,
      attachments,
      clear,
      error,
      lastSubmittedMessage,
      message,
      removeAttachment,
      setAttachments,
      setError,
      setPayload,
      setStatus,
      setText,
      status,
      submitPayload,
      text,
    }),
    [
      addAttachments,
      attachments,
      clear,
      error,
      lastSubmittedMessage,
      message,
      removeAttachment,
      setPayload,
      status,
      submitPayload,
      text,
    ]
  );

  return (
    <PromptInputContext.Provider value={value}>
      {children}
    </PromptInputContext.Provider>
  );
}

export function usePromptInput() {
  const context = useContext(PromptInputContext);
  if (!context) {
    throw new Error('usePromptInput must be used within PromptInputProvider.');
  }
  return context;
}

export function usePromptInputController(): PromptInputController {
  const {
    addAttachments,
    clear,
    removeAttachment,
    setAttachments,
    setError,
    setPayload,
    setStatus,
    setText,
    submitPayload,
  } = usePromptInput();

  return {
    addAttachments,
    clear,
    removeAttachment,
    setAttachments,
    setError,
    setPayload,
    setStatus,
    setText,
    submitPayload,
  };
}

export function usePromptInputState(): PromptInputControllerState {
  const { attachments, error, lastSubmittedMessage, message, status, text } =
    usePromptInput();

  return {
    attachments,
    error,
    lastSubmittedMessage,
    message,
    status,
    text,
  };
}
