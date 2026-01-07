import React from 'react';
import { DarkVeil } from '../ui/DarkVeil';

export const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] bg-black">
      <div className="absolute inset-0 w-full h-full">
        <DarkVeil
          hueShift={-130}
          noiseIntensity={0}
          scanlineIntensity={0}
          speed={0.6}
          scanlineFrequency={0}
          warpAmount={0}
          resolutionScale={1.1}
        />
      </div>

      {/* Optional: Keeping a subtle vignette overlay to ground the dashboard edges if desired, else remove */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-black/60 pointer-events-none" />
    </div>
  );
};