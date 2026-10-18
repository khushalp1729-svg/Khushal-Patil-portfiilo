import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  ScreenId, 
  MorphTarget, 
  MaskMode, 
  ShaderEffect, 
  ChaosPreset, 
  ChannelFader, 
  LogEntry, 
  HardwareStatus,
  CueItem
} from '../types';
import { audioEngine } from '../utils/audioEngine';

interface StageContextType {
  activeScreen: ScreenId;
  setActiveScreen: (screen: ScreenId) => void;
  crossfade: number;
  setCrossfade: (val: number) => void;
  bpm: number;
  setBpm: (bpm: number) => void;
  timecode: string;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  chaosMult: number;
  setChaosMult: (val: number) => void;
  spatialWd: number;
  setSpatialWd: (val: number) => void;
  poseConfidence: number;
  activeMorph: MorphTarget;
  setActiveMorph: (target: MorphTarget) => void;
  activeMask: MaskMode;
  setActiveMask: (mode: MaskMode) => void;
  activeShader: ShaderEffect;
  setActiveShader: (shader: ShaderEffect) => void;
  chaosPreset: ChaosPreset;
  setChaosPreset: (preset: ChaosPreset) => void;
  channels: ChannelFader[];
  updateChannelValue: (id: string, val: number) => void;
  toggleChannelMute: (id: string) => void;
  toggleChannelSolo: (id: string) => void;
  toggleChannelPeak: (id: string) => void;
  xyVector: { x: number; y: number };
  setXyVector: (v: { x: number; y: number }) => void;
  particleDensity: number;
  setParticleDensity: (density: number) => void;
  trailDecay: number;
  setTrailDecay: (decay: number) => void;
  audienceNodes: number;
  energyIndex: number;
  arenaExcitement: number;
  isBlackout: boolean;
  glitchTrigger: string | null;
  consoleLocked: boolean;
  setConsoleLocked: (locked: boolean) => void;
  isMuted: boolean;
  toggleAudioMute: () => void;
  logEntries: LogEntry[];
  addLog: (text: string, type?: 'info' | 'warn' | 'success' | 'alert') => void;
  hardware: HardwareStatus;
  cues: CueItem[];
  activeCueIndex: number;
  setActiveCueIndex: (idx: number) => void;
  triggerDrop: () => void;
  triggerGlitch: (variant?: string) => void;
  triggerBlackout: () => void;
  triggerMetamorphosis: () => void;
  triggerRealityTear: () => void;
  triggerAudioOverride: () => void;
  triggerRecordDump: () => void;
}

const StageContext = createContext<StageContextType | null>(null);

const INITIAL_CHANNELS: ChannelFader[] = [
  { id: 'crowd', name: 'CROWD MIC', value: 72, db: '-6.2 dB', muted: false, solo: false, peak: false, color: '#60ff98' },
  { id: 'vocal', name: 'VOCAL STEM', value: 85, db: '+1.4 dB', muted: false, solo: true, peak: false, color: '#60ff98' },
  { id: 'synth', name: 'MOD SYNTH', value: 68, db: '-2.1 dB', muted: false, solo: false, peak: false, color: '#7df4ff' },
  { id: 'sub', name: 'SUB QUAKE', value: 94, db: '+3.8 dB', muted: false, solo: false, peak: true, color: '#ffb4ab' },
];

const INITIAL_CUES: CueItem[] = [
  { id: 'cue-1', number: 'CUE 01', title: 'SONIC GENESIS', status: 'PASS', timestamp: '00:04:12' },
  { id: 'cue-2', number: 'CUE 02', title: 'SHADOW GENESIS', status: 'LIVE', timestamp: '00:14:28' },
  { id: 'cue-3', number: 'CUE 03', title: 'BASS GLITCH', status: 'NEXT', timestamp: '00:26:10' },
  { id: 'cue-4', number: 'CUE 04', title: 'CLIMAX', status: 'PENDING', timestamp: '00:41:00' },
];

