import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { SettingsModal } from './SettingsModal';
import { Particles } from './ui/Particles';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { mode, toggleMode, persona, colors } = useTheme();
  const isDark = mode === 'dark';
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: `linear-gradient(to right, ${colors.background}80, ${colors.card}80)`,
        borderColor: colors.border,
        zIndex: 'var(--z-header)'
      }}
      className="relative backdrop-blur-sm border-b shadow-sm overflow-hidden"
    >
      <Particles
        className="absolute inset-0"
        quantity={30}
        ease={50}
        color={colors.accent}
        refresh={false}
      />
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile menu button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuClick}
            className="lg:hidden w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>

          {/* Desktop logo */}
          <div className="hidden lg:flex items-center space-x-3">
            <motion.div
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
              }}
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white text-xl">🎯</span>
            </motion.div>
            <div>
              <h1 
                style={{ color: colors.text }}
                className="text-xl font-bold font-['Poppins']"
              >
                Quality Assurance Assistant
              </h1>
              <p 
                style={{ color: colors.secondary }}
                className="text-sm"
              >
                AI-Powered Quality Tools & Analysis
              </p>
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex items-center space-x-4">
            <motion.div 
              className="hidden sm:flex items-center space-x-2 px-3 py-2 rounded-full border"
              style={{
                background: `${colors.card}`,
                borderColor: colors.border
              }}
              whileHover={{ scale: 1.05 }}
              animate={{
                boxShadow: [
                  "0 0 0 rgba(0,0,0,0)",
                  "0 0 10px " + colors.accent + "40",
                  "0 0 0 rgba(0,0,0,0)"
                ]
              }}
              transition={{
                repeat: Infinity,
                duration: 2
              }}
            >
              <div 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: colors.accent }}
              ></div>
              <span 
                className="text-sm font-medium"
                style={{ color: colors.accent }}
              >
                Online
              </span>
            </motion.div>
            
            {/* Settings button */}
            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMode}
              style={{
                background: colors.card,
                color: colors.text
              }}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg"
            >
              {isDark ? (
                <svg style={{ color: colors.accent }} className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg style={{ color: colors.accent }} className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </motion.button>
            
            {/* Settings button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSettingsOpen(true)}
              style={{
                background: colors.card,
                color: colors.text
              }}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </motion.button>

            {/* Settings Modal */}
            <SettingsModal
              isOpen={isSettingsOpen}
              onClose={() => setIsSettingsOpen(false)}
            />
          </div>
        </div>
      </div>
    </motion.header>
  );
};