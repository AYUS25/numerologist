import { initAudio, playTactileClick, playHoverTick, playMechanicalDial, useAudio } from './audio';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Compass, Moon, Sun, AlertCircle, HelpCircle, LogIn, LogOut, User as UserIcon, Save, Trash2, Database, History, Info, Volume2, VolumeX, Music } from 'lucide-react';
import IntakeForm from './components/IntakeForm';
import ReportView from './components/ReportView';
import ChatBot from './components/ChatBot';
import DailyAffirmation from './components/DailyAffirmation';
import { generateNumerologyReport } from './numerologyEngine';
import { NumerologyInput, NumerologyReport, ChatMessage } from './types';
import { Download, Upload, Printer, X } from 'lucide-react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from './firebase';
import { saveReading, getSavedReadings, deleteSavedReading, SavedReading } from './dbHelper';
import AuthModal from './components/AuthModal';

// --- API Queue and Quota Tracking ---
let apiQueue: any[] = [];
let isProcessingQueue = false;
export const globalApiMetrics = {
  success: 0,
  failed: 0,
  retries: 0,
  quotaRemaining: 1500, // example starting quota
  isRateLimited: false,
};
const metricsListeners = new Set<any>();
export const subscribeToApiMetrics = (listener) => {
  metricsListeners.add(listener);
  return () => metricsListeners.delete(listener);
};
const notifyMetricsListeners = () => {
  metricsListeners.forEach(l => l({...globalApiMetrics}));
};

const processQueue = async () => {
  if (isProcessingQueue || apiQueue.length === 0) return;
  isProcessingQueue = true;
  
  while (apiQueue.length > 0) {
    const task = apiQueue[0];
    try {
      const result = await task.execute();
      task.resolve(result);
      apiQueue.shift();
      
      // small delay between queue items if not rate limited
      if (apiQueue.length > 0 && !globalApiMetrics.isRateLimited) {
         await new Promise(r => setTimeout(r, 200));
      }
    } catch (error) {
      if (error.status === 429) {
        globalApiMetrics.isRateLimited = true;
        notifyMetricsListeners();
        
        let retryAfterMs = error.retryAfter ? parseInt(error.retryAfter, 10) * 1000 : 5000;
        if (isNaN(retryAfterMs)) retryAfterMs = 5000;
        
        // Wait before processing next item
        await new Promise(r => setTimeout(r, retryAfterMs));
        globalApiMetrics.isRateLimited = false;
        notifyMetricsListeners();
      } else {
        task.reject(error);
        apiQueue.shift();
      }
    }
  }
  isProcessingQueue = false;
};

const fetchWithRetry = (url: string, options: any = {}, retries: number = 3): Promise<any> => {
  return new Promise((resolve, reject) => {
    const execute = async () => {
      let currentRetries = 0;
      let backoffMs = 1000;
      
      while (currentRetries <= retries) {
        try {
          const res = await fetch(url, options);
          if (res.ok) {
             globalApiMetrics.success++;
             globalApiMetrics.quotaRemaining = Math.max(0, globalApiMetrics.quotaRemaining - 1);
             notifyMetricsListeners();
             return res;
          }
          
          if (res.status === 429) {
             const retryAfter = res.headers.get('Retry-After');
             throw { status: 429, retryAfter, message: 'Rate limited' };
          }
          
          throw new Error(`HTTP error! status: ${res.status}`);
        } catch (error) {
          if (error.status === 429) {
             globalApiMetrics.retries++;
             notifyMetricsListeners();
             throw error; // Let the queue handle 429
          }
          
          currentRetries++;
          globalApiMetrics.retries++;
          notifyMetricsListeners();
          
          if (currentRetries > retries) {
            globalApiMetrics.failed++;
            notifyMetricsListeners();
            throw error;
          }
          
          // Exponential backoff
          await new Promise(r => setTimeout(r, backoffMs));
          backoffMs *= 2;
        }
      }
    };
    
    apiQueue.push({ execute, resolve, reject });
    processQueue();
  });
};
// -------------------------------------


