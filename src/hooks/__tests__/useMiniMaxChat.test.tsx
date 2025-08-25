// useMiniMaxChat Hook Tests
import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useMiniMaxChat } from '../useMiniMaxChat';
import { miniMaxService } from '@/services/minimax';
import type { MiniMaxChatCompletionResponse, MiniMaxMessage } from '@/types';

// Mock the miniMaxService
vi.mock('@/services/minimax', () => ({
  miniMaxService: {
    chat: vi.fn(),
    streamChat: vi.fn()
  }
}));

// Create a wrapper component for testing
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div>{children}</div>;
};

describe('useMiniMaxChat', () => {
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up any pending timers
    vi.useRealTimers();
  });

  it('should initialize with default messages', () => {
    const { result } = renderHook(() => useMiniMaxChat(), {
      wrapper: TestWrapper
    });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0]).toEqual({
      role: 'system',
      content: 'You are a helpful assistant.'
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should initialize with custom initial messages', () => {
    const initialMessages: MiniMaxMessage[] = [
      { role: 'system', content: 'You are a test assistant.' },
      { role: 'assistant', content: 'Hello! I am a test assistant.' }
    ];

    const { result } = renderHook(() => useMiniMaxChat({ initialMessages }), {
      wrapper: TestWrapper
    });

    expect(result.current.messages).toEqual(initialMessages);
  });

  it('should send a message and receive a response', async () => {
    // Mock the chat service response
    const mockResponse: MiniMaxChatCompletionResponse = {
      id: 'test-id',
      choices: [{
        index: 0,
        message: {
          role: 'assistant',
          content: 'Hello! How can I help you today?'
        },
        finish_reason: 'stop'
      }],
      created: Date.now(),
      model: 'MiniMax-M1',
      object: 'chat.completion',
      usage: {
        total_tokens: 20
      }
    };

    vi.mocked(miniMaxService.chat).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useMiniMaxChat(), {
      wrapper: TestWrapper
    });

    // Send a message
    await result.current.sendMessage('Hello!');

    // Wait for the state to update
    await waitFor(() => {
      expect(result.current.messages).toHaveLength(3);
      expect(result.current.messages[1]).toEqual({
        role: 'user',
        content: 'Hello!'
      });
      expect(result.current.messages[2]).toEqual({
        role: 'assistant',
        content: 'Hello! How can I help you today?'
      });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  it('should handle errors when sending a message', async () => {
    // Mock the chat service to throw an error
    vi.mocked(miniMaxService.chat).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useMiniMaxChat(), {
      wrapper: TestWrapper
    });

    // Send a message
    await result.current.sendMessage('Hello!');

    // Wait for the state to update
    await waitFor(() => {
      expect(result.current.messages).toHaveLength(2);
      expect(result.current.messages[1]).toEqual({
        role: 'user',
        content: 'Hello!'
      });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe('API Error');
    });
  });

  it('should clear messages', async () => {
    const { result } = renderHook(() => useMiniMaxChat(), {
      wrapper: TestWrapper
    });

    // Send a message to have more than initial messages
    const mockResponse: MiniMaxChatCompletionResponse = {
      id: 'test-id',
      choices: [{
        index: 0,
        message: {
          role: 'assistant',
          content: 'Hello!'
        },
        finish_reason: 'stop'
      }],
      created: Date.now(),
      model: 'MiniMax-M1',
      object: 'chat.completion',
      usage: {
        total_tokens: 10
      }
    };

    vi.mocked(miniMaxService.chat).mockResolvedValue(mockResponse);

    await result.current.sendMessage('Hello!');

    // Wait for the message to be added
    await waitFor(() => {
      expect(result.current.messages).toHaveLength(3);
    });

    // Clear messages
    result.current.clearMessages();

    // Check that messages are reset to initial state
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0]).toEqual({
      role: 'system',
      content: 'You are a helpful assistant.'
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should not send message when input is empty', async () => {
    const { result } = renderHook(() => useMiniMaxChat(), {
      wrapper: TestWrapper
    });

    // Try to send an empty message
    await result.current.sendMessage('');

    // The service should not be called
    expect(miniMaxService.chat).not.toHaveBeenCalled();

    // Messages should remain the same
    expect(result.current.messages).toHaveLength(1);
  });

  it('should not send message when already loading', async () => {
    // Mock the chat service to simulate a long-running request
    vi.mocked(miniMaxService.chat).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    const { result } = renderHook(() => useMiniMaxChat(), {
      wrapper: TestWrapper
    });

    // Send first message
    const firstPromise = result.current.sendMessage('Hello!');

    // Try to send second message while first is still loading
    const secondPromise = result.current.sendMessage('Hello again!');

    // Wait for both promises to resolve
    await Promise.all([firstPromise, secondPromise]);

    // The service should only be called once
    expect(miniMaxService.chat).toHaveBeenCalledTimes(1);
  });
});