import React from 'react';
import { StageProvider, useStage } from './context/StageContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { GlitchOverlay } from './components/GlitchOverlay';
import { MasterDirectorScreen } from './components/screens/MasterDirectorScreen';
import { ChaosOrchestraScreen } from './components/screens/ChaosOrchestraScreen';
import { ShadowTheaterScreen } from './components/screens/ShadowTheaterScreen';
import { RealityGlitcherScreen } from './components/screens/RealityGlitcherScreen';
import { CrowdTelemetryScreen } from './components/screens/CrowdTelemetryScreen';
import { GlobalRigSettingsScreen } from './components/screens/GlobalRigSettingsScreen';

const ScreenRouter: React.FC = () => {
  const { activeScreen } = useStage();

  switch (activeScreen) {
    case 'chaos-orchestra-engine':
      return <ChaosOrchestraScreen />;
    case 'shadow-theater-neural-rig':
      return <ShadowTheaterScreen />;
    case 'reality-glitcher-vfx':
      return <RealityGlitcherScreen />;
    case 'crowd-telemetry':
      return <CrowdTelemetryScreen />;
    case 'global-rig-settings':
      return <GlobalRigSettingsScreen />;
    case 'master-director':
    default:
      return <MasterDirectorScreen />;
  }
};

export default function App() {
  return (
    <StageProvider>
      <div className="min-h-screen bg-[#0d0e13] text-[#e3e1e9] font-['Inter'] relative selection:bg-[#00ff87] selection:text-[#003919]">
        <GlitchOverlay />
        <Header />
        <Sidebar />
        <div className="pl-64">
          <main className="w-full pt-16 min-h-screen bg-[#0d0e13]">
            <ScreenRouter />
          </main>
        </div>
      </div>
    </StageProvider>
  );
}
