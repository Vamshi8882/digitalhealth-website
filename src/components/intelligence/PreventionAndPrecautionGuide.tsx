/**
 * Digitalization in Healthcare - Prevention, Precaution & Lifestyle Medicine Guide
 *
 * Provides educational guidance on:
 * 1. Evidence-Based Dietary Protocols (Mediterranean, Fructose restriction, Coffee protection)
 * 2. Lifestyle Modification Milestones (3-5%, 7-10%, >10% weight loss, Sarcopenia resistance)
 * 3. Hepatotoxic Safety Rules (Acetaminophen 2g ceiling in cirrhosis, NSAID contraindication, Statin safety)
 * 4. Warning Signs & Red Flags (Asterixis, Scleral icterus, Hematemesis, Ascites triage)
 * 5. Interactive Patient Counseling Simulator with scoring & XP awards.
 */

import React, { useState } from 'react';
import {
  HeartPulse,
  Apple,
  Dumbbell,
  AlertTriangle,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Info,
  Pill,
  Coffee,
  Sparkles,
  ArrowRight,
  Flame,
  UserCheck
} from 'lucide-react';
import {
  DIETARY_PROTOCOLS,
  LIFESTYLE_BENCHMARKS,
  HEPATOTOXIC_RULES,
  CLINICAL_WARNING_SIGNS,
  DietaryProtocol,
  LifestyleBenchmark,
  HepatotoxicSafetyRule,
  ClinicalWarningSign
} from '../../data/longitudinalAndExplainabilityData';
import { useProgress } from '../../context/ProgressContext';

