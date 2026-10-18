import React, { useState } from 'react';
import { useStage } from '../../context/StageContext';
import { Users, Radio, Activity, Flame, ShieldAlert, Sparkles } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface ZoneData {
  id: string;
  name: string;
  nodes: number;
  energy: number;
  shoutDbm: number;
  syncRate: number;
  color: string;
}

export const CrowdTelemetryScreen: React.FC = () => {
  const { audienceNodes, energyIndex, arenaExcitement, addLog } = useStage();

  const [zones, setZones] = useState<ZoneData[]>([
    { id: 'z1', name: 'MOSH PIT / GA CENTER', nodes: 480, energy: 98, shoutDbm: 104.2, syncRate: 94, color: '#ffb4ab' },
    { id: 'z2', name: 'FRONT MEZZANINE (EAST)', nodes: 310, energy: 91, shoutDbm: 96.8, syncRate: 88, color: '#60ff98' },
    { id: 'z3', name: 'FRONT MEZZANINE (WEST)', nodes: 295, energy: 89, shoutDbm: 95.4, syncRate: 86, color: '#60ff98' },
    { id: 'z4', name: 'REAR BALCONY CLUSTER', nodes: 215, energy: 82, shoutDbm: 91.2, syncRate: 79, color: '#7df4ff' },
    { id: 'z5', name: 'VIP BOXES & RISERS', nodes: 120, energy: 76, shoutDbm: 88.0, syncRate: 72, color: '#ddb7ff' },
  ]);

  const [wristbandPattern, setWristbandPattern] = useState<'PULSE' | 'STROBE' | 'CHASE' | 'CHAOS'>('PULSE');

  const triggerWristbandFlash = () => {
    audioEngine.playDrop();
    addLog(`CROWD MATRIX: 1,420 Wristband LEDs synchronized to pattern ${wristbandPattern}`, 'success');
  };

  return (
    <div className="flex flex-col w-full text-[#e3e1e9] select-none pb-12 px-4 pt-2">
      {/* Top Banner */}
      <div className="bg-[#1a1b21] border border-[#34343a] p-3 mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#60ff98]/10 border border-[#60ff98] flex items-center justify-center text-[#60ff98]">
            <Users size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-['Space_Grotesk'] text-lg font-bold text-[#f1ffef]">
                ARENA CROWD TELEMETRY & SPATIAL SENSOR GRID
              </h1>
              <span className="font-['JetBrains_Mono'] text-[9px] bg-[#34343a] text-[#60ff98] px-1.5 py-0.5 rounded font-bold">
                BLE MESH 5.4 ACTIVE
              </span>
            </div>
            <p className="font-['JetBrains_Mono'] text-[10px] text-[#b9cbb9]">
              1,420 biometric & wristband sensor nodes · Acoustic cheer detection · Gyro collective movement
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerWristbandFlash}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00ff87] hover:bg-[#60ff98] text-[#007138] font-['JetBrains_Mono'] text-[10px] font-bold rounded cursor-pointer shadow-[0_0_8px_#00ff87]"
          >
            <Sparkles size={13} />
            <span>TRIGGER WRISTBAND LED BURST</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        <div className="bg-[#1e1f25] border border-[#34343a] p-3">
          <div className="font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9]">CONNECTED NODES</div>
          <div className="font-['Space_Grotesk'] text-2xl font-bold text-[#60ff98] mt-1">
            {audienceNodes.toLocaleString()} <span className="text-xs text-[#b9cbb9] font-normal">/ 1,500</span>
          </div>
          <div className="font-['JetBrains_Mono'] text-[9px] text-[#00e478] mt-1">94.6% NETWORK FILL</div>
        </div>

        <div className="bg-[#1e1f25] border border-[#34343a] p-3">
          <div className="font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9]">AGGREGATE DECIBEL</div>
          <div className="font-['Space_Grotesk'] text-2xl font-bold text-[#ffb4ab] mt-1">
            104.2 <span className="text-xs text-[#b9cbb9] font-normal">dBA</span>
          </div>
          <div className="font-['JetBrains_Mono'] text-[9px] text-[#ffdad6] mt-1">ZONE 1 MOSH PEAK</div>
        </div>

        <div className="bg-[#1e1f25] border border-[#34343a] p-3">
          <div className="font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9]">GYRO SYNC RATE</div>
          <div className="font-['Space_Grotesk'] text-2xl font-bold text-[#7df4ff] mt-1">
            89.4%
          </div>
          <div className="font-['JetBrains_Mono'] text-[9px] text-[#7df4ff] mt-1">COHERENT RHYTHM JUMP</div>
        </div>

        <div className="bg-[#1e1f25] border border-[#34343a] p-3">
          <div className="font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9]">ARENA EXCITEMENT INDEX</div>
          <div className="font-['Space_Grotesk'] text-2xl font-bold text-[#f0dbff] mt-1">
            {arenaExcitement}%
          </div>
          <div className="font-['JetBrains_Mono'] text-[9px] text-[#ddb7ff] mt-1">CLIMAX THRESHOLD READY</div>
        </div>
      </div>

      {/* Main Spatial Map & Zone Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-3">
        {/* Arena Spatial Heatmap */}
        <div className="lg:col-span-7 bg-[#1e1f25] border border-[#34343a] p-3 flex flex-col">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#34343a]/60 font-['JetBrains_Mono'] text-[10px]">
            <span className="text-[#f1ffef] font-bold">ARENA SEATING & FLOOR HEATMAP</span>
            <span className="text-[#60ff98]">UPDATE: 60 HZ REAL-TIME</span>
          </div>

          {/* Visual Arena Layout */}
          <div className="relative h-80 bg-[#0d0e13] border border-[#34343a] p-4 flex flex-col justify-between items-center overflow-hidden">
            {/* Stage Indicator at Top */}
            <div className="w-48 py-1 bg-[#00ff87]/20 border border-[#00ff87] text-center font-['JetBrains_Mono'] text-[9px] text-[#60ff98] font-bold tracking-widest shadow-[0_0_12px_rgba(0,255,135,0.3)]">
              STAGE / DJ DECK
            </div>

            {/* Mosh Pit Zone */}
            <div className="w-64 h-24 bg-[#93000a]/20 border border-[#ffb4ab] rounded-full flex flex-col items-center justify-center p-2 relative group hover:bg-[#93000a]/30 transition-all cursor-pointer">
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#ffdad6] font-bold">MOSH PIT (ZONE 1)</span>
              <span className="font-['JetBrains_Mono'] text-[9px] text-[#60ff98]">480 NODES · 98% HEAT</span>
              {/* Pulsing indicator */}
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab] animate-ping absolute -top-1"></div>
            </div>

            {/* Mezzanine Wings */}
            <div className="w-full flex justify-between px-6">
              <div className="w-36 h-16 bg-[#1a1b21] border border-[#60ff98] flex flex-col items-center justify-center p-1">
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#60ff98] font-bold">MEZZANINE WEST</span>
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9]">295 NODES</span>
              </div>
              <div className="w-36 h-16 bg-[#1a1b21] border border-[#60ff98] flex flex-col items-center justify-center p-1">
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#60ff98] font-bold">MEZZANINE EAST</span>
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9]">310 NODES</span>
              </div>
            </div>

            {/* Rear Balcony */}
            <div className="w-80 h-10 bg-[#1a1b21] border border-[#7df4ff] flex items-center justify-center gap-4">
              <span className="font-['JetBrains_Mono'] text-[9px] text-[#7df4ff] font-bold">REAR BALCONY (ZONE 4)</span>
              <span className="font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9]">215 NODES</span>
            </div>
          </div>
        </div>

        {/* Zone Telemetry Table & Wristband Controls */}
        <div className="lg:col-span-5 bg-[#1e1f25] border border-[#34343a] p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#34343a]/60">
              <span className="font-['Space_Grotesk'] text-sm font-semibold text-[#f1ffef]">
                ZONE TELEMETRY BREAKDOWN
              </span>
              <span className="font-['JetBrains_Mono'] text-[9px] text-[#7df4ff]">ACOUSTIC MIC ARRAY</span>
            </div>

            <div className="flex flex-col gap-2 mb-4">
              {zones.map((zone) => (
                <div key={zone.id} className="bg-[#1a1b21] p-2 border border-[#34343a]">
                  <div className="flex items-center justify-between font-['JetBrains_Mono'] text-[10px] mb-1">
                    <span className="font-bold text-[#e3e1e9]">{zone.name}</span>
                    <span className="text-[#60ff98]">{zone.energy}% ENERGY</span>
                  </div>
                  <div className="w-full bg-[#0d0e13] h-1.5 mb-1.5">
                    <div
                      className="h-full"
                      style={{
                        width: `${zone.energy}%`,
                        backgroundColor: zone.color,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9]">
                    <span>NODES: {zone.nodes}</span>
                    <span>SOUND: {zone.shoutDbm} dBA</span>
                    <span>SYNC: {zone.syncRate}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#292a2f] p-2 border border-[#34343a]">
              <span className="font-['JetBrains_Mono'] text-[9px] text-[#b9cbb9] block mb-1.5">
                WRISTBAND LIGHT PATTERN SYNC
              </span>
              <div className="grid grid-cols-4 gap-1.5 font-['JetBrains_Mono'] text-[9px]">
                {(['PULSE', 'STROBE', 'CHASE', 'CHAOS'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      audioEngine.playBlip(640, 0.05);
                      setWristbandPattern(p);
                    }}
                    className={`py-1.5 font-bold cursor-pointer transition-all ${
                      wristbandPattern === p
                        ? 'bg-[#00ff87] text-[#007138] shadow-[0_0_6px_#00ff87]'
                        : 'bg-[#1e1f25] text-[#b9cbb9] hover:bg-[#34343a]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-[#34343a]/40 font-['JetBrains_Mono'] text-[9px] text-[#849585]">
            <span>FREQUENCY RESPONSE: 20 Hz - 20 kHz (C-WEIGHTED FILTER)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
