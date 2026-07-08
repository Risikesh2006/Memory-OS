'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Sparkles, Loader2, ArrowDown } from 'lucide-react';
import MemoryReference from './MemoryReference';

export default function ChatInterface({ history, onSendMessage, loading }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const [showScrollDown, setShowScrollDown] = useState(false);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, loading]);

  // Handle scroll detection for "Scroll to bottom" button
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollDown(!isNearBottom);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-los-card border border-los-border rounded-2xl overflow-hidden shadow-2xl relative">
      
      {/* Header */}
      <div className="p-4 border-b border-los-border bg-los-bg-secondary flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-los-accent to-los-cyan flex items-center justify-center shadow-lg">
              <Sparkles size={20} className="text-white" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-los-bg rounded-full" />
          </div>
          <div>
            <h3 className="font-bold text-white">Memory Assistant</h3>
            <p className="text-xs text-los-text-muted">Always ready to explore your past</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar relative bg-los-bg"
      >
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-los-accent/10 text-los-accent-light flex items-center justify-center mb-6">
              <Sparkles size={32} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Hello! I'm your Memory Assistant.</h2>
            <p className="text-los-text-muted mb-8">
              Ask me anything about your past. I can find specific events, count memories, summarize periods, or find photos.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {['"How many photos do I have?"', '"What did I do last summer?"', '"Find memories with dogs"'].map((q, i) => (
                <button 
                  key={i} 
                  onClick={() => onSendMessage(q.replace(/"/g, ''))}
                  className="px-4 py-2 rounded-full bg-los-bg-tertiary border border-los-border text-xs text-los-text-secondary hover:text-white hover:border-los-accent transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          history.map((msg, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* User Message */}
              <div className="flex justify-end">
                <div className="max-w-[80%] flex gap-3">
                  <div className="bg-los-accent text-white px-5 py-3 rounded-2xl rounded-tr-sm shadow-md order-1">
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-los-bg-tertiary border border-los-border flex items-center justify-center order-2 flex-shrink-0">
                    <User size={14} className="text-los-text-muted" />
                  </div>
                </div>
              </div>

              {/* AI Response */}
              <div className="flex justify-start">
                <div className="max-w-[85%] flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-los-accent to-los-cyan flex items-center justify-center flex-shrink-0 shadow-lg shadow-los-accent/20">
                    <Sparkles size={14} className="text-white" />
                  </div>
                  <div className="space-y-3">
                    <div className="bg-los-bg-secondary border border-los-border text-los-text px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.response}</p>
                    </div>
                    
                    {/* Memory References / Citations */}
                    {msg.memoryRefs && msg.memoryRefs.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {msg.memoryRefs.map((ref, i) => (
                          <MemoryReference key={i} refData={ref} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-los-accent to-los-cyan flex items-center justify-center flex-shrink-0">
                <Sparkles size={14} className="text-white" />
              </div>
              <div className="bg-los-bg-secondary border border-los-border px-5 py-4 rounded-2xl rounded-tl-sm w-24 flex items-center justify-center gap-1">
                <motion.div className="w-1.5 h-1.5 bg-los-accent rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                <motion.div className="w-1.5 h-1.5 bg-los-accent rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                <motion.div className="w-1.5 h-1.5 bg-los-accent rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Floating Scroll Down Button */}
      <AnimatePresence>
        {showScrollDown && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={scrollToBottom}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 p-2 rounded-full bg-los-accent text-white shadow-lg glass-blur z-20"
          >
            <ArrowDown size={16} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="p-4 bg-los-bg-secondary border-t border-los-border z-10">
        <form 
          onSubmit={handleSubmit}
          className="relative flex items-end gap-2 bg-los-bg border border-los-border rounded-xl p-2 transition-all focus-within:border-los-accent focus-within:shadow-[0_0_15px_rgba(124,58,237,0.15)]"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your memories..."
            className="flex-1 max-h-32 min-h-[44px] bg-transparent border-none outline-none text-white placeholder:text-los-text-muted resize-none py-2.5 px-3 text-sm custom-scrollbar"
            rows={1}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3 rounded-lg bg-los-accent text-white hover:bg-los-accent-light transition-colors disabled:opacity-50 disabled:hover:bg-los-accent flex-shrink-0"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>
        <div className="text-center mt-2">
          <p className="text-[10px] text-los-text-muted">AI can make mistakes. Check important information.</p>
        </div>
      </div>
    </div>
  );
}
