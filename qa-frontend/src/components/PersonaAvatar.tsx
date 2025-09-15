import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

interface PersonaAvatarProps {
  type: 'novice' | 'expert' | 'skeptical';
  isActive?: boolean;
  onClick?: () => void;
}

const avatarAnimations = {
  novice: {
    scale: [1, 1.05, 1],
    transition: { 
      duration: 2, 
      repeat: Infinity, 
      ease: "easeInOut" as const 
    }
  },
  expert: {
    scale: [1, 1.02, 1],
    rotate: [0, 2, -2, 0],
    transition: { 
      duration: 3, 
      repeat: Infinity, 
      ease: "linear" as const,
      rotate: { duration: 5 }
    }
  },
  skeptical: {
    scale: [1, 0.95, 1],
    transition: { 
      duration: 1.5, 
      repeat: Infinity, 
      ease: "easeInOut" as const 
    }
  }
};

const avatarEmojis = {
  novice: '👋',
  expert: '🎓',
  skeptical: '🤔'
};

const avatarGradients = {
  novice: {
    light: 'from-blue-400 to-indigo-500',
    dark: 'from-blue-500 to-indigo-600'
  },
  expert: {
    light: 'from-indigo-500 to-purple-600',
    dark: 'from-indigo-600 to-purple-700'
  },
  skeptical: {
    light: 'from-orange-400 to-red-500',
    dark: 'from-orange-500 to-red-600'
  }
};

export const PersonaAvatar: React.FC<PersonaAvatarProps> = ({ 
  type, 
  isActive = false,
  onClick 
}) => {
  const { mode, colors } = useTheme();
  const animations = avatarAnimations[type];
  const gradient = avatarGradients[type][mode];

  return (
    <motion.div
      initial={{ scale: 1 }}
      animate={isActive ? animations : {}}
      whileHover={{ 
        scale: 1.1,
        boxShadow: type === 'novice' 
          ? "0 0 20px rgba(139, 92, 246, 0.3)"
          : type === 'expert'
          ? "0 0 20px rgba(37, 99, 235, 0.3)"
          : "0 0 20px rgba(249, 115, 22, 0.3)"
      }}
      className={`
        relative w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer
        bg-gradient-to-br ${gradient} 
        ${isActive ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#0D1117] ring-current' : ''}
      `}
      onClick={onClick}
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        animate={{
          boxShadow: isActive 
            ? [
                `0 0 10px ${colors.primary}33`,
                `0 0 20px ${colors.primary}33`,
                `0 0 10px ${colors.primary}33`
              ]
            : 'none'
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Emoji with float animation */}
      <motion.span 
        className="text-xl relative z-10"
        animate={isActive ? {
          y: [0, -2, 0],
          scale: [1, 1.1, 1],
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {avatarEmojis[type]}
      </motion.span>
    </motion.div>
  );
};