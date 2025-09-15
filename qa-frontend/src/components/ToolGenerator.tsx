import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { InfoCard } from './ui/InfoCard';

const tools = [
  {
    id: 'pareto',
    name: 'Pareto Chart',
    description: '80/20 analysis',
    emoji: '📊',
    color: 'from-red-500 to-pink-600',
    bg: 'bg-red-50',
    border: 'border-red-200'
  },
  {
    id: 'histogram',
    name: 'Histogram',
    description: 'Data distribution',
    emoji: '📈',
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200'
  },
  {
    id: 'control',
    name: 'Control Chart',
    description: 'Process monitoring',
    emoji: '⚙️',
    color: 'from-green-500 to-emerald-600',
    bg: 'bg-green-50',
    border: 'border-green-200'
  },
  {
    id: 'capability',
    name: 'Process Capability',
    description: 'Cp/Cpk analysis',
    emoji: '🎯',
    color: 'from-purple-500 to-violet-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200'
  },
  {
    id: 'fishbone',
    name: 'Fishbone Diagram',
    description: 'Root cause analysis',
    emoji: '🐟',
    color: 'from-orange-500 to-amber-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200'
  }
];

export const ToolGenerator: React.FC = () => {
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  
  const handleToolClick = (toolId: string) => {
    const newValue = activeToolId === toolId ? null : toolId;
    console.log('Setting activeToolId to:', newValue);
    setActiveToolId(newValue);
  };

  // Get active tool data
  const activeTool = tools.find(tool => tool.id === activeToolId);
  console.log('Current activeTool:', activeTool);

  return (
    <div className="space-y-4 relative">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white font-['Poppins'] flex items-center space-x-2">
        <span className="dark:text-white">⚡</span>
        <span>Quick Tools</span>
      </h3>
      
      <div className="grid grid-cols-1 gap-3">
        {tools.map((tool, index) => (
          <motion.button
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleToolClick(tool.id)}
            className={`p-4 rounded-2xl border-2 ${tool.bg} dark:bg-gray-800/50 ${tool.border} dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 group backdrop-blur-sm`}
          >
            <div className="flex items-center space-x-4">
              <motion.div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                whileHover={{ rotate: 5 }}
              >
                <span className="text-2xl">{tool.emoji}</span>
              </motion.div>
              
              <div className="flex-1 text-left">
                <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  {tool.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                  {tool.description}
                </p>
              </div>

              <motion.div
                className="w-6 h-6 rounded-full bg-white/60 dark:bg-white/10 flex items-center justify-center group-hover:bg-white/80 dark:group-hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <svg className="w-3 h-3 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Info card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-2xl border border-blue-200 dark:border-gray-700/50 backdrop-blur-sm"
      >
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm">💡</span>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-800 dark:text-gray-100 mb-1">Quick Start</h4>
            <p className="text-xs text-blue-600 dark:text-gray-300 leading-relaxed">
              Click any tool above or type your request in the chat to generate quality analysis charts instantly.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Info Card */}
      <InfoCard
        isOpen={activeToolId !== null}
        onClose={() => setActiveToolId(null)}
        title={activeTool?.name || ''}
        description={activeTool ? `Learn more about ${activeTool.name.toLowerCase()} and how it helps with ${activeTool.description.toLowerCase()}` : ''}
        icon={activeTool?.emoji || ''}
      />
    </div>
  );
};