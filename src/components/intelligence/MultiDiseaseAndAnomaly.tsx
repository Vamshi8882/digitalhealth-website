/**
 * Digitalization in Healthcare - Multi-Disease Prediction & Abnormality Detection
 * Real-time evaluation across 6 liver conditions (MASLD, ALD, Cirrhosis, Viral Hepatitis, Cholestasis, Acute Failure),
 * Anomaly Outlier Detection via Isolation Forest / Z-score heuristics,
 * Evidence-based Personalized Lifestyle & Dietary Recommendations,
 * and Doctor Referral & Red-Flag Emergency Triage.
 */

import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  HeartPulse,
  Flame,
  Stethoscope,
  Info,
  Apple,
  Dumbbell,
  ShieldCheck,
  Send,
  Download,
  Filter,
  Layers,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  evaluateMultiDiseaseRisks,
  detectBiomarkerAnomalies,
  MultiDiseaseDiagnosis,
  AnomalyReport
} from '../../data/clinicalIntelligenceData';
import { useProgress } from '../../context/ProgressContext';

interface MultiDiseaseAndAnomalyProps {
  initialLabs?: {
    age?: number;
    gender?: 'Male' | 'Female';
    totalBilirubin?: number;
    directBilirubin?: number;
    alkphos?: number;
    sgpt?: number;
    sgot?: number;
    totalProteins?: number;
    albumin?: number;
    agRatio?: number;
    plateletCount?: number;
    inr?: number;
  };
  onNavigateToKnowledgeGraph?: () => void;
  onNavigateToGuidelines?: () => void;
}

