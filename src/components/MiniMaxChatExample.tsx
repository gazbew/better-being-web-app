// MiniMax Chat Example Component
import React, { useState, useRef } from 'react';
import { miniMaxService } from '@/services/minimax';
import type { MiniMaxMessage } from '@/types';

const MiniMaxChatExample: React.FC = () => {
  const [messages, setMessages] = useState<MiniMaxMessage[]>([
    { role: 'system', content: 'You are a helpful assistant.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // Add user message to chat
      const userMessage: MiniMaxMessage = { role: 'user', content: input };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput('');

      // Get response from MiniMax
      const response = await miniMaxService.chat([
        ...newMessages,
        { role: 'system', content: 'You are a helpful assistant.' }
      ]);

      // Add assistant message to chat
      if (response.choices[0].message) {
        setMessages(prev => [...prev, response.choices[0].message!]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStreamChat = async () => {
    if (!input.trim() || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // Add user message to chat
      const userMessage: MiniMaxMessage = { role: 'user', content: input };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput('');

      // Add placeholder for assistant response
      const assistantMessage: MiniMaxMessage = { role: 'assistant', content: '' };
      setMessages(prev => [...prev, assistantMessage]);

      // Get streaming response from MiniMax
      let accumulatedContent = '';
      
      await miniMaxService.streamChat(
        [
          ...newMessages,
          { role: 'system', content: 'You are a helpful assistant.' }
        ],
        (chunk) => {
          if (chunk.choices[0].delta?.content) {
            accumulatedContent += chunk.choices[0].delta.content;
            // Update the last message with the accumulated content
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                content: accumulatedContent
              };
              return updated;
            });
          }
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Streaming chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto border rounded-lg shadow-lg">
      <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h2 className="text-xl font-bold">MiniMax Chat Example</h2>
        <p className="text-sm opacity-90">Powered by MiniMax-M1</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.filter(msg => msg.role !== 'system').map((message, index) => (
          <div 
            key={index} 
            className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white border border-gray-200 text-gray-800'
              }`}
            >
              <div className="font-semibold text-xs mb-1">
                {message.role === 'user' ? 'You' : 'Assistant'}
              </div>
              <div>{message.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white border border-gray-200 text-gray-800 px-4 py-2 rounded-lg max-w-xs">
              <div className="font-semibold text-xs mb-1">Assistant</div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 border-t border-red-200 text-red-700">
          Error: {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
          <button
            type="button"
            onClick={handleStreamChat}
            disabled={isLoading || !input.trim()}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Stream
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          <p>• Send: Regular API call | Stream: Streaming response</p>
        </div>
      </form>
    </div>
  );
};

export default MiniMaxChatExample;