export const PreventionAndPrecautionGuide: React.FC = () => {
  const { awardXP } = useProgress();

  // Active category tab inside prevention
  const [activeTab, setActiveTab] = useState<'diet' | 'lifestyle' | 'drug_safety' | 'warning_signs' | 'counseling'>('diet');

  // Interactive Acetaminophen safety calculator state
  const [patientCondition, setPatientCondition] = useState<'healthy' | 'fatty_liver' | 'compensated_cirrhosis' | 'decompensated'>('compensated_cirrhosis');

  // Patient counseling scenario state
  const [selectedCounselingOption, setSelectedCounselingOption] = useState<number | null>(null);
  const [counselingSubmitted, setCounselingSubmitted] = useState<boolean>(false);

  const getAcetaminophenAdvice = () => {
    switch (patientCondition) {
      case 'healthy':
        return {
          maxDaily: '4,000 mg / 24h',
          singleDose: '500 - 1,000 mg every 4-6h',
          safetyColor: 'text-emerald-400',
          advice: 'Standard therapeutic ceiling. Safe with normal glutathione reserves.'
        };
      case 'fatty_liver':
        return {
          maxDaily: '3,000 mg / 24h',
          singleDose: '500 mg every 6h',
          safetyColor: 'text-cyan-400',
          advice: 'Transaminases elevated, but hepatic synthetic capacity intact. Exercise mild caution.'
        };
      case 'compensated_cirrhosis':
        return {
          maxDaily: '2,000 mg / 24h',
          singleDose: '325 - 500 mg every 6-8h',
          safetyColor: 'text-amber-400',
          advice: 'PREFERRED analgesic over NSAIDs! Keep total dose strictly <= 2.0 g/day due to diminished hepatic glutathione reserves.'
        };
      case 'decompensated':
        return {
          maxDaily: '1,000 - 1,500 mg / 24h (or consult hepatology)',
          singleDose: '325 mg PRN',
          safetyColor: 'text-rose-400',
          advice: 'Extreme caution in active acute hepatic encephalopathy or jaundice.'
        };
    }
  };

  const apapAdvice = getAcetaminophenAdvice();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              <HeartPulse className="w-4 h-4" />
              <span>Preventive Hepatology &amp; Patient Safety Guidance</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400 font-normal">Evidence-Based Clinical Protocols</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Dietary Therapy, Lifestyle Interventions &amp; Hepatotoxicity Ceilings
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Equip yourself with actionable preventive recommendations: Mediterranean dietary prescriptions, histologic weight-loss milestones, evidence-based medication safety rules, and prompt recognition of red-flag hepatic decompensation signs.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('diet')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'diet'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            <span>Dietary Protocols</span>
          </button>

          <button
            onClick={() => setActiveTab('lifestyle')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'lifestyle'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Lifestyle &amp; Weight Milestones</span>
          </button>

          <button
            onClick={() => setActiveTab('drug_safety')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'drug_safety'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Hepatotoxic Drug Safety</span>
          </button>

          <button
            onClick={() => setActiveTab('warning_signs')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'warning_signs'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Red-Flag Warning Signs</span>
          </button>

          <button
            onClick={() => setActiveTab('counseling')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'counseling'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Patient Counseling Simulator</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DIETARY PROTOCOLS */}
      {activeTab === 'diet' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DIETARY_PROTOCOLS.map((protocol, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-cyan-400 font-bold uppercase tracking-wider text-[10px]">
                    {protocol.category}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold">
                    {protocol.evidenceGrade}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">
                  {protocol.recommendation}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {protocol.rationale}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-0.5">
                  Clinical Pearl &bull; Practical Tip:
                </span>
                <p className="text-xs text-cyan-300 font-medium">
                  {protocol.practicalTip}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: LIFESTYLE & WEIGHT BENCHMARKS */}
      {activeTab === 'lifestyle' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-cyan-400" />
              Weight Loss Benchmarks &amp; Histological Outcomes in MASH
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Clinical hepatology guidelines establish direct dose-response relationships between total body weight reduction and histological liver architecture recovery.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {LIFESTYLE_BENCHMARKS.map((bench, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-cyan-400 block font-mono">
                    {bench.intervention}
                  </span>
                  <div className="text-xs font-semibold text-white">
                    {bench.clinicalImpact}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-slate-800/80">
                    <strong>Mechanism:</strong> {bench.metabolicMechanism}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HEPATOTOXIC DRUG SAFETY */}
      {activeTab === 'drug_safety' && (
        <div className="space-y-6">
          {/* Interactive Acetaminophen Safe Dose Calculator */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Pill className="w-4 h-4 text-cyan-400" />
                  Acetaminophen (Paracetamol) Safe Ceiling Calculator
                </h3>
                <p className="text-xs text-slate-400">
                  Select the patient clinical stage to verify exact maximum safe therapeutic boundaries.
                </p>
              </div>

              <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
                {(['healthy', 'fatty_liver', 'compensated_cirrhosis', 'decompensated'] as const).map((cond) => (
                  <button
                    key={cond}
                    onClick={() => setPatientCondition(cond)}
                    className={`px-3 py-1 rounded-xl font-medium transition-all cursor-pointer ${
                      patientCondition === cond
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cond.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Maximum 24h Ceiling</span>
                <span className={`text-xl font-bold font-mono ${apapAdvice.safetyColor}`}>
                  {apapAdvice.maxDaily}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Single Dose Limit</span>
                <span className="text-sm font-bold font-mono text-white">
                  {apapAdvice.singleDose}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Attending Hepatology Rationale</span>
                <p className="text-xs text-slate-300 mt-1">
                  {apapAdvice.advice}
                </p>
              </div>
            </div>
          </div>

          {/* General Hepatotoxic Safety Rules Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400">
              Prescription Safety Matrix for Liver Patients
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {HEPATOTOXIC_RULES.map((rule, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{rule.medicationOrAgent}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        rule.dangerLevel === 'Strictly Contraindicated' ? 'bg-rose-500/20 text-rose-300' :
                        rule.dangerLevel === 'Caution/Monitor' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {rule.dangerLevel}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-300 flex justify-between pt-1 border-t border-slate-800/60">
                    <span>Normal Max: <strong>{rule.maxDoseNormal}</strong></span>
                    <span>Cirrhosis Max: <strong>{rule.maxDoseCirrhosis}</strong></span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed pt-1">
                    {rule.clinicalGuidance}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RED-FLAG WARNING SIGNS */}
      {activeTab === 'warning_signs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CLINICAL_WARNING_SIGNS.map((sign) => (
            <div
              key={sign.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white font-bold text-sm">{sign.signName}</span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      sign.urgency === 'EMERGENCY STAT' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                      sign.urgency === 'Urgent 48h' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                      'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    }`}
                  >
                    {sign.urgency}
                  </span>
                </div>
                <div className="text-xs text-cyan-300 font-medium">
                  Anatomical site: {sign.anatomicalLocation}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  <strong>Pathophysiology:</strong> {sign.pathophysiologicalCause}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-0.5">
                  Immediate Clinical Protocol:
                </span>
                <p className="text-xs text-slate-200">
                  {sign.clinicalAction}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: PATIENT COUNSELING SIMULATOR */}
      {activeTab === 'counseling' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
              Clinical Vignette Counseling Challenge
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              Counseling a Patient with Newly Diagnosed MASH &amp; Chronic Knee Osteoarthritis
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Patient is a 56-year-old male with MASH (F2 fibrosis), BMI 32.4, and knee pain. He asks: &quot;Doctor, I read on the internet that Tylenol damages the liver, so I take Ibuprofen (800 mg TID) instead. What should I do for my pain, diet, and morning coffee?&quot;
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-300">
              Select the optimal evidence-based physician counseling strategy:
            </span>

            {[
              {
                id: 0,
                text: 'Tell the patient to continue Ibuprofen 800 mg TID and avoid Acetaminophen completely; advise stopping coffee immediately.',
                isCorrect: false,
                feedback: 'INCORRECT: NSAIDs present high renal and GI bleeding risks in chronic liver disease. Coffee is actually protective (2-3 cups/day reduces fibrosis), and low-dose Acetaminophen is safer than NSAIDs.'
              },
              {
                id: 1,
                text: 'Discontinue Ibuprofen due to renal risk; recommend Acetaminophen <= 2.0g/day (divided 500mg doses) for pain; prescribe Mediterranean diet with fructose restriction; endorse 2-3 cups of unsweetened coffee daily.',
                isCorrect: true,
                feedback: 'EXCELLENT CLINICAL COUNSELING! NSAIDs are stopped to protect renal hemodynamics. Acetaminophen at <= 2.0 g/day is the safest oral analgesic. The Mediterranean diet and fructose restriction reduce steatosis, and coffee provides antifibrotic chlorogenic acids.'
              },
              {
                id: 2,
                text: 'Prescribe high-dose green tea extract and milk thistle to cleanse liver enzymes before treating the knee.',
                isCorrect: false,
                feedback: 'DANGEROUS ERROR: Concentrated green tea extract (EGCG) is a known cause of acute toxic liver failure. Milk thistle lacks proven clinical efficacy.'
              }
            ].map((option) => {
              const isSelected = selectedCounselingOption === option.id;
              let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

              if (counselingSubmitted) {
                if (option.isCorrect) {
                  btnStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-950/40 border-rose-500 text-rose-200';
                }
              } else if (isSelected) {
                btnStyle = 'bg-cyan-950/60 border-cyan-500 text-white';
              }

              return (
                <button
                  key={option.id}
                  disabled={counselingSubmitted}
                  onClick={() => setSelectedCounselingOption(option.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left text-xs transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                >
                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center shrink-0 text-xs font-mono mt-0.5">
                    {String.fromCharCode(65 + option.id)}
                  </span>
                  <div className="space-y-1">
                    <p className="leading-relaxed font-medium">{option.text}</p>
                    {counselingSubmitted && isSelected && (
                      <p className={`text-[11px] pt-1.5 border-t ${option.isCorrect ? 'border-emerald-700 text-emerald-300' : 'border-rose-700 text-rose-300'}`}>
                        {option.feedback}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {!counselingSubmitted ? (
            <button
              disabled={selectedCounselingOption === null}
              onClick={() => {
                setCounselingSubmitted(true);
                if (selectedCounselingOption === 1) awardXP(30);
              }}
              className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <span>Submit Counseling Recommendation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => {
                setCounselingSubmitted(false);
                setSelectedCounselingOption(null);
              }}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Try Another Counseling Scenario</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