const DevDiagnosticOverlay = () => {
  const [metrics, setMetrics] = useState(globalApiMetrics);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToApiMetrics(setMetrics);
    
    const handleKeyDown = (e) => {
      // Toggle with Ctrl+Shift+D
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        setIsVisible(v => !v);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      unsubscribe();
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[999] bg-black/90 border border-green-500/50 p-4 rounded-md font-mono text-[10px] text-green-400 w-64 shadow-2xl backdrop-blur-sm">
      <div className="flex justify-between items-center border-b border-green-500/30 pb-2 mb-2">
        <span className="font-bold uppercase tracking-wider text-green-500">Dev Diagnostics</span>
        <button onClick={() => setIsVisible(false)} className="hover:text-green-200">✕</button>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between"><span>API Quota (Est):</span> <span>{metrics.quotaRemaining}</span></div>
        <div className="flex justify-between text-blue-400"><span>Successful Calls:</span> <span>{metrics.success}</span></div>
        <div className="flex justify-between text-rose-400"><span>Failed Calls:</span> <span>{metrics.failed}</span></div>
        <div className="flex justify-between text-amber-400"><span>Retries Triggered:</span> <span>{metrics.retries}</span></div>
        <div className="flex justify-between">
          <span>Queue Status:</span> 
          <span className={metrics.isRateLimited ? 'text-amber-500 animate-pulse' : 'text-green-500'}>
            {metrics.isRateLimited ? 'RATE LIMITED (WAITING)' : 'IDLE'}
          </span>
        </div>
      </div>
    </div>
  );
};


