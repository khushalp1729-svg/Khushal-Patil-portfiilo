import React, { useState, useEffect, useRef } from 'react';
import { useStage } from '../../context/StageContext';
import { Play, Pause, RotateCcw, Volume2, Sparkles, Activity } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

export const ChaosOrchestraScreen: React.FC = () => {
  const { bpm, setBpm, chaosMult, setChaosMult, addLog } = useStage();
  const [isPlayingSeq, setIsPlayingSeq] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [filterCutoff, setFilterCutoff] = useState(1400);
  const [resonance, setResonance] = useState(4.2);
  const [delayFeedback, setDelayFeedback] = useState(65);
  const [drive, setDrive] = useState(38);

  // 16-step sequencer tracks
  const [sequenceGrid, setSequenceGrid] = useState<boolean[][]>([
    [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false], // Kick Sub
    [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false], // Snare / Clack
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],             // Hi-Hat Pulse
    [false, false, true, false, false, true, false, false, false, false, true, false, false, true, false, true],   // Granular Glitch
    [false, true, false, false, true, false, true, false, false, true, false, false, true, false, true, false],   // Neural Drone
  ]);

  const trackNames = ['SUB KICK 32Hz', 'NEURAL CLACK', 'OPTIC HI-HAT', 'GRANULAR GLITCH', 'CHIMERA DRONE'];

  // Step sequencer clock
  useEffect(() => {
    if (!isPlayingSeq) return;
    const intervalMs = (60 / bpm / 4) * 1000;
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        const next = (prev + 1) % 16;
        // Trigger audio for active tracks
        sequenceGrid.forEach((track, idx) => {
          if (track[next]) {
            if (idx === 0) audioEngine.playBlip(75, 0.08);
            else if (idx === 1) audioEngine.playBlip(320, 0.05);
            else if (idx === 2) audioEngine.playBlip(1200, 0.02);
            else if (idx === 3) audioEngine.playBlip(800 + Math.random() * 400, 0.04);
            else if (idx === 4) audioEngine.playBlip(180, 0.12);
          }
        });
        return next;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isPlayingSeq, bpm, sequenceGrid]);

  const toggleStep = (trackIdx: number, stepIdx: number) => {
    setSequenceGrid((prev) => {
      const next = prev.map((row) => [...row]);
      next[trackIdx][stepIdx] = !next[trackIdx][stepIdx];
      return next;
    });
  };

  const randomizePattern = () => {
    audioEngine.playGlitch();
    setSequenceGrid((prev) =>
      prev.map((row) => row.map(() => Math.random() > 0.65))
    );
    addLog('Chaos Orchestra: Generative mutation randomized steps', 'warn');
  };

  return (
    <div className="flex flex-col w-full text-[#e3e1e9] select-none pb-12 px-4 pt-2">
      {/* Top Banner */}
      <div className="bg-[#1a1b21] border border-[#34343a] p-3 mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#7df4ff]/10 border border-[#7df4ff] flex items-center justify-center text-[#7df4ff]">
            <Activity size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-['Space_Grotesk'] text-lg font-bold text-[#f1ffef]">
                CHAOS ORCHESTRA SYNTHESIS ENGINE
              </h1>
              <span className="font-['JetBrains_Mono'] text-[9px] bg-[#34343a] text-[#7df4ff] px-1.5 py-0.5 rounded font-bold">
                DSP CORE v4.1
              </span>
            </div>
            <p className="font-['JetBrains_Mono'] text-[10px] text-[#b9cbb9]">
              Multi-channel generative audio matrix · Neural-coupled granular synthesis & acoustic bus
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#1e1f25] px-3 py-1.5 border border-[#34343a]">
            <span className="font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9]">GLOBAL TEMPO:</span>
            <input
              type="number"
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="w-16 bg-[#0d0e13] px-2 py-0.5 font-['JetBrains_Mono'] text-[11px] text-[#60ff98] font-bold border border-[#34343a]"
            />
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#60ff98]">BPM</span>
          </div>

          <button
            onClick={() => setIsPlayingSeq(!isPlayingSeq)}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-['JetBrains_Mono'] text-[10px] font-bold rounded cursor-pointer transition-all ${
              isPlayingSeq
                ? 'bg-[#00ff87] text-[#007138] shadow-[0_0_8px_#00ff87]'
                : 'bg-[#292a2f] text-[#e3e1e9]'
            }`}
          >
            {isPlayingSeq ? <Pause size={13} /> : <Play size={13} />}
            <span>{isPlayingSeq ? 'SEQUENCER ACTIVE' : 'PAUSED'}</span>
          </button>

          <button
            onClick={randomizePattern}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e1f25] hover:bg-[#292a2f] border border-[#7df4ff] text-[#7df4ff] font-['JetBrains_Mono'] text-[10px] font-bold rounded cursor-pointer transition-all"
          >
            <Sparkles size={13} />
            <span>GEN_AI MUTATE</span>
          </button>
        </div>
      </div>

      {/* Grid Layout: Sequencer & DSP Synth Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-3">
        {/* Step Sequencer */}
        <div className="lg:col-span-8 bg-[#1e1f25] border border-[#34343a] p-3 flex flex-col">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#34343a]/60">
            <span className="font-['Space_Grotesk'] text-sm font-semibold text-[#f1ffef]">
              16-STEP POLYRHYTHMIC HARMONIC MATRIX
            </span>
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#60ff98]">
              STEP: {(activeStep + 1).toString().padStart(2, '0')} / 16
            </span>
          </div>

          {/* Tracks and grid buttons */}
          <div className="flex flex-col gap-2">
            {trackNames.map((name, trackIdx) => (
              <div key={name} className="flex items-center gap-2">
                <span className="w-28 font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9] truncate text-right pr-2">
                  {name}
                </span>
                <div className="grid grid-cols-16 flex-1 gap-1">
                  {sequenceGrid[trackIdx].map((isOn, stepIdx) => {
                    const isCurrent = activeStep === stepIdx;
                    return (
                      <button
                        key={stepIdx}
                        onClick={() => toggleStep(trackIdx, stepIdx)}
                        className={`h-9 rounded-none transition-all cursor-pointer border ${
                          isOn
                            ? trackIdx === 0
                              ? 'bg-[#60ff98] border-[#00ff87] shadow-[0_0_4px_#60ff98]'
                              : trackIdx === 1
                              ? 'bg-[#7df4ff] border-[#00dbe9] shadow-[0_0_4px_#7df4ff]'
                              : trackIdx === 2
                              ? 'bg-[#ddb7ff] border-[#8830d6]'
                              : trackIdx === 3
                              ? 'bg-[#ffb4ab] border-[#93000a]'
                              : 'bg-[#60ff98]/80 border-[#60ff98]'
                            : 'bg-[#0d0e13] border-[#34343a] hover:bg-[#292a2f]'
                        } ${isCurrent ? 'ring-2 ring-white z-10' : ''}`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-3 pt-2 border-t border-[#34343a]/40 font-['JetBrains_Mono'] text-[9px] text-[#849585]">
            <span>TEMPO CLOCK: INTERNAL (PRECISION ±0.001 MS)</span>
            <span>CLICK TO TOGGLE STEPS · AUTOPLAY ENABLED</span>
          </div>
        </div>

        {/* DSP Synth Filters & Knobs */}
        <div className="lg:col-span-4 bg-[#1e1f25] border border-[#34343a] p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#34343a]/60">
            <span className="font-['Space_Grotesk'] text-sm font-semibold text-[#f1ffef]">
              DSP MODULATION RACK
            </span>
            <span className="font-['JetBrains_Mono'] text-[9px] text-[#7df4ff]">ANALOG EMULATION</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-2">
            <div className="bg-[#1a1b21] p-2.5 border border-[#34343a]">
              <div className="flex justify-between font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9] mb-1">
                <span>FILTER CUTOFF</span>
                <span className="text-[#60ff98] font-bold">{filterCutoff} Hz</span>
              </div>
              <input
                type="range"
                min="100"
                max="8000"
                value={filterCutoff}
                onChange={(e) => setFilterCutoff(Number(e.target.value))}
                className="w-full accent-[#60ff98] cursor-pointer"
              />
            </div>

            <div className="bg-[#1a1b21] p-2.5 border border-[#34343a]">
              <div className="flex justify-between font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9] mb-1">
                <span>RESONANCE (Q)</span>
                <span className="text-[#7df4ff] font-bold">{resonance}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="12"
                step="0.1"
                value={resonance}
                onChange={(e) => setResonance(Number(e.target.value))}
                className="w-full accent-[#7df4ff] cursor-pointer"
              />
            </div>

            <div className="bg-[#1a1b21] p-2.5 border border-[#34343a]">
              <div className="flex justify-between font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9] mb-1">
                <span>DELAY FEEDBACK</span>
                <span className="text-[#ddb7ff] font-bold">{delayFeedback}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="95"
                value={delayFeedback}
                onChange={(e) => setDelayFeedback(Number(e.target.value))}
                className="w-full accent-[#ddb7ff] cursor-pointer"
              />
            </div>

            <div className="bg-[#1a1b21] p-2.5 border border-[#34343a]">
              <div className="flex justify-between font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9] mb-1">
                <span>SATURATION / DRIVE</span>
                <span className="text-[#ffb4ab] font-bold">+{drive}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={drive}
                onChange={(e) => setDrive(Number(e.target.value))}
                className="w-full accent-[#ffb4ab] cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-[#292a2f] p-2.5 border border-[#34343a]">
            <div className="flex items-center justify-between font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9] mb-1">
              <span>CHAOS MULTIPLIER ATTENUATION</span>
              <span className="text-[#60ff98] font-bold">{chaosMult}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={chaosMult}
              onChange={(e) => setChaosMult(Number(e.target.value))}
              className="w-full accent-[#60ff98] cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
