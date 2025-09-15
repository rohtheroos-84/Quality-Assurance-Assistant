import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PersonaSelector } from './PersonaSelector';
import { FileUpload } from './FileUpload';
import { ToolGenerator } from './ToolGenerator';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPersona: string;
  onPersonaChange: (persona: string) => void;
  uploadedFiles: any[];
  onFilesChange: (files: any[]) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  selectedPersona,
  onPersonaChange,
  uploadedFiles,
  onFilesChange
}) => {
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden"
            style={{ zIndex: 'var(--z-overlay)' }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ zIndex: 'var(--z-sidebar)' }}
        className={`fixed lg:relative left-0 top-0 h-full w-80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-2xl ${
          isOpen ? '' : 'lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">🎯</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white font-['Poppins']">QA Assistant</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">AI-Powered Tools</p>
                </div>
              </motion.div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="lg:hidden w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Persona Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <PersonaSelector
                selectedPersona={selectedPersona}
                onPersonaChange={onPersonaChange}
              />
            </motion.div>

            {/* File Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <FileUpload
                uploadedFiles={uploadedFiles}
                onFilesChange={onFilesChange}
              />
            </motion.div>

            {/* Quick Tools */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ToolGenerator />
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="p-6 border-t border-gray-200/50"
          >
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Powered by AI</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Online</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.aside>
    </>
  );
};