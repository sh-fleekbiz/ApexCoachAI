import { useMediaQuery } from './useMediaQuery.js';

/**
 * Hook to detect if the current viewport is mobile-sized
 * Uses breakpoint: < 768px for mobile
 * @returns boolean indicating if the viewport is mobile-sized
 */
export function useMobile(): boolean {
  return useMediaQuery('(max-width: 767px)');
}

/**
 * Hook to detect if the current viewport is tablet-sized
 * Uses breakpoint: 768px - 1024px for tablet
 * @returns boolean indicating if the viewport is tablet-sized
 */
export function useTablet(): boolean {
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1024px)');
  return isTablet;
}

/**
 * Hook to detect if the current viewport is desktop-sized
 * Uses breakpoint: > 1024px for desktop
 * @returns boolean indicating if the viewport is desktop-sized
 */
export function useDesktop(): boolean {
  return useMediaQuery('(min-width: 1025px)');
}

