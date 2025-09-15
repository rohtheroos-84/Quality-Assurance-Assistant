import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark';
type PersonaType = 'novice' | 'expert' | 'skeptical';

interface ThemeContextType {
  mode: ThemeMode;
  persona: PersonaType;
  setMode: (mode: ThemeMode) => void;
  setPersona: (persona: PersonaType) => void;
  toggleMode: () => void;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    border: string;
    card: string;
  };
}

const personaThemes = {
  novice: {
    light: {
      primary: '#4F46E5',
      secondary: '#8B5CF6',
      accent: '#10B981',
      background: '#FFFFFF',
      text: '#1F2937',
      border: '#E5E7EB',
      card: 'rgba(255, 255, 255, 0.8)',
    },
    dark: {
      primary: '#818CF8',
      secondary: '#A78BFA',
      accent: '#34D399',
      background: '#0D1117',
      text: '#F3F4F6',
      border: '#374151',
      card: 'rgba(22, 27, 34, 0.8)',
    },
  },
  expert: {
    light: {
      primary: '#2563EB',
      secondary: '#4F46E5',
      accent: '#3B82F6',
      background: '#FFFFFF',
      text: '#1F2937',
      border: '#E5E7EB',
      card: 'rgba(255, 255, 255, 0.8)',
    },
    dark: {
      primary: '#3B82F6',
      secondary: '#6366F1',
      accent: '#60A5FA',
      background: '#0D1117',
      text: '#F3F4F6',
      border: '#374151',
      card: 'rgba(22, 27, 34, 0.8)',
    },
  },
  skeptical: {
    light: {
      primary: '#F97316',
      secondary: '#EA580C',
      accent: '#FB923C',
      background: '#FFFFFF',
      text: '#1F2937',
      border: '#E5E7EB',
      card: 'rgba(255, 255, 255, 0.8)',
    },
    dark: {
      primary: '#FB923C',
      secondary: '#F97316',
      accent: '#FDBA74',
      background: '#0D1117',
      text: '#F3F4F6',
      border: '#374151',
      card: 'rgba(22, 27, 34, 0.8)',
    },
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('themeMode');
    return (saved as ThemeMode) || 'light';
  });
  const [persona, setPersona] = useState<PersonaType>('novice');

  useEffect(() => {
    // Update stored preferences and classes
    localStorage.setItem('themeMode', mode);
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);

  const toggleMode = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  const colors = personaThemes[persona][mode];

  const value = {
    mode,
    persona,
    setMode,
    setPersona,
    toggleMode,
    colors,
  };

  useEffect(() => {
    // Update data attributes for CSS variables
    document.documentElement.dataset.theme = mode;
    document.documentElement.dataset.persona = persona;
  }, [mode, persona]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};