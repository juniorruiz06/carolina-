import { useState, useEffect } from 'react';

/**
 * Hook para detectar dispositivos móviles y orientación
 * Útil para optimizar la experiencia de usuario en móviles
 */

interface UseMobileReturn {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: 'portrait' | 'landscape';
  screenSize: 'sm' | 'md' | 'lg' | 'xl';
  isTouchDevice: boolean;
}

export const useMobile = (): UseMobileReturn => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      
      setOrientation(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
    };

    // Set initial values
    handleResize();

    // Listen for resize events
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Determine device type based on screen width
  const isMobile = windowSize.width < 768; // < md
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024; // md to lg
  const isDesktop = windowSize.width >= 1024; // >= lg

  // Determine screen size category
  const getScreenSize = (): 'sm' | 'md' | 'lg' | 'xl' => {
    if (windowSize.width < 640) return 'sm';
    if (windowSize.width < 768) return 'md';
    if (windowSize.width < 1024) return 'lg';
    return 'xl';
  };

  // Check if device supports touch
  const isTouchDevice = typeof window !== 'undefined' && (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore
    navigator.msMaxTouchPoints > 0
  );

  return {
    isMobile,
    isTablet,
    isDesktop,
    orientation,
    screenSize: getScreenSize(),
    isTouchDevice,
  };
};