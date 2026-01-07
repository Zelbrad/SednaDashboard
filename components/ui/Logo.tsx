import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <img
    src="/logo.png"
    alt="Sedna Logo"
    className={className}
    style={{ objectFit: 'contain' }}
  />
);