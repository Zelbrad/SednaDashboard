import React from 'react';
import { DarkVeil } from '../ui/DarkVeil';

export const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] bg-sedna-dark">
      <DarkVeil
        hueShift={-120}
        noiseIntensity={0}
        scanlineIntensity={0}
        speed={0.5}
        scanlineFrequency={0}
        warpAmount={0}
        resolutionScale={1}
        className="opacity-80" // Slight fade to blend with black bg
      />
      
      {/* Optional: Keeping a subtle vignette overlay to ground the dashboard edges */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-black/60 pointer-events-none" />
    </div>
  );
};