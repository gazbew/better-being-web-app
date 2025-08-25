// MiniMax Service Tests
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { miniMaxService } from '../minimax';
import type { MiniMaxChatCompletionRequest, MiniMaxChatCompletionResponse } from '@/types';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('MiniMaxService', () => {
  beforeEach(() => {
    // Set the API key in environment variables
    vi.stubEnv('VITE_MINIMAX_API_KEY', 'test-api-key');
    
    // Clear all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore environment variables
    vi.unstubAllEnvs();
  });

  describe('createChatCompletion', () => {
    it('should make a successful API call with correct parameters', async () => {
      // Mock response
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

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      } as Response);

      // Test data
      const request: MiniMaxChatCompletionRequest = {
        model: 'MiniMax-M1',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Hello!' }
        ],
        stream: false
      };

      // Call the service
      const result = await miniMaxService.createChatCompletion(request);

      // Assertions
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.minimax.io/v1/text/chatcompletion_v2',
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer test-api-key',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(request)
        }
      );
    });

    it('should throw an error when API key is not configured', async () => {
      // Remove API key
      vi.stubEnv('VITE_MINIMAX_API_KEY', '');

      const request: MiniMaxChatCompletionRequest = {
        model: 'MiniMax-M1',
        messages: [{ role: 'user', content: 'Hello!' }],
        stream: false
      };

      await expect(miniMaxService.createChatCompletion(request))
        .rejects
        .toThrow('MiniMax API key is not configured');
    });

    it('should throw an error when API returns an error response', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: () => Promise.resolve('Invalid API key')
      } as Response);

      const request: MiniMaxChatCompletionRequest = {
        model: 'MiniMax-M1',
        messages: [{ role: 'user', content: 'Hello!' }],
        stream: false
      };

      await expect(miniMaxService.createChatCompletion(request))
        .rejects
        .toThrow('MiniMax API error: 401 Unauthorized - Invalid API key');
    });
  });

  describe('chat', () => {
    it('should call createChatCompletion with correct parameters', async () => {
      // Mock the createChatCompletion method
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

      const createChatCompletionSpy = vi.spyOn(miniMaxService, 'createChatCompletion')
        .mockResolvedValue(mockResponse);

      // Test data
      const messages: import('@/types').MiniMaxMessage[] = [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello!' }
      ];

      // Call the chat method
      const result = await miniMaxService.chat(messages, 'MiniMax-M1', {
        maxTokens: 1000,
        temperature: 0.7
      });

      // Assertions
      expect(result).toEqual(mockResponse);
      expect(createChatCompletionSpy).toHaveBeenCalledWith({
        model: 'MiniMax-M1',
        messages,
        stream: false,
        max_tokens: 1000,
        temperature: 0.7
      });

      // Clean up
      createChatCompletionSpy.mockRestore();
    });
  });
});