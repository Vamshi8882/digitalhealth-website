/**
 * Digitalization in Healthcare - ML Prediction Interpretation & Explainable AI (XAI)
 *
 * Explains *why* the ML model predicts a particular outcome, identifies influential
 * biomarkers using SHAP-inspired feature attributions and waterfall visualizations,
 * and provides an interactive "What-If" counterfactual laboratory for medical students.
 */

import React, { useState } from 'react';
import {
  Brain,
  Sliders,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Info,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  BarChart2
} from 'lucide-react';
import { computeExplainability, ExplainabilityAnalysis } from '../../data/longitudinalAndExplainabilityData';
import { useProgress } from '../../context/ProgressContext';

export const MLPredictionExplainer: React.FC = () => {
  const { awardXP } = useProgress();

  // Patient biomarker state for counterfactual simulation
  const [labs, setLabs] = useState({
    age: 48,
    gender: 'Male',
    totalBilirubin: 3.2,
    directBilirubin: 1.8,
    alkphos: 185,
    sgpt: 72, // ALT
    sgot: 168, // AST
    totalProteins: 6.4,
    albumin: 3.1,
    agRatio: 0.94
  });

  const [activePreset, setActivePreset] = useState<string>('custom');

  // Compute explainability analysis in real time
  const explanation: ExplainabilityAnalysis = computeExplainability(labs);

  const applyPreset = (presetName: string, presetLabs: typeof labs) => {
    setLabs(presetLabs);
    setActivePreset(presetName);
    awardXP(10);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              <Brain className="w-4 h-4" />
              <span>Explainable AI (XAI) &amp; Algorithmic Interpretability</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400 font-normal">SHAP Feature Attribution</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Why Did the Machine Learning Model Predict This Outcome?
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Black-box AI is unacceptable in clinical medicine. Explore exact feature attribution weights (SHAP values), investigate nonlinear biomarker interactions (De Ritis ratio &amp; conjugation fraction), and experiment with the interactive counterfactual simulator.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setLabs({
                  age: 48,
                  gender: 'Male',
                  totalBilirubin: 3.2,
                  directBilirubin: 1.8,
                  alkphos: 185,
                  sgpt: 72,
                  sgot: 168,
                  totalProteins: 6.4,
                  albumin: 3.1,
                  agRatio: 0.94
                });
                setActivePreset('custom');
              }}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Values</span>
            </button>
          </div>
        </div>

        {/* Clinical Teaching Presets */}
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            One-Click Diagnostic Teaching Presets:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-2">
            <button
              onClick={() =>
                applyPreset('alcoholic', {
                  age: 49,
                  gender: 'Male',
                  totalBilirubin: 12.4,
                  directBilirubin: 8.2,
                  alkphos: 195,
                  sgpt: 92,
                  sgot: 265,
                  totalProteins: 5.9,
                  albumin: 2.8,
                  agRatio: 0.9
                })
              }
              className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                activePreset === 'alcoholic'
                  ? 'bg-amber-950/50 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                  : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold text-white">Alcoholic Hepatitis</div>
              <div className="text-[10px] text-slate-400 mt-0.5">AST:ALT 2.88x, High Bilirubin</div>
            </button>

            <button
              onClick={() =>
                applyPreset('mash', {
                  age: 51,
                  gender: 'Male',
                  totalBilirubin: 1.4,
                  directBilirubin: 0.5,
                  alkphos: 135,
                  sgpt: 118,
                  sgot: 68,
                  totalProteins: 7.1,
                  albumin: 4.1,
                  agRatio: 1.35
                })
              }
              className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                activePreset === 'mash'
                  ? 'bg-cyan-950/50 border-cyan-500 shadow-md ring-1 ring-cyan-500/50'
                  : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold text-white">Metabolic MASH / Steatohepatitis</div>
              <div className="text-[10px] text-slate-400 mt-0.5">ALT &gt; AST (De Ritis 0.58)</div>
            </button>

            <button
              onClick={() =>
                applyPreset('burnout', {
                  age: 58,
                  gender: 'Male',
                  totalBilirubin: 4.8,
                  directBilirubin: 2.9,
                  alkphos: 240,
                  sgpt: 34,
                  sgot: 38,
                  totalProteins: 5.4,
                  albumin: 2.3,
                  agRatio: 0.74
                })
              }
              className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                activePreset === 'burnout'
                  ? 'bg-rose-950/50 border-rose-500 shadow-md ring-1 ring-rose-500/50'
                  : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold text-white flex items-center gap-1">
                <span>Cirrhosis &quot;Burn-Out&quot;</span>
                <span className="text-[9px] text-rose-400 bg-rose-500/20 px-1.5 py-0.2 rounded">Paradox</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Normal transaminases, Albumin 2.3</div>
            </button>

            <button
              onClick={() =>
                applyPreset('healthy', {
                  age: 32,
                  gender: 'Female',
                  totalBilirubin: 0.8,
                  directBilirubin: 0.2,
                  alkphos: 75,
                  sgpt: 22,
                  sgot: 24,
                  totalProteins: 7.2,
                  albumin: 4.5,
                  agRatio: 1.66
                })
              }
              className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                activePreset === 'healthy'
                  ? 'bg-emerald-950/50 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                  : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold text-white">Healthy Living Donor</div>
              <div className="text-[10px] text-slate-400 mt-0.5">All biomarkers in reference</div>
            </button>
          </div>
        </div>
      </div>

      {/* Burn-out Clinical Paradox Alert */}
      {explanation.paradoxAlert && (
        <div className="bg-rose-950/40 border border-rose-600/50 rounded-2xl p-4 flex items-start gap-3 shadow-lg">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-200 leading-relaxed">
            <span className="font-bold text-rose-100 uppercase tracking-wide">
              CLINICAL AI TEACHING ALERT: DECEPTIVE TRANSAMINASE &quot;BURN-OUT&quot;
            </span>{' '}
            {explanation.paradoxAlert} Notice that naive models evaluating transaminases in isolation would misclassify this patient as low risk, whereas SHAP reveals the dominant negative impact of severe hypoalbuminemia.
          </div>
        </div>
      )}

      {/* Main Split: Counterfactual Sliders (5 cols) vs SHAP Waterfall & Interpretation (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Counterfactual Laboratory (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                &quot;What-If&quot; Counterfactual Laboratory
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Adjust any parameter slider to simulate clinical intervention or disease progression in real time.
              </p>
            </div>

            {/* AST Slider */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-medium">AST (SGOT):</span>
                <span className={`font-mono font-bold ${labs.sgot > 40 ? 'text-amber-400' : 'text-slate-200'}`}>
                  {labs.sgot} IU/L
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="350"
                value={labs.sgot}
                onChange={(e) => setLabs({ ...labs, sgot: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>10 (Normal)</span>
                <span>Ref: 10-40</span>
                <span>350 (Severe)</span>
              </div>
            </div>

            {/* ALT Slider */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-medium">ALT (SGPT):</span>
                <span className={`font-mono font-bold ${labs.sgpt > 45 ? 'text-cyan-400' : 'text-slate-200'}`}>
                  {labs.sgpt} IU/L
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="350"
                value={labs.sgpt}
                onChange={(e) => setLabs({ ...labs, sgpt: Number(e.target.value) })}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>10 (Normal)</span>
                <span>Ref: 7-45</span>
                <span>350 (Severe)</span>
              </div>
            </div>

            {/* Total Bilirubin Slider */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-medium">Total Bilirubin:</span>
                <span className={`font-mono font-bold ${labs.totalBilirubin > 1.2 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {labs.totalBilirubin.toFixed(1)} mg/dL
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="20.0"
                step="0.1"
                value={labs.totalBilirubin}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setLabs({
                    ...labs,
                    totalBilirubin: val,
                    directBilirubin: Math.min(val, Number((val * 0.6).toFixed(1)))
                  });
                }}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0.2 (Normal)</span>
                <span>Ref: 0.2-1.2</span>
                <span>20.0 (Extreme)</span>
              </div>
            </div>

            {/* Serum Albumin Slider */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-medium">Serum Albumin:</span>
                <span className={`font-mono font-bold ${labs.albumin < 3.5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {labs.albumin.toFixed(1)} g/dL
                </span>
              </div>
              <input
                type="range"
                min="1.5"
                max="5.5"
                step="0.1"
                value={labs.albumin}
                onChange={(e) => setLabs({ ...labs, albumin: Number(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1.5 (Failure)</span>
                <span>Ref: 3.5-5.0</span>
                <span>5.5 (Robust)</span>
              </div>
            </div>

            {/* Alkaline Phosphatase Slider */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-medium">Alkaline Phosphatase:</span>
                <span className={`font-mono font-bold ${labs.alkphos > 147 ? 'text-amber-400' : 'text-slate-200'}`}>
                  {labs.alkphos} IU/L
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="450"
                value={labs.alkphos}
                onChange={(e) => setLabs({ ...labs, alkphos: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>30 (Normal)</span>
                <span>Ref: 44-147</span>
                <span>450 (Cholestasis)</span>
              </div>
            </div>

            {/* Derived Mathematical Ratios Box */}
            <div className="pt-2 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400">De Ritis Ratio (AST/ALT):</span>
                <span className="font-mono font-bold text-cyan-400">
                  {explanation.deRitisAnalysis.ratio}x
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400">Direct Bilirubin Fraction:</span>
                <span className="font-mono font-bold text-amber-400">
                  {explanation.conjugationAnalysis.directFraction}% ({explanation.conjugationAnalysis.type})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: SHAP Feature Attribution Waterfall & Interpretation (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Real-time Probability & Model Output */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                  Model Decision Output
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Predicted Hepatic Risk: {explanation.predictedRisk}%
                </h3>
              </div>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  explanation.riskCategory === 'Critical' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
                  explanation.riskCategory === 'High' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                  explanation.riskCategory === 'Moderate' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' :
                  'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}
              >
                {explanation.riskCategory.toUpperCase()} RISK
              </span>
            </div>

            {/* Probability Progress Meter */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Baseline Expected ILPD Cohort Risk: 28%</span>
                <span className="font-mono font-bold text-white">Current Risk: {explanation.predictedRisk}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800 relative">
                <div
                  className={`h-full transition-all duration-300 ${
                    explanation.predictedRisk >= 75 ? 'bg-gradient-to-r from-amber-500 to-rose-500' :
                    explanation.predictedRisk >= 50 ? 'bg-gradient-to-r from-cyan-500 to-amber-500' :
                    'bg-gradient-to-r from-emerald-500 to-cyan-500'
                  }`}
                  style={{ width: `${explanation.predictedRisk}%` }}
                />
              </div>
            </div>

            {/* SHAP Feature Attribution Waterfall Bars */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-cyan-400" /> Feature Attribution Breakdown (SHAP Values)
                </span>
                <span className="text-[10px] text-slate-400">
                  Green = protective / pushes risk down &bull; Red = risk driver
                </span>
              </div>

              <div className="space-y-2.5">
                {explanation.topDrivers.map((driver) => {
                  const isPositive = driver.shapWeight > 0;
                  const isNeutral = Math.abs(driver.shapWeight) < 1.0;
                  const absWeight = Math.abs(driver.shapWeight);
                  const barWidth = Math.min(100, (absWeight / 25) * 100);

                  return (
                    <div key={driver.featureCode} className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{driver.featureName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({driver.patientValue})</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono text-xs">
                          <span className={isPositive ? 'text-rose-400 font-bold' : isNeutral ? 'text-slate-400' : 'text-emerald-400 font-bold'}>
                            {isPositive ? `+${driver.shapWeight}%` : `${driver.shapWeight}%`}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            ({driver.relativeImportancePct}% weight)
                          </span>
                        </div>
                      </div>

                      {/* Bar Representation */}
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-200 ${
                            isPositive ? 'bg-rose-500' : isNeutral ? 'bg-slate-600' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>

                      <p className="text-[10px] text-slate-400 leading-snug">
                        {driver.clinicalMechanism}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Diagnostic Interpretation Summary */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5 text-[11px]">
                <Info className="w-3.5 h-3.5 text-cyan-400" /> Attending Interpretation Guide:
              </span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {explanation.clinicalInterpretation}
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] text-slate-400">
                <span>De Ritis Hallmark: <strong className="text-slate-200">{explanation.deRitisAnalysis.hallmark}</strong></span>
                <span>Conjugation Pattern: <strong className="text-slate-200">{explanation.conjugationAnalysis.type}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
