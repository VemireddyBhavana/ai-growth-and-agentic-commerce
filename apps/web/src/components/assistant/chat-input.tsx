'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Mic,
  MicOff,
  Sparkles,
  Paperclip,
  CornerDownLeft,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAssistantStore } from '@/stores/use-assistant-store';

const QUICK_CHIPS = [
  'Under ₹1000',
  'Trending',
  'Best Sellers',
  'New Arrivals',
  'Gaming',
  'Fashion',
  'Electronics',
  'Earbuds under ₹3000',
];

export const ChatInput: React.FC = () => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendUserMessage, isGenerating } = useAssistantStore();

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const message = input.trim();
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    await sendUserMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChipClick = (chip: string) => {
    let query = chip;
    if (chip === 'Under ₹1000') query = 'Show me best tech accessories under ₹1000';
    else if (chip === 'Trending') query = 'Show me the trending products today';
    else if (chip === 'Best Sellers') query = 'What are the highest rated best sellers?';
    else if (chip === 'New Arrivals') query = 'Show new arrival products and gadgets';
    else if (chip === 'Gaming') query = 'Show gaming keyboards and accessories';
    else if (chip === 'Fashion') query = 'Show premium smartwatches and wearables';
    else if (chip === 'Electronics') query = 'Show all top electronic gadgets';
    else if (chip === 'Earbuds under ₹3000') query = 'I need wireless earbuds under ₹3000';

    sendUserMessage(query);
  };

  const toggleVoice = () => {
    if (!isListening) {
      setIsListening(true);
      toast.info('Voice Assistant listening...', {
        description: 'Speak your shopping requirements naturally',
      });
      // Simulate speech-to-text after 2.5s
      setTimeout(() => {
        setIsListening(false);
        setInput('I need wireless earbuds under ₹3000 with active noise cancellation');
        toast.success('Voice captured!');
      }, 2500);
    } else {
      setIsListening(false);
    }
  };

  return (
    <div className="w-full space-y-2.5">
      {/* Quick Suggestion Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar px-1">
        <span className="text-[11px] font-mono text-zinc-400 shrink-0 flex items-center gap-1 mr-1">
          <Sparkles className="w-3 h-3 text-violet-400" />
          Quick:
        </span>
        {QUICK_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => handleChipClick(chip)}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 hover:border-violet-500/40 whitespace-nowrap transition-all active:scale-95 shadow-sm"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Main Input Box */}
      <form
        onSubmit={handleSubmit}
        className={`relative rounded-2xl border ${
          isListening
            ? 'border-rose-500/60 shadow-lg shadow-rose-500/20 bg-rose-950/10'
            : 'border-white/15 focus-within:border-violet-500/60 focus-within:shadow-lg focus-within:shadow-violet-500/10 bg-zinc-900/90'
        } backdrop-blur-2xl transition-all duration-300 p-2 sm:p-3 flex flex-col gap-2`}
      >
        <div className="flex items-end gap-2">
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={toggleVoice}
            className={`p-2.5 rounded-xl transition-all ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
            }`}
            title={isListening ? 'Stop listening' : 'Voice search'}
            aria-label="Voice search"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder={
              isListening
                ? 'Listening to your voice... speak now'
                : 'Ask anything... "Wireless earbuds under ₹3000" or "Compare smartwatches"'
            }
            className="flex-1 bg-transparent text-sm sm:text-base text-zinc-100 placeholder:text-zinc-400 resize-none outline-none py-1 px-1 max-h-36 overflow-y-auto leading-relaxed"
          />

          {/* Clear Text button */}
          {input && (
            <button
              type="button"
              onClick={() => setInput('')}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
              aria-label="Clear input"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className={`p-2.5 sm:px-4 sm:py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 ${
              input.trim() && !isGenerating
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 shadow-violet-500/25'
                : 'bg-zinc-800 text-zinc-400 cursor-not-allowed border border-white/5'
            }`}
            aria-label="Send message"
          >
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span className="hidden sm:inline">Ask AI</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Bottom Helpers */}
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 px-1 pt-1 border-t border-white/5">
          <div className="flex items-center gap-2">
            <span>Powered by GPT-4o & Neural Commerce Engine</span>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-white/10 text-[10px] text-zinc-300">
              Enter ↵
            </kbd>
            <span>to send</span>
          </div>
        </div>
      </form>
    </div>
  );
};