const ApiStatusIndicator = () => {
  const [metrics, setMetrics] = useState(globalApiMetrics);
  
  useEffect(() => {
    const unsub = subscribeToApiMetrics(setMetrics); return () => { unsub(); };
  }, []);

  const isHealthy = !metrics.isRateLimited && metrics.failed < 5;

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#111] border border-white/5 rounded-full" title={isHealthy ? 'API Healthy' : 'Rate Limited/Offline'}>
      <div className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`}></div>
      <span className={`text-[9px] uppercase tracking-wider font-bold ${isHealthy ? 'text-emerald-500' : 'text-amber-500'}`}>
        {isHealthy ? 'API Healthy' : 'Rate Limited'}
      </span>
    </div>
  );
};



export default function App() {
  const { soundEnabled, setSoundEnabled, droneEnabled, setDroneEnabled } = useAudio();
  const [report, setReport] = useState<NumerologyReport | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatSessions, setChatSessions] = useState<{id: string, date: string, messages: ChatMessage[]}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'error' | 'success'} | null>(null);

  // User Authentication & Persistent Readings States
  const [user, setUser] = useState<User | null>(null);
  const [savedReadings, setSavedReadings] = useState<SavedReading[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSavedReadingsLoading, setIsSavedReadingsLoading] = useState(false);

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        loadReadings(firebaseUser.uid);
      } else {
        setSavedReadings([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadReadings = async (uid: string) => {
    setIsSavedReadingsLoading(true);
    try {
      const readings = await getSavedReadings(uid);
      setSavedReadings(readings);
    } catch (err) {
      console.error('Failed to load readings:', err);
    } finally {
      setIsSavedReadingsLoading(false);
    }
  };

  const handleSaveReading = async () => {
    if (!user) {
      playTactileClick();
      setIsAuthModalOpen(true);
      return;
    }
    if (!report) return;
    
    playTactileClick();
    try {
      await saveReading(user.uid, report.input);
      setToast({ message: `Successfully saved ${report.input.fullName}'s blueprint to your celestial logs!`, type: 'success' });
      await loadReadings(user.uid);
    } catch (err: any) {
      console.error('Error saving reading:', err);
      setToast({ message: 'Cosmic alignment error: Unable to save reading.', type: 'error' });
    }
  };

  const handleDeleteReading = async (id: string, name: string) => {
    playTactileClick();
    if (!confirm(`Are you sure you want to purge ${name}'s blueprint from your celestial logs?`)) return;
    try {
      await deleteSavedReading(id);
      setToast({ message: `Purged ${name}'s blueprint from the active registry.`, type: 'success' });
      if (user) {
        await loadReadings(user.uid);
      }
    } catch (err: any) {
      console.error('Error deleting reading:', err);
      setToast({ message: 'Error purging record from database.', type: 'error' });
    }
  };

  const handleLoadSavedReading = (reading: SavedReading) => {
    playTactileClick();
    setIsLoading(true);
    setDailyTransit('');
    setTimeout(() => {
      try {
        const input: NumerologyInput = {
          fullName: reading.fullName,
          dateOfBirth: reading.dateOfBirth,
          timeOfBirth: reading.timeOfBirth || undefined,
          placeOfBirth: reading.placeOfBirth || undefined,
        };
        const rep = generateNumerologyReport(input.fullName, input.dateOfBirth, input.timeOfBirth, input.placeOfBirth, input.phoneNumber);
        setReport(rep);
        localStorage.setItem('numerology_input', JSON.stringify(input));
        localStorage.setItem('numerology_report', JSON.stringify(rep));
        setChatHistory([]);
        localStorage.removeItem('numerology_chat');
      } catch (err: any) {
        setToast({ message: 'Error restoring saved blueprint.', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleSignOut = async () => {
    playTactileClick();
    try {
      await signOut(auth);
      setToast({ message: 'Successfully closed celestial connection.', type: 'success' });
    } catch (err) {
      setToast({ message: 'Error ending session.', type: 'error' });
    }
  };

  // Auto-hide toast
  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);


  const handleExportJSON = () => {
    if (!report) return;
    const data = {
      input: report.input,
      chatHistory,
      chatSessions
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `numerology_profile_${report.input.fullName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  

  const handlePrintPDF = () => {
    window.print();
  };

  const [dailyTransit, setDailyTransit] = useState('');
  const [isTransitLoading, setIsTransitLoading] = useState(false);

  useEffect(() => {
    if (report && !dailyTransit && !isTransitLoading) {
      setIsTransitLoading(true);
      fetchWithRetry('/api/numerology/daily-forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report })
      }).then(res => res.json()).then(data => {
        if (data.forecast) setDailyTransit(data.forecast);
      }).catch((err) => setToast({ message: 'Cosmic interference detected: Unable to fetch daily transit.', type: 'error' }))
      .finally(() => setIsTransitLoading(false));
    }
  }, [report, dailyTransit, isTransitLoading]);

  // 1. Load cached numerology profiles on startup
  useEffect(() => {
    const savedInput = localStorage.getItem('numerology_input');
    if (savedInput) {
      try {
        const savedReport = localStorage.getItem('numerology_report');
        if (savedReport) {
          setReport(JSON.parse(savedReport));
        } else {
          const parsed = JSON.parse(savedInput) as NumerologyInput;
          const rep = generateNumerologyReport(parsed.fullName, parsed.dateOfBirth, parsed.timeOfBirth, parsed.placeOfBirth, parsed.phoneNumber);
          setReport(rep);
          localStorage.setItem('numerology_report', JSON.stringify(rep));
        }
        
        // Restore saved chat history
        const savedChat = localStorage.getItem('numerology_chat');
        if (savedChat) {
          setChatHistory(JSON.parse(savedChat));
        }

        // Restore chat sessions
        const savedSessions = localStorage.getItem('numerology_sessions');
        if (savedSessions) {
          setChatSessions(JSON.parse(savedSessions));
        }
      } catch (err) {
        console.error('Failed to load saved profile:', err);
      }
    }
  }, []);

  // 2. Handle core numerology calculation
  const handleIntakeSubmit = (input: NumerologyInput) => {
    setIsLoading(true);
    setToast(null);
    setDailyTransit('');
    
    // Simulate celestial computation time (1.2 seconds of cosmic loader)
    setTimeout(() => {
      try {
        const rep = generateNumerologyReport(input.fullName, input.dateOfBirth, input.timeOfBirth, input.placeOfBirth, input.phoneNumber);
        setReport(rep);
        
        // Cache input and calculated report details
        localStorage.setItem('numerology_input', JSON.stringify(input));
        localStorage.setItem('numerology_report', JSON.stringify(rep));
        
        // Clear old chat for new profile
        setChatHistory([]);
        localStorage.removeItem('numerology_chat');
      } catch (err: any) {
        setToast({ message: err.message || 'Celestial mechanics failed. Please re-enter.', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    }, 1200);
  };

  // 3. Handle sending message to Aetheria chatbot
  const handleSendMessage = async (text: string, lang: string = 'en-US') => {
    if (!report || isChatLoading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...chatHistory, userMsg];
    setChatHistory(updatedHistory);
    localStorage.setItem('numerology_chat', JSON.stringify(updatedHistory));
    setIsChatLoading(true);

    try {
      const response: any = await fetchWithRetry('/api/numerology/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: lang,
          report: report,
          messages: chatHistory,
          userMessage: text,
        }),
      });

      if (!response.ok) {
        throw new Error('Cosmic channels are noisy right now.');
      }

      const data = await response.json();
      
      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'model',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const finalHistory = [...updatedHistory, botMsg];
      setChatHistory(finalHistory);
      localStorage.setItem('numerology_chat', JSON.stringify(finalHistory));
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'model',
        content: "### 🌌 Celestial Realignment in Progress\n\nThe direct link to the universal source is temporarily experiencing interference. Please wait a moment while the energies recalibrate. \n\n**In the meantime, reflect on:**\n- Your Life Path Number: " + report.metrics.lifePath.number + "\n- Your current Personal Year: " + report.metrics.personalYear.number + "\n\nTry sending your message again shortly.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatHistory([...updatedHistory, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // 4. Handle clearing profile & state
  const handleReset = () => {
    setReport(null);
    setChatHistory([]);
    setDailyTransit('');
    localStorage.removeItem('numerology_input');
    localStorage.removeItem('numerology_report');
    localStorage.removeItem('numerology_chat');
    setToast(null);
  };

  const handleClearChat = () => {
    setChatHistory([]);
    localStorage.removeItem('numerology_chat');
  };

  const handleSaveSession = () => {
    if (chatHistory.length === 0) return;
    const newSession = {
      id: crypto.randomUUID(),
      date: new Date().toLocaleString(),
      messages: [...chatHistory]
    };
    const updatedSessions = [newSession, ...chatSessions];
    setChatSessions(updatedSessions);
    localStorage.setItem('numerology_sessions', JSON.stringify(updatedSessions));
    setChatHistory([]);
    localStorage.removeItem('numerology_chat');
  };

  const handleRestoreSession = (id: string) => {
    const session = chatSessions.find((s) => s.id === id);
    if (session) {
      setChatHistory(session.messages);
      localStorage.setItem('numerology_chat', JSON.stringify(session.messages));
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-slate-300 flex flex-col selection:bg-gold-accent/20 selection:text-gold-accent" id="app-root">
      {/* Background subtle celestial ambient aura */}
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none select-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold-accent/5 rounded-full blur-[140px]"></div>
      </div>

      {/* 1. Sophisticated Dark Top Navigation Rail */}
      <header className="h-16 border-b border-dark-border flex items-center bg-dark-panel sticky top-0 z-50 shrink-0">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-6 sm:px-8">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={handleReset}>
            <div className="p-1.5 bg-gold-accent/5 rounded-lg border border-gold-accent/15">
              <Sparkles className="w-4 h-4 text-gold-accent" />
            </div>
            <span className="font-display text-[11px] font-bold tracking-[0.2em] text-white uppercase">
              Aetheric Numerology
            </span>
          </div>
          
          {/* Controls & Auth */}
          <div className="flex items-center gap-4 sm:gap-6 text-[10px] uppercase font-mono tracking-tighter text-slate-400">
            <ApiStatusIndicator />

            {report && (
              <div className="flex items-center gap-3 border-r border-white/5 pr-4 sm:pr-6">
                <button 
                  onMouseEnter={() => playHoverTick()} 
                  onClick={handlePrintPDF} 
                  className="hover:text-gold-accent transition-colors flex items-center gap-1.5 cursor-pointer py-1 px-2 hover:bg-white/5 rounded" 
                  title="Print to PDF"
                >
                  <Printer className="w-3.5 h-3.5" /> 
                  <span className="hidden sm:inline">Print Report</span>
                </button>

                <button 
                  onMouseEnter={() => playHoverTick()} 
                  onClick={handleSaveReading} 
                  className="hover:text-gold-accent transition-colors flex items-center gap-1.5 cursor-pointer py-1 px-2 hover:bg-white/5 rounded text-gold-accent font-semibold" 
                  title="Save Reading"
                >
                  <Save className="w-3.5 h-3.5 text-gold-accent" /> 
                  <span>Save Reading</span>
                </button>
              </div>
            )}
            
            {/* Audio Preferences Widget */}
            <div className="flex items-center gap-1.5 border-r border-white/5 pr-4">
              <button
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  setTimeout(() => playMechanicalDial(), 0);
                }}
                onMouseEnter={() => playHoverTick()}
                className={`p-1.5 rounded hover:bg-white/5 cursor-pointer transition-colors ${soundEnabled ? 'text-gold-accent hover:text-white' : 'text-slate-600 hover:text-slate-500'}`}
                title={soundEnabled ? "Mute Cosmic Harmonics" : "Unmute Cosmic Harmonics"}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => {
                  setDroneEnabled(!droneEnabled);
                  setTimeout(() => playMechanicalDial(), 0);
                }}
                onMouseEnter={() => playHoverTick()}
                className={`p-1.5 rounded hover:bg-white/5 cursor-pointer transition-colors ${soundEnabled && droneEnabled ? 'text-gold-accent hover:text-white' : 'text-slate-600 hover:text-slate-500'}`}
                title={droneEnabled ? "Silence Celestial Drone" : "Resonate Celestial Drone"}
                disabled={!soundEnabled}
              >
                <Music className="w-4 h-4" />
              </button>
            </div>

            {/* User Auth Section */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex items-center gap-1.5 text-[#a1a1aa] lowercase">
                    <UserIcon className="w-3 h-3 text-gold-accent" />
                    <span>{user.email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    onMouseEnter={() => playHoverTick()}
                    className="flex items-center gap-1 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer py-1 px-2 hover:bg-rose-500/5 rounded border border-transparent hover:border-rose-500/10"
                    id="btn-sign-out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { playTactileClick(); setIsAuthModalOpen(true); }}
                  onMouseEnter={() => playHoverTick()}
                  className="flex items-center gap-1.5 text-gold-accent hover:text-white transition-all cursor-pointer py-1.5 px-3 bg-gold-accent/5 hover:bg-gold-accent/15 rounded-lg border border-gold-accent/20 hover:border-gold-accent/40 shadow-sm"
                  id="btn-sign-in-trigger"
                >
                  <LogIn className="w-3.5 h-3.5 text-gold-accent" />
                  <span>Align Account</span>
                </button>
              )}
            </div>

            <div className="hidden lg:flex items-center gap-1 pl-2 border-l border-white/5">
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
              <span>Core-9 Active</span>
            </div>
          </div>

        </div>
      </header>

      {/* 2. Main content block */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        <AnimatePresence mode="wait">
          {isLoading ? (
            /* Loading State */
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6"
              id="cosmic-loading-indicator"
            >
              <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 border-t-2 border-b-2 border-gold-accent rounded-full animate-spin"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gold-dark to-gold-accent flex items-center justify-center absolute text-xs text-black font-bold font-display">
                  Ω
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-medium text-gold-accent text-lg uppercase tracking-wider">
                  Mapping Cosmic Alignment
                </h3>
                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest animate-pulse max-w-sm">
                  Reducing numerical letter values... compiling personal year cycle... opening channel to oracle Aetheria.
                </p>
              </div>
            </motion.div>
          ) : !report ? (
            /* Intake Form View with Saved Readings Panel */
            <motion.div
              key="intake"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-10"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className={`${user ? 'lg:col-span-8' : 'lg:col-span-12'} w-full transition-all duration-500`}>
                  <IntakeForm onSubmit={handleIntakeSubmit} isLoading={isLoading} />
                </div>
                
                {/* Saved Readings List */}
                {user && (
                  <div className="lg:col-span-4 bg-dark-panel border border-dark-border p-6 shadow-2xl relative overflow-hidden text-left flex flex-col min-h-[400px]">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600"></div>
                    
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-emerald-400" />
                        <h4 className="font-display text-xs uppercase font-bold tracking-widest text-zinc-100">Saved Profiles</h4>
                      </div>
                      <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20">
                        {savedReadings.length} Saved
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-400 leading-relaxed font-sans mb-4">
                      Click any registered seeker profile to load their complete numerology report instantaneously.
                    </p>

                    {isSavedReadingsLoading ? (
                      <div className="flex-1 flex flex-col items-center justify-center py-10 space-y-3">
                        <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Querying Records...</span>
                      </div>
                    ) : savedReadings.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center py-12 text-center border border-dashed border-zinc-850 rounded-xl px-4">
                        <History className="w-8 h-8 text-zinc-700 mb-3 animate-pulse" />
                        <h5 className="text-xs font-bold text-zinc-400 uppercase font-mono tracking-wider">No Seekers Registered</h5>
                        <p className="text-[10px] text-zinc-500 max-w-xs mt-1 font-sans">
                          Once you calculate a report, click the <strong className="text-gold-accent">"Save Reading"</strong> button in the header to store it here permanently.
                        </p>
                      </div>
                    ) : (
                      <div className="flex-1 overflow-y-auto max-h-[450px] space-y-2.5 pr-1 custom-scrollbar">
                        {savedReadings.map((reading) => (
                          <div 
                            key={reading.id}
                            className="group p-3 bg-[#171717] hover:bg-[#222] border border-white/5 hover:border-emerald-500/30 rounded-xl transition-all flex items-center justify-between gap-3 relative shadow-sm"
                          >
                            <div 
                              onClick={() => handleLoadSavedReading(reading)}
                              className="flex-1 min-w-0 cursor-pointer text-left"
                            >
                              <h5 className="text-xs font-bold text-zinc-200 group-hover:text-emerald-300 transition-colors uppercase font-mono truncate">
                                {reading.fullName}
                              </h5>
                              <div className="flex items-center gap-3 text-[10px] text-zinc-500 mt-1 font-sans">
                                <span>DOB: {new Date(reading.dateOfBirth).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                {reading.placeOfBirth && <span className="truncate max-w-[100px] border-l border-white/10 pl-2">📍 {reading.placeOfBirth}</span>}
                              </div>
                            </div>

                            <button
                              onClick={() => handleDeleteReading(reading.id, reading.fullName)}
                              className="opacity-0 group-hover:opacity-100 p-2 hover:bg-rose-950/30 text-zinc-500 hover:text-rose-400 rounded-lg transition-all border border-transparent hover:border-rose-500/10 cursor-pointer"
                              title="Delete Profile"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            /* Complete Full-Stack Dashboard Grid */
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              id="dashboard-root"
            >
              {/* Daily Affirmation & Celestial Transit */}
              <div className="lg:col-span-12 space-y-6">
                <DailyAffirmation 
                  personalYear={report.metrics.personalYear.number} 
                  personalDay={report.metrics.personalDay.number} 
                />
                
                <div className="bg-blue-950/20 border border-blue-900/50 p-6 rounded-sm relative overflow-hidden text-left flex flex-col md:flex-row gap-6 items-center print:hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="flex-1">
                     <h3 className="text-xs uppercase font-bold text-blue-400 tracking-widest font-display mb-2 flex items-center gap-2">
                       <Moon className="w-4 h-4 text-blue-400" />
                       Daily Celestial Transit
                     </h3>
                     {isTransitLoading ? (
                       <div className="text-sm text-blue-300/60 font-sans animate-pulse">Consulting the oracles for today's planetary and numerological alignment...</div>
                     ) : (
                       <p className="text-sm text-blue-200/90 font-sans leading-relaxed">
                         {dailyTransit || "The cosmos are quietly integrating your energies today."}
                       </p>
                     )}
                  </div>
                </div>
              </div>

              {/* Left Side: Detailed report components (8 columns) */}
              <div className="lg:col-span-8 space-y-8 overflow-y-auto">
                <ReportView report={report} onReset={handleReset} />
              </div>

              {/* Right Side: Consultation chat interface (4 columns) */}
              <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
                <div className="bg-[#121212]/80 border-l-4 border-gold-accent p-4 rounded-sm text-left">
                  <span className="text-[10px] uppercase font-bold text-gold-accent tracking-widest font-display block mb-1">
                    Direct Spiritual Portal
                  </span>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                    Consult your Numerologist AI below. Your calculated blueprint is fully loaded within the model's focus fields to resolve your inquiries with 100% precision.
                  </p>
                </div>
                <ChatBot
                  report={report}
                  messages={chatHistory}
                  onSendMessage={handleSendMessage}
                  onClearChat={handleClearChat}
                  isLoading={isChatLoading}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. Global Footer */}
      <footer className="h-10 bg-dark-panel border-t border-dark-border flex items-center justify-between px-6 text-[9px] uppercase tracking-[0.2em] text-[#525252] shrink-0">
        <span>Pythagorean Methodology Standard v4.2.1</span>
        <span className="hidden sm:inline">© 2026 Aetheric Intelligence Collective</span>
        <span>Encryption Key: 1.6180339</span>
      </footer>

      {/* Auth Modal Portal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(msg) => setToast({ message: msg, type: 'success' })}
      />

      {/* Elegant Celestial Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-[120] max-w-sm w-full p-4 rounded-xl border shadow-2xl flex items-start gap-3 bg-zinc-950 ${
              toast.type === 'error' ? 'border-rose-900/50' : 'border-[#404040]'
            }`}
            id="celestial-toast-notification"
          >
            <div className={`absolute top-0 left-0 w-full h-1 rounded-t-xl ${
              toast.type === 'error' ? 'bg-rose-500' : 'bg-gold-accent'
            }`}></div>
            <Sparkles className={`w-5 h-5 shrink-0 mt-0.5 ${
              toast.type === 'error' ? 'text-rose-400' : 'text-gold-accent'
            }`} />
            <div className="flex-1 text-left">
              <h4 className={`text-[10px] uppercase tracking-widest font-bold font-display ${
                toast.type === 'error' ? 'text-rose-400' : 'text-gold-accent'
              }`}>
                {toast.type === 'error' ? 'System Warning' : 'Celestial Oracle'}
              </h4>
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed font-sans">{toast.message}</p>
            </div>
            <button 
              onClick={() => setToast(null)}
              className="text-zinc-500 hover:text-zinc-300 transition-colors p-1 rounded-lg hover:bg-white/5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <DevDiagnosticOverlay />
    </div>
  );
}
