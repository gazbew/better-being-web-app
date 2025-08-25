# MiniMax API Integration

This document explains how to use the MiniMax API integration in the BetterBeing application.

## Setup

1. **Environment Configuration**
   Add your MiniMax API key to your `.env` file:
   ```env
   VITE_MINIMAX_API_KEY=your_actual_api_key_here
   ```

2. **Service Import**
   Import the MiniMax service in your components:
   ```typescript
   import { miniMaxService } from '@/services/minimax';
   ```

## Usage Examples

### Basic Chat Completion

```typescript
import { miniMaxService } from '@/services/minimax';
import type { MiniMaxMessage } from '@/types';

const messages: MiniMaxMessage[] = [
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: 'Hello, how are you?' }
];

try {
  const response = await miniMaxService.chat(messages);
  console.log(response.choices[0].message?.content);
} catch (error) {
  console.error('Error:', error);
}
```

### Streaming Chat Completion

```typescript
import { miniMaxService } from '@/services/minimax';
import type { MiniMaxMessage, MiniMaxChatCompletionChunk } from '@/types';

const messages: MiniMaxMessage[] = [
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: 'Tell me a story.' }
];

try {
  let fullResponse = '';
  
  await miniMaxService.streamChat(
    messages,
    (chunk: MiniMaxChatCompletionChunk) => {
      if (chunk.choices[0].delta?.content) {
        fullResponse += chunk.choices[0].delta.content;
        // Update UI with incremental content
        console.log('New content:', chunk.choices[0].delta.content);
      }
    }
  );
  
  console.log('Full response:', fullResponse);
} catch (error) {
  console.error('Error:', error);
}
```

### Advanced Configuration

```typescript
import { miniMaxService } from '@/services/minimax';

const response = await miniMaxService.chat(
  messages,
  'MiniMax-Text-01', // Model selection
  {
    maxTokens: 1000,
    temperature: 0.7,
    topP: 0.9,
    maskSensitiveInfo: true
  }
);
```

### Function Calling

```typescript
import { miniMaxService } from '@/services/minimax';
import type { MiniMaxTool } from '@/types';

const tools: MiniMaxTool[] = [
  {
    type: 'function',
    function: {
      name: 'get_current_weather',
      description: 'Get the current weather for a location',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'The city and state, e.g. San Francisco, CA'
          }
        },
        required: ['location']
      }
    }
  }
];

const response = await miniMaxService.createChatCompletion({
  model: 'MiniMax-M1',
  messages: [
    { role: 'user', content: "What's the weather like in San Francisco?" }
  ],
  tools: tools,
  tool_choice: 'auto'
});
```

## API Reference

### `miniMaxService.chat(messages, model, options)`

Create a chat completion with a simple interface.

**Parameters:**
- `messages`: Array of message objects
- `model`: Model to use ('MiniMax-M1' or 'MiniMax-Text-01')
- `options`: Configuration object with:
  - `maxTokens`: Maximum tokens to generate
  - `temperature`: Sampling temperature (0-2)
  - `topP`: Nucleus sampling parameter
  - `maskSensitiveInfo`: Mask sensitive information

**Returns:** `Promise<MiniMaxChatCompletionResponse>`

### `miniMaxService.streamChat(messages, onChunk, model, options)`

Create a streaming chat completion.

**Parameters:**
- `messages`: Array of message objects
- `onChunk`: Callback function for each chunk
- `model`: Model to use
- `options`: Configuration object

**Returns:** `Promise<void>`

### `miniMaxService.createChatCompletion(request)`

Create a chat completion with full control over parameters.

**Parameters:**
- `request`: Full request object with all MiniMax parameters

**Returns:** `Promise<MiniMaxChatCompletionResponse>`

### `miniMaxService.createStreamingChatCompletion(request)`

Create a streaming chat completion with full control.

**Parameters:**
- `request`: Full request object with `stream: true`

**Returns:** `Promise<AsyncGenerator<MiniMaxChatCompletionChunk, void, unknown>>`

## Error Handling

All methods will throw errors for:
- Network issues
- Invalid API keys
- API rate limits
- Invalid parameters

Always wrap calls in try/catch blocks:

```typescript
try {
  const response = await miniMaxService.chat(messages);
  // Handle success
} catch (error) {
  if (error instanceof Error) {
    console.error('MiniMax API Error:', error.message);
  }
}
```

## Best Practices

1. **Environment Variables**: Always store API keys in environment variables
2. **Error Handling**: Implement proper error handling for all API calls
3. **Streaming**: Use streaming for better user experience with longer responses
4. **Caching**: Consider caching responses for repeated queries
5. **Rate Limiting**: Be aware of API rate limits in production
6. **Security**: Never expose API keys in client-side code in production

## Models

- **MiniMax-M1**: Recommended for most use cases, supports longer context
- **MiniMax-Text-01**: Alternative model with different characteristics

For streaming responses, MiniMax-M1 is recommended for better stability.