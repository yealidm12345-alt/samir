import React, { useState, useEffect, useRef } from 'react';
import { 
  RotateCw, 
  Maximize2, 
  Minimize2, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Wifi, 
  Battery, 
  Volume2,
  ExternalLink
} from 'lucide-react';
import { AppProject } from '../types';
import { soundManager } from '../services/sound';

interface PhoneSimulatorProps {
  project: AppProject;
  onConsoleLog?: (type: 'log' | 'warn' | 'error', message: string) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  language: 'en' | 'bn';
}

type DeviceMode = 'pixel8' | 'galaxy' | 'tablet' | 'responsive';

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  project,
  onConsoleLog,
  isFullscreen,
  onToggleFullscreen,
  language,
}) => {
  const [device, setDevice] = useState<DeviceMode>('pixel8');
  const [key, setKey] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState<string>('10:42');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Listen to messages from the sandbox iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'APEX_CONSOLE') {
        onConsoleLog?.(event.data.level, event.data.message);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onConsoleLog]);

  const reloadSimulator = () => {
    soundManager.playClick();
    setKey((prev) => prev + 1);
    onConsoleLog?.('log', '[Simulator] Hard reload sandbox container');
  };

  // Build combined HTML bundle to inject into iframe srcdoc
  const combinedSrcDoc = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <style>
    ${project.css}
  </style>
  <script>
    // Console interceptor for live debug inspector
    (function() {
      const oldLog = console.log;
      const oldWarn = console.warn;
      const oldError = console.error;
      
      console.log = function(...args) {
        window.parent.postMessage({ type: 'APEX_CONSOLE', level: 'log', message: args.join(' ') }, '*');
        oldLog.apply(console, args);
      };
      console.warn = function(...args) {
        window.parent.postMessage({ type: 'APEX_CONSOLE', level: 'warn', message: args.join(' ') }, '*');
        oldWarn.apply(console, args);
      };
      console.error = function(...args) {
        window.parent.postMessage({ type: 'APEX_CONSOLE', level: 'error', message: args.join(' ') }, '*');
        oldError.apply(console, args);
      };

      // Mock Android Native Bridge for Webview
      window.AndroidBridge = {
        showToast: function(msg) {
          console.log('[NativeBridge] Toast: ' + msg);
        },
        vibratePhone: function(ms) {
          console.log('[NativeBridge] Haptic Vibe: ' + ms + 'ms');
          if (navigator.vibrate) navigator.vibrate(ms);
        }
      };
    })();
  </script>
</head>
<body>
  ${project.html}
  <script>
    try {
      ${project.js}
    } catch(err) {
      console.error(err.message);
    }
  </script>
</body>
</html>
`;

  // Dimensions based on device
  let frameWidth = 'w-[370px]';
  let frameHeight = 'h-[720px]';

  if (device === 'galaxy') {
    frameWidth = 'w-[360px]';
    frameHeight = 'h-[700px]';
  } else if (device === 'tablet') {
    frameWidth = 'w-[560px]';
    frameHeight = 'h-[680px]';
  } else if (device === 'responsive') {
    frameWidth = 'w-full';
    frameHeight = 'h-[720px]';
  }

  return (
    <div className={`flex flex-col items-center justify-start h-full p-3 sm:p-4 bg-neutral-950/80 border border-neutral-800 rounded-xl ${isFullscreen ? 'fixed inset-0 z-50 p-6 bg-neutral-950' : ''}`}>
      {/* Device Toolbar Controls */}
      <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-neutral-800 text-xs">
        <div className="flex items-center gap-1.5 p-1 bg-neutral-900 rounded-lg border border-neutral-800">
          <button
            onClick={() => {
              soundManager.playClick();
              setDevice('pixel8');
            }}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
              device === 'pixel8' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
            }`}
            title="Pixel 8 Mockup"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pixel 8</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setDevice('galaxy');
            }}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
              device === 'galaxy' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
            }`}
            title="Galaxy S24"
          >
            <Smartphone className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Galaxy S24</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setDevice('tablet');
            }}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
              device === 'tablet' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
            }`}
            title="10-inch Tablet"
          >
            <Tablet className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Tablet</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setDevice('responsive');
            }}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
              device === 'responsive' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
            }`}
            title="Fluid Full Width"
          >
            <Monitor className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Fluid</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={reloadSimulator}
            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
            title="Reload sandbox preview"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onToggleFullscreen();
            }}
            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Sandbox'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-amber-400" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Mockup Frame Container */}
      <div className={`transition-all duration-300 relative flex flex-col ${frameWidth} ${frameHeight} max-w-full rounded-[38px] border-4 border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden`}>
        {/* Device Notch / Punch-hole Camera */}
        <div className="w-full bg-neutral-950 h-7 flex items-center justify-between px-6 pt-1 text-[11px] font-mono text-neutral-400 select-none z-10">
          <span className="font-semibold text-neutral-200">{currentTime}</span>
          <div className="w-3.5 h-3.5 rounded-full bg-neutral-800 border border-neutral-700 mx-auto"></div>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold text-emerald-400">5G</span>
            <Wifi className="w-3 h-3 text-neutral-300" />
            <Battery className="w-3.5 h-3.5 text-neutral-300" />
          </div>
        </div>

        {/* Live Iframe Viewport */}
        <div className="flex-1 w-full bg-black relative overflow-hidden">
          <iframe
            key={key}
            ref={iframeRef}
            srcDoc={combinedSrcDoc}
            title="ApexDroid Native Simulator"
            className="w-full h-full border-none bg-neutral-950"
            sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
          />
        </div>

        {/* Android Home Navigation Pill Indicator */}
        <div className="w-full bg-neutral-950 py-1.5 flex justify-center items-center z-10">
          <div className="w-28 h-1 rounded-full bg-neutral-600"></div>
        </div>
      </div>
    </div>
  );
};
