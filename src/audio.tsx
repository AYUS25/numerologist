import React, { createContext, useContext, useState, useEffect } from 'react';

// Global variables for Web Audio API single source of truth
let audioCtx: AudioContext | null = null;
const buffers: Record<string, AudioBuffer> = {};
let isInitializing = false;
let droneOscillators: { osc: OscillatorNode; lfo: OscillatorNode }[] = [];
let droneGainNode: GainNode | null = null;

const sampleRate = 44100;

// Standardized Haptic vibration patterns type
export type HapticPattern = 'light' | 'medium' | 'heavy' | 'error';

// Standardized trigger helper for browser Vibration API with strict iframe safety
export const triggerHapticPattern = (pattern: HapticPattern) => {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;
  
  // Verify sound settings in local storage
  const soundEnabled = typeof window !== 'undefined' ? (localStorage.getItem('aetheric_sound_enabled') !== 'false') : true;
  if (!soundEnabled) return;

  try {
    switch (pattern) {
      case 'light':
        navigator.vibrate(10);
        break;
      case 'medium':
        navigator.vibrate(35);
        break;
      case 'heavy':
        navigator.vibrate(65);
        break;
      case 'error':
        navigator.vibrate([80, 50, 80]);
        break;
    }
  } catch (err) {
    // Suppress security or iframe restriction exceptions gracefully
  }
};

// Waveform generator: click sound
function renderClickBuffer(ctx: AudioContext): AudioBuffer {
  const duration = 0.05;
  const buffer = ctx.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t = i / sampleRate;
    // frequency sweeps from 800Hz to 100Hz
    const freq = 100 + 700 * Math.exp(-60 * t);
    const amp = Math.exp(-80 * t);
    data[i] = Math.sin(2 * Math.PI * freq * t) * amp;
  }
  return buffer;
}

// Waveform generator: dial sound
function renderDialBuffer(ctx: AudioContext): AudioBuffer {
  const duration = 0.08;
  const buffer = ctx.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t = i / sampleRate;
    // triangle wave sweep from 300Hz to 50Hz
    const freq = 50 + 250 * Math.exp(-40 * t);
    const amp = Math.exp(-50 * t);
    const cycle = freq * t;
    const triangleVal = 2 * Math.abs(2 * (cycle - Math.floor(cycle + 0.5))) - 1;
    data[i] = triangleVal * amp;
  }
  return buffer;
}

// Waveform generator: tick sound
function renderTickBuffer(ctx: AudioContext): AudioBuffer {
  const duration = 0.015;
  const buffer = ctx.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t = i / sampleRate;
    // square wave sweep from 4000Hz to 200Hz
    const freq = 200 + 3800 * Math.exp(-200 * t);
    const amp = Math.exp(-150 * t);
    const val = Math.sin(2 * Math.PI * freq * t) >= 0 ? 1 : -1;
    data[i] = val * amp;
  }
  return buffer;
}

// Low-latency buffer play function
function playBuffer(name: 'click' | 'dial' | 'tick', volume: number) {
  const soundEnabled = typeof window !== 'undefined' ? (localStorage.getItem('aetheric_sound_enabled') !== 'false') : true;
  if (!soundEnabled) return;
  
  if (!audioCtx) {
    initAudioSystem(true);
  }
  
  if (audioCtx && audioCtx.state === 'suspended') {
    try {
      audioCtx.resume();
    } catch (e) {}
  }
  
  if (!audioCtx) return;
  
  let buffer = buffers[name];
  if (!buffer) {
    // Dynamically regenerate buffer on-the-fly if missing
    try {
      if (name === 'click') buffers['click'] = renderClickBuffer(audioCtx);
      else if (name === 'dial') buffers['dial'] = renderDialBuffer(audioCtx);
      else if (name === 'tick') buffers['tick'] = renderTickBuffer(audioCtx);
      buffer = buffers[name];
    } catch (e) {
      return;
    }
  }
  
  if (!buffer) return;
  
  try {
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    
    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    source.start();
  } catch (e) {
    // Fail silently
  }
}

// Low-level celestial background drone
export const startDrone = (ctx: AudioContext) => {
  try {
    if (droneGainNode) return; // already running
    
    droneGainNode = ctx.createGain();
    droneGainNode.gain.setValueAtTime(0, ctx.currentTime);
    droneGainNode.gain.linearRampToValueAtTime(0.012, ctx.currentTime + 4);
    
    const freqs = [55, 82.41, 110]; // Low celestial chord (A1, E2, A2)
    droneOscillators = freqs.map(f => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f;
      
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.05 + (Math.random() * 0.05);
      
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 3;
      
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      
      osc.connect(droneGainNode!);
      
      osc.start();
      lfo.start();
      
      return { osc, lfo };
    });
    
    droneGainNode.connect(ctx.destination);
  } catch (e) {
    console.warn("Drone failed to start:", e);
  }
};