export const StageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('master-director');
  const [crossfade, setCrossfadeState] = useState<number>(44);
  const [bpm, setBpm] = useState<number>(138.00);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [chaosMult, setChaosMult] = useState<number>(68);
  const [spatialWd, setSpatialWd] = useState<number>(84);
  const [poseConfidence] = useState<number>(99.4);
  const [activeMorph, setActiveMorph] = useState<MorphTarget>('CHIMERA');
  const [activeMask, setActiveMask] = useState<MaskMode>('SOLID MASK');
  const [activeShader, setActiveShader] = useState<ShaderEffect>('FRACTURE');
  const [chaosPreset, setChaosPreset] = useState<ChaosPreset>('NEON RIOT');
  const [channels, setChannels] = useState<ChannelFader[]>(INITIAL_CHANNELS);
  const [xyVector, setXyVector] = useState<{ x: number; y: number }>({ x: 0.64, y: -0.28 });
  const [particleDensity, setParticleDensity] = useState<number>(1200);
  const [trailDecay, setTrailDecay] = useState<number>(420);
  const [audienceNodes] = useState<number>(1420);
  const [energyIndex] = useState<number>(92);
  const [arenaExcitement] = useState<number>(92);
  const [isBlackout, setIsBlackout] = useState<boolean>(false);
  const [glitchTrigger, setGlitchTrigger] = useState<string | null>(null);
  const [consoleLocked, setConsoleLocked] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [cues] = useState<CueItem[]>(INITIAL_CUES);
  const [activeCueIndex, setActiveCueIndex] = useState<number>(1);

  // Timecode simulation
  const [timecode, setTimecode] = useState<string>('00:14:28:16');
  
  const [hardware] = useState<HardwareStatus>({
    opticLinkMs: 0.42,
    dmxBus: 'UNIV 1-8',
    tempoDrift: '±0.001',
    neuralLatMs: 14,
    gpuUsage: 94,
    fps: 60,
    cudaCoreUsage: 92,
  });

  const [logEntries, setLogEntries] = useState<LogEntry[]>([
    { id: '1', time: '14:28:12', text: "Neural model loaded 'Chimera_Rig_v3.onnx' (TensorRT engine ready)", type: 'info' },
    { id: '2', time: '14:28:14', text: "Crowd bass resonance peak +4.2dB detected (Zone 2)", type: 'warn' },
    { id: '3', time: '14:28:16', text: "Reality Glitcher frame sync locked at 60.0 FPS", type: 'success' },
  ]);

  const addLog = useCallback((text: string, type: 'info' | 'warn' | 'success' | 'alert' = 'info') => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    setLogEntries(prev => [{ id: Math.random().toString(), time: timeStr, text, type }, ...prev.slice(0, 19)]);
  }, []);

  const setCrossfade = useCallback((val: number) => {
    setCrossfadeState(val);
    const computedChaos = Math.round(50 + (val * 0.3));
    setChaosMult(computedChaos);
  }, []);

  const triggerGlitch = useCallback((variant: string = 'SPIKE') => {
    audioEngine.playGlitch();
    setGlitchTrigger(variant);
    addLog(`Tactical Glitch Trigger engaged: ${variant}`, 'alert');
    setTimeout(() => {
      setGlitchTrigger(null);
    }, 450);
  }, [addLog]);

  const triggerDrop = useCallback(() => {
    audioEngine.playDrop();
    setGlitchTrigger('DROP');
    addLog('TACTICAL AUTO DROP [F1] FIRED // FULL SUB × LASER SPIKE', 'success');
    setTimeout(() => {
      setGlitchTrigger(null);
    }, 600);
  }, [addLog]);

  const triggerBlackout = useCallback(() => {
    audioEngine.playBlackout();
    setIsBlackout(prev => {
      const next = !prev;
      addLog(next ? 'PANIC BLACKOUT [ESC] ENGAGED - 0 DMX / 0 dB ALL STAGES' : 'PANIC BLACKOUT DISENGAGED - RESTORING DECK STATE', 'alert');
      return next;
    });
  }, [addLog]);

  const triggerMetamorphosis = useCallback(() => {
    audioEngine.playBlip(750, 0.15);
    setActiveMorph(prev => {
      const list: MorphTarget[] = ['CHIMERA', 'CYBER DRAGON', 'FRACTAL ROOT', 'VOID PHANTOM'];
      const nextIdx = (list.indexOf(prev) + 1) % list.length;
      const next = list[nextIdx];
      addLog(`NEURAL MORPH [F2] executed -> ${next}`, 'info');
      return next;
    });
    setGlitchTrigger('METAMORPH');
    setTimeout(() => setGlitchTrigger(null), 300);
  }, [addLog]);

  const triggerRealityTear = useCallback(() => {
    audioEngine.playGlitch();
    setGlitchTrigger('TEAR');
    addLog('REALITY TEAR [F3] TRIGGERED - FULL CHROMATIC ABERRATION SHIFT', 'warn');
    setTimeout(() => setGlitchTrigger(null), 400);
  }, [addLog]);

  const triggerAudioOverride = useCallback(() => {
    audioEngine.playBlip(440, 0.25);
    addLog('AUDIO OVERRIDE [F4] ACTIVATED - FALLBACK DRONE LOOP ENGAGED', 'warn');
  }, [addLog]);

  const triggerRecordDump = useCallback(() => {
    audioEngine.playBlip(920, 0.1);
    addLog(`MEMORY DUMP RECORDED - Buffer 256/256 frames flushed to FOH_ALPHA`, 'info');
  }, [addLog]);

  const toggleAudioMute = useCallback(() => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
    addLog(muted ? 'Stage Audio Feedback MUTED' : 'Stage Audio Feedback ENABLED', 'info');
  }, [addLog]);

  const updateChannelValue = (id: string, val: number) => {
    setChannels(prev => prev.map(ch => {
      if (ch.id === id) {
        const dbVal = ((val - 70) * 0.25).toFixed(1);
        const dbStr = `${val >= 70 ? '+' : ''}${dbVal} dB`;
        return { ...ch, value: val, db: dbStr };
      }
      return ch;
    }));
  };

  const toggleChannelMute = (id: string) => {
    audioEngine.playBlip(300, 0.05);
    setChannels(prev => prev.map(ch => ch.id === id ? { ...ch, muted: !ch.muted } : ch));
  };

  const toggleChannelSolo = (id: string) => {
    audioEngine.playBlip(600, 0.05);
    setChannels(prev => prev.map(ch => ch.id === id ? { ...ch, solo: !ch.solo } : ch));
  };

  const toggleChannelPeak = (id: string) => {
    audioEngine.playBlip(900, 0.05);
    setChannels(prev => prev.map(ch => ch.id === id ? { ...ch, peak: !ch.peak } : ch));
  };

  // Live timecode updater
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTimecode(prev => {
        const parts = prev.split(':').map(Number);
        let [hh, mm, ss, ff] = parts;
        ff += 1;
        if (ff >= 30) {
          ff = 0;
          ss += 1;
          if (ss >= 60) {
            ss = 0;
            mm += 1;
            if (mm >= 60) {
              mm = 0;
              hh += 1;
            }
          }
        }
        return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}:${String(ff).padStart(2, '0')}`;
      });
    }, 33);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'F1') {
        e.preventDefault();
        triggerDrop();
      } else if (e.key === 'F2') {
        e.preventDefault();
        triggerMetamorphosis();
      } else if (e.key === 'F3') {
        e.preventDefault();
        triggerRealityTear();
      } else if (e.key === 'F4') {
        e.preventDefault();
        triggerAudioOverride();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        triggerBlackout();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerDrop, triggerMetamorphosis, triggerRealityTear, triggerAudioOverride, triggerBlackout]);

  return (
    <StageContext.Provider
      value={{
        activeScreen,
        setActiveScreen,
        crossfade,
        setCrossfade,
        bpm,
        setBpm,
        timecode,
        isPlaying,
        setIsPlaying,
        chaosMult,
        setChaosMult,
        spatialWd,
        setSpatialWd,
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
        isBlackout,
        glitchTrigger,
        consoleLocked,
        setConsoleLocked,
        isMuted,
        toggleAudioMute,
        logEntries,
        addLog,
        hardware,
        cues,
        activeCueIndex,
        setActiveCueIndex,
        triggerDrop,
        triggerGlitch,
        triggerBlackout,
        triggerMetamorphosis,
        triggerRealityTear,
        triggerAudioOverride,
        triggerRecordDump,
      }}
    >
      {children}
    </StageContext.Provider>
  );
};

export const useStage = () => {
  const context = useContext(StageContext);
  if (!context) {
    throw new Error('useStage must be used within a StageProvider');
  }
  return context;
};
