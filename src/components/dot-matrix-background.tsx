"use client";

import { useEffect, useRef, ReactNode } from "react";

interface DotMatrixBackgroundProps {
  children?: ReactNode;
  className?: string;
}

export default function DotMatrixBackground({ children, className = "" }: DotMatrixBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      containerRef.current.style.setProperty('--mouse-x', `${x}px`);
      containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, var(--color-primary) 1px, transparent 0)',
            backgroundSize: '32px 32px',
            WebkitMaskImage: 'radial-gradient(circle 400px at var(--mouse-x, 50vw) var(--mouse-y, 50vh), black 0%, transparent 100%)',
            maskImage: 'radial-gradient(circle 400px at var(--mouse-x, 50vw) var(--mouse-y, 50vh), black 0%, transparent 100%)',
          }}
        />
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle 400px at var(--mouse-x, 50vw) var(--mouse-y, 50vh), rgba(34, 211, 238, 0.03) 0%, transparent 100%)',
          }}
        />
      </div>
      
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}