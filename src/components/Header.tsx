import React from 'react';
import { useStage } from '../context/StageContext';
import { ScreenId } from '../types';
import { Volume2, VolumeX } from 'lucide-react';

const NAV_ITEMS: { id: ScreenId; label: string }[] = [
  { id: 'master-director', label: 'Master Director' },
  { id: 'chaos-orchestra-engine', label: 'Chaos Orchestra Engine' },
  { id: 'shadow-theater-neural-rig', label: 'Shadow Theater Neural Rig' },
  { id: 'reality-glitcher-vfx', label: 'Reality Glitcher VFX' },
  { id: 'crowd-telemetry', label: 'Crowd Telemetry' },
  { id: 'global-rig-settings', label: 'Global Rig Settings' },
];

export const Header: React.FC = () => {
  const {
    activeScreen,
    setActiveScreen,
    bpm,
    audienceNodes,
    hardware,
    triggerDrop,
    triggerGlitch,
    triggerBlackout,
    isMuted,
    toggleAudioMute,
    isBlackout,
  } = useStage();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-[#1a1b21]/95 backdrop-blur-xl border-b border-[#34343a] flex items-center justify-between px-4">
      {/* Brand & Stage Telemetry */}
      <div className="flex items-center gap-5">
        <div 
          onClick={() => setActiveScreen('master-director')}
          className="flex items-center gap-3 cursor-pointer group"
          title="Return to Master Director"
        >
          <span className="flex h-2.5 w-2.5 rounded-full bg-[#60ff98] shadow-[0_0_8px_#60ff98] animate-pulse"></span>
          <span className="font-['Space_Grotesk'] text-lg font-semibold tracking-wider text-[#f1ffef] group-hover:text-[#60ff98] transition-colors">
            STITCH CARNIVAL
          </span>
          <span className="font-['JetBrains_Mono'] text-[9px] tracking-widest uppercase bg-[#34343a] px-1 py-0.5 rounded text-[#7df4ff]">
            V3.8-LIVE
          </span>
        </div>

        {/* Global Live Arena Telemetry Strip */}
        <div className="hidden xl:flex items-center gap-3 pl-3 border-l border-[#34343a]/60 font-['JetBrains_Mono'] text-[10px] tracking-wider text-[#b9cbb9]">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#60ff98]"></span>
            <span>ARENA:</span>
            <span className="text-[#f1ffef] font-bold">MAIN DECK</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7df4ff]"></span>
            <span>BPM:</span>
            <span className="text-[#d3fbff] font-bold">{bpm.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e478]"></span>
            <span>SYNC:</span>
            <span className="text-[#00e478] font-bold">LOCKED</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ddb7ff]"></span>
            <span>NODES:</span>
            <span className="text-[#f0dbff] font-bold">{audienceNodes.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#60ff98]"></span>
            <span>GPU:</span>
            <span className="text-[#f1ffef] font-bold">{hardware.gpuUsage}% {hardware.fps}FPS</span>
          </div>
        </div>
      </div>

      {/* Screen Navigation Tabs */}
      <nav className="hidden lg:flex items-center h-full">
        {NAV_ITEMS.map((item) => {
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              className={`flex items-center h-full px-3 text-[12px] font-['JetBrains_Mono'] transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#34343a] text-[#60ff98] border-b-2 border-[#00ff87] font-semibold'
                  : 'text-[#b9cbb9] hover:text-[#e3e1e9] hover:bg-[#1e1f25]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Right Tactical Quick Actions & Audio / Profile */}
      <div className="flex items-center gap-3">
        {/* Sound Feedback Mute Toggle */}
        <button
          onClick={toggleAudioMute}
          title={isMuted ? 'Unmute Live Audio Synthesizer' : 'Mute Live Audio Synthesizer'}
          className={`p-1.5 rounded border transition-colors ${
            isMuted 
              ? 'bg-[#292a2f] text-neutral-400 border-[#34343a]' 
              : 'bg-[#1e1f25] text-[#60ff98] border-[#3b4b3d] shadow-[0_0_6px_rgba(96,255,152,0.3)]'
          }`}
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>

        {/* Tactical Quick Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={triggerDrop}
            className="px-2 py-1 bg-[#1e1f25] hover:bg-[#292a2f] border border-[#3b4b3d] font-['JetBrains_Mono'] text-[9px] font-bold tracking-widest text-[#60ff98] transition-all active:scale-95 cursor-pointer shadow-[0_0_6px_rgba(96,255,152,0.2)]"
            type="button"
          >
            DROP
          </button>
          <button
            onClick={() => triggerGlitch('HEADER_SPIKE')}
            className="px-2 py-1 bg-[#1e1f25] hover:bg-[#292a2f] border border-[#3b4b3d] font-['JetBrains_Mono'] text-[9px] font-bold tracking-widest text-[#7df4ff] transition-all active:scale-95 cursor-pointer"
            type="button"
          >
            GLITCH
          </button>
          <button
            onClick={triggerBlackout}
            className={`px-2 py-1 border font-['JetBrains_Mono'] text-[9px] font-bold tracking-widest transition-all active:scale-95 cursor-pointer ${
              isBlackout
                ? 'bg-[#690005] border-[#ffb4ab] text-white animate-pulse'
                : 'bg-[#93000a] hover:bg-[#34343a] border-[#ffb4ab] text-[#ffdad6]'
            }`}
            type="button"
          >
            BLACKOUT
          </button>
        </div>

        {/* Director Profile Badge */}
        <div className="flex items-center gap-2 pl-3 border-l border-[#34343a]/60">
          <div className="text-right hidden sm:block">
            <div className="font-['JetBrains_Mono'] text-[10px] text-[#f1ffef] leading-none font-bold">DIR_01</div>
            <div className="font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9]">ONLINE</div>
          </div>
          <img
            alt="Director Profile"
            className="w-8 h-8 rounded-full object-cover ring-1 ring-[#00e478]"
            src="https://lh3.googleusercontent.com/aida/AEtjO1U_BBfWVLGIKurcy0iNK4uipY4pbSdp7qhHL1XWqXVBKRR21AF3WcZqO1rvlEwoLnBhgb1FktYz9_97XzzjtXaeu5feA0AsaNhxrw0sjI3Tw0JN-tO5b8Ht5i7ihy-9cUssZ5x595ZYetWI-GAUoLEtrkTN5kmU9_nnunXEegc49EEUElj437hpcBcYWDn57CLFFwLOB7Vvbi0g_dkuo7PYf2be5PqE5Vva-fanqvHMMrCw2w9HV0HDCw"
          />
        </div>
      </div>
    </header>
  );
};
