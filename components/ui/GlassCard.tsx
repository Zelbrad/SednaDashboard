import React, { ReactNode, useRef } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  onClick,
  hoverEffect = true
}) => {
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    divRef.current.style.setProperty('--mouse-x', `${x}px`);
    divRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={`
        group relative overflow-hidden rounded-2xl
        bg-sedna-glass backdrop-blur-xl border border-sedna-glassBorder
        shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]
        transition-all duration-500 ease-out
        ${hoverEffect ? 'hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(255,0,0,0.1)]' : ''}
        ${className}
      `}
    >
      {/* Spotlight Border Effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(700px circle at var(--mouse-x) var(--mouse-y), rgba(3, 3, 3, 0.57), transparent 40%)`,
          zIndex: 1
        }}
      />

      {/* Content Layer */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};