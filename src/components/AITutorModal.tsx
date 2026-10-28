import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Mic, MicOff, X, Sparkles, BookOpen, Volume2, ShieldCheck, RefreshCw } from 'lucide-react';
import { MODULES_DATA } from './LearningModules';
import { LAB_REFERENCES } from '../data/ilpdData';

interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  sourceCitation?: string;
  isOfflineFallback?: boolean;
}

interface AITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AITutorModal: React.FC<AITutorModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'tutor',
      text: 'Greetings. I am your Digitalization in Healthcare Clinical AI Tutor. You can ask me questions regarding the Indian Liver Patient Dataset (ILPD), the De Ritis ratio, 5-fold cross-validation, explainable AI (SHAP), computer vision for scleral icterus, or medical ethics. How can I assist your study today?',
      timestamp: 'Just now',
      sourceCitation: 'Platform Knowledge Base & Clinical Guidelines'
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedModelTier, setSelectedModelTier] = useState<'gemini-flash' | 'gemini-lite' | 'local-tfidf'>('gemini-flash');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Local TF-IDF / Semantic Matching Engine (Offline Fallback)
  const queryLocalTFIDF = (query: string): { response: string; citation: string } => {
    const q = query.toLowerCase();

    if (q.includes('de ritis') || q.includes('ast/alt') || q.includes('ratio')) {
      return {
        response: 'The De Ritis Ratio (AST / ALT), documented by Fernando De Ritis in 1957, is a critical hepatology biomarker. A ratio exceeding 2.0 strongly indicates alcoholic hepatitis or advanced cirrhosis. In contrast, acute viral hepatitis and early NAFLD typically exhibit ratios below 1.0 because cytosolic ALT rises faster than mitochondrial AST.',
        citation: 'Module 4: Clinical Feature Engineering & De Ritis Ratio'
      };
    }
    if (q.includes('bilirubin') || q.includes('icterus') || q.includes('jaundice')) {
      return {
        response: 'Bilirubin is a catabolic byproduct of heme breakdown. Scleral icterus (yellow eyes) becomes clinically evident when serum total bilirubin exceeds 2.5 - 3.0 mg/dL, due to bilirubin’s high binding affinity for scleral elastin. Direct (conjugated) bilirubin exceeding 50% of the total points towards biliary cholestasis or hepatocellular injury.',
        citation: 'Module 3 & Module 9: Medical Computer Vision & Scleral Icterus'
      };
    }
    if (q.includes('roc') || q.includes('auc') || q.includes('accuracy') || q.includes('paradox')) {
      return {
        response: 'The Accuracy Paradox occurs in healthcare because clinical datasets often feature heavy class imbalance (e.g. 71.4% liver patients in the ILPD). A useless dummy model predicting "Patient" for everyone achieves 71.4% raw accuracy. ROC-AUC evaluates true positive rate vs false positive rate across all decision thresholds and remains invariant to prevalence skew.',
        citation: 'Module 6: Model Evaluation & Asymmetric Costs'
      };
    }
    if (q.includes('shap') || q.includes('explain') || q.includes('xai') || q.includes('black box')) {
      return {
        response: 'Explainable AI (XAI) addresses the black-box dilemma in medicine. SHAP (Shapley Additive exPlanations) uses game theory to calculate the marginal contribution of each lab marker (e.g. elevated ALP and direct bilirubin) to a patient’s specific risk score. This ensures doctors can verify biochemical plausibility before taking clinical action.',
        citation: 'Module 7: Explainable AI & Demystifying Black-Box Algorithms'
      };
    }
    if (q.includes('112') || q.includes('emergency') || q.includes('cpr')) {
      return {
        response: 'India’s unified single emergency telephone number is 112, connecting universal dispatch for Police, Fire, and Ambulance across all States. In acute emergencies such as pulseless cardiac arrest, immediately dial 112 and initiate high-quality chest compressions at 100-120/min at a depth of 5-6 cm.',
        citation: 'Clinical Ethics & First-Aid Handbook'
      };
    }

    return {
      response: `Regarding "${query}": In medical data science, the key is maintaining rigorous feature standardization (StandardScaler), validating on stratified 5-fold cross validation, and adhering to the Nine Ethical Rules of Digital Medicine—ensuring the algorithm serves to augment clinical human judgement rather than replace it.`,
      citation: 'Clinical Decision Support System Architecture & GMLP'
    };
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputPrompt.trim() || isLoading) return;

    const userText = inputPrompt.trim();
    setInputPrompt('');

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // If local-tfidf is selected, skip API
      if (selectedModelTier === 'local-tfidf') {
        const localRes = queryLocalTFIDF(userText);
        setMessages(prev => [
          ...prev,
          {
            id: `t-${Date.now()}`,
            sender: 'tutor',
            text: localRes.response,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sourceCitation: localRes.citation,
            isOfflineFallback: true
          }
        ]);
        setIsLoading(false);
        return;
      }

      // Call server-side Gemini API proxy route
      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          modelTier: selectedModelTier
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      if (data.answer) {
        setMessages(prev => [
          ...prev,
          {
            id: `t-${Date.now()}`,
            sender: 'tutor',
            text: data.answer,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sourceCitation: data.citation || 'Gemini 3.8 Flash Clinical Pedagogical Reasoning'
          }
        ]);
      } else {
        throw new Error('No answer in response');
      }
    } catch (err) {
      // Graceful fallback to localized TF-IDF engine
      const localRes = queryLocalTFIDF(userText);
      setMessages(prev => [
        ...prev,
        {
          id: `t-${Date.now()}`,
          sender: 'tutor',
          text: localRes.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sourceCitation: `${localRes.citation} (Local Knowledge Engine)`,
          isOfflineFallback: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Microphone audio transcription using browser Web Speech API
  const toggleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputPrompt(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl h-[620px] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Clinical AI Medical Data Science Tutor</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                  Active
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Grounding: ILPD Dataset, Hepatology Rules &amp; CDSS Standards
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Model Tier Selector */}
            <select
              value={selectedModelTier}
              onChange={e => setSelectedModelTier(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-lg px-2 py-1 font-mono"
            >
              <option value="gemini-flash">Gemini 3.8 Flash</option>
              <option value="gemini-lite">Gemini 3.1 Flash-Lite</option>
              <option value="local-tfidf">Offline Local TF-IDF</option>
            </select>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Message Scroll Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none space-y-1.5'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {msg.sourceCitation && (
                  <div className="pt-2 mt-2 border-t border-slate-800/80 text-[10px] text-cyan-400 flex items-center gap-1 font-mono">
                    <BookOpen className="w-3 h-3" />
                    <span>Citation: {msg.sourceCitation}</span>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs bg-slate-950 p-3 rounded-2xl max-w-xs border border-slate-800">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>Synthesizing clinical response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`p-2.5 rounded-xl border transition-colors ${
              isListening
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Transcribe voice input with microphone"
          >
            {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputPrompt}
            onChange={e => setInputPrompt(e.target.value)}
            placeholder={isListening ? 'Listening via microphone...' : 'Ask about De Ritis ratio, ILPD, ROC-AUC, or SaMD ethics...'}
            className="flex-1 bg-slate-900 border border-slate-800 text-xs text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-cyan-500"
          />

          <button
            type="submit"
            disabled={!inputPrompt.trim() || isLoading}
            className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 p-2.5 rounded-xl shadow transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
