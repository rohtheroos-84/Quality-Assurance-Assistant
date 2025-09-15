import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useTheme } from '../../context/ThemeContext';

interface InfoCardProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  icon: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  isOpen,
  onClose,
  title,
  description,
  icon
}) => {
  console.log('InfoCard render with props:', { isOpen, title, description, icon });
  const { colors } = useTheme();
  const portalRoot = document.body;
  if (!portalRoot) {
    console.error('Portal root element not found');
    return null;
  }

  console.log('Rendering portal with isOpen:', isOpen);
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          style={{
            background: `linear-gradient(135deg, ${colors.card}80, ${colors.background}60)`,
            borderColor: `${colors.border}40`,
            zIndex: 9999,
            position: 'fixed',
            right: '24px',
            top: '80px',
            width: '320px'
          }}
          className="p-6 rounded-2xl border backdrop-blur-xl shadow-2xl dark:bg-gray-800/50 dark:border-gray-700/50"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <div className="relative">
            <div className="flex items-center space-x-3 mb-3">
              <div 
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                }}
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              >
                <span className="text-xl">{icon}</span>
              </div>
              <h3 
                style={{ color: colors.text }}
                className="text-lg font-semibold"
              >
                {title}
              </h3>
            </div>
            <p 
              style={{ color: colors.text }}
              className="text-sm opacity-90"
            >
              {description}
            </p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                color: '#ffffff'
              }}
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              ✕
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    portalRoot
  );
};