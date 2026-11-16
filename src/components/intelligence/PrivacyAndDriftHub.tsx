/**
 * Digitalization in Healthcare - Data Privacy, Model Drift & Terminology Translation Hub
 * - Data Privacy Management: HIPAA / GDPR consent ledger, simulated AES-256 encryption/decryption, de-identification masking
 * - Model Drift Monitoring: Population Stability Index (PSI) and Kolmogorov-Smirnov test against ILPD baseline
 * - Medical Terminology Translator: Clinical jargon to Plain English + translations in Hindi, Spanish, Telugu, Tamil, French.
 */

import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  TrendingDown,
  Globe,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Search,
  Eye,
  EyeOff,
  Cpu,
  Layers,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  computeModelDriftMetrics,
  TERMINOLOGY_DICTIONARY,
  TerminologyTranslation,
  BiomarkerDriftMetric
} from '../../data/clinicalIntelligenceData';
import { useProgress } from '../../context/ProgressContext';

export const PrivacyAndDriftHub: React.FC = () => {
  const { predictions, awardXP } = useProgress();

  const [activeTab, setActiveTab] = useState<'privacy' | 'drift' | 'translation'>('privacy');

  // Privacy State
  const [isEncrypted, setIsEncrypted] = useState(true);
  const [isAnonymized, setIsAnonymized] = useState(true);
  const [consents, setConsents] = useState({
    researchOptIn: true,
    clinicalAudit: true,
    aiModelTraining: false
  });

  // Terminology Translation State
  const [selectedTerm, setSelectedTerm] = useState<TerminologyTranslation>(TERMINOLOGY_DICTIONARY[0]);
  const [selectedLanguage, setSelectedLanguage] = useState<'hindi' | 'spanish' | 'telugu' | 'tamil' | 'french'>('hindi');
  const [searchWord, setSearchWord] = useState('');

  // Model Drift Metrics
  const driftMetrics: BiomarkerDriftMetric[] = useMemo(() => {
    return computeModelDriftMetrics(predictions);
  }, [predictions]);

  // Simulated AES-256 Cipher text preview
  const samplePatientRecord = {
    patientMRN: 'MRN-8492048',
    fullName: 'Rajesh K. Sharma',
    dob: '1974-06-12',
    totalBilirubin: 4.8,
    directBilirubin: 2.6,
    ast: 185,
    alt: 76,
    diagnosis: 'Severe Acute Alcoholic Hepatitis'
  };

  const encryptedHex =
    '4a7f9b1c83e20d5f9910ae4b22c7f891d03b6e82c5f104d9b73c882a10e4f9b28a1c9e3d0f7b4c2a11e5f8b9';

  const filteredTerms = TERMINOLOGY_DICTIONARY.filter(
    (t) =>
      searchWord === '' ||
      t.term.toLowerCase().includes(searchWord.toLowerCase()) ||
      t.plainEnglish.toLowerCase().includes(searchWord.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Enterprise Compliance, MLOps &amp; Health Literacy
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded font-mono font-semibold">
                HIPAA &bull; PSI Drift &bull; 6 Languages
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>Data Privacy, Model Drift &amp; Terminology Hub</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Maintain regulatory patient data confidentiality with encryption and consent controls, monitor real-time statistical distribution drift (PSI) against the ILPD baseline, and translate complex clinical jargon into plain English and regional Indian and global languages.
            </p>
          </div>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'privacy'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950/40'
              : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Data Privacy &amp; Encryption Vault</span>
        </button>

        <button
          onClick={() => setActiveTab('drift')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'drift'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950/40'
              : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <TrendingDown className="w-3.5 h-3.5" />
          <span>Model Drift &amp; MLOps Monitor (PSI)</span>
        </button>

        <button
          onClick={() => setActiveTab('translation')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'translation'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950/40'
              : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Medical Terminology Translator</span>
        </button>
      </div>

      {/* TAB 1: DATA PRIVACY & ENCRYPTION VAULT */}
      {activeTab === 'privacy' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                  Confidentiality Controls
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">HIPAA &amp; GDPR Consent Ledger</h3>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                COMPLIANT
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <div className="font-bold text-white">De-Identification Masking</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Mask patient names, MRN, and exact dates</div>
                </div>
                <button
                  onClick={() => setIsAnonymized(!isAnonymized)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer border ${
                    isAnonymized ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {isAnonymized ? 'Active' : 'Disabled'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <div className="font-bold text-white">Academic Research Opt-In</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Permit de-identified biomarker pooling for ILPD research</div>
                </div>
                <input
                  type="checkbox"
                  checked={consents.researchOptIn}
                  onChange={(e) => setConsents({ ...consents, researchOptIn: e.target.checked })}
                  className="w-4 h-4 accent-cyan-400"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <div className="font-bold text-white">Continuous Model Retraining Opt-In</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Allow weight adaptation for model drift correction</div>
                </div>
                <input
                  type="checkbox"
                  checked={consents.aiModelTraining}
                  onChange={(e) => setConsents({ ...consents, aiModelTraining: e.target.checked })}
                  className="w-4 h-4 accent-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Encryption Live Preview */}
          <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                  Cryptographic Payload
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">AES-GCM 256-Bit Cipher View</h3>
              </div>
              <button
                onClick={() => setIsEncrypted(!isEncrypted)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-800 cursor-pointer"
              >
                {isEncrypted ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{isEncrypted ? 'Decrypt Payload' : 'Encrypt Payload'}</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
              {isEncrypted ? (
                <div className="space-y-2">
                  <div className="text-emerald-400 font-bold">[CIPHERTEXT ENCRYPTED AT REST]:</div>
                  <div className="text-[11px] text-slate-400 break-all">{encryptedHex}</div>
                  <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
                    Key Derivative: PBKDF2 with SHA-256 (100,000 rounds) &bull; IV: 96-bit GCM
                  </div>
                </div>
              ) : (
                <div className="space-y-1 text-slate-200">
                  <div className="text-amber-400 font-bold">[DECRYPTED PLAINTEXT RECORD]:</div>
                  <div>MRN: {isAnonymized ? 'MRN-*******' : samplePatientRecord.patientMRN}</div>
                  <div>Name: {isAnonymized ? 'Patient R. S.' : samplePatientRecord.fullName}</div>
                  <div>DOB: {isAnonymized ? '1974-**-**' : samplePatientRecord.dob}</div>
                  <div>Total Bilirubin: {samplePatientRecord.totalBilirubin} mg/dL</div>
                  <div>Direct Bilirubin: {samplePatientRecord.directBilirubin} mg/dL</div>
                  <div>AST: {samplePatientRecord.ast} IU/L &bull; ALT: {samplePatientRecord.alt} IU/L</div>
                  <div>Diagnosis: {samplePatientRecord.diagnosis}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MODEL DRIFT & MLOPS MONITOR */}
      {activeTab === 'drift' && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Population Stability Index (PSI) Monitoring Against Baseline ILPD</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Baseline Reference Cohort: 583 verified clinical records &bull; Drift threshold: PSI &gt; 0.25 (Retrain alert)
              </div>
            </div>

            <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-3 py-1 rounded-xl border border-cyan-800">
              PSI Threshold: &lt;0.10 Stable
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {driftMetrics.map((dm, idx) => (
              <div key={idx} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white">{dm.featureName}</span>
                  <span
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
                      dm.status.startsWith('Severe')
                        ? 'bg-rose-950 text-rose-300 border-rose-800'
                        : dm.status.startsWith('Moderate')
                        ? 'bg-amber-950 text-amber-300 border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    }`}
                  >
                    PSI: {dm.psiScore} ({dm.status})
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <div className="text-slate-500">Baseline ILPD Mean</div>
                    <div className="font-bold font-mono text-white mt-0.5">{dm.baselineMean} &plusmn; {dm.baselineStd}</div>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <div className="text-slate-500">Current Cohort Mean</div>
                    <div className="font-bold font-mono text-cyan-300 mt-0.5">{dm.currentCohortMean} &plusmn; {dm.currentCohortStd}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>Kolmogorov-Smirnov p-value: {dm.ksPValue}</span>
                  {dm.retrainRecommended ? (
                    <span className="text-rose-400 font-bold">Retraining Recommended</span>
                  ) : (
                    <span className="text-emerald-400 font-bold">Distribution Stable</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MEDICAL TERMINOLOGY TRANSLATOR */}
      {activeTab === 'translation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Terms List */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search medical term..."
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {filteredTerms.map((term) => {
                const isSelected = selectedTerm.term === term.term;
                return (
                  <div
                    key={term.term}
                    onClick={() => {
                      setSelectedTerm(term);
                      awardXP(5);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-slate-950 border-cyan-500 shadow-md ring-1 ring-cyan-500'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{term.term}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{term.plainEnglish}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Translation Viewer Pane */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                  Clinical Terminology Explainer
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedTerm.term}</h3>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                {[
                  { id: 'hindi', label: 'Hindi (हिंदी)' },
                  { id: 'spanish', label: 'Spanish' },
                  { id: 'telugu', label: 'Telugu (తెలుగు)' },
                  { id: 'tamil', label: 'Tamil (தமிழ்)' },
                  { id: 'french', label: 'French' }
                ].map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLanguage(lang.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                      selectedLanguage === lang.id
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="font-semibold text-slate-400 uppercase text-[10px] font-mono">
                Medical Professional Definition:
              </span>
              <p className="text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-2xl border border-slate-800/80">
                {selectedTerm.definition}
              </p>
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="font-semibold text-emerald-400 uppercase text-[10px] font-mono">
                Patient Plain-English Explanation:
              </span>
              <p className="text-white leading-relaxed bg-emerald-950/20 p-3.5 rounded-2xl border border-emerald-900/60 font-medium">
                {selectedTerm.plainEnglish}
              </p>
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="font-semibold text-cyan-400 uppercase text-[10px] font-mono">
                Regional Language Translation ({selectedLanguage.toUpperCase()}):
              </span>
              <p className="text-cyan-200 leading-relaxed bg-cyan-950/30 p-3.5 rounded-2xl border border-cyan-800/60 text-sm font-semibold">
                {selectedTerm.translations[selectedLanguage]}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
