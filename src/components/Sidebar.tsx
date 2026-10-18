import React, { useState } from 'react';
import { useStage } from '../context/StageContext';

export const Sidebar: React.FC = () => {
  const {
    hardware,
    triggerDrop,
    triggerGlitch,
    triggerBlackout,
    triggerRecordDump,
    consoleLocked,
    setConsoleLocked,
    isBlackout,
    addLog,
  } = useStage();

  const [slot, setSlot] = useState<string>('FOH_ALPHA');

  const cycleSlot = () => {
    const slots = ['FOH_ALPHA', 'FOH_BETA', 'BROADCAST_01', 'BACKSTAGE_RIG'];
    const next = slots[(slots.indexOf(slot) + 1) % slots.length];
    setSlot(next);
    addLog(`Operator slot switched to ${next}`, 'info');
  };

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-[#1a1b21] border-r border-[#34343a] z-40 flex flex-col justify-between p-3 overflow-y-auto">
      <div className="flex flex-col gap-5">
        {/* Hardware Matrix */}
        <div className="flex flex-col gap-1.5">
          <div className="font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9] font-bold tracking-widest px-1">
            HARDWARE MATRIX
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <div 
              onClick={() => addLog(`OPTIC LINK test ping: ${hardware.opticLinkMs}ms (Jitter: 0.02ms)`, 'info')}
              className="bg-[#1e1f25] hover:bg-[#292a2f] cursor-pointer p-1.5 rounded border border-[#3b4b3d]/40 transition-colors"
              title="Click to test ping"
            >
              <span className="font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9] block">OPTIC LINK</span>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#60ff98] font-bold">{hardware.opticLinkMs} MS</span>
            </div>
            <div 
              onClick={() => addLog(`DMX BUS status: Universe 1-8 active (Art-Net / sACN streaming)`, 'info')}
              className="bg-[#1e1f25] hover:bg-[#292a2f] cursor-pointer p-1.5 rounded border border-[#3b4b3d]/40 transition-colors"
              title="Click for DMX diagnostic"
            >
              <span className="font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9] block">DMX BUS</span>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#7df4ff] font-bold">{hardware.dmxBus}</span>
            </div>
            <div 
              className="bg-[#1e1f25] p-1.5 rounded border border-[#3b4b3d]/40"
            >
              <span className="font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9] block">TEMPO DRIFT</span>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#60ff98] font-bold">{hardware.tempoDrift}</span>
            </div>
            <div 
              className="bg-[#1e1f25] p-1.5 rounded border border-[#3b4b3d]/40"
            >
              <span className="font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9] block">NEURAL LAT</span>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#ddb7ff] font-bold">{hardware.neuralLatMs} MS</span>
            </div>
          </div>
        </div>

        {/* Tactical Triggers */}
        <div className="flex flex-col gap-1.5">
          <div className="font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9] font-bold tracking-widest px-1">
            TACTICAL TRIGGERS
          </div>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={triggerDrop}
              className="w-full text-left px-3 py-1.5 bg-[#00ff87] hover:bg-[#60ff98] text-[#007138] font-['JetBrains_Mono'] text-[10px] rounded flex items-center justify-between font-bold shadow-[0_0_8px_#00ff87] active:scale-95 transition-all cursor-pointer"
              type="button"
            >
              <span>TRIGGER DROP</span>
              <span className="font-['JetBrains_Mono'] text-[9px]">[F1]</span>
            </button>

            <button
              onClick={() => triggerGlitch('SIDEBAR_SPIKE')}
              className="w-full text-left px-3 py-1.5 bg-[#1e1f25] hover:bg-[#292a2f] border border-[#00dbe9] font-['JetBrains_Mono'] text-[10px] text-[#7df4ff] rounded flex items-center justify-between active:scale-95 transition-all cursor-pointer shadow-[0_0_6px_rgba(0,219,233,0.2)]"
              type="button"
            >
              <span>ENGAGE GLITCH SPIKE</span>
              <span className="font-['JetBrains_Mono'] text-[9px]">[F2]</span>
            </button>

            <button
              onClick={triggerRecordDump}
              className="w-full text-left px-3 py-1.5 bg-[#1e1f25] hover:bg-[#292a2f] border border-[#3b4b3d] font-['JetBrains_Mono'] text-[10px] text-[#e3e1e9] rounded flex items-center justify-between active:scale-95 transition-all cursor-pointer"
              type="button"
            >
              <span>RECORD DUMP</span>
              <span className="font-['JetBrains_Mono'] text-[9px]">[F3]</span>
            </button>

            <button
              onClick={triggerBlackout}
              className={`w-full text-left px-3 py-1.5 border border-[#ffb4ab] font-['JetBrains_Mono'] text-[10px] rounded flex items-center justify-between font-bold active:scale-95 transition-all cursor-pointer ${
                isBlackout
                  ? 'bg-[#690005] text-white animate-pulse'
                  : 'bg-[#93000a] hover:bg-[#690005] text-[#ffdad6]'
              }`}
              type="button"
            >
              <span>PANIC BLACKOUT</span>
              <span className="font-['JetBrains_Mono'] text-[9px]">[ESC]</span>
            </button>
          </div>
        </div>

        {/* Active Signals */}
        <div className="flex flex-col gap-1.5">
          <div className="font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9] font-bold tracking-widest px-1">
            ACTIVE SIGNALS
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between bg-[#1e1f25] px-2 py-1.5 rounded">
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#e3e1e9]">AUDIO MASTER</span>
              <span className="flex items-center gap-1 font-['JetBrains_Mono'] text-[9px] text-[#60ff98] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#60ff98] animate-pulse"></span>
                +2.4 dB
              </span>
            </div>
            <div className="flex items-center justify-between bg-[#1e1f25] px-2 py-1.5 rounded">
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#e3e1e9]">STAGE CAMERA 01</span>
              <span className="flex items-center gap-1 font-['JetBrains_Mono'] text-[9px] text-[#60ff98] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#60ff98]"></span>
                FEED OK
              </span>
            </div>
            <div className="flex items-center justify-between bg-[#1e1f25] px-2 py-1.5 rounded">
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#e3e1e9]">PUPPET RIG-A</span>
              <span className="flex items-center gap-1 font-['JetBrains_Mono'] text-[9px] text-[#7df4ff] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7df4ff]"></span>
                TRACKING
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Console Lock & Slot Switcher */}
      <div className="pt-3 border-t border-[#34343a]/40 flex items-center justify-between font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9]">
        <button
          onClick={() => {
            const next = !consoleLocked;
            setConsoleLocked(next);
            addLog(next ? 'Console locked (accidental clicks restricted)' : 'Console unlocked', 'info');
          }}
          className="hover:text-[#f1ffef] transition-colors cursor-pointer"
        >
          CONSOLE LOCK: <span className={consoleLocked ? 'text-[#ffb4ab] font-bold' : 'text-[#60ff98]'}>{consoleLocked ? 'ON' : 'OFF'}</span>
        </button>
        <button
          onClick={cycleSlot}
          className="hover:text-[#7df4ff] transition-colors cursor-pointer"
          title="Click to switch operator slot"
        >
          SLOT: <span className="text-[#f1ffef] font-bold">{slot}</span>
        </button>
      </div>
    </aside>
  );
};
