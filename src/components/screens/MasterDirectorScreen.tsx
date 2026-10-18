import React, { useRef, useEffect, useState } from 'react';
import { useStage } from '../../context/StageContext';
import { MorphTarget, MaskMode, ShaderEffect, ChaosPreset } from '../../types';

export const MasterDirectorScreen: React.FC = () => {
  const {
    crossfade,
    setCrossfade,
    timecode,
    chaosMult,
    spatialWd,
    poseConfidence,
    activeMorph,
    setActiveMorph,
    activeMask,
    setActiveMask,
    activeShader,
    setActiveShader,
    chaosPreset,
    setChaosPreset,
    channels,
    updateChannelValue,
    toggleChannelMute,
    toggleChannelSolo,
    toggleChannelPeak,
    xyVector,
    setXyVector,
    particleDensity,
    setParticleDensity,
    trailDecay,
    setTrailDecay,
    audienceNodes,
    energyIndex,
    arenaExcitement,
    logEntries,
    cues,
    activeCueIndex,
    setActiveCueIndex,
    triggerDrop,
    triggerGlitch,
    triggerBlackout,
    triggerMetamorphosis,
    triggerRealityTear,
    triggerAudioOverride,
    isBlackout,
  } = useStage();

  // Canvas ref for audio spectrum
  const spectrumCanvasRef = useRef<HTMLCanvasElement | null>(null);
  // XY touch pad state
  const padRef = useRef<HTMLDivElement | null>(null);
  const [isDraggingPad, setIsDraggingPad] = useState(false);

  // Animate audio spectrum
  useEffect(() => {
    let animId: number;
    let offset = 0;
    const canvas = spectrumCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      offset += 0.05;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Draw dynamic multi-frequency waves
      ctx.beginPath();
      ctx.moveTo(0, h * 0.85);

      for (let x = 0; x <= w; x += 6) {
        const freq1 = Math.sin((x * 0.03) + offset) * 25;
        const freq2 = Math.cos((x * 0.08) - offset * 1.5) * 15;
        const freq3 = Math.sin((x * 0.015) + offset * 0.7) * 35;
        const noise = (Math.random() - 0.5) * 6;
        const y = (h * 0.6) + freq1 + freq2 + freq3 + noise;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();

      // Gradient fill
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(0, 238, 252, 0.45)');
      grad.addColorStop(0.5, 'rgba(96, 255, 152, 0.25)');
      grad.addColorStop(1, 'rgba(13, 14, 19, 0.9)');
      ctx.fillStyle = grad;
      ctx.fill();

      // Stroke primary line
      ctx.beginPath();
      for (let x = 0; x <= w; x += 6) {
        const freq1 = Math.sin((x * 0.03) + offset) * 25;
        const freq2 = Math.cos((x * 0.08) - offset * 1.5) * 15;
        const freq3 = Math.sin((x * 0.015) + offset * 0.7) * 35;
        const noise = (Math.random() - 0.5) * 6;
        const y = (h * 0.6) + freq1 + freq2 + freq3 + noise;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#00eefc';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Secondary harmonic dashed line
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      for (let x = 0; x <= w; x += 8) {
        const y = (h * 0.65) + Math.sin((x * 0.04) - offset * 1.2) * 20;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#60ff98';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  // Handle XY vector dragging
  const handlePadInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!padRef.current) return;
    const rect = padRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;
    const xPct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const yPct = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    
    // Map to [-1, +1]
    const xVal = parseFloat(((xPct - 0.5) * 2).toFixed(2));
    const yVal = parseFloat((-(yPct - 0.5) * 2).toFixed(2));
    setXyVector({ x: xVal, y: yVal });
  };

  const morphTargets: MorphTarget[] = ['CHIMERA', 'CYBER DRAGON', 'FRACTAL ROOT', 'VOID PHANTOM'];
  const maskModes: MaskMode[] = ['SOLID MASK', 'WIREFRAME', 'DEPTH_PCD'];
  const shaderModes: ShaderEffect[] = ['MIRROR', 'FRACTURE', 'RGB DISP'];
  const chaosPresets: ChaosPreset[] = ['VELVET STATIC', 'NEON RIOT', 'ABYSSAL DRONE', 'HYPERPOP TEAR'];

  return (
    <div className="flex flex-col w-full text-[#e3e1e9] select-none pb-12">
      {/* TOP ACT & TIMELINE STATUS RIBBON */}
      <section className="w-full bg-[#1a1b21] px-4 py-1.5 mb-3 border-b border-[#34343a]/60">
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
          {/* Act Badge & Meta */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex items-center justify-center px-3 py-1.5 bg-[#34343a]">
              <span className="absolute -top-1 -left-1 w-2 h-2 bg-[#60ff98]"></span>
              <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#7df4ff]"></span>
              <span className="font-['JetBrains_Mono'] text-[9px] text-[#60ff98] tracking-widest uppercase font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#60ff98] shadow-[0_0_8px_#60ff98] animate-pulse"></span>
                STAGE ACTIVE
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#7df4ff] tracking-wider">
                  SEQUENCE 02 / 04
                </span>
                <span className="font-['JetBrains_Mono'] text-[9px] px-1.5 py-0.5 bg-[#1e1f25] text-[#f0dbff] uppercase font-bold">
                  GEN_AI DUAL-FEED
                </span>
              </div>
              <h1 className="font-['Space_Grotesk'] text-lg font-semibold text-[#f1ffef] tracking-tight truncate">
                ACT II: SHADOW THEATER × CHAOS SYMPHONY IN HARMONY
              </h1>
            </div>
          </div>

          {/* Timecode Counter & Keyframe Markers Scrubber */}
          <div className="flex-1 max-w-2xl flex flex-col gap-1.5 bg-[#1e1f25] px-3 py-2 border border-[#34343a]/40">
            <div className="flex items-center justify-between font-['JetBrains_Mono'] text-[10px]">
              <div className="flex items-center gap-2 text-[#60ff98] font-bold">
                <span className="material-symbols-outlined text-sm text-[#60ff98] animate-spin">
                  sync
                </span>
                <span>{timecode}</span>
                <span className="text-[#b9cbb9] font-normal">/ 00:45:00:00</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#b9cbb9] font-['JetBrains_Mono'] text-[9px]">NEXT EVENT:</span>
                <span className="text-[#7df4ff] font-bold font-['JetBrains_Mono'] text-[10px] bg-[#292a2f] px-1.5 py-0.5">
                  BASS GLITCH BURST [T -01:42]
                </span>
              </div>
            </div>

            {/* Custom Interactive Timeline Track */}
            <div className="relative w-full h-4 bg-[#0d0e13] flex items-center px-1 overflow-hidden">
              {/* Elapsed Fill */}
              <div
                className="absolute left-0 top-0 bottom-0 bg-[#00ff87]/30 transition-all duration-300"
                style={{ width: `${32 + (activeCueIndex * 18)}%` }}
              ></div>
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-[#60ff98] shadow-[0_0_10px_#60ff98] z-20 transition-all duration-300"
                style={{ left: `${32 + (activeCueIndex * 18)}%` }}
              ></div>

              {/* Keyframe Cues */}
              <div className="relative w-full h-full flex items-center justify-between z-10 px-2 font-['JetBrains_Mono'] text-[9px]">
                {cues.map((cue, idx) => {
                  const isCurrent = activeCueIndex === idx;
                  return (
                    <button
                      key={cue.id}
                      onClick={() => setActiveCueIndex(idx)}
                      className={`flex items-center gap-1 cursor-pointer transition-colors ${
                        isCurrent
                          ? 'text-[#60ff98] font-bold'
                          : idx < activeCueIndex
                          ? 'text-[#b9cbb9] opacity-60'
                          : 'text-[#7df4ff]'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 ${
                          isCurrent
                            ? 'bg-[#60ff98] shadow-[0_0_6px_#60ff98] rotate-45'
                            : 'bg-[#3b4b3d]'
                        }`}
                      ></span>
                      <span className="hidden sm:inline">{cue.number}: {cue.title} [{cue.status}]</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Master Knobs / Telemetry Strip */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <div className="bg-[#1e1f25] px-2.5 py-1.5 flex flex-col min-w-[100px] border border-[#34343a]/40">
              <span className="font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9]">CHAOS MULT</span>
              <div className="flex items-baseline justify-between mt-0.5">
                <span className="font-['JetBrains_Mono'] text-base font-bold text-[#7df4ff]">{chaosMult}%</span>
                <span className="text-[#60ff98] font-['JetBrains_Mono'] text-[10px] font-bold">
                  +{(chaosMult / 55).toFixed(1)}x
                </span>
              </div>
            </div>
            <div className="bg-[#1e1f25] px-2.5 py-1.5 flex flex-col min-w-[100px] border border-[#34343a]/40">
              <span className="font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9]">SPATIAL W/D</span>
              <div className="flex items-baseline justify-between mt-0.5">
                <span className="font-['JetBrains_Mono'] text-base font-bold text-[#60ff98]">{spatialWd}%</span>
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9]">3D DMX</span>
              </div>
            </div>
            <div className="bg-[#1e1f25] px-2.5 py-1.5 flex flex-col min-w-[110px] border border-[#34343a]/40">
              <span className="font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9]">POSE CONFIDENCE</span>
              <div className="flex items-baseline justify-between mt-0.5">
                <span className="font-['JetBrains_Mono'] text-base font-bold text-[#60ff98]">{poseConfidence}%</span>
                <span className="text-[#ddb7ff] font-['JetBrains_Mono'] text-[10px]">11MS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MASTER CROSSFADER BAR (ORCHESTRA vs GLITCHER) */}
      <section className="px-4 mb-3">
        <div className="bg-[#292a2f] px-3 py-1 flex items-center gap-3 shadow-md border border-[#34343a]/60">
          <div className="flex items-center gap-2 min-w-[200px]">
            <span className="w-2 h-2 rounded-full bg-[#7df4ff] shadow-[0_0_6px_#7df4ff]"></span>
            <span className="font-['JetBrains_Mono'] text-[10px] font-bold text-[#7df4ff]">
              DECK A: CHAOS ORCHESTRA
            </span>
          </div>

          <div className="flex-1 relative flex items-center">
            <input
              id="master-crossfade"
              type="range"
              min="0"
              max="100"
              value={crossfade}
              onChange={(e) => setCrossfade(Number(e.target.value))}
              className="w-full h-3 bg-[#0d0e13] appearance-none cursor-pointer accent-[#60ff98] rounded-none"
            />
            <div className="absolute inset-0 pointer-events-none flex justify-between px-2 font-['JetBrains_Mono'] text-[9px] text-[#849585] items-center">
              <span>100:00</span>
              <span>75:25</span>
              <span className="text-[#f1ffef] font-bold">SPLIT 50:50</span>
              <span>25:75</span>
              <span>00:100</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 min-w-[200px]">
            <span className="font-['JetBrains_Mono'] text-[10px] font-bold text-[#f0dbff]">
              DECK B: REALITY GLITCHER
            </span>
            <span className="w-2 h-2 rounded-full bg-[#f0dbff] shadow-[0_0_6px_#f0dbff]"></span>
          </div>
        </div>
      </section>

      {/* MAIN MULTI-VIEWPORT THREE-FEED MATRIX */}
      <section className="px-4 mb-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* FEED 1: AI CHAOS ORCHESTRA VIEWPORT */}
          <div className="lg:col-span-4 bg-[#1e1f25] flex flex-col shadow-lg overflow-hidden relative group border border-[#34343a]">
            {/* Top HUD Header */}
            <div className="bg-[#34343a] px-3 py-1 flex items-center justify-between font-['JetBrains_Mono'] text-[10px]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#7df4ff] rounded-full animate-ping"></span>
                <span className="font-bold text-[#7df4ff]">CAM 01 // AUDIO SPECTRUM HUD</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-['JetBrains_Mono'] text-[9px] px-1 bg-[#1a1b21] text-[#b9cbb9]">FFT 4096</span>
                <span className="text-[#60ff98]">60 FPS</span>
              </div>
            </div>

            {/* Video Canvas Simulator with Spectrogram */}
            <div className="relative h-64 bg-[#0d0e13] overflow-hidden flex flex-col justify-end p-3">
              <img
                alt="Cyberpunk high contrast audio visualizer"
                className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMTJososA8zLgDKQWQt_btwUI9t_cK2_Bx2MyoJodH_87WvYcuqcFa0asAhS-3twv84938lPnujX-dikar2W4HoL8pi7iMphhYU5Q4dm3P8iKlV3h_EJU8cqVPNeM3O0q5CziPVacSFTCYIdBqehRZY6q6qm006mYI-BV8aOpbzQN63apCqcUhH3PQkjindrAjZHCkYLVS95cCXrsbptTm62csl4NEMOLC-wIcfFrpGs17azQB_IcJ"
              />
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-[#0d0e13]/80"></div>
              
              {/* Corner Reticles */}
              <div className="absolute top-2 left-2 text-[#7df4ff] font-['JetBrains_Mono'] text-[9px] tracking-widest">[RET_01-L]</div>
              <div className="absolute top-2 right-2 text-[#7df4ff] font-['JetBrains_Mono'] text-[9px] tracking-widest">[RET_01-R]</div>

              {/* Dynamic Canvas Spectrogram */}
              <div className="relative z-10 w-full mb-2 h-24">
                <canvas
                  ref={spectrumCanvasRef}
                  width={340}
                  height={96}
                  className="w-full h-full block"
                />
              </div>

              {/* Bottom Telemetry Badges */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-1 pt-1 bg-[#1a1b21]/85 backdrop-blur-sm px-2 py-1">
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#60ff98] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#60ff98]"></span> RHYTHM SYNC: 98.2%
                </span>
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#7df4ff]">
                  WHISTLE DETECT: ZONE 4
                </span>
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#f0dbff]">
                  PEAK: +3.8 dB
                </span>
              </div>
            </div>

            {/* Stem Breakdown Meters */}
            <div className="bg-[#292a2f] p-1.5 grid grid-cols-4 gap-1.5 text-center font-['JetBrains_Mono'] text-[9px]">
              <div className="bg-[#1e1f25] px-1 py-1">
                <span className="text-[#b9cbb9] block truncate">ACOUSTIC</span>
                <div className="w-full bg-[#0d0e13] h-1.5 mt-1">
                  <div className="bg-[#7df4ff] h-full w-[78%]"></div>
                </div>
              </div>
              <div className="bg-[#1e1f25] px-1 py-1">
                <span className="text-[#b9cbb9] block truncate">GRANULAR</span>
                <div className="w-full bg-[#0d0e13] h-1.5 mt-1">
                  <div className="bg-[#60ff98] h-full w-[64%]"></div>
                </div>
              </div>
              <div className="bg-[#1e1f25] px-1 py-1">
                <span className="text-[#b9cbb9] block truncate">SUB-BASS</span>
                <div className="w-full bg-[#0d0e13] h-1.5 mt-1">
                  <div className="bg-[#7df4ff] h-full w-[91%] shadow-[0_0_4px_#7df4ff]"></div>
                </div>
              </div>
              <div className="bg-[#1e1f25] px-1 py-1">
                <span className="text-[#b9cbb9] block truncate">PULSE</span>
                <div className="w-full bg-[#0d0e13] h-1.5 mt-1">
                  <div className="bg-[#f0dbff] h-full w-[52%]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* FEED 2: FEATURED ACTIVE STREAM - AI SHADOW THEATER NEURAL RIG */}
          <div className="lg:col-span-4 bg-[#1e1f25] flex flex-col shadow-2xl overflow-hidden relative border border-[#00ff87]/40 shadow-[0_0_24px_rgba(0,255,135,0.15)]">
            {/* Top Status Bar */}
            <div className="bg-[#34343a] px-3 py-1 flex items-center justify-between font-['JetBrains_Mono'] text-[10px]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#60ff98] rounded-full animate-pulse shadow-[0_0_8px_#60ff98]"></span>
                <span className="font-bold text-[#60ff98]">MAIN FEED // SHADOW THEATER RIG</span>
              </div>
              <span className="font-['JetBrains_Mono'] text-[9px] px-2 py-0.5 bg-[#00ff87] text-[#007138] font-bold">
                FEATURED LIVE
              </span>
            </div>

            {/* Featured Viewport Visual Container */}
            <div className="relative h-64 bg-[#0d0e13] overflow-hidden flex flex-col justify-between p-3">
              <img
                alt="Stage performance silhouette morphing into chimera"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  activeMask === 'WIREFRAME' ? 'opacity-40 invert filter contrast-150' : 'opacity-65'
                }`}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPIJRlx2riegYjXY0R54Lhc4hrhGGJDpDWyfow5y2iXRZBH7n5Ek_hac5CXTDpjGjm127Dm6eSQETvGiKyC1OxR3d28GYqeob-Nu6XSIjUPngAwysMCs1W26RgwgUIYJ5OvystIySKa-36b6cfAyjszqLadTvuz8y6JxdZcq2vVVEPlMVpEjEZgVsQ6bcIN8HcMvrjlxoA-NbsHdyyMTEWbvAtZPtXtVXIXAgzg0smbG5SLBK2J6Bp"
              />

              {/* Augmented HUD Overlays & Joint Nodes */}
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="font-['JetBrains_Mono'] text-[9px] px-1.5 py-0.5 bg-[#0d0e13]/80 text-[#60ff98] flex items-center gap-1 backdrop-blur-sm border border-[#3b4b3d]/40">
                    <span className="w-1.5 h-1.5 bg-[#60ff98] rounded-full"></span> 99.4% POSE LOCK
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[9px] px-1.5 py-0.5 bg-[#0d0e13]/80 text-[#7df4ff] backdrop-blur-sm border border-[#3b4b3d]/40">
                    MORPH: {activeMorph}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1 font-['JetBrains_Mono'] text-[10px]">
                  <span className="text-[#60ff98] bg-[#0d0e13]/90 px-1 font-bold">LATENCY: 11 MS</span>
                  <span className="text-[#f0dbff] bg-[#0d0e13]/90 px-1 font-['JetBrains_Mono'] text-[9px]">
                    DEPTH MASK: {activeMask.split(' ')[0]}
                  </span>
                </div>
              </div>

              {/* Synthetic Neural Joint Lines SVG overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <line stroke="#60ff98" strokeOpacity="0.8" strokeWidth="2" x1="50%" x2="48%" y1="28%" y2="45%"></line>
                <line stroke="#00eefc" strokeOpacity="0.7" strokeWidth="1.5" x1="48%" x2="38%" y1="45%" y2="60%"></line>
                <line stroke="#00eefc" strokeOpacity="0.7" strokeWidth="1.5" x1="48%" x2="58%" y1="45%" y2="58%"></line>
                <line stroke="#60ff98" strokeDasharray="2,2" strokeWidth="2" x1="38%" x2="32%" y1="60%" y2="82%"></line>
                <line stroke="#60ff98" strokeDasharray="2,2" strokeWidth="2" x1="58%" x2="64%" y1="58%" y2="84%"></line>
                <circle cx="50%" cy="28%" fill="#00ff87" r="4"></circle>
                <circle cx="48%" cy="45%" fill="#7df4ff" r="3.5"></circle>
                <circle cx="38%" cy="60%" fill="#60ff98" r="3"></circle>
                <circle cx="58%" cy="58%" fill="#60ff98" r="3"></circle>
                <circle cx="32%" cy="82%" fill="#ddb7ff" r="4"></circle>
                <circle cx="64%" cy="84%" fill="#ddb7ff" r="4"></circle>
              </svg>

              {/* Interactive Mask Toggles on Bottom Rail */}
              <div className="relative z-10 flex items-center justify-between bg-[#0d0e13]/90 backdrop-blur-md px-2 py-1 border-t border-[#34343a]/60">
                <div className="flex items-center gap-1.5 font-['JetBrains_Mono'] text-[9px]">
                  {maskModes.map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setActiveMask(mode)}
                      className={`px-2 py-0.5 cursor-pointer transition-colors ${
                        activeMask === mode
                          ? 'bg-[#f1ffef] text-[#003919] font-bold shadow-[0_0_6px_#60ff98]'
                          : 'bg-[#1e1f25] hover:bg-[#292a2f] text-[#e3e1e9]'
                      }`}
                      type="button"
                    >
                      {mode}
                    </button>
                  ))}
                </div>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#60ff98] font-bold">
                  {(particleDensity / 1000).toFixed(3)}K PTS
                </span>
              </div>
            </div>

            {/* Model Pipeline Quick Indicators */}
            <div className="bg-[#292a2f] px-3 py-1 flex items-center justify-between font-['JetBrains_Mono'] text-[9px]">
              <span className="text-[#b9cbb9]">INFERENCE: TENSORRT-LLM 8-BIT</span>
              <span className="text-[#60ff98] flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#60ff98] rounded-full"></span> CUDA CORE: 92%
              </span>
            </div>
          </div>

          {/* FEED 3: REALITY GLITCHER VFX STAGE VIEWPORT */}
          <div className="lg:col-span-4 bg-[#1e1f25] flex flex-col shadow-lg overflow-hidden relative border border-[#34343a]">
            {/* Top Status Bar */}
            <div className="bg-[#34343a] px-3 py-1 flex items-center justify-between font-['JetBrains_Mono'] text-[10px]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#f0dbff] rounded-full"></span>
                <span className="font-bold text-[#f0dbff]">STAGE FX // REALITY GLITCHER</span>
              </div>
              <span className="font-['JetBrains_Mono'] text-[9px] px-1 bg-[#1a1b21] text-[#f0dbff] font-bold">
                SHADER: QUANTUM_v4
              </span>
            </div>

            {/* Glitch Feed Container */}
            <div className="relative h-64 bg-[#0d0e13] overflow-hidden flex flex-col justify-between p-3">
              <img
                alt="RGB split chromatic aberration glitch art"
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-200 ${
                  activeShader === 'MIRROR' 
                    ? 'scale-x-[-1] opacity-60' 
                    : activeShader === 'RGB DISP'
                    ? 'hue-rotate-90 opacity-70 contrast-125'
                    : 'opacity-45'
                }`}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDYwnpLliae5WovCEADj3t4Bi7RpIBR66Ka3EtImFnAW_8oPoI6Ur__aPp-ZiilS2_XeAe1elLCjqq3awrm5L0JrBIooC1a0FisYC2Tff6pWMZrWs9qZHa738yeA7ZXhD29VLyXYfifU5fLMntqJyNp5SdMSAKgHPJBoUQcEPcLj-d_ciyWMFUybXGAp8OUSZzePEakde9t_2E55CepFnHsHaso1iUuckx9TpyqS6bGJyIg-9TuGJh"
              />

              {/* Topological Matrix Mesh Simulation */}
              <div className="absolute inset-0 pointer-events-none opacity-25 bg-[linear-gradient(to_right,#8830d6_1px,transparent_1px),linear-gradient(to_bottom,#8830d6_1px,transparent_1px)] bg-[size:16px_16px]"></div>

              <div className="relative z-10 flex items-start justify-between">
                <div className="bg-[#0d0e13]/80 px-2 py-0.5 backdrop-blur-sm font-['JetBrains_Mono'] text-[9px] text-[#f0dbff] border border-[#34343a]/40">
                  CHROMATIC SPLIT: {Math.round(crossfade * 1.5 + 12)}%
                </div>
                <div className="bg-[#0d0e13]/80 px-2 py-0.5 backdrop-blur-sm font-['JetBrains_Mono'] text-[10px] text-[#ffb4ab] border border-[#34343a]/40">
                  DISPLACEMENT: ±24PX
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-between bg-[#0d0e13]/85 backdrop-blur-sm px-2 py-1 font-['JetBrains_Mono'] text-[10px] border-t border-[#34343a]/60">
                <div className="flex items-center gap-2">
                  <span className="font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9]">RGB SPLIT</span>
                  <div className="w-20 bg-[#292a2f] h-2">
                    <div
                      className="bg-[#ddb7ff] h-full transition-all duration-150"
                      style={{ width: `${Math.min(100, Math.round(crossfade * 1.5 + 12))}%` }}
                    ></div>
                  </div>
                </div>
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#60ff98]">AUDIO-REACTIVE: HIGH</span>
              </div>
            </div>

            {/* Quick Shader Toggles */}
            <div className="bg-[#292a2f] p-1.5 flex items-center justify-between font-['JetBrains_Mono'] text-[9px]">
              <div className="flex items-center gap-1">
                {shaderModes.map((shader) => (
                  <button
                    key={shader}
                    onClick={() => setActiveShader(shader)}
                    className={`px-2 py-0.5 cursor-pointer transition-colors ${
                      activeShader === shader
                        ? 'bg-[#ddb7ff] text-[#490080] font-bold shadow-[0_0_6px_#ddb7ff]'
                        : 'bg-[#1e1f25] hover:bg-[#34343a] text-[#7df4ff]'
                    }`}
                    type="button"
                  >
                    {shader}
                  </button>
                ))}
              </div>
              <span className="text-[#b9cbb9]">PASS: 03/04</span>
            </div>
          </div>
        </div>
      </section>

      {/* MID SECTION: DUAL SUB-PANELS (AUDIO ENGINE vs NEURAL / FX RIG) */}
      <section className="px-4 mb-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* LEFT SUB-PANEL: LIVE AUDIO INGESTION & CHAOS SYNTHESIZER (6 COLS) */}
          <div className="lg:col-span-6 bg-[#1e1f25] flex flex-col p-3 shadow-md border border-[#34343a]">
            {/* Sub-Panel Header */}
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#34343a]/60">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#7df4ff] text-lg">graphic_eq</span>
                <span className="font-['Space_Grotesk'] text-lg font-semibold text-[#f1ffef]">
                  CHAOS SYNTHESIZER & INGESTION BUS
                </span>
              </div>
              <span className="font-['JetBrains_Mono'] text-[9px] px-2 py-0.5 bg-[#34343a] text-[#7df4ff] font-bold">
                DMX UNIV 1-4
              </span>
            </div>

            {/* 4-Channel Input Faders with Peak Meters */}
            <div className="grid grid-cols-4 gap-2 bg-[#1a1b21] p-2 mb-3 border border-[#34343a]/40">
              {channels.map((ch) => (
                <div key={ch.id} className="flex flex-col items-center gap-2 bg-[#1e1f25] px-2 py-2 border border-[#34343a]/30">
                  <span className="font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9] truncate w-full text-center">
                    {ch.name}
                  </span>
                  <div className="h-32 flex items-center gap-2">
                    {/* Meter segments */}
                    <div className="w-2.5 h-full bg-[#0d0e13] flex flex-col justify-end p-0.5">
                      <div
                        className="w-full transition-all duration-100"
                        style={{
                          height: `${ch.muted ? 0 : ch.value}%`,
                          backgroundColor: ch.color,
                          boxShadow: ch.peak ? '0 0 6px #ffb4ab' : `0 0 4px ${ch.color}`,
                        }}
                      ></div>
                    </div>
                    {/* Vertical Fader slider */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={ch.value}
                      onChange={(e) => updateChannelValue(ch.id, Number(e.target.value))}
                      className="h-28 w-4 appearance-none bg-[#34343a] accent-[#7df4ff] cursor-pointer [writing-mode:bt-lr] -rotate-180"
                    />
                  </div>
                  <span
                    className={`font-['JetBrains_Mono'] text-[10px] font-bold ${
                      ch.peak ? 'text-[#ffb4ab]' : 'text-[#60ff98]'
                    }`}
                  >
                    {ch.muted ? 'MUTED' : ch.db}
                  </span>
                  
                  {/* Action button */}
                  {ch.solo !== undefined && ch.id === 'vocal' ? (
                    <button
                      onClick={() => toggleChannelSolo(ch.id)}
                      className={`w-full py-0.5 text-center font-['JetBrains_Mono'] text-[9px] font-bold cursor-pointer transition-colors ${
                        ch.solo
                          ? 'bg-[#00ff87] text-[#007138] shadow-[0_0_6px_#00ff87]'
                          : 'bg-[#34343a] text-[#e3e1e9]'
                      }`}
                      type="button"
                    >
                      SOLO
                    </button>
                  ) : ch.id === 'sub' ? (
                    <button
                      onClick={() => toggleChannelPeak(ch.id)}
                      className={`w-full py-0.5 text-center font-['JetBrains_Mono'] text-[9px] font-bold cursor-pointer transition-colors ${
                        ch.peak
                          ? 'bg-[#93000a] text-[#ffdad6] shadow-[0_0_6px_#ffb4ab]'
                          : 'bg-[#34343a] text-[#e3e1e9]'
                      }`}
                      type="button"
                    >
                      PEAK
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleChannelMute(ch.id)}
                      className={`w-full py-0.5 text-center font-['JetBrains_Mono'] text-[9px] cursor-pointer transition-colors ${
                        ch.muted
                          ? 'bg-[#690005] text-[#ffdad6] font-bold'
                          : 'bg-[#34343a] text-[#7df4ff]'
                      }`}
                      type="button"
                    >
                      MUTE
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Generative Quantizer Engine Controls */}
            <div className="bg-[#292a2f] p-2 flex flex-col gap-1.5 mb-2 border border-[#34343a]/50">
              <div className="flex items-center justify-between font-['JetBrains_Mono'] text-[10px]">
                <span className="text-[#e3e1e9] font-bold">GENERATIVE HARMONY QUANTIZER</span>
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#60ff98] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#60ff98]"></span> STACKING: ON
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 font-['JetBrains_Mono'] text-[10px] pt-1">
                <div className="bg-[#1e1f25] p-1.5 flex flex-col">
                  <span className="font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9]">SCALE ROOT</span>
                  <span className="text-[#f1ffef] font-bold">D MINOR (DORIAN)</span>
                </div>
                <div className="bg-[#1e1f25] p-1.5 flex flex-col">
                  <span className="font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9]">CLOCK SOURCE</span>
                  <span className="text-[#7df4ff] font-bold">HEARTBEAT CLUSTER</span>
                </div>
                <div className="bg-[#1e1f25] p-1.5 flex flex-col">
                  <span className="font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9]">TEMPO ANCHOR</span>
                  <span className="text-[#60ff98] font-bold">138.00 BPM [LOCK]</span>
                </div>
              </div>
            </div>

            {/* Chaos Seed Selectors */}
            <div className="flex flex-col gap-1.5">
              <span className="font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9]">CHAOS SEED PRESETS</span>
              <div className="grid grid-cols-4 gap-1.5 font-['JetBrains_Mono'] text-[10px]">
                {chaosPresets.map((preset) => {
                  const isSelected = chaosPreset === preset;
                  return (
                    <button
                      key={preset}
                      onClick={() => setChaosPreset(preset)}
                      className={`px-2 py-1.5 text-center truncate cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#7df4ff] text-[#00363a] font-bold shadow-[0_0_8px_#7df4ff]'
                          : 'bg-[#1e1f25] hover:bg-[#292a2f] text-[#b9cbb9] border-b border-transparent hover:border-[#60ff98]'
                      }`}
                      type="button"
                    >
                      {preset}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT SUB-PANEL: NEURAL RIG & GLITCH FX CONTROL DECK (6 COLS) */}
          <div className="lg:col-span-6 bg-[#1e1f25] flex flex-col p-3 shadow-md border border-[#34343a]">
            {/* Sub-Panel Header */}
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#34343a]/60">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#f0dbff] text-lg">smart_toy</span>
                <span className="font-['Space_Grotesk'] text-lg font-semibold text-[#f1ffef]">
                  NEURAL RIG & REALITY GLITCH MATRIX
                </span>
              </div>
              <span className="font-['JetBrains_Mono'] text-[9px] px-2 py-0.5 bg-[#34343a] text-[#f0dbff]">
                LAT: 11.2MS
              </span>
            </div>

            {/* Upper Neural Rig Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              {/* Morph Target Selector */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9]">SILHOUETTE MORPH TARGET</span>
                  <span className="font-['JetBrains_Mono'] text-[9px] text-[#60ff98]">ACTIVE</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 font-['JetBrains_Mono'] text-[10px]">
                  {morphTargets.map((morph) => {
                    const isSelected = activeMorph === morph;
                    return (
                      <button
                        key={morph}
                        onClick={() => setActiveMorph(morph)}
                        className={`p-2 text-left flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#00ff87] text-[#007138] font-bold shadow-[0_0_8px_#00ff87]'
                            : 'bg-[#292a2f] hover:bg-[#34343a] text-[#e3e1e9]'
                        }`}
                        type="button"
                      >
                        <span className="truncate">{morph}</span>
                        {isSelected && <span className="material-symbols-outlined text-sm">check</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Particle Density & Trail Decay Sliders */}
                <div className="flex flex-col gap-2 mt-1">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9]">
                      <span>PARTICLE DENSITY</span>
                      <span className="text-[#60ff98] font-bold font-['JetBrains_Mono'] text-[10px]">
                        {(particleDensity / 1000).toFixed(1)}M PTS
                      </span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="2000"
                      value={particleDensity}
                      onChange={(e) => setParticleDensity(Number(e.target.value))}
                      className="w-full h-1.5 bg-[#0d0e13] appearance-none accent-[#60ff98] cursor-pointer"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9]">
                      <span>TRAIL DECAY</span>
                      <span className="text-[#ddb7ff] font-bold font-['JetBrains_Mono'] text-[10px]">
                        {trailDecay} MS
                      </span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="1000"
                      value={trailDecay}
                      onChange={(e) => setTrailDecay(Number(e.target.value))}
                      className="w-full h-1.5 bg-[#0d0e13] appearance-none accent-[#ddb7ff] cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* XY Chaos Touch Controller Pad */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9]">
                    XY WARP / CHROMATIC VECTOR
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[10px] text-[#7df4ff]">
                    [X: {xyVector.x >= 0 ? `+${xyVector.x}` : xyVector.x} / Y: {xyVector.y >= 0 ? `+${xyVector.y}` : xyVector.y}]
                  </span>
                </div>

                {/* Interactive XY Field */}
                <div
                  ref={padRef}
                  onMouseDown={(e) => {
                    setIsDraggingPad(true);
                    handlePadInteraction(e);
                  }}
                  onMouseMove={(e) => {
                    if (isDraggingPad) handlePadInteraction(e);
                  }}
                  onMouseUp={() => setIsDraggingPad(false)}
                  onMouseLeave={() => setIsDraggingPad(false)}
                  className="relative w-full h-44 bg-[#0d0e13] flex items-center justify-center overflow-hidden cursor-crosshair group border border-[#3b4b3d]/40 select-none"
                >
                  {/* Grid Lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2438_1px,transparent_1px),linear-gradient(to_bottom,#1f2438_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                  {/* Center Axis crosshairs */}
                  <div className="absolute w-full h-px bg-[#3b4b3d]/60"></div>
                  <div className="absolute h-full w-px bg-[#3b4b3d]/60"></div>

                  {/* Puck representation positioned based on xyVector */}
                  <div
                    className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full bg-[#7df4ff]/20 border border-[#7df4ff] flex items-center justify-center shadow-[0_0_12px_#7df4ff] transition-transform duration-75"
                    style={{
                      left: `${((xyVector.x / 2) + 0.5) * 100}%`,
                      top: `${((-xyVector.y / 2) + 0.5) * 100}%`,
                    }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#7df4ff]"></div>
                  </div>

                  {/* Pad Labels */}
                  <span className="absolute top-1 left-2 font-['JetBrains_Mono'] text-[9px] text-[#849585]">
                    +Y ECHO
                  </span>
                  <span className="absolute bottom-1 right-2 font-['JetBrains_Mono'] text-[9px] text-[#849585]">
                    +X WARP
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Glitch Strobe Action Pads */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-[#34343a]/60">
              <span className="font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9]">
                TACTICAL GLITCH SPIKE TRIGGERS
              </span>
              <div className="grid grid-cols-4 gap-1.5 font-['JetBrains_Mono'] text-[10px]">
                <button
                  onClick={() => triggerGlitch('STITCH FLASH')}
                  className="py-2.5 px-2 bg-[#292a2f] hover:bg-[#34343a] border border-[#7df4ff]/40 text-[#7df4ff] font-bold flex flex-col items-center gap-1 active:scale-95 transition-all cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-sm">flash_on</span>
                  <span className="font-['JetBrains_Mono'] text-[9px]">STITCH FLASH</span>
                </button>

                <button
                  onClick={() => triggerGlitch('RGB TEAR')}
                  className="py-2.5 px-2 bg-[#292a2f] hover:bg-[#34343a] border border-[#f0dbff]/40 text-[#f0dbff] font-bold flex flex-col items-center gap-1 active:scale-95 transition-all cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-sm">view_carousel</span>
                  <span className="font-['JetBrains_Mono'] text-[9px]">RGB TEAR</span>
                </button>

                <button
                  onClick={() => triggerGlitch('TIME ECHO')}
                  className="py-2.5 px-2 bg-[#292a2f] hover:bg-[#34343a] border border-[#60ff98]/40 text-[#60ff98] font-bold flex flex-col items-center gap-1 active:scale-95 transition-all cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-sm">history</span>
                  <span className="font-['JetBrains_Mono'] text-[9px]">TIME ECHO -0.5s</span>
                </button>

                <button
                  onClick={() => triggerGlitch('VOID INVERT')}
                  className="py-2.5 px-2 bg-[#292a2f] hover:bg-[#34343a] border border-[#ffb4ab]/40 text-[#ffb4ab] font-bold flex flex-col items-center gap-1 active:scale-95 transition-all cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-sm">contrast</span>
                  <span className="font-['JetBrains_Mono'] text-[9px]">VOID INVERT</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM BAR: REAL-TIME CROWD TELEMETRY & STAGE AUTOMATION OVERRIDE */}
      <section className="px-4 mb-5">
        <div className="bg-[#1a1b21] flex flex-col p-3 shadow-2xl border border-[#34343a]/60">
          {/* Upper Telemetry Ribbon */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-2 mb-3 border-b border-[#34343a]/40 gap-3">
            {/* Live Node Count & Stats */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#60ff98] shadow-[0_0_8px_#60ff98] animate-ping"></span>
                <span className="font-['Space_Grotesk'] text-lg font-bold text-[#60ff98]">
                  {audienceNodes.toLocaleString()}
                </span>
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9]">
                  ACTIVE AUDIENCE NODES
                </span>
              </div>
              <div className="flex items-center gap-2 pl-3 border-l border-[#34343a]/50 font-['JetBrains_Mono'] text-[10px]">
                <span className="text-[#b9cbb9]">GYRO SYNC:</span>
                <span className="text-[#f1ffef] font-bold">89%</span>
                <span className="text-[#b9cbb9] ml-2">SHOUT BURSTS:</span>
                <span className="text-[#7df4ff] font-bold">420 / MIN</span>
                <span className="text-[#b9cbb9] ml-2">ENERGY INDEX:</span>
                <span className="text-[#60ff98] font-bold">{energyIndex} / 100 [PEAK]</span>
              </div>
            </div>

            {/* Room Acoustic Excitement Meter */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9] whitespace-nowrap">
                ARENA EXCITEMENT
              </span>
              <div className="w-48 h-3 bg-[#0d0e13] flex items-center p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#7df4ff] via-[#60ff98] to-[#ffb4ab] shadow-[0_0_8px_#60ff98] transition-all duration-300"
                  style={{ width: `${arenaExcitement}%` }}
                ></div>
              </div>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#60ff98] font-bold">
                {arenaExcitement}%
              </span>
            </div>
          </div>

          {/* Stage Automation Override Deck: Giant Tactical Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 mb-3">
            {/* TRIGGER DROP Button */}
            <button
              onClick={triggerDrop}
              className="relative group p-3 bg-[#00ff87] hover:bg-[#60ff98] text-[#007138] font-['Space_Grotesk'] text-lg font-bold flex flex-col items-center justify-center gap-1 shadow-[0_0_16px_#00ff87] active:scale-95 transition-all cursor-pointer"
              type="button"
            >
              <div className="flex items-center gap-1.5 font-['JetBrains_Mono'] text-[9px] text-[#007138]/80 tracking-widest">
                <span className="w-2 h-2 rounded-full bg-[#007138]"></span>
                TACTICAL AUTO [F1]
              </div>
              <span className="tracking-wider">TRIGGER DROP</span>
              <span className="font-['JetBrains_Mono'] text-[10px] font-normal opacity-90">
                FULL SUB × LASER SPIKE
              </span>
            </button>

            {/* SHADOW METAMORPHOSIS Button */}
            <button
              onClick={triggerMetamorphosis}
              className="relative group p-3 bg-[#1e1f25] hover:bg-[#292a2f] border-2 border-[#00dbe9] text-[#7df4ff] font-['Space_Grotesk'] text-lg font-bold flex flex-col items-center justify-center gap-1 shadow-[0_0_12px_rgba(0,219,233,0.3)] active:scale-95 transition-all cursor-pointer"
              type="button"
            >
              <div className="flex items-center gap-1.5 font-['JetBrains_Mono'] text-[9px] text-[#00dbe9] tracking-widest">
                <span className="w-2 h-2 rounded-full bg-[#7df4ff]"></span>
                NEURAL MORPH [F2]
              </div>
              <span className="tracking-wider text-center truncate w-full">METAMORPHOSIS</span>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#b9cbb9] font-normal">
                CASCADE POINT MESH
              </span>
            </button>

            {/* REALITY TEAR Button */}
            <button
              onClick={triggerRealityTear}
              className="relative group p-3 bg-[#1e1f25] hover:bg-[#292a2f] border-2 border-[#f0dbff] text-[#f0dbff] font-['Space_Grotesk'] text-lg font-bold flex flex-col items-center justify-center gap-1 shadow-[0_0_12px_rgba(240,219,255,0.25)] active:scale-95 transition-all cursor-pointer"
              type="button"
            >
              <div className="flex items-center gap-1.5 font-['JetBrains_Mono'] text-[9px] text-[#ddb7ff] tracking-widest">
                <span className="w-2 h-2 rounded-full bg-[#f0dbff]"></span>
                VFX OVERRIDE [F3]
              </div>
              <span className="tracking-wider">REALITY TEAR</span>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#b9cbb9] font-normal">
                FULL CHROMATIC SHIFT
              </span>
            </button>

            {/* EMERGENCY AUDIO OVERRIDE Button */}
            <button
              onClick={triggerAudioOverride}
              className="relative group p-3 bg-[#1e1f25] hover:bg-[#292a2f] border-2 border-[#849585] text-[#f1ffef] font-['Space_Grotesk'] text-lg font-bold flex flex-col items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
              type="button"
            >
              <div className="flex items-center gap-1.5 font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9] tracking-widest">
                <span className="material-symbols-outlined text-sm">warning</span>
                FAILSAFE [F4]
              </div>
              <span className="tracking-wider">AUDIO OVERRIDE</span>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#b9cbb9] font-normal">
                FALLBACK DRONE LOOP
              </span>
            </button>

            {/* PANIC BLACKOUT Master Abort Button */}
            <button
              onClick={triggerBlackout}
              className={`relative group p-3 border-2 border-[#ffb4ab] font-['Space_Grotesk'] text-lg font-bold flex flex-col items-center justify-center gap-1 active:scale-95 transition-all overflow-hidden cursor-pointer ${
                isBlackout
                  ? 'bg-[#690005] text-white shadow-[0_0_24px_rgba(255,180,171,0.8)]'
                  : 'bg-[#93000a] hover:bg-[#690005] text-[#ffdad6] shadow-[0_0_16px_rgba(147,0,10,0.6)]'
              }`}
              type="button"
            >
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[repeating-linear-gradient(45deg,#000,#000_10px,#fff_10px,#fff_20px)]"></div>
              <div className="flex items-center gap-1.5 font-['JetBrains_Mono'] text-[9px] text-[#ffdad6] tracking-widest relative z-10">
                <span className="material-symbols-outlined text-sm text-[#ffdad6]">dangerous</span>
                MASTER KILL [ESC]
              </div>
              <span className="tracking-wider relative z-10">PANIC BLACKOUT</span>
              <span className="font-['JetBrains_Mono'] text-[10px] font-normal relative z-10 opacity-90">
                IMMEDIATE 0 DMX / 0 dB
              </span>
            </button>
          </div>

          {/* Live Event Ticker Output */}
          <div className="bg-[#0d0e13] px-3 py-1 flex items-center justify-between font-['JetBrains_Mono'] text-[10px] overflow-hidden border border-[#34343a]/40">
            <div className="flex items-center gap-3 truncate">
              <span className="font-['JetBrains_Mono'] text-[9px] text-[#60ff98] bg-[#1e1f25] px-1 py-0.5">
                EVENT STREAM
              </span>
              <div className="flex items-center gap-4 text-[#b9cbb9] truncate">
                {logEntries.slice(0, 3).map((entry, idx) => (
                  <React.Fragment key={entry.id}>
                    {idx > 0 && <span className="text-[#3b4b3d]">•</span>}
                    <span
                      className={
                        entry.type === 'alert'
                          ? 'text-[#ffb4ab] font-bold'
                          : entry.type === 'success'
                          ? 'text-[#60ff98]'
                          : entry.type === 'warn'
                          ? 'text-[#7df4ff]'
                          : 'text-[#b9cbb9]'
                      }
                    >
                      [{entry.time}] {entry.text}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>
            <span className="font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9] whitespace-nowrap pl-3">
              BUFFER: 256/256 OK
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
