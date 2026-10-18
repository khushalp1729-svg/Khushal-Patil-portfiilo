import React from 'react';
import { useStage } from '../context/StageContext';

export const GlitchOverlay: React.FC = () => {
  const { glitchTrigger, isBlackout, triggerBlackout } = useStage();

  if (isBlackout) {
    return (
      <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center pointer-events-auto select-none">
        <div className="border-2 border-[#ffb4ab] bg-[#93000a]/30 p-8 max-w-lg text-center backdrop-blur-md shadow-[0_0_50px_rgba(255,180,171,0.5)]">
          <div className="font-['JetBrains_Mono'] text-sm text-[#ffb4ab] tracking-widest uppercase mb-2 animate-pulse">
            ⚠️ EMERGENCY OVERRIDE
          </div>
          <h2 className="font-['Space_Grotesk'] text-3xl font-bold text-white mb-4">
            PANIC BLACKOUT ACTIVE
          </h2>
          <p className="font-['JetBrains_Mono'] text-xs text-[#ffdad6] mb-6">
            ALL DMX CHANNELS AT ZERO · AUDIO MASTER MUTED (-∞ dB) · NEURAL TRACKERS SUSPENDED
          </p>
          <button
            onClick={triggerBlackout}
            className="px-6 py-2.5 bg-[#ffdad6] hover:bg-white text-[#690005] font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer shadow-[0_0_15px_#ffdad6]"
          >
            DISENGAGE BLACKOUT (RESTORE RIG)
          </button>
        </div>
      </div>
    );
  }

  if (!glitchTrigger) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {/* Glitch Strobe Flash */}
      <div 
        className={`absolute inset-0 transition-opacity duration-150 ${
          glitchTrigger === 'DROP'
            ? 'bg-gradient-to-t from-[#00ff87]/30 via-white/10 to-[#00dbe9]/30 mix-blend-screen animate-pulse'
            : glitchTrigger === 'TEAR'
            ? 'bg-gradient-to-r from-red-500/20 via-cyan-500/20 to-purple-500/20 mix-blend-color-dodge'
            : 'bg-white/20 mix-blend-overlay'
        }`}
      />
      {/* Scanline glitch lines */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,135,0.15)_3px,transparent_4px)]"></div>
    </div>
  );
};
