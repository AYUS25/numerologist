import { playTactileClick, playHoverTick, playMechanicalDial } from '../audio';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, Trash2, HelpCircle, Volume2, VolumeX, Menu, Mic, MicOff, Globe } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, NumerologyReport } from '../types';

interface ChatBotProps {
  report: NumerologyReport;
  messages: ChatMessage[];
  onSendMessage: (text: string, lang: string) => void;
  onClearChat: () => void;
  isLoading: boolean;
}

export default function ChatBot({ report, messages, onSendMessage, onClearChat, isLoading }: ChatBotProps) {
  const [inputText, setInputText] = useState('');
  const [isTtsEnabled, setIsTtsEnabled] = useState(false);
  const [isInteractiveMode, setIsInteractiveMode] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'speaking' | 'processing'>('idle');
  const [currentlySpokenMsgId, setCurrentlySpokenMsgId] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en-US' | 'hi-IN'>('en-US');
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const lastSpokenMsgId = useRef<string | null>(null);
  const finalTranscriptRef = useRef('');
  const isInteractiveModeRef = useRef(false);
  const languageRef = useRef(language);

  // Sync refs to avoid closure stale-state inside Web Speech API event listeners
  useEffect(() => {
    isInteractiveModeRef.current = isInteractiveMode;
  }, [isInteractiveMode]);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  // Suggested questions based on their actual numbers
  const suggestions = [
    `Explain how my Life Path ${report.metrics.lifePath.number} and Expression ${report.metrics.expression.number} interact.`,
    `What are my primary Karmic Lessons, and how do I master them?`,
    `What does my Personal Year ${report.metrics.personalYear.number} mean for my career and love life?`,
    `How do my Soul Urge ${report.metrics.soulUrge.number} and Personality ${report.metrics.personality.number} compare?`
  ];

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false; // Stop when speech pauses to allow automatic submit
        rec.interimResults = true;
        
        rec.onstart = () => {
          setIsListening(true);
          if (isInteractiveModeRef.current) {
            setVoiceStatus('listening');
          }
        };

        rec.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + ' ';
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          const fullText = (finalTranscriptRef.current + finalTranscript + interimTranscript).trim();
          setInputText(fullText);
          
          if (finalTranscript.trim()) {
            finalTranscriptRef.current = (finalTranscriptRef.current + finalTranscript).trim();
          }
        };

        rec.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
          if (isInteractiveModeRef.current) {
            setVoiceStatus('idle');
          }
        };

        rec.onend = () => {
          setIsListening(false);
          const textToSend = finalTranscriptRef.current.trim();
          finalTranscriptRef.current = ''; // Reset
          
          if (isInteractiveModeRef.current) {
            if (textToSend) {
              // Submit immediately inside Interactive Mode
              setVoiceStatus('processing');
              setInputText('');
              onSendMessage(textToSend, languageRef.current);
            } else {
              // Auto-restart listening if user stopped without speech, unless AI is currently speaking
              setVoiceStatus('idle');
              if (window.speechSynthesis && !window.speechSynthesis.speaking) {
                setTimeout(() => {
                  if (isInteractiveModeRef.current) {
                    try {
                      recognitionRef.current?.start();
                    } catch (e) {}
                  }
                }, 300);
              }
            }
          } else {
            setVoiceStatus('idle');
          }
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language;
    }
  }, [language]);

  const toggleListening = () => {
    playMechanicalDial();
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  // Text to Speech engine with strict markdown filtering
  const speakText = (text: string, msgId?: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    
    if (currentlySpokenMsgId === msgId && msgId) {
      // Toggle off / stop speaking
      setCurrentlySpokenMsgId(null);
      setVoiceStatus('idle');
      return;
    }

    if (msgId) {
      setCurrentlySpokenMsgId(msgId);
    } else {
      setCurrentlySpokenMsgId(null);
    }

    const cleanedText = text
      .replace(/[*#_`~]/g, '')
      .replace(/\[\d+\]/g, '') // remove citation brackets
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = language;
    
    utterance.onstart = () => {
      setVoiceStatus('speaking');
      if (isInteractiveModeRef.current) {
        try {
          recognitionRef.current?.stop();
          setIsListening(false);
        } catch (e) {}
      }
    };

    const handleEnd = () => {
      setVoiceStatus('idle');
      setCurrentlySpokenMsgId(null);
      if (isInteractiveModeRef.current && !isLoading) {
        setTimeout(() => {
          if (isInteractiveModeRef.current) {
            try {
              recognitionRef.current?.start();
              setIsListening(true);
              setVoiceStatus('listening');
            } catch (e) {}
          }
        }, 400);
      }
    };

    utterance.onend = handleEnd;
    utterance.onerror = handleEnd;

    window.speechSynthesis.speak(utterance);
  };

  // Handle automatic readout of incoming AI model replies
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    if (isTtsEnabled && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'model' && lastMessage.id !== lastSpokenMsgId.current) {
        lastSpokenMsgId.current = lastMessage.id;
        speakText(lastMessage.content, lastMessage.id);
      }
    }
  }, [messages, isLoading, isTtsEnabled, language]);

  const toggleTts = () => {
    setIsTtsEnabled((prev) => {
      const next = !prev;
      if (!next && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    
    onSendMessage(inputText.trim(), language);
    setInputText('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (isLoading) return;
    onSendMessage(suggestion, language);
  };

  return (
    <div className="bg-dark-panel border border-dark-border h-[640px] flex flex-col overflow-hidden shadow-2xl relative rounded-2xl" id="chatbot-container">
      {/* 1. Chat Header */}
      <div className="p-4 bg-dark-panel border-b border-dark-border flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500/10 rounded-full border border-blue-500/30 flex items-center justify-center animate-celestial-float">
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h4 className="font-display text-xs font-bold text-[#f5f5f7] tracking-widest uppercase">
              The Life Audit Panel
            </h4>
            <p className="text-[10px] text-zinc-500 font-sans">
              Interactive Numerologist Oracle
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button onMouseEnter={() => playHoverTick()} onTouchMove={() => playHoverTick()}  
              onClick={onClearChat}
              className="p-2 hover:bg-rose-500/10 rounded-lg text-slate-500 hover:text-rose-400 transition-colors border border-transparent hover:border-rose-500/20 cursor-pointer"
              title="Clear conversation"
              id="btn-clear-chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Control Switchboard Panel */}
      <div className="px-4 py-3.5 bg-zinc-950 border-b border-dark-border grid grid-cols-3 gap-2.5 shrink-0" id="chatbot-switches-row">
        {/* Switch 1: Language Toggle */}
        <button
          onClick={() => { playMechanicalDial(); setLanguage(lang => lang === 'en-US' ? 'hi-IN' : 'en-US'); }}
          className={`py-3 px-3 rounded-xl border text-[10px] font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
            language === 'en-US'
              ? 'bg-zinc-900 border-zinc-700 hover:border-zinc-500 text-zinc-100 hover:bg-zinc-800'
              : 'bg-zinc-900 border-zinc-700 hover:border-zinc-500 text-zinc-100 hover:bg-zinc-800'
          }`}
          id="btn-switch-lang"
        >
          <Globe className={`w-3.5 h-3.5 ${language === 'en-US' ? 'text-blue-400' : 'text-indigo-400'}`} />
          <span className="flex items-center gap-1.5">
            <span>{language === 'en-US' ? 'English' : 'Hindi'}</span>
            <span className={`w-1.5 h-1.5 rounded-full ${language === 'en-US' ? 'bg-blue-400 shadow-[0_0_4px_#60a5fa]' : 'bg-indigo-400 shadow-[0_0_4px_#818cf8]'}`}></span>
          </span>
        </button>

        {/* Switch 2: Voice Oracle (TTS) */}
        <button
          onClick={() => { playMechanicalDial(); toggleTts(); }}
          className={`py-3 px-3 rounded-xl border text-[10px] font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
            isTtsEnabled
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 hover:border-zinc-700'
          }`}
          id="btn-switch-voice"
        >
          {isTtsEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-500" />}
          <span className="flex items-center gap-1.5">
            <span>Voice: {isTtsEnabled ? 'ON' : 'OFF'}</span>
            <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isTtsEnabled ? 'bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]' : 'bg-zinc-600'}`}></span>
          </span>
        </button>

        {/* Switch 3: Interactive Mode (Hands-Free turn-taking) */}
        <button
          onClick={() => {
            playMechanicalDial();
            setIsInteractiveMode(prev => {
              const next = !prev;
              if (next) {
                window.speechSynthesis?.cancel();
                setIsTtsEnabled(true);
                setTimeout(() => {
                  try {
                    recognitionRef.current?.start();
                    setIsListening(true);
                    setVoiceStatus('listening');
                  } catch (e) {}
                }, 150);
              } else {
                try {
                  recognitionRef.current?.stop();
                  setIsListening(false);
                  setVoiceStatus('idle');
                } catch (e) {}
              }
              return next;
            });
          }}
          className={`py-3 px-3 rounded-xl border text-[10px] font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
            isInteractiveMode
              ? 'bg-purple-950/40 border-purple-500/50 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 hover:border-zinc-700'
          }`}
          id="btn-switch-interactive"
        >
          <Mic className={`w-3.5 h-3.5 ${isInteractiveMode ? 'text-purple-400 animate-bounce' : 'text-zinc-500'}`} />
          <span className="flex items-center gap-1.5">
            <span>Interactive</span>
            <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isInteractiveMode ? 'bg-purple-400 animate-pulse shadow-[0_0_6px_#c084fc]' : 'bg-zinc-600'}`}></span>
          </span>
        </button>
      </div>

      {/* Voice Status Indicator bar */}
      {isInteractiveMode && (
        <div className="bg-purple-950/20 px-4 py-1.5 text-[9px] uppercase tracking-widest text-purple-400/90 font-mono flex items-center justify-between border-b border-purple-500/10">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${voiceStatus === 'listening' ? 'bg-emerald-500 animate-ping' : voiceStatus === 'speaking' ? 'bg-blue-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`}></span>
            <span>Status: {voiceStatus === 'listening' ? 'Listening...' : voiceStatus === 'speaking' ? 'Speaking...' : voiceStatus === 'processing' ? 'Processing...' : 'Ready'}</span>
          </div>
          {voiceStatus === 'listening' && <span className="text-[8px] animate-pulse">Hands-free active</span>}
        </div>
      )}

      <div className="flex-1 flex overflow-hidden relative">
        {/* 2. Messages Box */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" id="chat-messages-box">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <HelpCircle className="w-10 h-10 text-slate-800 animate-pulse" />
              <div>
                <p className="font-display text-xs font-semibold text-blue-500 tracking-wider uppercase">
                  WELCOME TO YOUR LIFE AUDIT
                </p>
                <p className="text-[11px] text-[#71717a] font-sans max-w-xs mx-auto mt-1 leading-relaxed">
                  Hello! I am your personal Numerologist. Come on in, let's discuss your life, your goals, or anything you'd like to explore. Your blueprint is ready—what's on your mind today?
                </p>
              </div>
              {/* Suggested starters */}
              <div className="w-full max-w-sm pt-4 border-t border-dark-border space-y-2">
                <span className="text-[9px] uppercase tracking-widest text-[#525252] font-mono block mb-2">
                  Suggested Inquiries
                </span>
                {suggestions.map((s, idx) => (
                  <button onMouseEnter={() => playHoverTick()} onTouchMove={() => playHoverTick()}  
                    key={idx}
                    onClick={() => handleSuggestionClick(s)}
                    className="w-full text-left bg-[#171717] hover:bg-blue-500/5 border border-dark-border hover:border-blue-500/20 p-3 rounded-lg text-[11px] text-slate-400 hover:text-blue-500 transition-all cursor-pointer leading-normal block"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                const isSpoken = currentlySpokenMsgId === msg.id;
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] rounded-xl p-4 text-xs leading-relaxed relative group ${
                      isUser 
                        ? 'bg-blue-500/15 text-[#f5f5f7] rounded-tr-none font-sans font-medium border border-blue-500/20' 
                        : 'bg-dark-bg border border-dark-border text-slate-300 rounded-tl-none font-sans'
                    }`}>
                      {/* Readout speaker button on message bubbles */}
                      {!isUser && (
                        <button
                          type="button"
                          onClick={() => { playTactileClick(); speakText(msg.content, msg.id); }}
                          className={`absolute right-2 top-2 p-1.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100 ${
                            isSpoken ? 'text-blue-400 opacity-100 bg-blue-500/10 border border-blue-500/20' : 'text-slate-500 hover:text-blue-400'
                          }`}
                          title={isSpoken ? "Stop reading" : "Read aloud"}
                        >
                          <Volume2 className={`w-3.5 h-3.5 ${isSpoken ? 'animate-bounce' : ''}`} />
                        </button>
                      )}

                      {isUser ? (
                        <p className="whitespace-pre-wrap pr-4">{msg.content}</p>
                      ) : (
                        <div className="markdown-body space-y-2 pr-6">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed text-[#d1d1d6]">{children}</p>,
                              ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1 text-[#d1d1d6]">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1 text-[#d1d1d6]">{children}</ol>,
                              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                              h1: ({ children }) => <h1 className="font-display font-bold text-xs text-blue-400 mt-3 mb-1">{children}</h1>,
                              h2: ({ children }) => <h2 className="font-display font-bold text-xs text-blue-400 mt-2 mb-1">{children}</h2>,
                              h3: ({ children }) => <h3 className="font-display font-semibold text-xs text-blue-400/80 mt-2 mb-0.5">{children}</h3>,
                              strong: ({ children }) => <strong className="font-bold text-blue-400">{children}</strong>,
                              em: ({ children }) => <em className="italic text-slate-400">{children}</em>,
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      )}
                      <span className={`block text-[8px] mt-2 ${isUser ? 'text-slate-400' : 'text-slate-600'} font-mono`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-dark-bg border border-dark-border text-slate-400 rounded-xl p-4 flex items-center gap-2 text-xs">
                    <div className="flex gap-1.5 items-center justify-center">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                    <span className="font-display italic text-[11px] text-blue-500/60 tracking-wider">Consulting the cosmos...</span>
                  </div>
                </motion.div>
              )}
              <div ref={chatBottomRef} />
            </div>
          )}
        </div>
      </div>

      {/* 3. Input Form with Microphone Inside */}
      <form onSubmit={handleSubmit} className="p-3 bg-dark-panel border-t border-dark-border shrink-0">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isListening ? "Listening... Speak now." : "Ask about your karmic debt or vibrational sync..."}
            className="w-full bg-[#171717] border border-dark-border focus:border-blue-500 rounded-xl py-3.5 pl-4 pr-24 text-white placeholder-[#404040] focus:outline-none transition-colors text-xs font-mono"
            disabled={isLoading}
            id="chatbot-input-field"
          />
          
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {recognitionRef.current && (
              <button onMouseEnter={() => playHoverTick()} onTouchMove={() => playHoverTick()}  
                type="button"
                onClick={toggleListening}
                className={`p-2 transition-all cursor-pointer rounded-lg ${
                  isListening 
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                    : 'hover:bg-blue-500/10 text-slate-500 hover:text-blue-400'
                }`}
                title={isListening ? "Stop listening" : "Start Voice Input"}
              >
                {isListening ? <Mic className="w-4 h-4 animate-pulse text-rose-400" /> : <Mic className="w-4 h-4" />}
              </button>
            )}
            <button onMouseEnter={() => playHoverTick()} onTouchMove={() => playHoverTick()}  
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2 hover:bg-blue-500/10 text-blue-500 disabled:text-slate-700 transition-all cursor-pointer rounded-lg text-[10px] uppercase tracking-widest font-bold"
              id="chatbot-send-button"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
