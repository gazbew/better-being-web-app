// MiniMax Chat Example Component using the useMiniMaxChat hook
import React, { useEffect, useRef } from 'react';
import { useMiniMaxChat } from '@/hooks/useMiniMaxChat';

const MiniMaxChatWithHook: React.FC = () => {
  const [input, setInput] = React.useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    streamMessage,
    clearMessages
  } = useMiniMaxChat({
    initialMessages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'assistant', content: 'Hello! How can I help you today?' }
    ],
    onNewMessage: (message) => {
      console.log('New message:', message);
    },
    onError: (error) => {
      console.error('Chat error:', error);
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    await sendMessage(input);
    setInput('');
  };

  const handleStreamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    await streamMessage(input);
    setInput('');
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto border rounded-lg shadow-lg">
      <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">MiniMax Chat (Hook Example)</h2>
            <p className="text-sm opacity-90">Powered by MiniMax-M1</p>
          </div>
          <button
            onClick={clearMessages}
            className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Clear
          </button>
        </div>
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
            onClick={handleStreamSubmit}
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

export default MiniMaxChatWithHook;