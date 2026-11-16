/**
 * Digitalization in Healthcare - Clinical Guidelines & Staging Calculators
 * Searchable clinical practice guidelines (AASLD, EASL, WHO, APASL)
 * and interactive calculators for FIB-4, Child-Pugh, and APRI staging.
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Calculator,
  Search,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Award,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  CLINICAL_GUIDELINES,
  calculateFIB4,
  calculateChildPugh,
  ClinicalGuidelineItem
} from '../../data/clinicalIntelligenceData';
import { useProgress } from '../../context/ProgressContext';

export const GuidelinesAndCalculators: React.FC = () => {
  const { awardXP } = useProgress();
  const [activeTab, setActiveTab] = useState<'guidelines' | 'fib4' | 'childpugh'>('guidelines');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<string>('all');

  // FIB-4 State
  const [fib4Age, setFib4Age] = useState(52);
  const [fib4Ast, setFib4Ast] = useState(84);
  const [fib4Alt, setFib4Alt] = useState(62);
  const [fib4Plt, setFib4Plt] = useState(130); // in thousands (130k)

  const fib4Result = calculateFIB4(fib4Age, fib4Ast, fib4Alt, fib4Plt);

  // Child-Pugh State
  const [cpBili, setCpBili] = useState(2.8);
  const [cpAlb, setCpAlb] = useState(2.9);
  const [cpInr, setCpInr] = useState(1.8);
  const [cpAscites, setCpAscites] = useState<'None' | 'Slight / Controlled' | 'Moderate / Tense'>('Slight / Controlled');
  const [cpEnceph, setCpEnceph] = useState<'None' | 'Grade 1-2 (Mild)' | 'Grade 3-4 (Severe)'>('Grade 1-2 (Mild)');

  const cpResult = calculateChildPugh({
    totalBilirubin: cpBili,
    albumin: cpAlb,
    inr: cpInr,
    ascites: cpAscites,
    encephalopathy: cpEnceph
  });

  // Filtered Guidelines
  const filteredGuidelines = CLINICAL_GUIDELINES.filter((g) => {
    const matchesOrg = selectedOrg === 'all' || g.organization === selectedOrg;
    const matchesQuery =
      searchQuery === '' ||
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.recommendation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.targetConditions.some((tc) => tc.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesOrg && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800 font-bold flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                International Hepatology Practice Standards
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded font-mono font-semibold">
                Class I, Level A Evidence
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>Clinical Guidelines &amp; Staging Calculators</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Access trusted diagnostic algorithms from AASLD, EASL, WHO, and APASL. Calculate non-invasive fibrosis index (FIB-4) and Child-Pugh functional cirrhosis staging for patient risk assessment.
            </p>
          </div>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('guidelines')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'guidelines'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950/40'
              : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Practice Guidelines ({filteredGuidelines.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('fib4');
            awardXP(10);
          }}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'fib4'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950/40'
              : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>FIB-4 Fibrosis Calculator</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('childpugh');
            awardXP(10);
          }}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'childpugh'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950/40'
              : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Child-Pugh Cirrhosis Staging</span>
        </button>
      </div>

      {/* TAB 1: GUIDELINES DIRECTORY */}
      {activeTab === 'guidelines' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search guideline recommendation or disease..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-1 text-xs">
              {['all', 'AASLD', 'EASL', 'WHO', 'APASL'].map((org) => (
                <button
                  key={org}
                  onClick={() => setSelectedOrg(org)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                    selectedOrg === org
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {org === 'all' ? 'All Societies' : org}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredGuidelines.map((g) => (
              <div key={g.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-400 font-mono text-[11px] bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                      {g.organization} {g.year}
                    </span>
                    <h3 className="font-bold text-white text-sm">{g.title}</h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded shrink-0">
                    {g.evidenceGrade}
                  </span>
                </div>

                <p className="text-slate-200 leading-relaxed text-[11px]">{g.recommendation}</p>

                <div className="space-y-1.5 pt-1">
                  <div className="font-semibold text-slate-400 text-[10px] uppercase font-mono">
                    Key Actionable Protocol Steps:
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    {g.keyActionSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: FIB-4 CALCULATOR */}
      {activeTab === 'fib4' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                Formula: (Age &times; AST) / (Platelets &times; &radic;ALT)
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">FIB-4 Index Calculator</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Patient Age (Years): {fib4Age}</label>
                <input
                  type="range"
                  min="18"
                  max="90"
                  value={fib4Age}
                  onChange={(e) => setFib4Age(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">AST / SGOT (IU/L): {fib4Ast}</label>
                <input
                  type="range"
                  min="10"
                  max="350"
                  value={fib4Ast}
                  onChange={(e) => setFib4Ast(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">ALT / SGPT (IU/L): {fib4Alt}</label>
                <input
                  type="range"
                  min="10"
                  max="350"
                  value={fib4Alt}
                  onChange={(e) => setFib4Alt(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Platelet Count (&times;10&sup3; /µL): {fib4Plt}k</label>
                <input
                  type="range"
                  min="30"
                  max="450"
                  value={fib4Plt}
                  onChange={(e) => setFib4Plt(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                Calculated Score Output
              </span>
              <div className="text-3xl font-black font-mono text-white mt-1">{fib4Result.score}</div>

              <div className="mt-3">
                <span
                  className={`text-xs font-mono font-bold px-3 py-1 rounded-xl border ${
                    fib4Result.score > 2.67
                      ? 'bg-rose-950 text-rose-300 border-rose-800'
                      : fib4Result.score >= 1.3
                      ? 'bg-amber-950 text-amber-300 border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  }`}
                >
                  {fib4Result.riskCategory}
                </span>
              </div>

              <div className="mt-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                <div className="font-semibold text-white">Clinical Guidance:</div>
                <div className="text-[11px] leading-relaxed text-slate-300">{fib4Result.recommendation}</div>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 font-mono">
              Validated in AASLD &amp; EASL guidelines for non-invasive triage of NAFLD and viral hepatitis.
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CHILD-PUGH CALCULATOR */}
      {activeTab === 'childpugh' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                Cirrhosis Prognostic &amp; Functional Reserve Score
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">Child-Pugh Classification Calculator</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-400 font-mono text-[10px]">Total Bilirubin (mg/dL)</label>
                <input
                  type="number"
                  step="0.1"
                  value={cpBili}
                  onChange={(e) => setCpBili(Number(e.target.value))}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-slate-400 font-mono text-[10px]">Albumin (g/dL)</label>
                <input
                  type="number"
                  step="0.1"
                  value={cpAlb}
                  onChange={(e) => setCpAlb(Number(e.target.value))}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-slate-400 font-mono text-[10px]">Prothrombin Time / INR</label>
                <input
                  type="number"
                  step="0.1"
                  value={cpInr}
                  onChange={(e) => setCpInr(Number(e.target.value))}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 font-mono text-[10px]">Ascites Status</label>
                <select
                  value={cpAscites}
                  onChange={(e) => setCpAscites(e.target.value as any)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2 text-white text-xs"
                >
                  <option value="None">None (1 Point)</option>
                  <option value="Slight / Controlled">Slight / Diuretic-Controlled (2 Points)</option>
                  <option value="Moderate / Tense">Moderate / Refractory Tense (3 Points)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-mono text-[10px]">Hepatic Encephalopathy</label>
                <select
                  value={cpEnceph}
                  onChange={(e) => setCpEnceph(e.target.value as any)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2 text-white text-xs"
                >
                  <option value="None">None (1 Point)</option>
                  <option value="Grade 1-2 (Mild)">Grade 1-2: Mild Asterixis (2 Points)</option>
                  <option value="Grade 3-4 (Severe)">Grade 3-4: Stupor / Coma (3 Points)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                Child-Pugh Score &amp; Tier
              </span>
              <div className="text-3xl font-black font-mono text-white mt-1">
                {cpResult.points} Points
              </div>
              <div className="text-xs font-bold text-amber-300 mt-1">{cpResult.classGrade}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[10px]">1-Year Survival</div>
                <div className="text-lg font-bold text-white mt-0.5">{cpResult.oneYearSurvival}</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[10px]">2-Year Survival</div>
                <div className="text-lg font-bold text-white mt-0.5">{cpResult.twoYearSurvival}</div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 leading-relaxed bg-slate-900 p-3 rounded-2xl border border-slate-800">
              Class C signifies severe decompensation requiring urgent liver transplantation waitlist referral.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
