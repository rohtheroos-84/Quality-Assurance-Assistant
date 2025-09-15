import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

interface ParallaxContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const ParallaxContainer: React.FC<ParallaxContainerProps> = ({ children, className = '', style = {} }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const y = useSpring(0, springConfig);

  useEffect(() => {
    if (!ref.current) return;
    const element = ref.current;

    return scrollY.onChange((latest) => {
      if (!element) return;
      const elementTop = element.offsetTop;
      const elementHeight = element.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollPosition = latest;

      // Calculate parallax effect only when element is in view
      if (
        scrollPosition + windowHeight > elementTop &&
        scrollPosition < elementTop + elementHeight
      ) {
        const relativeScroll = (scrollPosition + windowHeight - elementTop) / (windowHeight + elementHeight);
        const parallaxValue = Math.min(20, Math.max(-20, (relativeScroll - 0.5) * 40));
        y.set(parallaxValue);
      }
    });
  }, [scrollY, y]);

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{ y, ...style }}
    >
      {children}
    </motion.div>
  );
};