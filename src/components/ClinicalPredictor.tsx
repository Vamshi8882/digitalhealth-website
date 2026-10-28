import React, { useState } from 'react';
import { LAB_REFERENCES, CLINICAL_PRESETS, ClinicalCasePreset } from '../data/ilpdData';
import { predictLiverDiseaseRisk, PredictionResult } from '../ml/engine';
import { AlertCircle, CheckCircle, HelpCircle, Activity, ArrowRight, RotateCcw, Download, Sparkles, Database, Clock } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

export const ClinicalPredictor: React.FC = () => {
  const { savePredictionRecord, predictions, awardXP, storageEngine } = useProgress();
  const [formData, setFormData] = useState({
    age: 45,
    gender: 'Male' as 'Male' | 'Female',
    totalBilirubin: 2.4,
    directBilirubin: 1.1,
    alkphos: 210,
    sgpt: 65, // ALT
    sgot: 125, // AST
    totalProteins: 6.8,
    albumin: 3.2,
    agRatio: 0.88
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [predictionHistory, setPredictionHistory] = useState<Array<{ timestamp: string; band: string; score: number }>>([]);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (formData.age < 1 || formData.age > 110) {
      errors.age = 'Age must be clinically plausible (1 to 110 years).';
    }
    if (formData.totalBilirubin <= 0 || formData.totalBilirubin > 60) {
      errors.totalBilirubin = 'Total Bilirubin must be between 0.1 and 60 mg/dL.';
    }
    if (formData.directBilirubin < 0) {
      errors.directBilirubin = 'Direct Bilirubin cannot be negative.';
    }
    if (formData.directBilirubin > formData.totalBilirubin) {
      errors.directBilirubin = 'Direct (Conjugated) Bilirubin cannot exceed Total Bilirubin.';
    }
    if (formData.alkphos < 10 || formData.alkphos > 2500) {
      errors.alkphos = 'Alkaline Phosphatase must be between 10 and 2500 IU/L.';
    }
    if (formData.sgpt < 1 || formData.sgpt > 3000) {
      errors.sgpt = 'ALT (SGPT) must be between 1 and 3000 IU/L.';
    }
    if (formData.sgot < 1 || formData.sgot > 3000) {
      errors.sgot = 'AST (SGOT) must be between 1 and 3000 IU/L.';
    }
    if (formData.totalProteins < 2.0 || formData.totalProteins > 14.0) {
      errors.totalProteins = 'Total Proteins must be between 2.0 and 14.0 g/dL.';
    }
    if (formData.albumin < 0.5 || formData.albumin > 7.0) {
      errors.albumin = 'Albumin must be between 0.5 and 7.0 g/dL.';
    }
    if (formData.albumin > formData.totalProteins) {
      errors.albumin = 'Albumin cannot exceed Total Proteins.';
    }
    if (formData.agRatio <= 0 || formData.agRatio > 5.0) {
      errors.agRatio = 'A/G ratio must be between 0.1 and 5.0.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const result = predictLiverDiseaseRisk(formData);
    setPrediction(result);

    const deRitis = formData.sgpt > 0 ? Number((formData.sgot / formData.sgpt).toFixed(2)) : 1.0;
    const conjRatio = formData.totalBilirubin > 0 ? Number((formData.directBilirubin / formData.totalBilirubin).toFixed(2)) : 0.0;

    savePredictionRecord({
      patientAge: formData.age,
      gender: formData.gender,
      totalBilirubin: formData.totalBilirubin,
      directBilirubin: formData.directBilirubin,
      deRitisRatio: deRitis,
      bilirubinRatio: conjRatio,
      riskPercent: result.riskScorePercent,
      likelihoodBand: result.likelihoodBand
    });
    awardXP(15, 'b8');
  };

  const applyPreset = (preset: ClinicalCasePreset) => {
    setFormData(preset.values);
    setFormErrors({});
    const res = predictLiverDiseaseRisk(preset.values);
    setPrediction(res);

    const deRitis = preset.values.sgpt > 0 ? Number((preset.values.sgot / preset.values.sgpt).toFixed(2)) : 1.0;
    const conjRatio = preset.values.totalBilirubin > 0 ? Number((preset.values.directBilirubin / preset.values.totalBilirubin).toFixed(2)) : 0.0;

    savePredictionRecord({
      patientAge: preset.values.age,
      gender: preset.values.gender,
      totalBilirubin: preset.values.totalBilirubin,
      directBilirubin: preset.values.directBilirubin,
      deRitisRatio: deRitis,
      bilirubinRatio: conjRatio,
      riskPercent: res.riskScorePercent,
      likelihoodBand: res.likelihoodBand
    });
  };

  // Helper to determine range status for visual gauge bars
  const getRangeStatus = (val: number, minNorm: number, maxNorm: number) => {
    if (val < minNorm) return { status: 'low', color: 'bg-blue-400', label: 'Below Normal' };
    if (val > maxNorm) return { status: 'high', color: 'bg-rose-500', label: 'Elevated' };
    return { status: 'normal', color: 'bg-emerald-400', label: 'Normal' };
  };

  return (
    <div className="w-full space-y-6">
      {/* Mandatory Persistent Regulatory Banner */}
      <div className="bg-amber-950/40 border border-amber-600/50 rounded-2xl p-4 flex items-start gap-3 shadow-lg">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200 leading-relaxed">
          <span className="font-bold text-amber-100 uppercase tracking-wide">
            EDUCATIONAL SYSTEM ONLY: NOT A MEDICAL DIAGNOSTIC DEVICE.
          </span>{' '}
          This machine learning prediction model is designed strictly for medical student education and clinical decision-support research. Never make patient management, medication, or discharge decisions based solely on these algorithmic outputs.
        </div>
      </div>

      {/* Preset Fill Buttons */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Clinical Sample Profiles (One-Click Pre-Fill)
          </div>
          <span className="text-[11px] text-slate-500">Curated teaching profiles</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {CLINICAL_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className="p-2.5 rounded-xl text-left bg-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/60 transition-all group"
            >
              <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                {preset.name}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                {preset.description}
              </div>
              <span className={`inline-block mt-2 text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                preset.expectedClass === 'Higher Likelihood' ? 'bg-rose-500/20 text-rose-300' :
                preset.expectedClass === 'Moderate Likelihood' ? 'bg-amber-500/20 text-amber-300' :
                'bg-emerald-500/20 text-emerald-300'
              }`}>
                {preset.expectedClass}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Form & Results Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form Column (7 cols) */}
        <form onSubmit={handlePredict} className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" /> Patient Laboratory Markers
              </h3>
              <p className="text-xs text-slate-400">Enter standard liver function test (LFT) panel values</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  age: 35,
                  gender: 'Male',
                  totalBilirubin: 0.9,
                  directBilirubin: 0.2,
                  alkphos: 95,
                  sgpt: 24,
                  sgot: 22,
                  totalProteins: 7.1,
                  albumin: 4.2,
                  agRatio: 1.45
                });
                setPrediction(null);
                setFormErrors({});
              }}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          {/* Demographic Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Patient Age (Years)
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: parseFloat(e.target.value) || 0 })}
                className={`w-full bg-slate-950 border ${formErrors.age ? 'border-rose-500' : 'border-slate-800'} rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500`}
              />
              {formErrors.age && <p className="text-[11px] text-rose-400 mt-1">{formErrors.age}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Biological Gender
              </label>
              <select
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Male">Male (Elevated ILPD baseline)</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          {/* Bilirubin Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-medium text-slate-300">Total Bilirubin (TBIL)</span>
                <span className="text-[10px] text-slate-400 font-mono">0.2 - 1.2 mg/dL</span>
              </div>
              <input
                type="number"
                step="0.1"
                value={formData.totalBilirubin}
                onChange={e => setFormData({ ...formData, totalBilirubin: parseFloat(e.target.value) || 0 })}
                className={`w-full bg-slate-950 border ${formErrors.totalBilirubin ? 'border-rose-500' : 'border-slate-800'} rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500`}
              />
              {formErrors.totalBilirubin && <p className="text-[11px] text-rose-400 mt-1">{formErrors.totalBilirubin}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-medium text-slate-300">Direct Bilirubin (DBIL)</span>
                <span className="text-[10px] text-slate-400 font-mono">0.0 - 0.3 mg/dL</span>
              </div>
              <input
                type="number"
                step="0.1"
                value={formData.directBilirubin}
                onChange={e => setFormData({ ...formData, directBilirubin: parseFloat(e.target.value) || 0 })}
                className={`w-full bg-slate-950 border ${formErrors.directBilirubin ? 'border-rose-500' : 'border-slate-800'} rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500`}
              />
              {formErrors.directBilirubin && <p className="text-[11px] text-rose-400 mt-1">{formErrors.directBilirubin}</p>}
            </div>
          </div>

          {/* Alkaline Phosphatase Row */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-medium text-slate-300">Alkaline Phosphatase (ALP)</span>
              <span className="text-[10px] text-slate-400 font-mono">44 - 147 IU/L</span>
            </div>
            <input
              type="number"
              value={formData.alkphos}
              onChange={e => setFormData({ ...formData, alkphos: parseFloat(e.target.value) || 0 })}
              className={`w-full bg-slate-950 border ${formErrors.alkphos ? 'border-rose-500' : 'border-slate-800'} rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500`}
            />
            {formErrors.alkphos && <p className="text-[11px] text-rose-400 mt-1">{formErrors.alkphos}</p>}
          </div>

          {/* Transaminases (ALT & AST) Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-medium text-slate-300">ALT (SGPT)</span>
                <span className="text-[10px] text-slate-400 font-mono">7 - 56 IU/L</span>
              </div>
              <input
                type="number"
                value={formData.sgpt}
                onChange={e => setFormData({ ...formData, sgpt: parseFloat(e.target.value) || 0 })}
                className={`w-full bg-slate-950 border ${formErrors.sgpt ? 'border-rose-500' : 'border-slate-800'} rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500`}
              />
              {formErrors.sgpt && <p className="text-[11px] text-rose-400 mt-1">{formErrors.sgpt}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-medium text-slate-300">AST (SGOT)</span>
                <span className="text-[10px] text-slate-400 font-mono">10 - 40 IU/L</span>
              </div>
              <input
                type="number"
                value={formData.sgot}
                onChange={e => setFormData({ ...formData, sgot: parseFloat(e.target.value) || 0 })}
                className={`w-full bg-slate-950 border ${formErrors.sgot ? 'border-rose-500' : 'border-slate-800'} rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500`}
              />
              {formErrors.sgot && <p className="text-[11px] text-rose-400 mt-1">{formErrors.sgot}</p>}
            </div>
          </div>

          {/* Derived De Ritis Ratio Live Preview */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">De Ritis Ratio (AST / ALT):</span>
            <span className={`font-mono font-bold ${
              (formData.sgot / Math.max(1, formData.sgpt)) > 2.0
                ? 'text-rose-400'
                : 'text-cyan-400'
            }`}>
              {(formData.sgot / Math.max(1, formData.sgpt)).toFixed(2)}{' '}
              {(formData.sgot / Math.max(1, formData.sgpt)) > 2.0 && '(>2.0 Alcoholic Hallmark)'}
            </span>
          </div>

          {/* Proteins Row */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="text-[11px] text-slate-300 mb-1">Total Proteins</div>
              <input
                type="number"
                step="0.1"
                value={formData.totalProteins}
                onChange={e => setFormData({ ...formData, totalProteins: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-sm text-white"
              />
            </div>
            <div>
              <div className="text-[11px] text-slate-300 mb-1">Albumin (ALB)</div>
              <input
                type="number"
                step="0.1"
                value={formData.albumin}
                onChange={e => setFormData({ ...formData, albumin: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-sm text-white"
              />
            </div>
            <div>
              <div className="text-[11px] text-slate-300 mb-1">A/G Ratio</div>
              <input
                type="number"
                step="0.05"
                value={formData.agRatio}
                onChange={e => setFormData({ ...formData, agRatio: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-sm text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <span>Execute ML Clinical Risk Estimation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Prediction Results & Explainable AI (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {prediction ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-semibold uppercase text-slate-400">Model Stratification</span>
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${
                  prediction.likelihoodBand === 'Higher Likelihood' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                  prediction.likelihoodBand === 'Moderate Likelihood' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {prediction.likelihoodBand}
                </span>
              </div>

              {/* Likelihood Gauge Bar */}
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs text-slate-300 font-medium">Estimated Risk Score</span>
                  <span className="text-2xl font-bold font-mono text-white">
                    {prediction.riskScorePercent}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full transition-all duration-500 ${
                      prediction.riskScorePercent > 65 ? 'bg-rose-500' :
                      prediction.riskScorePercent > 35 ? 'bg-amber-500' :
                      'bg-emerald-400'
                    }`}
                    style={{ width: `${prediction.riskScorePercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>0% (Lower)</span>
                  <span>38% (Moderate)</span>
                  <span>68% (Higher)</span>
                </div>
              </div>

              {/* Dominant Factors */}
              <div>
                <span className="text-xs font-semibold uppercase text-slate-400 block mb-2">Dominant Clinical Contributors</span>
                <div className="space-y-2">
                  {prediction.dominantFactors.map((f, i) => (
                    <div key={i} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
                      <div className="font-bold text-slate-200">{f.feature}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{f.impact}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Explainable AI (XAI) Attribution Waterfall */}
              <div>
                <span className="text-xs font-semibold uppercase text-slate-400 block mb-2">Feature Contribution (XAI)</span>
                <div className="space-y-1.5">
                  {prediction.attributionMap.slice(0, 5).map((attr, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <span className="w-36 truncate text-slate-300">{attr.feature}</span>
                      <div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-cyan-400 h-full rounded-full"
                          style={{ width: `${attr.contributionPercent}%` }}
                        />
                      </div>
                      <span className="font-mono text-slate-400 text-[11px] w-10 text-right">{attr.contributionPercent}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Model Reliability & Honesty Guard */}
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-[11px] space-y-1 text-slate-400">
                <div className="font-semibold text-slate-300">Model Reliability Statement</div>
                <div>{prediction.reliabilityNotice.sensitivity}</div>
                <div>{prediction.reliabilityNotice.falseAlarmRate}</div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 space-y-3">
              <Activity className="w-8 h-8 mx-auto text-slate-600" />
              <div className="text-sm font-semibold text-slate-300">Awaiting Clinical Inputs</div>
              <p className="text-xs max-w-xs mx-auto leading-relaxed">
                Fill the laboratory parameters on the left or click a sample teaching profile above to view the risk stratification and Explainable AI analysis.
              </p>
            </div>
          )}

          {/* Reference Range Indicator Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl text-xs space-y-2">
            <div className="font-semibold text-slate-300 text-xs">Biomarker Reference Status Check</div>
            <div className="space-y-2 pt-1">
              {[
                { name: 'Total Bilirubin', val: formData.totalBilirubin, min: 0.2, max: 1.2, unit: 'mg/dL' },
                { name: 'Direct Bilirubin', val: formData.directBilirubin, min: 0.0, max: 0.3, unit: 'mg/dL' },
                { name: 'ALP', val: formData.alkphos, min: 44, max: 147, unit: 'IU/L' },
                { name: 'ALT (SGPT)', val: formData.sgpt, min: 7, max: 56, unit: 'IU/L' },
                { name: 'AST (SGOT)', val: formData.sgot, min: 10, max: 40, unit: 'IU/L' },
                { name: 'Albumin', val: formData.albumin, min: 3.5, max: 5.0, unit: 'g/dL' }
              ].map(item => {
                const check = getRangeStatus(item.val, item.min, item.max);
                return (
                  <div key={item.name} className="flex items-center justify-between py-1 border-b border-slate-800/60 last:border-0">
                    <span className="text-slate-300">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-white">{item.val} {item.unit}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        check.status === 'normal' ? 'bg-emerald-500/20 text-emerald-300' :
                        check.status === 'high' ? 'bg-rose-500/20 text-rose-300' :
                        'bg-blue-500/20 text-blue-300'
                      }`}>
                        {check.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Persistent Prediction History (IndexedDB / LocalStorage) */}
          {predictions.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl text-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-slate-300 flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Persistent Patient Stratification Log</span>
                </div>
                <span className="text-[10px] text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded font-mono">
                  {storageEngine}
                </span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {predictions.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px]"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">
                          {p.patientAge}y {p.gender}
                        </span>
                        <span
                          className={`px-1.5 py-0.2 text-[10px] rounded font-bold ${
                            p.likelihoodBand === 'Higher Likelihood'
                              ? 'bg-rose-500/20 text-rose-300'
                              : p.likelihoodBand === 'Moderate Likelihood'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {p.likelihoodBand} ({p.riskPercent}%)
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        De Ritis: {p.deRitisRatio.toFixed(2)} | Conj. Ratio: {p.bilirubinRatio !== undefined ? p.bilirubinRatio.toFixed(2) : '0.00'}
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-600" />
                      {p.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
