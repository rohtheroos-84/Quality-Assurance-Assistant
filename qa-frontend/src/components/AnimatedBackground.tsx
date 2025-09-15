import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  variant?: 'default' | 'novice' | 'expert' | 'skeptical';
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ variant = 'default' }) => {
  // Defining color gradients per variant
  const gradients = {
    default: ['rgba(79, 70, 229, 0.1)', 'rgba(139, 92, 246, 0.1)', 'rgba(16, 185, 129, 0.1)'],
    novice: ['rgba(249, 168, 212, 0.1)', 'rgba(216, 180, 254, 0.1)', 'rgba(129, 140, 248, 0.1)'],
    expert: ['rgba(59, 130, 246, 0.1)', 'rgba(99, 102, 241, 0.1)', 'rgba(139, 92, 246, 0.1)'],
    skeptical: ['rgba(251, 146, 60, 0.1)', 'rgba(234, 88, 12, 0.1)', 'rgba(249, 115, 22, 0.1)']
  };

  const colors = gradients[variant];

  return (
    <div style={{ zIndex: 'var(--z-background)' }} className="fixed inset-0 overflow-hidden bg-white dark:bg-[#0D1117]">
      {/* Gradient blobs */}
      <motion.div
        className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full filter blur-3xl opacity-30"
        animate={{
          background: colors,
          x: [-50, 50, -50],
          y: [-50, 50, -50],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          background: `radial-gradient(circle, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full filter blur-3xl opacity-30"
        animate={{
          background: colors.reverse(),
          x: [50, -50, 50],
          y: [50, -50, 50],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          background: `radial-gradient(circle, ${colors[2]} 0%, ${colors[1]} 50%, ${colors[0]} 100%)`
        }}
      />
    </div>
  );
};