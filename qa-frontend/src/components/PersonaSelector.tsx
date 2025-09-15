import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

interface PersonaSelectorProps {
  selectedPersona: string;
  onPersonaChange: (persona: string) => void;
}

const personas = [
  {
    id: 'Novice Guide',
    name: 'Novice Guide',
    description: 'Explains tools simply with analogies',
    emoji: '🌱',
    colors: {
      light: {
        gradient: 'from-blue-400 via-indigo-500 to-purple-600',
        bg: 'bg-blue-50',
        border: 'border-indigo-200',
        text: 'text-indigo-700'
      },
      dark: {
        gradient: 'from-blue-500 via-indigo-600 to-purple-700',
        bg: 'bg-indigo-900/20',
        border: 'border-indigo-700',
        text: 'text-indigo-400'
      }
    }
  },
  {
    id: 'Expert Consultant',
    name: 'Expert Consultant',
    description: 'Uses technical terms and advanced methods',
    emoji: '🎓',
    colors: {
      light: {
        gradient: 'from-indigo-500 via-blue-600 to-cyan-600',
        bg: 'bg-indigo-50',
        border: 'border-blue-200',
        text: 'text-blue-700'
      },
      dark: {
        gradient: 'from-indigo-600 via-blue-700 to-cyan-700',
        bg: 'bg-blue-900/20',
        border: 'border-blue-700',
        text: 'text-blue-400'
      }
    }
  },
  {
    id: 'Skeptical Manager',
    name: 'Skeptical Manager',
    description: 'Challenges recommendations and asks for proof',
    emoji: '🤔',
    colors: {
      light: {
        gradient: 'from-orange-500 via-amber-500 to-yellow-500',
        bg: 'bg-orange-50',
        border: 'border-amber-200',
        text: 'text-amber-700'
      },
      dark: {
        gradient: 'from-orange-600 via-amber-600 to-yellow-600',
        bg: 'bg-amber-900/20',
        border: 'border-amber-700',
        text: 'text-amber-400'
      }
    }
  }
];

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  selectedPersona,
  onPersonaChange
}) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  
  return (
    <div className="space-y-4">
      <h3 className={`text-lg font-semibold font-['Poppins'] flex items-center space-x-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
        <span>🎭</span>
        <span>Chatbot Persona</span>
      </h3>
      
      <div className="space-y-3">
        {personas.map((persona, index) => {
          const colors = isDark ? persona.colors.dark : persona.colors.light;
          
          return (
            <motion.button
              key={persona.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPersonaChange(persona.id)}
              className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 ${
                selectedPersona === persona.id
                  ? `${colors.bg} ${colors.border} shadow-lg`
                  : isDark
                    ? 'bg-gray-800/60 backdrop-blur-sm border-gray-700 hover:border-gray-600 hover:shadow-md'
                    : 'bg-white/60 backdrop-blur-sm border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center space-x-4">
                <motion.div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg ${
                    selectedPersona === persona.id ? 'ring-2 ring-white/50' : ''
                  }`}
                  animate={selectedPersona === persona.id ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-2xl">{persona.emoji}</span>
                </motion.div>
                
                <div className="flex-1 text-left">
                  <h4 className={`font-semibold text-sm ${
                    selectedPersona === persona.id ? colors.text : isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {persona.name}
                  </h4>
                  <p className={`text-xs mt-1 ${
                    selectedPersona === persona.id ? colors.text : isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {persona.description}
                  </p>
                </div>

                {/* Selection indicator */}
                <motion.div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedPersona === persona.id
                      ? `border-current ${colors.text}`
                      : isDark ? 'border-gray-600' : 'border-gray-300'
                  }`}
                  animate={selectedPersona === persona.id ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {selectedPersona === persona.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-3 h-3 rounded-full bg-current"
                    />
                  )}
                </motion.div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};