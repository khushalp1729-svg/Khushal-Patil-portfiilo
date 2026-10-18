export type ScreenId = 
  | 'master-director'
  | 'chaos-orchestra-engine'
  | 'shadow-theater-neural-rig'
  | 'reality-glitcher-vfx'
  | 'crowd-telemetry'
  | 'global-rig-settings';

export type MorphTarget = 'CHIMERA' | 'CYBER DRAGON' | 'FRACTAL ROOT' | 'VOID PHANTOM';

export type MaskMode = 'SOLID MASK' | 'WIREFRAME' | 'DEPTH_PCD';

export type ShaderEffect = 'MIRROR' | 'FRACTURE' | 'RGB DISP';

export type ChaosPreset = 'VELVET STATIC' | 'NEON RIOT' | 'ABYSSAL DRONE' | 'HYPERPOP TEAR';

export interface ChannelFader {
  id: string;
  name: string;
  value: number; // 0 to 100
  db: string;
  muted: boolean;
  solo: boolean;
  peak: boolean;
  color: string;
}

export interface CueItem {
  id: string;
  number: string;
  title: string;
  status: 'PASS' | 'LIVE' | 'NEXT' | 'PENDING';
  timestamp: string;
}

export interface LogEntry {
  id: string;
  time: string;
  text: string;
  type: 'info' | 'warn' | 'success' | 'alert';
}

export interface HardwareStatus {
  opticLinkMs: number;
  dmxBus: string;
  tempoDrift: string;
  neuralLatMs: number;
  gpuUsage: number;
  fps: number;
  cudaCoreUsage: number;
}
