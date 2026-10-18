import React, { useRef, useEffect, useState } from 'react';
import { useStage } from '../../context/StageContext';
import { MorphTarget, MaskMode } from '../../types';
import { Camera, Eye, Zap, Layers, Cpu, RotateCcw } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

export const ShadowTheaterScreen: React.FC = () => {
  const {
    activeMorph,
    setActiveMorph,
    activeMask,
    setActiveMask,
    particleDensity,
    setParticleDensity,
    trailDecay,
    setTrailDecay,
    addLog,
  } = useStage();

  const [activeCam, setActiveCam] = useState<'FRONT' | 'LEFT_WING' | 'RIGHT_WING' | 'OVERHEAD'>('FRONT');
  const [boneSmoothing, setBoneSmoothing] = useState(88);
  const [depthCutoff, setDepthCutoff] = useState(2.4); // meters
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const morphTargets: MorphTarget[] = ['CHIMERA', 'CYBER DRAGON', 'FRACTAL ROOT', 'VOID PHANTOM'];
  const maskModes: MaskMode[] = ['SOLID MASK', 'WIREFRAME', 'DEPTH_PCD'];

  // Animate dynamic skeleton mocap on canvas
  useEffect(() => {
    let animId: number;
    let t = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      t += 0.04;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Background grid
      ctx.strokeStyle = 'rgba(52, 52, 58, 0.4)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Dynamic Dancer Joints Calculation
      const centerX = w / 2;
      const centerY = h * 0.45;

      const sway = Math.sin(t) * 25;
      const headY = centerY - 90 + Math.cos(t * 1.5) * 6;
      const neckX = centerX + sway * 0.4;
      const neckY = headY + 30;

      const leftShoulderX = neckX - 45;
      const leftShoulderY = neckY + 15;
      const rightShoulderX = neckX + 45;
      const rightShoulderY = neckY + 15;

      const leftElbowX = leftShoulderX - 35 + Math.sin(t * 1.8) * 20;
      const leftElbowY = leftShoulderY + 45 + Math.cos(t * 1.8) * 15;
      const leftHandX = leftElbowX - 25 + Math.sin(t * 2) * 25;
      const leftHandY = leftElbowY - 30 + Math.cos(t * 2) * 35;

      const rightElbowX = rightShoulderX + 35 + Math.cos(t * 1.4) * 20;
      const rightElbowY = rightShoulderY + 45 + Math.sin(t * 1.4) * 15;
      const rightHandX = rightElbowX + 25 + Math.cos(t * 1.6) * 30;
      const rightHandY = rightElbowY - 25 + Math.sin(t * 1.6) * 30;

      const hipX = centerX + sway * 0.2;
      const hipY = centerY + 65;

      const leftKneeX = hipX - 28 + Math.sin(t * 1.2) * 15;
      const leftKneeY = hipY + 65;
      const leftFootX = leftKneeX - 10 + Math.sin(t * 1.2) * 10;
      const leftFootY = leftKneeY + 70;

      const rightKneeX = hipX + 28 - Math.sin(t * 1.2) * 15;
      const rightKneeY = hipY + 65;
      const rightFootX = rightKneeX + 10 - Math.sin(t * 1.2) * 10;
      const rightFootY = rightKneeY + 70;

      // Draw Bones
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#60ff98';

      const drawBone = (x1: number, y1: number, x2: number, y2: number, color = '#60ff98') => {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      };

      // Spine & Shoulders
      drawBone(neckX, neckY, hipX, hipY, '#7df4ff');
      drawBone(leftShoulderX, leftShoulderY, rightShoulderX, rightShoulderY, '#7df4ff');

      // Arms
      drawBone(leftShoulderX, leftShoulderY, leftElbowX, leftElbowY, '#60ff98');
      drawBone(leftElbowX, leftElbowY, leftHandX, leftHandY, '#60ff98');
      drawBone(rightShoulderX, rightShoulderY, rightElbowX, rightElbowY, '#60ff98');
      drawBone(rightElbowX, rightElbowY, rightHandX, rightHandY, '#60ff98');

      // Legs
      drawBone(hipX, hipY, leftKneeX, leftKneeY, '#ddb7ff');
      drawBone(leftKneeX, leftKneeY, leftFootX, leftFootY, '#ddb7ff');
      drawBone(hipX, hipY, rightKneeX, rightKneeY, '#ddb7ff');
      drawBone(rightKneeX, rightKneeY, rightFootX, rightFootY, '#ddb7ff');

      // Draw Joints
      const joints = [
        { x: neckX, y: headY, r: 16, c: '#00ff87' }, // Head
        { x: neckX, y: neckY, r: 6, c: '#7df4ff' },
        { x: leftShoulderX, y: leftShoulderY, r: 5, c: '#60ff98' },
        { x: rightShoulderX, y: rightShoulderY, r: 5, c: '#60ff98' },
        { x: leftElbowX, y: leftElbowY, r: 5, c: '#60ff98' },
        { x: rightElbowX, y: rightElbowY, r: 5, c: '#60ff98' },
        { x: leftHandX, y: leftHandY, r: 7, c: '#00eefc' },
        { x: rightHandX, y: rightHandY, r: 7, c: '#00eefc' },
        { x: hipX, y: hipY, r: 7, c: '#7df4ff' },
        { x: leftKneeX, y: leftKneeY, r: 5, c: '#ddb7ff' },
        { x: rightKneeX, y: rightKneeY, r: 5, c: '#ddb7ff' },
        { x: leftFootX, y: leftFootY, r: 6, c: '#ddb7ff' },
        { x: rightFootX, y: rightFootY, r: 6, c: '#ddb7ff' },
      ];

      joints.forEach((j) => {
        ctx.beginPath();
        ctx.arc(j.x, j.y, j.r, 0, Math.PI * 2);
        ctx.fillStyle = j.c;
        ctx.fill();
        ctx.shadowColor = j.c;
        ctx.shadowBlur = 8;
      });
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  const resetCalibration = () => {
    audioEngine.playBlip(900, 0.1);
    addLog('Shadow Theater: Camera calibration origin reset to center stage (0, 0, 0)', 'info');
  };

  return (
    <div className="flex flex-col w-full text-[#e3e1e9] select-none pb-12 px-4 pt-2">
      {/* Top Banner */}
      <div className="bg-[#1a1b21] border border-[#34343a] p-3 mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#60ff98]/10 border border-[#60ff98] flex items-center justify-center text-[#60ff98]">
            <Layers size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-['Space_Grotesk'] text-lg font-bold text-[#f1ffef]">
                SHADOW THEATER NEURAL RIG & MOCAP
              </h1>
              <span className="font-['JetBrains_Mono'] text-[9px] bg-[#34343a] text-[#60ff98] px-1.5 py-0.5 rounded font-bold">
                TENSORRT-LLM 8-BIT
              </span>
            </div>
            <p className="font-['JetBrains_Mono'] text-[10px] text-[#b9cbb9]">
              Low-latency pose estimation · Real-time point cloud deformation · Neural avatar metamorphosis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(['FRONT', 'LEFT_WING', 'RIGHT_WING', 'OVERHEAD'] as const).map((cam) => (
            <button
              key={cam}
              onClick={() => {
                setActiveCam(cam);
                addLog(`Shadow Theater: Switched camera viewpoint to ${cam}`, 'info');
              }}
              className={`px-2.5 py-1 font-['JetBrains_Mono'] text-[9px] font-bold rounded cursor-pointer transition-all ${
                activeCam === cam
                  ? 'bg-[#00ff87] text-[#007138] shadow-[0_0_8px_#00ff87]'
                  : 'bg-[#1e1f25] text-[#b9cbb9] hover:bg-[#292a2f]'
              }`}
            >
              {cam}
            </button>
          ))}
          <button
            onClick={resetCalibration}
            className="flex items-center gap-1 px-3 py-1 bg-[#1e1f25] hover:bg-[#292a2f] border border-[#3b4b3d] text-[#e3e1e9] font-['JetBrains_Mono'] text-[9px] font-bold rounded cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>CALIBRATE</span>
          </button>
        </div>
      </div>

      {/* Main Viewport & Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-3">
        {/* Dynamic Skeleton Canvas Viewport */}
        <div className="lg:col-span-8 bg-[#1e1f25] border border-[#34343a] p-3 flex flex-col">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#34343a]/60 font-['JetBrains_Mono'] text-[10px]">
            <span className="text-[#60ff98] font-bold">LIVE POSE SKELETON // 33 KEYPOINTS</span>
            <span className="text-[#7df4ff]">LATENCY: 11.2 MS · CONFIDENCE: 99.4%</span>
          </div>

          <div className="relative h-96 bg-[#0d0e13] border border-[#34343a] flex items-center justify-center overflow-hidden">
            <canvas
              ref={canvasRef}
              width={640}
              height={380}
              className="w-full h-full object-contain"
            />
            {/* Viewport HUD overlays */}
            <div className="absolute top-2 left-2 font-['JetBrains_Mono'] text-[9px] text-[#60ff98] bg-[#1a1b21]/80 px-2 py-0.5 border border-[#3b4b3d]">
              ACTIVE CAM: {activeCam} (60.0 FPS)
            </div>
            <div className="absolute bottom-2 right-2 font-['JetBrains_Mono'] text-[9px] text-[#7df4ff] bg-[#1a1b21]/80 px-2 py-0.5 border border-[#3b4b3d]">
              ACTIVE MORPH: {activeMorph}
            </div>
          </div>
        </div>

        {/* Morph Targets and Neural Attributes */}
        <div className="lg:col-span-4 bg-[#1e1f25] border border-[#34343a] p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#34343a]/60">
              <span className="font-['Space_Grotesk'] text-sm font-semibold text-[#f1ffef]">
                SILHOUETTE METAMORPHOSIS
              </span>
              <span className="font-['JetBrains_Mono'] text-[9px] text-[#60ff98]">TARGET MESH</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {morphTargets.map((morph) => (
                <button
                  key={morph}
                  onClick={() => {
                    audioEngine.playBlip(700, 0.08);
                    setActiveMorph(morph);
                    addLog(`Neural Rig: Target morph changed to ${morph}`, 'info');
                  }}
                  className={`p-2.5 text-left rounded-none font-['JetBrains_Mono'] text-[10px] font-bold cursor-pointer transition-all ${
                    activeMorph === morph
                      ? 'bg-[#00ff87] text-[#007138] shadow-[0_0_8px_#00ff87]'
                      : 'bg-[#292a2f] hover:bg-[#34343a] text-[#e3e1e9]'
                  }`}
                >
                  <div className="truncate">{morph}</div>
                  <div className="text-[9px] font-normal opacity-80">v3.4-RIG</div>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <div className="bg-[#1a1b21] p-2 border border-[#34343a]">
                <div className="flex justify-between font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9] mb-1">
                  <span>PARTICLE POINT DENSITY</span>
                  <span className="text-[#60ff98] font-bold">{(particleDensity / 1000).toFixed(1)}M PTS</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  value={particleDensity}
                  onChange={(e) => setParticleDensity(Number(e.target.value))}
                  className="w-full accent-[#60ff98] cursor-pointer"
                />
              </div>

              <div className="bg-[#1a1b21] p-2 border border-[#34343a]">
                <div className="flex justify-between font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9] mb-1">
                  <span>TEMPORAL TRAIL DECAY</span>
                  <span className="text-[#ddb7ff] font-bold">{trailDecay} MS</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  value={trailDecay}
                  onChange={(e) => setTrailDecay(Number(e.target.value))}
                  className="w-full accent-[#ddb7ff] cursor-pointer"
                />
              </div>

              <div className="bg-[#1a1b21] p-2 border border-[#34343a]">
                <div className="flex justify-between font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9] mb-1">
                  <span>BONE TRACKING SMOOTHING</span>
                  <span className="text-[#7df4ff] font-bold">{boneSmoothing}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={boneSmoothing}
                  onChange={(e) => setBoneSmoothing(Number(e.target.value))}
                  className="w-full accent-[#7df4ff] cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-[#34343a]/40 font-['JetBrains_Mono'] text-[9px] text-[#849585]">
            <span>INFERENCE MODEL: RESNET-50 ONNX (FP16 ACCELERATED)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
