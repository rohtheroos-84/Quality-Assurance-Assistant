import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const { colors } = useTheme();
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div 
          style={{
            background: `${colors.card}90`,
            borderColor: colors.border
          }}
          className="relative backdrop-blur-sm rounded-2xl border shadow-lg focus-within:shadow-xl transition-all duration-300">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              adjustTextareaHeight();
            }}
            onKeyPress={handleKeyPress}
            placeholder="Ask about QA tools, methods, SOPs, or generate charts..."
            disabled={disabled}
            style={{
              color: colors.text,
              minHeight: '56px',
              maxHeight: '120px'
            }}
            className="w-full px-6 py-4 pr-16 bg-transparent border-0 rounded-2xl resize-none focus:outline-none placeholder-gray-500 font-['Roboto'] text-sm leading-relaxed"
          />
          
          <motion.button
            type="submit"
            disabled={!message.trim() || disabled}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
              message.trim() && !disabled
                ? `bg-gradient-to-r from-${colors.primary} to-${colors.secondary} text-white shadow-lg hover:shadow-xl`
                : `${colors.card} text-gray-400 cursor-not-allowed`
            }`}
          >
            <motion.svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={disabled ? { rotate: 0 } : { rotate: message.trim() ? 0 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </motion.svg>
          </motion.button>
        </div>

        {/* Quick suggestions */}
        {message.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-4 flex flex-wrap gap-2"
          >
            {[
              "Generate histogram",
              "Create Pareto chart",
              "Show control charts",
              "Root cause analysis"
            ].map((suggestion, index) => (
              <motion.button
                key={suggestion}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMessage(suggestion)}
                style={{
                  background: `${colors.card}80`,
                  borderColor: colors.border,
                  color: colors.text
                }}
                className="px-3 py-1.5 backdrop-blur-sm border rounded-full text-xs font-medium transition-all duration-200 hover:shadow-md"
              >
                {suggestion}
              </motion.button>
            ))}
          </motion.div>
        )}
      </form>
    </motion.div>
  );
};