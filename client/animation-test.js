// Simple animation test script
console.log('Testing animation fixes...');

// Test device detection
function testDeviceDetection() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const preferReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hardwareConcurrency = navigator.hardwareConcurrency || 2;
  
  console.log('Device Detection Results:');
  console.log('- Is Mobile:', isMobile);
  console.log('- Prefers Reduced Motion:', preferReducedMotion);
  console.log('- Hardware Concurrency:', hardwareConcurrency);
  
  return { isMobile, preferReducedMotion, hardwareConcurrency };
}

// Test CSS animation support
function testCSSAnimationSupport() {
  const testElement = document.createElement('div');
  const animationSupport = {
    animation: 'animation' in testElement.style,
    transform: 'transform' in testElement.style,
    willChange: 'willChange' in testElement.style,
    backfaceVisibility: 'backfaceVisibility' in testElement.style
  };
  
  console.log('CSS Animation Support:');
  Object.entries(animationSupport).forEach(([key, value]) => {
    console.log(`- ${key}:`, value);
  });
  
  return animationSupport;
}

// Test GSAP availability (if loaded)
function testGSAPAvailability() {
  const gsapAvailable = typeof window.gsap !== 'undefined';
  console.log('GSAP Available:', gsapAvailable);
  
  if (gsapAvailable) {
    console.log('GSAP Version:', window.gsap.version);
  }
  
  return gsapAvailable;
}

// Run tests
document.addEventListener('DOMContentLoaded', () => {
  console.log('=== Animation Compatibility Test ===');
  
  const deviceInfo = testDeviceDetection();
  const cssSupport = testCSSAnimationSupport();
  const gsapAvailable = testGSAPAvailability();
  
  // Test performance optimizations
  const root = document.documentElement;
  if (deviceInfo.isMobile) {
    root.style.setProperty('--animation-quality', 'medium');
    console.log('Applied mobile optimizations');
  } else {
    root.style.setProperty('--animation-quality', 'high');
    console.log('Applied desktop optimizations');
  }
  
  if (deviceInfo.preferReducedMotion) {
    document.body.classList.add('reduce-motion');
    console.log('Applied reduced motion settings');
  }
  
  console.log('=== Test Complete ===');
  console.log('Animation fixes should now work across devices!');
});