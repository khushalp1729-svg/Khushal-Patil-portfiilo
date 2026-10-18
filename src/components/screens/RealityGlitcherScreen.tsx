import React, { useState } from 'react';
import { useStage } from '../../context/StageContext';
import { ShaderEffect } from '../../types';
import { Sparkles, Sliders, Monitor, Zap } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

export const RealityGlitcherScreen: React.FC = () => {
  const {
    activeShader,
    setActiveShader,
    triggerGlitch,
    addLog,
  } = useStage();

  const [chromaticSplit, setChromaticSplit] = useState(78);
  const [displacement, setDisplacement] = useState(24);
  const [scanlineDensity, setScanlineDensity] = useState(48);
  const [glitchFrequency, setGlitchFrequency] = useState(62);
  const [feedbackDecay, setFeedbackDecay] = useState(85);

  const shaders: { id: ShaderEffect; name: string; desc: string }[] = [
    { id: 'MIRROR', name: 'KALEIDO MIRROR', desc: '4-way spatial mirror fold' },
    { id: 'FRACTURE', name: 'QUANTUM FRACTURE', desc: 'Voronoi glass splinter matrix' },
    { id: 'RGB DISP', name: 'RGB DISPLACEMENT', desc: 'Sub-pixel chromatic vector tear' },
  ];

  return (
    <div className="flex flex-col w-full text-[#e3e1e9] select-none pb-12 px-4 pt-2">
      {/* Top Banner */}
      <div className="bg-[#1a1b21] border border-[#34343a] p-3 mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#ddb7ff]/10 border border-[#ddb7ff] flex items-center justify-center text-[#ddb7ff]">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-['Space_Grotesk'] text-lg font-bold text-[#f1ffef]">
                REALITY GLITCHER VFX MATRIX
              </h1>
              <span className="font-['JetBrains_Mono'] text-[9px] bg-[#34343a] text-[#ddb7ff] px-1.5 py-0.5 rounded font-bold">
                GLSL QUANTUM_v4
              </span>
            </div>
            <p className="font-['JetBrains_Mono'] text-[10px] text-[#b9cbb9]">
              Stage LED wall mapping · Real-time post-processing shaders · Audio-reactive raster distortions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => triggerGlitch('MANUAL_STROBE')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#93000a] hover:bg-[#690005] border border-[#ffb4ab] text-[#ffdad6] font-['JetBrains_Mono'] text-[10px] font-bold rounded cursor-pointer"
          >
            <Zap size={13} />
            <span>FORCE STROBE SPIKE</span>
          </button>
        </div>
      </div>

      {/* Main Viewport & Shader Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-3">
        {/* Live Glitch Viewport Simulator */}
        <div className="lg:col-span-8 bg-[#1e1f25] border border-[#34343a] p-3 flex flex-col">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#34343a]/60 font-['JetBrains_Mono'] text-[10px]">
            <span className="text-[#ddb7ff] font-bold">STAGE LED WALL RASTER OUTPUT (3840 × 1080)</span>
            <span className="text-[#60ff98]">AUDIO REACTIVE: LOCKED</span>
          </div>

          <div className="relative h-96 bg-[#0d0e13] border border-[#34343a] overflow-hidden flex items-center justify-center">
            {/* Visual preview with live CSS filters responding to controls */}
            <img
              alt="Reality Glitcher Visualizer"
              className={`w-full h-full object-cover transition-all duration-100 ${
                activeShader === 'MIRROR'
                  ? 'scale-x-[-1]'
                  : activeShader === 'RGB DISP'
                  ? 'hue-rotate-180 contrast-150'
                  : ''
              }`}
              style={{
                filter: `blur(${displacement * 0.05}px) contrast(${100 + chromaticSplit * 0.5}%)`,
              }}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDYwnpLliae5WovCEADj3t4Bi7RpIBR66Ka3EtImFnAW_8oPoI6Ur__aPp-ZiilS2_XeAe1elLCjqq3awrm5L0JrBIooC1a0FisYC2Tff6pWMZrWs9qZHa738yeA7ZXhD29VLyXYfifU5fLMntqJyNp5SdMSAKgHPJBoUQcEPcLj-d_ciyWMFUybXGAp8OUSZzePEakde9t_2E55CepFnHsHaso1iUuckx9TpyqS6bGJyIg-9TuGJh"
            />

            {/* Scanline overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.8)_51%)]"
              style={{ backgroundSize: `100% ${100 - scanlineDensity + 4}px` }}
            ></div>

            {/* Top HUD */}
            <div className="absolute top-2 left-2 font-['JetBrains_Mono'] text-[9px] bg-[#1a1b21]/90 px-2 py-0.5 text-[#ddb7ff] border border-[#34343a]">
              CHROMATIC SPLIT: {chromaticSplit}% · DISPLACEMENT: ±{displacement}PX
            </div>
          </div>
        </div>

        {/* Shader Parameters */}
        <div className="lg:col-span-4 bg-[#1e1f25] border border-[#34343a] p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#34343a]/60">
              <span className="font-['Space_Grotesk'] text-sm font-semibold text-[#f1ffef]">
                ACTIVE SHADER PRESET
              </span>
              <span className="font-['JetBrains_Mono'] text-[9px] text-[#7df4ff]">PIPELINE</span>
            </div>

            <div className="flex flex-col gap-2 mb-4">
              {shaders.map((shader) => (
                <button
                  key={shader.id}
                  onClick={() => {
                    audioEngine.playBlip(820, 0.06);
                    setActiveShader(shader.id);
                    addLog(`Reality Glitcher: Shader switched to ${shader.name}`, 'info');
                  }}
                  className={`p-2.5 text-left rounded-none font-['JetBrains_Mono'] text-[10px] cursor-pointer transition-all ${
                    activeShader === shader.id
                      ? 'bg-[#ddb7ff] text-[#490080] font-bold shadow-[0_0_8px_#ddb7ff]'
                      : 'bg-[#292a2f] hover:bg-[#34343a] text-[#e3e1e9]'
                  }`}
                >
                  <div className="font-bold">{shader.name}</div>
                  <div className="text-[9px] opacity-80">{shader.desc}</div>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <div className="bg-[#1a1b21] p-2 border border-[#34343a]">
                <div className="flex justify-between font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9] mb-1">
                  <span>CHROMATIC SPLIT (RGB ABERRATION)</span>
                  <span className="text-[#ddb7ff] font-bold">{chromaticSplit}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={chromaticSplit}
                  onChange={(e) => setChromaticSplit(Number(e.target.value))}
                  className="w-full accent-[#ddb7ff] cursor-pointer"
                />
              </div>

              <div className="bg-[#1a1b21] p-2 border border-[#34343a]">
                <div className="flex justify-between font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9] mb-1">
                  <span>RASTER DISPLACEMENT</span>
                  <span className="text-[#ffb4ab] font-bold">±{displacement} PX</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="64"
                  value={displacement}
                  onChange={(e) => setDisplacement(Number(e.target.value))}
                  className="w-full accent-[#ffb4ab] cursor-pointer"
                />
              </div>

              <div className="bg-[#1a1b21] p-2 border border-[#34343a]">
                <div className="flex justify-between font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9] mb-1">
                  <span>CRT SCANLINE DENSITY</span>
                  <span className="text-[#7df4ff] font-bold">{scanlineDensity}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={scanlineDensity}
                  onChange={(e) => setScanlineDensity(Number(e.target.value))}
                  className="w-full accent-[#7df4ff] cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-[#34343a]/40 font-['JetBrains_Mono'] text-[9px] text-[#849585]">
            <span>OUTPUT PASS: 03/04 · FRAME BUFFER SYNC: 100% OK</span>
          </div>
        </div>
      </div>
    </div>
  );
};