export const MultiDiseaseAndAnomaly: React.FC<MultiDiseaseAndAnomalyProps> = ({
  initialLabs,
  onNavigateToKnowledgeGraph,
  onNavigateToGuidelines
}) => {
  const { awardXP } = useProgress();

  const [formData, setFormData] = useState({
    age: initialLabs?.age || 50,
    gender: (initialLabs?.gender || 'Male') as 'Male' | 'Female',
    totalBilirubin: initialLabs?.totalBilirubin || 3.8,
    directBilirubin: initialLabs?.directBilirubin || 2.1,
    alkphos: initialLabs?.alkphos || 215,
    sgpt: initialLabs?.sgpt || 78,
    sgot: initialLabs?.sgot || 165,
    totalProteins: initialLabs?.totalProteins || 6.2,
    albumin: initialLabs?.albumin || 2.9,
    agRatio: initialLabs?.agRatio || 0.88,
    plateletCount: initialLabs?.plateletCount || 115000,
    inr: initialLabs?.inr || 1.58
  });

  const [activeTab, setActiveTab] = useState<'diseases' | 'anomalies' | 'recommendations' | 'triage'>('diseases');
  const [selectedDisease, setSelectedDisease] = useState<string | null>('cirrhosis');

  // Compute multi-disease risks
  const multiDiseaseResults: MultiDiseaseDiagnosis[] = useMemo(() => {
    return evaluateMultiDiseaseRisks(formData);
  }, [formData]);

  // Compute anomaly report
  const anomalyReport: AnomalyReport = useMemo(() => {
    return detectBiomarkerAnomalies(formData);
  }, [formData]);

  // Determine Doctor Referral / Triage Level
  const triageDecision = useMemo(() => {
    const hasEmergencyAlf = formData.sgpt > 2500 || formData.sgot > 2500 || formData.inr > 2.0;
    const hasSevereJaundiceOrSbp = formData.totalBilirubin > 12 || (formData.albumin < 2.5 && formData.inr > 1.8);
    const hasCriticalAnomaly = anomalyReport.detectedPatterns.some((p) => p.severity === 'critical');

    if (hasEmergencyAlf || hasSevereJaundiceOrSbp || hasCriticalAnomaly) {
      return {
        level: 'RED - STAT EMERGENCY RESUSCITATION / ICU ADMISSION',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-800',
        actionTimeframe: 'IMMEDIATE (Within 60 Minutes)',
        rationale:
          'Profound coagulopathy (INR > 2.0), massive cytolytic surge (>2500 IU/L), or severe hepatic decompensation. High risk of fatal cerebral edema, gastrointestinal hemorrhage, or sepsis.',
        transportRecommendation: 'Emergency Medical Services (EMS) transport to tertiary liver transplant center with ICU critical care bed.'
      };
    }

    const hasUrgentCirrhosisOrAsh = multiDiseaseResults.some((d) => d.riskBand === 'High' && (d.id === 'cirrhosis' || d.id === 'ald' || d.id === 'cholestasis'));
    if (hasUrgentCirrhosisOrAsh || formData.plateletCount < 100000 || formData.totalBilirubin > 3.0) {
      return {
        level: 'AMBER - URGENT HEPATOLOGY SPECIALIST CONSULTATION',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-800',
        actionTimeframe: 'URGENT (Within 48 to 72 Hours)',
        rationale:
          'Features of chronic liver decompensation, portal hypertension (thrombocytopenia < 100k), significant hyperbilirubinemia, or high probability of advanced fibrosis (FIB-4 > 3.25).',
        transportRecommendation: 'Expedited outpatient referral to academic Hepatology or Gastroenterology clinic for non-invasive elastography and variceal screening.'
      };
    }

    return {
      level: 'GREEN - ROUTINE OUTPATIENT PRIMARY CARE MANAGEMENT',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-800',
      actionTimeframe: 'ROUTINE (Within 2 to 4 Weeks)',
      rationale:
        'Preserved hepatic synthetic capacity (Albumin > 3.5, normal INR), absence of portal hypertension, mild metabolic steatosis risk or early MASLD.',
      transportRecommendation: 'Primary Care Physician / Endocrinologist follow-up with metabolic optimization, dietary counseling, and repeat LFTs in 3 to 6 months.'
    };
  }, [formData, multiDiseaseResults, anomalyReport]);

  const deRitis = (formData.sgpt > 0 ? formData.sgot / formData.sgpt : 1).toFixed(2);
  const conjFraction = ((formData.directBilirubin / Math.max(0.1, formData.totalBilirubin)) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800 font-bold flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                Multi-Disease Machine Learning &amp; Clinical Stratification
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded font-mono font-semibold">
                6 Conditions Modeled
              </span>
              <span className="text-[10px] text-amber-400 bg-amber-950/70 border border-amber-800 px-2 py-0.5 rounded font-mono font-semibold">
                Isolation Forest Anomaly Check
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>Multi-Disease Risk Engine &amp; Clinical Triage</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Unlike single-target classifiers, this multi-condition engine evaluates differential hepatic pathologies simultaneously—stratifying MASLD/NAFLD, Alcoholic Steatohepatitis, Cirrhosis, Viral Hepatitis, Cholestasis, and Acute Toxic Failure with automated outlier detection.
            </p>
          </div>

          {/* Quick Ratios Card */}
          <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 shrink-0">
            <div className="text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">De Ritis (AST/ALT)</div>
              <div className="text-xl font-black font-mono text-cyan-400">{deRitis}</div>
              <div className="text-[9px] text-slate-500">{parseFloat(deRitis) > 2.0 ? 'Alcoholic Pattern' : 'Viral/Metabolic'}</div>
            </div>
            <div className="h-8 w-[1px] bg-slate-800" />
            <div className="text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Direct Fraction</div>
              <div className="text-xl font-black font-mono text-indigo-300">{conjFraction}%</div>
              <div className="text-[9px] text-slate-500">{parseFloat(conjFraction) > 50 ? 'Conjugated High' : 'Unconjugated'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Quick Inputs Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="text-xs font-bold text-white flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-cyan-400" />
            <span>Interactive Patient Laboratory Controls &bull; Adjust Parameters to Re-Stratify</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setFormData({
                  age: 46,
                  gender: 'Female',
                  totalBilirubin: 1.1,
                  directBilirubin: 0.3,
                  alkphos: 110,
                  sgpt: 76,
                  sgot: 48,
                  totalProteins: 7.2,
                  albumin: 4.2,
                  agRatio: 1.4,
                  plateletCount: 265000,
                  inr: 1.02
                });
                awardXP(10);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold border border-slate-700"
            >
              Preset: MASLD
            </button>
            <button
              onClick={() => {
                setFormData({
                  age: 52,
                  gender: 'Male',
                  totalBilirubin: 4.5,
                  directBilirubin: 2.3,
                  alkphos: 185,
                  sgpt: 72,
                  sgot: 195,
                  totalProteins: 6.0,
                  albumin: 2.8,
                  agRatio: 0.85,
                  plateletCount: 95000,
                  inr: 1.65
                });
                awardXP(10);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold border border-slate-700"
            >
              Preset: Alcoholic Cirrhosis
            </button>
            <button
              onClick={() => {
                setFormData({
                  age: 28,
                  gender: 'Male',
                  totalBilirubin: 3.6,
                  directBilirubin: 2.0,
                  alkphos: 120,
                  sgpt: 3800,
                  sgot: 3200,
                  totalProteins: 5.9,
                  albumin: 3.3,
                  agRatio: 1.3,
                  plateletCount: 160000,
                  inr: 2.45
                });
                awardXP(10);
              }}
              className="px-2.5 py-1 rounded-lg bg-rose-950/50 hover:bg-rose-900/50 text-rose-300 text-[10px] font-semibold border border-rose-800"
            >
              Preset: Toxic ALF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
          <div>
            <label className="text-[10px] text-slate-400 font-mono">Age / Gender</label>
            <div className="flex gap-1 mt-1">
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-16 bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono text-xs text-center"
              />
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' })}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2 text-white text-xs"
              >
                <option value="Male">M</option>
                <option value="Female">F</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-mono">Total Bili (mg/dL)</label>
            <input
              type="number"
              step="0.1"
              value={formData.totalBilirubin}
              onChange={(e) => setFormData({ ...formData, totalBilirubin: Number(e.target.value) })}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-mono">Direct Bili (mg/dL)</label>
            <input
              type="number"
              step="0.1"
              value={formData.directBilirubin}
              onChange={(e) => setFormData({ ...formData, directBilirubin: Number(e.target.value) })}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-mono">ALT / SGPT (IU/L)</label>
            <input
              type="number"
              value={formData.sgpt}
              onChange={(e) => setFormData({ ...formData, sgpt: Number(e.target.value) })}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-mono">AST / SGOT (IU/L)</label>
            <input
              type="number"
              value={formData.sgot}
              onChange={(e) => setFormData({ ...formData, sgot: Number(e.target.value) })}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-mono">ALP (IU/L)</label>
            <input
              type="number"
              value={formData.alkphos}
              onChange={(e) => setFormData({ ...formData, alkphos: Number(e.target.value) })}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-mono">Albumin (g/dL)</label>
            <input
              type="number"
              step="0.1"
              value={formData.albumin}
              onChange={(e) => setFormData({ ...formData, albumin: Number(e.target.value) })}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-mono">A/G Ratio</label>
            <input
              type="number"
              step="0.05"
              value={formData.agRatio}
              onChange={(e) => setFormData({ ...formData, agRatio: Number(e.target.value) })}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-mono">Platelets (/µL)</label>
            <input
              type="number"
              step="5000"
              value={formData.plateletCount}
              onChange={(e) => setFormData({ ...formData, plateletCount: Number(e.target.value) })}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-mono">PT / INR</label>
            <input
              type="number"
              step="0.05"
              value={formData.inr}
              onChange={(e) => setFormData({ ...formData, inr: Number(e.target.value) })}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* Sub-Tabs: Multi-Disease vs. Anomalies vs. Lifestyle Recommendations vs. Doctor Referral */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('diseases')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'diseases'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950/40'
              : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Multi-Disease Risk Profiles (6)</span>
        </button>

        <button
          onClick={() => setActiveTab('anomalies')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'anomalies'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950/40'
              : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Biomarker Anomaly &amp; Outliers ({anomalyReport.detectedPatterns.length})</span>
          {anomalyReport.isAnomaly && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
        </button>

        <button
          onClick={() => setActiveTab('recommendations')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'recommendations'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950/40'
              : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Apple className="w-3.5 h-3.5" />
          <span>Personalized Diet &amp; Lifestyle Plan</span>
        </button>

        <button
          onClick={() => setActiveTab('triage')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'triage'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950/40'
              : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Doctor Referral &amp; Red-Flag Triage</span>
        </button>
      </div>

      {/* TAB 1: MULTI-DISEASE PREDICTION CARDS */}
      {activeTab === 'diseases' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Disease List */}
          <div className="lg:col-span-7 space-y-3">
            {multiDiseaseResults.map((d) => {
              const isSelected = selectedDisease === d.id;
              return (
                <div
                  key={d.id}
                  onClick={() => setSelectedDisease(d.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-slate-950 border-cyan-500 shadow-lg shadow-cyan-950/30 ring-1 ring-cyan-500'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{d.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">({d.icd10})</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          d.riskBand === 'Critical'
                            ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                            : d.riskBand === 'High'
                            ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                            : d.riskBand === 'Moderate'
                            ? 'bg-blue-950/80 text-blue-300 border-blue-800'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        {d.riskBand.toUpperCase()} ({d.riskScore}%)
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        d.riskBand === 'Critical'
                          ? 'bg-rose-500'
                          : d.riskBand === 'High'
                          ? 'bg-amber-400'
                          : d.riskBand === 'Moderate'
                          ? 'bg-cyan-400'
                          : 'bg-slate-600'
                      }`}
                      style={{ width: `${d.riskScore}%` }}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-2 pt-1 text-[10px] text-slate-400">
                    {d.triggerMarkers.slice(0, 2).map((tm, idx) => (
                      <span key={idx} className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {tm}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Inspected Disease Details Panel */}
          <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            {(() => {
              const current = multiDiseaseResults.find((d) => d.id === selectedDisease) || multiDiseaseResults[0];
              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                        Detailed Clinical Pathophysiology
                      </span>
                      <h3 className="text-base font-bold text-white mt-0.5">{current.name}</h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-white bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
                      {current.riskScore}% Risk
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="font-semibold text-slate-200">Mechanism of Injury:</div>
                    <p className="text-[11px] leading-relaxed text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                      {current.pathophysiology}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="font-semibold text-slate-200">Diagnostic Clinical Criteria:</div>
                    <ul className="space-y-1 text-[11px] text-slate-400 list-disc list-inside">
                      {current.clinicalCriteria.map((cc, i) => (
                        <li key={i}>{cc}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-800/60 space-y-1 text-xs">
                    <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Guideline Action Protocol</span>
                    </div>
                    <div className="text-[11px] text-slate-200 leading-relaxed">{current.guidelineAction}</div>
                  </div>

                  {onNavigateToKnowledgeGraph && (
                    <button
                      onClick={onNavigateToKnowledgeGraph}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                    >
                      <span>Explore Knowledge Graph Connections &rarr;</span>
                    </button>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* TAB 2: BIOMARKER ANOMALY & OUTLIER DETECTION */}
      {activeTab === 'anomalies' && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg ${
                  anomalyReport.isAnomaly
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-800'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-800'
                }`}
              >
                {anomalyReport.isAnomaly ? '⚠️' : '🛡️'}
              </div>
              <div>
                <div className="text-xs font-bold text-white">{anomalyReport.isolationForestVerdict}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Anomaly score: <span className="font-mono text-cyan-400 font-bold">{anomalyReport.anomalyScore}</span> (Normalized multi-dimensional partition distance)
                </div>
              </div>
            </div>

            <span
              className={`text-[10px] font-mono font-bold px-3 py-1 rounded-xl border ${
                anomalyReport.isAnomaly
                  ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                  : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
              }`}
            >
              {anomalyReport.isAnomaly ? 'OUTLIER DETECTED' : 'NORMAL RANGE'}
            </span>
          </div>

          {anomalyReport.detectedPatterns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {anomalyReport.detectedPatterns.map((pat, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      {pat.marker}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        pat.severity === 'critical'
                          ? 'bg-rose-950 text-rose-300 border-rose-800'
                          : pat.severity === 'severe'
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-blue-950 text-blue-300 border-blue-800'
                      }`}
                    >
                      Z-Score: {pat.zScore > 0 ? `+${pat.zScore}` : pat.zScore}
                    </span>
                  </div>

                  <div className="text-base font-black font-mono text-cyan-400">Value: {pat.value}</div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{pat.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="text-sm font-bold text-white">No Statistical Outliers Identified</div>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Current laboratory parameters align within typical multivariate distributions of the ILPD cohort without discordant physiological combinations.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PERSONALIZED DIET & LIFESTYLE RECOMMENDATIONS */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Diet Box */}
            <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                <Apple className="w-4 h-4 text-cyan-400" />
                <span>Evidence-Based Hepatic Diet</span>
              </div>
              <h4 className="text-sm font-bold text-white">Mediterranean Liver Pattern</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Coffee Consumption:</strong> 2-3 cups of filtered black coffee daily significantly lowers ALT and hepatic fibrosis progression.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Sodium Restriction:</strong> Limit sodium to &lt; 2,000 mg/day (approx. 1 level tsp table salt) to prevent ascites and fluid pooling.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Protein Target:</strong> Maintain 1.2 to 1.5 g/kg dry weight protein from poultry, eggs, and legumes to combat hepatic sarcopenia.
                  </span>
                </li>
              </ul>
            </div>

            {/* Exercise Box */}
            <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Dumbbell className="w-4 h-4 text-emerald-400" />
                <span>Physical Activity Prescription</span>
              </div>
              <h4 className="text-sm font-bold text-white">Aerobic + Resistance Training</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">150 Minutes / Week:</strong> Moderate brisk walking, swimming, or cycling to improve peripheral insulin sensitivity.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">2-3 Resistance Sessions:</strong> Light dumbbell or bodyweight exercises to preserve skeletal muscle mass (myokine release).
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Weight Target:</strong> 7-10% sustained total body weight reduction resolves steatohepatitis in &gt;80% of patients.
                  </span>
                </li>
              </ul>
            </div>

            {/* Toxin & Medication Safety */}
            <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Toxin &amp; Drug Safety Shield</span>
              </div>
              <h4 className="text-sm font-bold text-white">Avoiding Secondary Insult</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Strict Alcohol Cessation:</strong> Complete abstinence is mandatory for De Ritis &gt; 1.5 or suspected cirrhosis.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Avoid NSAIDs:</strong> Ibuprofen/Naproxen provoke fatal hepatorenal syndrome and variceal bleeding in cirrhosis.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Paracetamol Limit:</strong> Restrict to &lt; 2,000 mg/day (2 grams) in divided doses; avoid overdoses.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DOCTOR REFERRAL & RED-FLAG EMERGENCY TRIAGE */}
      {activeTab === 'triage' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Clinical Triage Categorization
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{triageDecision.level}</h3>
              </div>
              <span className={`text-xs font-mono font-bold px-3 py-1 rounded-xl border ${triageDecision.badgeColor}`}>
                Action: {triageDecision.actionTimeframe}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-semibold text-slate-200">Clinical Rationale:</div>
              <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80">
                {triageDecision.rationale}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-semibold text-slate-200">Transport &amp; Service Direction:</div>
              <p className="text-cyan-300 font-mono text-[11px] bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80">
                {triageDecision.transportRecommendation}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              {onNavigateToGuidelines && (
                <button
                  onClick={onNavigateToGuidelines}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Review AASLD / EASL Clinical Practice Guidelines &rarr;</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
