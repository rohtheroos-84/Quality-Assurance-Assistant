import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage, chatAPI } from '../services/api';
import { MessageBubble } from '../components/MessageBubble';
import { ChatInput } from '../components/ChatInput';
import { ChartDisplay } from '../components/ChartDisplay';
import { ParallaxContainer } from '../components/ParallaxContainer';
import ParticlesOGL from './ui/ParticlesOGL';
import { useTheme } from '../context/ThemeContext';

interface ChatInterfaceProps {
  selectedPersona: string;
  uploadedFiles: any[];
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  selectedPersona, 
  uploadedFiles 
}) => {
  const { colors } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Format uploaded files into the structure expected by the backend
      const fileContext = uploadedFiles.length > 0 
        ? uploadedFiles.map(file => {
            const isCSV = file.type === 'text/csv' || file.type.includes('excel');
            return {
              name: file.name,
              type: file.type,
              content: isCSV 
                ? JSON.stringify(file.uploadResponse?.data || [])
                : file.uploadResponse?.text || '',
              metadata: {
                columns: file.uploadResponse?.columns || [],
                ...file.uploadResponse?.metadata || {}
              }
            };
          })
        : [];

      const response = await chatAPI.sendMessage(
        message,
        messages,
        selectedPersona,
        undefined,
        JSON.stringify(fileContext)
      );

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        chartData: response.tool_result?.chart_data,
        toolType: response.tool_type,
        statistics: response.tool_result?.data_summary,
        chartMetadata: response.tool_result?.chart_metadata,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-sm">
      {/* Header */}
      <div className="bg-white/95 dark:bg-[#161B22]/95 backdrop-blur-md text-gray-900 dark:text-white p-4 border-b border-gray-200 dark:border-gray-700 flex-none">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-2xl">🎯</span>
            </div>
            <div>
              <h1 className="text-xl font-bold font-['Poppins']">Quality Assurance Assistant</h1>
              <p className="text-blue-100 text-sm">AI-Powered Quality Tools & Analysis</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Online</span>
          </div>
        </motion.div>
      </div>

      {/* Messages Area - using flex-1 to take remaining space */}
      <ParallaxContainer 
        style={{ zIndex: 'var(--z-content)' }}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/80 dark:bg-[#0D1117]/80 backdrop-blur-sm relative">
        {/* Particles Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
          <ParticlesOGL
            particleCount={200}
            particleSpread={10}
            speed={0.1}
            particleColors={[colors.accent, colors.primary, colors.secondary]}
            particleBaseSize={100}
            moveParticlesOnHover={true}
            alphaParticles={false}
            disableRotation={false}
          />
        </div>
        
        {/* Messages Content */}
        <div className="min-h-full relative" style={{ zIndex: 1 }}>
        {messages.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center justify-center h-full text-center space-y-6"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-4xl">🤖</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white font-['Poppins']">Welcome to QA Assistant</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-md">
                I'm your AI-powered quality assurance expert. Ask me about tools, methods, SOPs, or generate charts!
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "Generate a histogram",
                "Create a Pareto chart", 
                "Show me control charts",
                "Help with root cause analysis"
              ].map((suggestion, index) => (
                <motion.button
                  key={suggestion}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSendMessage(suggestion)}
                  className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full text-sm font-medium text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm"
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <MessageBubble message={message} selectedPersona={selectedPersona} />
              {message.chartData && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <ChartDisplay
                    chartData={message.chartData}
                    toolType={message.toolType || ''}
                    statistics={message.statistics}
                    chartMetadata={message.chartMetadata}
                  />
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 max-w-xs shadow-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🤖</span>
                </div>
                <div className="flex space-x-1">
                  <motion.div 
                    className="w-2 h-2 bg-blue-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div 
                    className="w-2 h-2 bg-blue-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div 
                    className="w-2 h-2 bg-blue-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
        </div>
      </ParallaxContainer>

      {/* Input Area - Fixed at bottom */}
      <div 
        style={{ zIndex: 'var(--z-input)' }}
        className="flex-none bg-white/95 dark:bg-[#161B22]/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 p-4">
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};