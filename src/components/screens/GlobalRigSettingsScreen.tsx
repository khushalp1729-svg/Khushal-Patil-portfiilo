import React, { useState } from 'react';
import { useStage } from '../../context/StageContext';
import { Settings, Shield, Server, Cpu, HardDrive, Download, Upload, CheckCircle2 } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

export const GlobalRigSettingsScreen: React.FC = () => {
  const { hardware, consoleLocked, setConsoleLocked, addLog } = useStage();

  const [dmxUniverses, setDmxUniverses] = useState([
    { id: 1, name: 'STAGE LASER ARRAY', protocol: 'Art-Net 4', status: 'ACTIVE', rate: '44 Hz' },
    { id: 2, name: 'MAIN LED WALL PIXEL MAPPING', protocol: 'sACN (E1.31)', status: 'ACTIVE', rate: '60 Hz' },
    { id: 3, name: 'MOVING HEAD BEAMS (RIG A)', protocol: 'Art-Net 4', status: 'ACTIVE', rate: '44 Hz' },
    { id: 4, name: 'STROBE & BLINDER BARS', protocol: 'DMX512-A', status: 'ACTIVE', rate: '40 Hz' },
    { id: 5, name: 'PYRO & CRYO JET TRIGGERS', protocol: 'Hardwire Safe', status: 'ARMED', rate: 'Immediate' },
    { id: 6, name: 'SHADOW PROJECTION RIG', protocol: 'Art-Net 4', status: 'ACTIVE', rate: '60 Hz' },
  ]);

  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExportShowfile = () => {
    audioEngine.playBlip(800, 0.1);
    setExportSuccess(true);
    addLog('SHOWFILE EXPORTED: Stitch_Carnival_Act2_Final.scshow (Hash: a7f8d9)', 'success');
    setTimeout(() => setExportSuccess(false), 3000);
  };

  return (
    <div className="flex flex-col w-full text-[#e3e1e9] select-none pb-12 px-4 pt-2">
      {/* Top Banner */}
      <div className="bg-[#1a1b21] border border-[#34343a] p-3 mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#7df4ff]/10 border border-[#7df4ff] flex items-center justify-center text-[#7df4ff]">
            <Settings size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-['Space_Grotesk'] text-lg font-bold text-[#f1ffef]">
                GLOBAL RIG & HARDWARE ROUTING SETTINGS
              </h1>
              <span className="font-['JetBrains_Mono'] text-[9px] bg-[#34343a] text-[#7df4ff] px-1.5 py-0.5 rounded font-bold">
                CONSOLE ALPHA
              </span>
            </div>
            <p className="font-['JetBrains_Mono'] text-[10px] text-[#b9cbb9]">
              Optical fiber link routing · DMX universe patch · TensorRT GPU resource orchestration
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportShowfile}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00ff87] hover:bg-[#60ff98] text-[#007138] font-['JetBrains_Mono'] text-[10px] font-bold rounded cursor-pointer transition-all shadow-[0_0_8px_#00ff87]"
          >
            {exportSuccess ? <CheckCircle2 size={13} /> : <Download size={13} />}
            <span>{exportSuccess ? 'SHOWFILE SAVED!' : 'EXPORT SHOWFILE (.SCSHOW)'}</span>
          </button>
        </div>
      </div>

      {/* Grid: DMX Universe Patch & System Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-3">
        {/* DMX Universe Patch Table */}
        <div className="lg:col-span-8 bg-[#1e1f25] border border-[#34343a] p-3 flex flex-col">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#34343a]/60 font-['JetBrains_Mono'] text-[10px]">
            <span className="text-[#f1ffef] font-bold">DMX / SACN LIGHTING BUS ROUTING</span>
            <span className="text-[#60ff98]">6 ACTIVE UNIVERSES</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-['JetBrains_Mono'] text-[10px]">
              <thead>
                <tr className="border-b border-[#34343a] text-[#b9cbb9] text-[9px]">
                  <th className="py-2 px-2">UNIV</th>
                  <th className="py-2 px-2">FIXTURE / DESTINATION</th>
                  <th className="py-2 px-2">PROTOCOL</th>
                  <th className="py-2 px-2">REFRESH</th>
                  <th className="py-2 px-2 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#34343a]/40">
                {dmxUniverses.map((u) => (
                  <tr key={u.id} className="hover:bg-[#292a2f] transition-colors">
                    <td className="py-2.5 px-2 text-[#7df4ff] font-bold">#{u.id.toString().padStart(2, '0')}</td>
                    <td className="py-2.5 px-2 text-[#f1ffef] font-semibold">{u.name}</td>
                    <td className="py-2.5 px-2 text-[#b9cbb9]">{u.protocol}</td>
                    <td className="py-2.5 px-2 text-[#b9cbb9]">{u.rate}</td>
                    <td className="py-2.5 px-2 text-right">
                      <span
                        className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                          u.status === 'ACTIVE'
                            ? 'bg-[#00ff87]/20 text-[#60ff98] border border-[#00ff87]/40'
                            : 'bg-[#93000a]/20 text-[#ffdad6] border border-[#ffb4ab]/40'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Diagnostics & Console Safety */}
        <div className="lg:col-span-4 bg-[#1e1f25] border border-[#34343a] p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#34343a]/60">
              <span className="font-['Space_Grotesk'] text-sm font-semibold text-[#f1ffef]">
                RIG INFRASTRUCTURE STATUS
              </span>
              <span className="font-['JetBrains_Mono'] text-[9px] text-[#60ff98]">NOMINAL</span>
            </div>

            <div className="flex flex-col gap-2.5 mb-4">
              <div className="bg-[#1a1b21] p-2.5 border border-[#34343a]">
                <div className="flex justify-between font-['JetBrains_Mono'] text-[10px] text-[#b9cbb9] mb-1">
                  <span>OPTIC FIBER LATENCY</span>
                  <span className="text-[#60ff98] font-bold">{hardware.opticLinkMs} MS</span>
                </div>
                <div className="font-['JetBrains_Mono'] text-[9px] text-[#849585]">
                  Primary 10GbE SFP+ Active · 0 Packet Drops
                </div>
              </div>

              <div className="bg-[#1a1b21] p-2.5 border border-[#34343a]">
                <div className="flex justify-between font-['JetBrains_Mono'] text-[10px] text-[#b9cbb9] mb-1">
                  <span>GPU TENSORRT LOAD</span>
                  <span className="text-[#7df4ff] font-bold">{hardware.gpuUsage}%</span>
                </div>
                <div className="font-['JetBrains_Mono'] text-[9px] text-[#849585]">
                  CUDA Core: {hardware.cudaCoreUsage}% · VRAM: 14.2 / 24 GB
                </div>
              </div>

              <div className="bg-[#1a1b21] p-2.5 border border-[#34343a]">
                <div className="flex justify-between font-['JetBrains_Mono'] text-[10px] text-[#b9cbb9] mb-1">
                  <span>CONSOLE LOCK INTERLOCK</span>
                  <span className={consoleLocked ? 'text-[#ffb4ab] font-bold' : 'text-[#60ff98] font-bold'}>
                    {consoleLocked ? 'LOCKED' : 'UNRESTRICTED'}
                  </span>
                </div>
                <button
                  onClick={() => setConsoleLocked(!consoleLocked)}
                  className="w-full mt-1.5 py-1 bg-[#292a2f] hover:bg-[#34343a] text-[#f1ffef] font-['JetBrains_Mono'] text-[9px] font-bold rounded cursor-pointer"
                >
                  {consoleLocked ? 'UNLOCK OPERATOR CONTROLS' : 'ENGAGE CONSOLE LOCK'}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-[#34343a]/40 font-['JetBrains_Mono'] text-[9px] text-[#849585]">
            <span>FAILSAFE PROFILE: HARDWARE TIMEOUT KILL (50 MS)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
