// MiniMax API Service for Chat Completions
import type {
  MiniMaxChatCompletionRequest,
  MiniMaxChatCompletionResponse,
  MiniMaxChatCompletionChunk,
  MiniMaxMessage,
  MiniMaxModel
} from '@/types';

const MINIMAX_API_URL = 'https://api.minimax.io/v1/text/chatcompletion_v2';
const MINIMAX_API_KEY = import.meta.env.VITE_MINIMAX_API_KEY || '';

class MiniMaxService {
  private getApiKey(): string {
    if (!MINIMAX_API_KEY) {
      throw new Error('MiniMax API key is not configured. Please set VITE_MINIMAX_API_KEY in your environment variables.');
    }
    return MINIMAX_API_KEY;
  }

  /**
   * Create a chat completion request
   * @param request The chat completion request parameters
   * @returns The chat completion response
   */
  async createChatCompletion(request: MiniMaxChatCompletionRequest): Promise<MiniMaxChatCompletionResponse> {
    const apiKey = this.getApiKey();
    
    // For streaming requests, we need to handle the response differently
    if (request.stream) {
      throw new Error('Use createStreamingChatCompletion for streaming requests');
    }

    try {
      const response = await fetch(MINIMAX_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`MiniMax API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return await response.json() as MiniMaxChatCompletionResponse;
    } catch (error) {
      console.error('MiniMax chat completion error:', error);
      throw error;
    }
  }

  /**
   * Create a streaming chat completion request
   * @param request The chat completion request parameters
   * @returns An async generator that yields chat completion chunks
   */
  async createStreamingChatCompletion(request: MiniMaxChatCompletionRequest & { stream: true }): Promise<AsyncGenerator<MiniMaxChatCompletionChunk, void, unknown>> {
    const apiKey = this.getApiKey();
    
    const self = this;
    async function* streamGenerator(): AsyncGenerator<MiniMaxChatCompletionChunk, void, unknown> {
      try {
        const response = await fetch(MINIMAX_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(request)
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`MiniMax API error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        if (!response.body) {
          throw new Error('Response body is null');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  return;
                }
                try {
                  const parsed = JSON.parse(data) as MiniMaxChatCompletionChunk;
                  yield parsed;
                } catch (parseError) {
                  console.warn('Failed to parse streaming chunk:', parseError);
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
        }
      } catch (error) {
        console.error('MiniMax streaming chat completion error:', error);
        throw error;
      }
    }

    return streamGenerator();
  }

  /**
   * Simple chat completion method for basic use cases
   * @param messages Array of messages in the conversation
   * @param model The model to use (default: MiniMax-M1)
   * @param options Additional options for the completion
   * @returns The chat completion response
   */
  async chat(
    messages: MiniMaxMessage[],
    model: MiniMaxModel = 'MiniMax-M1',
    options: {
      maxTokens?: number;
      temperature?: number;
      topP?: number;
      maskSensitiveInfo?: boolean;
    } = {}
  ): Promise<MiniMaxChatCompletionResponse> {
    const request: MiniMaxChatCompletionRequest = {
      model,
      messages,
      stream: false,
      max_tokens: options.maxTokens,
      temperature: options.temperature,
      top_p: options.topP,
      mask_sensitive_info: options.maskSensitiveInfo
    };

    return await this.createChatCompletion(request);
  }

  /**
   * Streaming chat method for basic use cases
   * @param messages Array of messages in the conversation
   * @param onChunk Callback function to handle each chunk
   * @param model The model to use (default: MiniMax-M1)
   * @param options Additional options for the completion
   */
  async streamChat(
    messages: MiniMaxMessage[],
    onChunk: (chunk: MiniMaxChatCompletionChunk) => void,
    model: MiniMaxModel = 'MiniMax-M1',
    options: {
      maxTokens?: number;
      temperature?: number;
      topP?: number;
      maskSensitiveInfo?: boolean;
    } = {}
  ): Promise<void> {
    const request: MiniMaxChatCompletionRequest = {
      model,
      messages,
      stream: true,
      max_tokens: options.maxTokens,
      temperature: options.temperature,
      top_p: options.topP,
      mask_sensitive_info: options.maskSensitiveInfo
    };

    const stream = await this.createStreamingChatCompletion(request as MiniMaxChatCompletionRequest & { stream: true });
    
    for await (const chunk of stream) {
      onChunk(chunk);
    }
  }
}

// Export singleton instance
export const miniMaxService = new MiniMaxService();

// Export class for custom instances
export default miniMaxService;