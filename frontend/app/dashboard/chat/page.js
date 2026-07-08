'use client';

import { useState, useEffect } from 'react';
import { MessageSquareText } from 'lucide-react';
import { aiAPI } from '@/lib/apiService';
import ChatInterface from '@/components/Chat/ChatInterface';
import toast from 'react-hot-toast';

export default function ChatPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await aiAPI.getChatHistory();
        setHistory(response.data || []);
      } catch (error) {
        console.error('Failed to load chat history:', error);
      } finally {
        setInitialFetchDone(true);
      }
    };
    fetchHistory();
  }, []);

  const handleSendMessage = async (message) => {
    // Optimistic UI update
    const newHistory = [...history, { message, response: '', isOptimistic: true }];
    setHistory(newHistory);
    setLoading(true);

    try {
      const response = await aiAPI.chat(message);
      
      // Update with real response
      setHistory(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          message,
          response: response.data.response,
          memoryRefs: response.data.memoryRefs,
          isOptimistic: false
        };
        return updated;
      });
    } catch (error) {
      toast.error('Failed to send message');
      // Remove optimistic message on fail
      setHistory(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col h-[calc(100vh-140px)] min-h-[600px]">
      <div className="mb-6 hidden md:block">
        <h1 className="los-heading-xl text-los-text mb-2 flex items-center gap-3">
          <MessageSquareText className="text-los-accent" size={32} />
          AI Memory Assistant
        </h1>
        <p className="los-body">
          Chat naturally with your life history. The AI acts as your personal biographer, helping you find forgotten details, count events, and summarize periods of your life.
        </p>
      </div>

      <div className="flex-1 w-full relative">
        {!initialFetchDone ? (
          <div className="absolute inset-0 bg-los-card border border-los-border rounded-2xl los-skeleton" />
        ) : (
          <ChatInterface 
            history={history} 
            onSendMessage={handleSendMessage} 
            loading={loading} 
          />
        )}
      </div>
    </div>
  );
}
