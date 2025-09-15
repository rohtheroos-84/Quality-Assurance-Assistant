import React from 'react';
import { Particles } from './Particles';
import { useTheme } from '../../context/ThemeContext';

export const BackgroundParticles: React.FC = () => {
  const { colors, mode } = useTheme();
  
  return (
    <div className="absolute inset-0 overflow-hidden isolate pointer-events-none">
      <div 
        className="absolute inset-0"
        style={{
          background: mode === 'dark' 
            ? 'linear-gradient(to bottom, #000000bb, #111827bb)'
            : 'linear-gradient(to bottom, #ffffffbb, #f3f4f6bb)',
        }}
      />
      <Particles
        className="absolute inset-0"
        quantity={30}
        ease={30}
        size={0.8}
        color={colors.accent}
        refresh={false}
        staticity={40}
      />
    </div>
  );
};