import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  // Animation states: 'mounting' -> 'entering' -> 'active' -> 'dissolving' -> 'done'
  const [animationState, setAnimationState] = useState<'mounting' | 'entering' | 'active' | 'dissolving'>('mounting');

  useEffect(() => {
    // 1. Trigger entrance
    const enterTimer = setTimeout(() => {
      setAnimationState('entering');
    }, 40);

    // 2. Transition into active presentation state
    const holdTimer = setTimeout(() => {
      setAnimationState('active');
    }, 800);

    // 3. Begin smooth 800ms dissolve exit at 3.2 seconds
    const dissolveTimer = setTimeout(() => {
      setAnimationState('dissolving');
    }, 3200);

    // 4. Complete and unmount cleanly at exactly 4.0 seconds (4000ms)
    const finishTimer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(holdTimer);
      clearTimeout(dissolveTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  // Allow clicking anywhere to skip with a quick dissolve
  const handleSkip = () => {
    if (animationState === 'dissolving') return;
    setAnimationState('dissolving');
    setTimeout(() => {
      onComplete();
    }, 400);
  };

  const isDissolving = animationState === 'dissolving';
  const isMounting = animationState === 'mounting';

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white select-none cursor-pointer transition-all duration-800 ease-in-out ${
        isDissolving ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
      id="skillgo-splash-screen"
      style={{
        transitionProperty: 'opacity, transform',
        transitionDuration: isDissolving ? '800ms' : '600ms',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isDissolving ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      <div 
        className="flex flex-col items-center justify-center px-6 w-full max-w-4xl text-center transition-all duration-800 ease-in-out"
        style={{
          opacity: isMounting ? 0 : isDissolving ? 0 : 1,
          transform: isMounting 
            ? 'scale(0.94) translateY(6px)' 
            : isDissolving
            ? 'scale(1.02) translateY(-4px)'
            : 'scale(1) translateY(0px)',
          filter: isMounting ? 'blur(6px)' : isDissolving ? 'blur(3px)' : 'blur(0px)',
          transitionDuration: isDissolving ? '800ms' : '900ms',
        }}
      >
        
        {/* Animated Brand Wordmark */}
        <div className="flex items-center justify-center">
          <h1
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-black tracking-[0.14em] sm:tracking-[0.2em] md:tracking-[0.24em] uppercase select-none transition-all duration-1000 ease-out"
            style={{
              fontFamily: "'Syncopate', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              fontWeight: 700,
              letterSpacing: isMounting ? '0.08em' : '0.24em',
            }}
          >
            SKILLGO
          </h1>
        </div>

        {/* Subtle, ultra-clean aesthetic progress line animating across 3.2 seconds */}
        <div 
          className="mt-8 sm:mt-12 w-32 sm:w-44 h-[2.5px] bg-slate-100 rounded-full overflow-hidden transition-opacity duration-600"
          style={{
            opacity: isMounting || isDissolving ? 0 : 1,
          }}
        >
          <div 
            className="h-full bg-black rounded-full"
            style={{
              width: isMounting ? '0%' : '100%',
              transitionProperty: 'width',
              transitionDuration: '3200ms',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>

        {/* Small subtle tap-to-continue hint */}
        <span 
          className="mt-5 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-slate-300 font-medium transition-opacity duration-700 delay-500"
          style={{
            opacity: animationState === 'active' ? 0.65 : 0,
          }}
        >
          Tap anywhere to continue
        </span>

      </div>
    </div>
  );
}
