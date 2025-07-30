/**
 * Device detection and performance optimization utilities
 */

export interface DeviceCapabilities {
  isLowEndDevice: boolean;
  supportsAdvancedAnimations: boolean;
  preferReducedMotion: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  hasGoodConnection: boolean;
}

/**
 * Detect device capabilities for animation optimization
 */
export function detectDeviceCapabilities(): DeviceCapabilities {
  // Check for reduced motion preference
  const preferReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Basic device type detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)|Android(?=.*\bTablet\b)/i.test(navigator.userAgent);
  const isDesktop = !isMobile && !isTablet;
  
  // Performance indicators
  const hardwareConcurrency = navigator.hardwareConcurrency || 2;
  const deviceMemory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4;
  
  // Network connection quality
  const connection = (navigator as unknown as { connection?: { effectiveType?: string } }).connection;
  const hasGoodConnection = !connection || 
    (connection.effectiveType !== 'slow-2g' && connection.effectiveType !== '2g');
  
  // Determine if device is low-end
  const isLowEndDevice = hardwareConcurrency <= 2 || deviceMemory <= 2 || !hasGoodConnection;
  
  // Check for advanced animation support
  const supportsAdvancedAnimations = !isLowEndDevice && 
    !preferReducedMotion && 
    'requestAnimationFrame' in window &&
    'transform' in document.documentElement.style;
  
  return {
    isLowEndDevice,
    supportsAdvancedAnimations,
    preferReducedMotion,
    isMobile,
    isTablet,
    isDesktop,
    hasGoodConnection
  };
}

/**
 * Get optimized animation settings based on device capabilities
 */
export function getOptimizedAnimationSettings(capabilities: DeviceCapabilities) {
  if (capabilities.preferReducedMotion) {
    return {
      duration: 0,
      stagger: 0,
      enableAnimations: false,
      enableTransforms: false
    };
  }
  
  if (capabilities.isLowEndDevice) {
    return {
      duration: 0.3,
      stagger: 0.02,
      enableAnimations: true,
      enableTransforms: false
    };
  }
  
  return {
    duration: 0.6,
    stagger: 0.05,
    enableAnimations: true,
    enableTransforms: true
  };
}

/**
 * Apply performance optimizations based on device
 */
export function applyPerformanceOptimizations(capabilities: DeviceCapabilities) {
  const root = document.documentElement;
  
  if (capabilities.isLowEndDevice) {
    root.style.setProperty('--animation-quality', 'low');
    root.style.setProperty('--blur-effects', 'none');
    root.style.setProperty('--backdrop-filter', 'none');
  } else if (capabilities.isMobile) {
    root.style.setProperty('--animation-quality', 'medium');
    root.style.setProperty('--blur-effects', 'blur(4px)');
    root.style.setProperty('--backdrop-filter', 'blur(4px)');
  } else {
    root.style.setProperty('--animation-quality', 'high');
    root.style.setProperty('--blur-effects', 'blur(8px)');
    root.style.setProperty('--backdrop-filter', 'blur(8px)');
  }
  
  // Add device class to body for CSS targeting
  document.body.classList.add(
    capabilities.isMobile ? 'device-mobile' : 
    capabilities.isTablet ? 'device-tablet' : 'device-desktop'
  );
  
  if (capabilities.isLowEndDevice) {
    document.body.classList.add('device-low-end');
  }
  
  if (capabilities.preferReducedMotion) {
    document.body.classList.add('reduce-motion');
  }
}