// Stops the background drone
export const stopDrone = () => {
  try {
    if (droneGainNode) {
      droneGainNode.gain.setValueAtTime(droneGainNode.gain.value, audioCtx?.currentTime || 0);
      droneGainNode.gain.linearRampToValueAtTime(0, (audioCtx?.currentTime || 0) + 1);
      
      const oldGain = droneGainNode;
      const oldOscs = droneOscillators;
      
      droneGainNode = null;
      droneOscillators = [];
      
      setTimeout(() => {
        try {
          oldOscs.forEach(nodes => {
            nodes.osc.stop();
            nodes.lfo.stop();
          });
          oldGain.disconnect();
        } catch (e) {}
      }, 1100);
    }
  } catch (e) {}
};

// Main initializer of AudioContext and pre-rendering waveform buffers
export const initAudioSystem = (forceGesture = false) => {
  if (typeof window === 'undefined') return null;
  if (audioCtx) {
    if (audioCtx.state === 'suspended' && forceGesture) {
      audioCtx.resume();
    }
    return audioCtx;
  }
  
  if (isInitializing) return null;
  isInitializing = true;
  
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;
    
    audioCtx = new AudioContextClass();
    
    // Render and cache high-performance buffers
    buffers['click'] = renderClickBuffer(audioCtx);
    buffers['dial'] = renderDialBuffer(audioCtx);
    buffers['tick'] = renderTickBuffer(audioCtx);
    
    const droneEnabled = localStorage.getItem('aetheric_drone_enabled') !== 'false';
    const soundEnabled = localStorage.getItem('aetheric_sound_enabled') !== 'false';
    
    if (soundEnabled && droneEnabled) {
      startDrone(audioCtx);
    }
  } catch (e) {
    console.warn("Audio system init failed:", e);
  } finally {
    isInitializing = false;
  }
  return audioCtx;
};

// Legacy support wrapper functions mapping to low-latency buffered sounds
export const initAudio = (forceGesture = false) => {
  return initAudioSystem(forceGesture);
};

export const playTactileClick = () => {
  triggerHapticPattern('light');
  playBuffer('click', 0.04);
};

export const playMechanicalDial = () => {
  triggerHapticPattern('medium');
  playBuffer('dial', 0.08);
};

export const playHoverTick = () => {
  // Only trigger hover sound if AudioContext is fully active and warmed up,
  // preventing hover gestures from forcing AudioContext warnings/unsolicited popups
  if (audioCtx && audioCtx.state === 'running') {
    triggerHapticPattern('light');
    playBuffer('tick', 0.003);
  }
};

// Context setup for React components
export interface AudioContextProps {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  droneEnabled: boolean;
  setDroneEnabled: (enabled: boolean) => void;
  playClick: () => void;
  playDial: () => void;
  playTick: () => void;
  triggerHaptic: (pattern: HapticPattern) => void;
  initializeAudio: () => void;
}

const AudioReactContext = createContext<AudioContextProps | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('aetheric_sound_enabled') !== 'false';
  });
  
  const [droneEnabled, setDroneEnabledState] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('aetheric_drone_enabled') !== 'false';
  });

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    localStorage.setItem('aetheric_sound_enabled', String(enabled));
    if (!enabled) {
      stopDrone();
    } else if (droneEnabled) {
      if (audioCtx) {
        startDrone(audioCtx);
      } else {
        initAudioSystem(true);
      }
    }
  };

  const setDroneEnabled = (enabled: boolean) => {
    setDroneEnabledState(enabled);
    localStorage.setItem('aetheric_drone_enabled', String(enabled));
    if (!enabled) {
      stopDrone();
    } else if (soundEnabled) {
      if (audioCtx) {
        startDrone(audioCtx);
      } else {
        initAudioSystem(true);
      }
    }
  };

  const playClick = () => {
    playTactileClick();
  };

  const playDial = () => {
    playMechanicalDial();
  };

  const playTick = () => {
    playHoverTick();
  };

  const triggerHaptic = (pattern: HapticPattern) => {
    triggerHapticPattern(pattern);
  };

  const initializeAudio = () => {
    initAudioSystem(true);
  };

  // Synchronize system initialization with the first interaction gesture
  useEffect(() => {
    const handleGesture = () => {
      initAudioSystem(true);
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('click', handleGesture, { once: true });
      window.addEventListener('touchstart', handleGesture, { once: true });
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('click', handleGesture);
        window.removeEventListener('touchstart', handleGesture);
      }
    };
  }, []);

  // Sync state transitions of sound/drone on mount/update
  useEffect(() => {
    if (soundEnabled && droneEnabled) {
      if (audioCtx && audioCtx.state === 'running') {
        startDrone(audioCtx);
      }
    } else {
      stopDrone();
    }
  }, [soundEnabled, droneEnabled]);

  return (
    <AudioReactContext.Provider value={{
      soundEnabled,
      setSoundEnabled,
      droneEnabled,
      setDroneEnabled,
      playClick,
      playDial,
      playTick,
      triggerHaptic,
      initializeAudio
    }}>
      {children}
    </AudioReactContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioReactContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const useHaptic = () => {
  return {
    trigger: triggerHapticPattern,
    light: () => triggerHapticPattern('light'),
    medium: () => triggerHapticPattern('medium'),
    heavy: () => triggerHapticPattern('heavy'),
    error: () => triggerHapticPattern('error'),
  };
};
