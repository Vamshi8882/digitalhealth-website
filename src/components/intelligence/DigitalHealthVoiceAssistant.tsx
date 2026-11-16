/**
 * Digitalization in Healthcare - Digital Health Voice Assistant
 * Voice-based interaction for medical education, verbal clinical queries,
 * automated voice navigation, and clinical speech dictation using Web Speech API (STT & TTS).
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  Sparkles,
  ArrowRight,
  Send,
  MessageSquare,
  HelpCircle,
  Play,
  RotateCcw,
  Activity,
  Layers,
  FileText,
  Stethoscope
} from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

interface VoiceAssistantProps {
  onNavigateToView?: (viewId: string) => void;
}

export const DigitalHealthVoiceAssistant: React.FC<VoiceAssistantProps> = ({ onNavigateToView }) => {
  const { awardXP } = useProgress();

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string; action?: string }>>([
    {
      sender: 'assistant',
      text: "Greetings, Doctor. I am your Digital Health Medical Voice Assistant. You can speak commands like 'Explain De Ritis ratio', 'Show MASLD guidelines', or 'Navigate to Case Simulator'."
    }
  ]);

  const recognitionRef = useRef<any>(null);

  // Initialize SpeechRecognition if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const spokenText = event.results[0][0].transcript;
          setTranscript(spokenText);
          handleProcessVoiceQuery(spokenText);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Text-To-Speech
  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Toggle listening
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
          awardXP(5);
        } catch (e) {
          console.warn('SpeechRecognition start error:', e);
        }
      } else {
        alert('Web Speech Recognition API is not supported in this browser. You can type queries directly below!');
      }
    }
  };

  // Process voice/text command
  const handleProcessVoiceQuery = (query: string) => {
    const q = query.toLowerCase().trim();
    if (!q) return;

    setMessages((prev) => [...prev, { sender: 'user', text: query }]);

    let responseText = '';
    let navAction = '';

    if (q.includes('case simulator') || q.includes('case') || q.includes('patient')) {
      responseText = 'Navigating you to the Inpatient Clinical Case Simulator ward now.';
      navAction = 'cases';
    } else if (q.includes('predictor') || q.includes('risk') || q.includes('stratify')) {
      responseText = 'Opening the Clinical Risk Predictor for patient laboratory stratification.';
      navAction = 'predictor';
    } else if (q.includes('de ritis') || q.includes('ratio') || q.includes('ast alt')) {
      responseText =
        'The De Ritis Ratio is AST divided by ALT. A ratio greater than 2.0 with AST under 400 is pathognomonic for alcoholic hepatitis. A ratio under 1.0 is typical for acute viral hepatitis or metabolic fatty liver disease.';
    } else if (q.includes('masld') || q.includes('fatty liver') || q.includes('nafld')) {
      responseText =
        'Metabolic Dysfunction-Associated Steatotic Liver Disease (MASLD) presents with ALT predominant over AST and normal bilirubin. AASLD guidelines recommend calculating the FIB-4 score to triage advanced fibrosis.';
    } else if (q.includes('cirrhosis') || q.includes('portal hypertension') || q.includes('ascites')) {
      responseText =
        'Cirrhosis features architectural bridging fibrosis. Hallmark lab signs include thrombocytopenia below 150,000 from splenic pooling, hypoalbuminemia, and prolonged INR. EASL guidelines mandate paracentesis for ascites to rule out SBP.';
    } else if (q.includes('guidelines') || q.includes('aasld') || q.includes('easl')) {
      responseText = 'Accessing international hepatology clinical guidelines from AASLD, EASL, and WHO.';
    } else if (q.includes('report') || q.includes('ocr') || q.includes('pdf')) {
      responseText = 'Opening the Medical Report Analyzer OCR engine for digitized lab report extraction.';
    } else {
      responseText = `Clinical consultation regarding "${query}": In the Indian Liver Patient Dataset, predictive accuracy relies heavily on transaminases, bilirubin conjugation fraction, and synthetic albumin. Remember: ROC-AUC is preferred over raw accuracy due to the 71.4% class imbalance.`;
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'assistant', text: responseText, action: navAction }]);
      speakText(responseText);
      if (navAction && onNavigateToView) {
        setTimeout(() => onNavigateToView(navAction), 1500);
      }
      awardXP(15);
    }, 400);

    setInputText('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800 font-bold flex items-center gap-1">
                <Mic className="w-3.5 h-3.5" />
                Conversational Speech AI &bull; STT &amp; TTS Engine
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded font-mono font-semibold">
                Hands-Free Medical Navigation
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>Digital Health Voice Assistant</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Interact verbally using your microphone. Ask complex hepatology pathophysiology questions, dictate patient symptoms, or speak natural commands to navigate directly across clinical simulators and guidelines.
            </p>
          </div>

          {/* Voice Mic Trigger Button */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={toggleListening}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold transition-all shadow-xl cursor-pointer ${
                isListening
                  ? 'bg-rose-500 text-white animate-bounce shadow-rose-950/80 ring-4 ring-rose-500/30'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-950/50 hover:scale-105'
              }`}
            >
              {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
            </button>

            <div>
              <div className="text-xs font-bold text-white">
                {isListening ? 'Listening to voice...' : isSpeaking ? 'Speaking audio...' : 'Tap Mic to Speak'}
              </div>
              <div className="text-[11px] text-slate-400">Web Speech API Voice Engine</div>
            </div>
          </div>
        </div>

        {/* Audio Waveform Animation when Listening / Speaking */}
        {(isListening || isSpeaking) && (
          <div className="mt-4 flex items-center justify-center gap-1.5 h-8 animate-in fade-in">
            {[40, 75, 90, 60, 100, 45, 80, 95, 55, 70, 85].map((height, i) => (
              <div
                key={i}
                className={`w-1.5 rounded-full transition-all duration-150 ${
                  isListening ? 'bg-rose-400' : 'bg-cyan-400'
                }`}
                style={{
                  height: `${height}%`,
                  animation: 'pulse 1s infinite',
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Suggested Voice Commands */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Click to ask:
        </span>
        {[
          'Explain De Ritis ratio',
          'Navigate to Case Simulator',
          'What is MASLD fatty liver?',
          'Show cirrhosis guidelines',
          'Analyze medical report',
          'Explain AST vs ALT'
        ].map((sample) => (
          <button
            key={sample}
            onClick={() => handleProcessVoiceQuery(sample)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs transition-colors cursor-pointer"
          >
            &quot;{sample}&quot;
          </button>
        ))}
      </div>

      {/* Chat Transcript Conversation History */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="text-xs font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>Spoken Conversation Transcript</span>
          </div>

          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="text-[11px] text-rose-400 hover:underline flex items-center gap-1"
            >
              <VolumeX className="w-3.5 h-3.5" /> Stop Voice
            </button>
          )}
        </div>

        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 text-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl max-w-xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none space-y-2'
                }`}
              >
                <div>{m.text}</div>
                {m.sender === 'assistant' && (
                  <button
                    onClick={() => speakText(m.text)}
                    className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer pt-1"
                  >
                    <Volume2 className="w-3 h-3" /> Replay Voice Audio
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Field Fallback */}
        <div className="pt-2 flex items-center gap-2 border-t border-slate-800">
          <input
            type="text"
            placeholder="Type or speak a clinical medical question..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleProcessVoiceQuery(inputText)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />

          <button
            onClick={() => handleProcessVoiceQuery(inputText)}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
