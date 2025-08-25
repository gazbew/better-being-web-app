// React Hook for MiniMax Chat Integration
import { useState, useRef, useCallback } from 'react';
import { miniMaxService } from '@/services/minimax';
import type { MiniMaxMessage, MiniMaxModel } from '@/types';

interface UseMiniMaxChatOptions {
  model?: MiniMaxModel;
  initialMessages?: MiniMaxMessage[];
  onNewMessage?: (message: MiniMaxMessage) => void;
  onError?: (error: string) => void;
}

interface UseMiniMaxChatReturn {
  messages: MiniMaxMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  streamMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

export const useMiniMaxChat = ({
  model = 'MiniMax-M1',
  initialMessages = [{ role: 'system', content: 'You are a helpful assistant.' }],
  onNewMessage,
  onError
}: UseMiniMaxChatOptions = {}): UseMiniMaxChatReturn => {
  const [messages, setMessages] = useState<MiniMaxMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleError = useCallback((err: unknown) => {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    setError(errorMessage);
    onError?.(errorMessage);
    console.error('MiniMax chat error:', err);
  }, [onError]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // Cancel any ongoing streaming requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Add user message
      const userMessage: MiniMaxMessage = { role: 'user', content };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      onNewMessage?.(userMessage);

      // Get response from MiniMax
      const response = await miniMaxService.chat(newMessages, model);
      
      // Add assistant message
      if (response.choices[0].message) {
        const assistantMessage = response.choices[0].message;
        setMessages(prev => [...prev, assistantMessage]);
        onNewMessage?.(assistantMessage);
      }
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, model, onNewMessage, handleError]);

  const streamMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // Cancel any ongoing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();

      // Add user message
      const userMessage: MiniMaxMessage = { role: 'user', content };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      onNewMessage?.(userMessage);

      // Add placeholder for assistant response
      const assistantMessage: MiniMaxMessage = { role: 'assistant', content: '' };
      setMessages(prev => [...prev, assistantMessage]);

      // Get streaming response
      let accumulatedContent = '';
      
      await miniMaxService.streamChat(
        newMessages,
        (chunk) => {
          // Check if request was aborted
          if (abortControllerRef.current?.signal.aborted) {
            return;
          }
          
          if (chunk.choices[0].delta?.content) {
            accumulatedContent += chunk.choices[0].delta.content;
            // Update the last message with accumulated content
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                content: accumulatedContent
              };
              return updated;
            });
          }
        },
        model
      );
      
      // Notify about final assistant message
      if (accumulatedContent) {
        onNewMessage?.({ role: 'assistant', content: accumulatedContent });
      }
    } catch (err) {
      // Ignore abort errors
      if (err instanceof Error && err.name !== 'AbortError') {
        handleError(err);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [messages, isLoading, model, onNewMessage, handleError]);

  const clearMessages = useCallback(() => {
    // Cancel any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    setMessages(initialMessages);
    setError(null);
    setIsLoading(false);
  }, [initialMessages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    streamMessage,
    clearMessages
  };
};

export default useMiniMaxChat;