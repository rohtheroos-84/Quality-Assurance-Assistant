import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs, vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../context/ThemeContext';

interface MessageBubbleProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  };
  selectedPersona?: string;
}

const getPersonaAvatar = (persona: string) => {
  const avatars = {
    'Novice Guide': { emoji: '🌱', color: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    'Expert Consultant': { emoji: '👨‍💻', color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    'Skeptical Manager': { emoji: '🤔', color: 'from-orange-500 to-amber-600', bg: 'bg-orange-50', border: 'border-orange-200' }
  };
  return avatars[persona as keyof typeof avatars] || avatars['Novice Guide'];
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, selectedPersona = 'Novice Guide' }) => {
  const { colors, mode } = useTheme();
  const isUser = message.role === 'user';
  const personaInfo = getPersonaAvatar(selectedPersona);
  const isDark = mode === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ zIndex: 'var(--z-content)' }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex items-start space-x-3 max-w-3xl ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        {!isUser && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={`w-10 h-10 rounded-full bg-gradient-to-br ${personaInfo.color} flex items-center justify-center shadow-lg`}
          >
            <span className="text-white text-lg">{personaInfo.emoji}</span>
          </motion.div>
        )}

        {/* Message Content */}
        <motion.div
          initial={{ opacity: 0, x: isUser ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: isUser 
              ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
              : isDark ? `${colors.card}` : `${colors.background}90`,
            borderColor: isUser ? 'transparent' : colors.border,
            color: isUser ? '#fff' : colors.text
          }}
          className={`relative backdrop-blur-sm border rounded-2xl px-6 py-4 shadow-lg ${
            isUser ? 'rounded-br-md' : 'rounded-bl-md'
          }`}
        >
          {/* Message text */}
          <div className={`prose prose-sm max-w-none ${isUser ? 'prose-invert' : ''}`}>
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      {...props}
                      style={vs}
                      language={match[1]}
                      PreTag="div"
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code 
                      {...props} 
                      style={{
                        background: isDark ? colors.card : 'rgba(0,0,0,0.05)',
                        color: colors.text
                      }}
                      className="rounded px-1"
                    >
                      {children}
                    </code>
                  );
                },
                p({ children }: any) {
                  return (
                    <p style={{ color: isUser ? '#fff' : colors.text }} className="text-sm leading-relaxed">
                      {children}
                    </p>
                  );
                },
                strong({ children }: any) {
                  return (
                    <strong className={isUser ? 'text-white font-bold' : 'text-gray-900 dark:text-white font-bold'}>
                      {children}
                    </strong>
                  );
                },
                // Add handlers for other text elements
                li({ children }: any) {
                  return (
                    <li style={{ color: isUser ? '#fff' : colors.text }} className="text-sm">
                      {children}
                    </li>
                  );
                },
                h1({ children }: any) {
                  return (
                    <h1 style={{ color: isUser ? '#fff' : colors.text }} className="text-xl font-bold">
                      {children}
                    </h1>
                  );
                },
                h2({ children }: any) {
                  return (
                    <h2 style={{ color: isUser ? '#fff' : colors.text }} className="text-lg font-bold">
                      {children}
                    </h2>
                  );
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Timestamp */}
          <div className={`text-xs mt-2 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>

          {/* Decorative elements */}
          {!isUser && (
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-white/90 rounded-full"></div>
          )}
          {isUser && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full"></div>
          )}
        </motion.div>

        {/* User avatar */}
        {isUser && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center shadow-lg"
          >
            <span className="text-white text-lg">👤</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};