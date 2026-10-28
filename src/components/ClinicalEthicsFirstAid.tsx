import React, { useState } from 'react';
import { ShieldAlert, PhoneCall, HeartPulse, Check, X, BookOpen, AlertOctagon, HelpCircle, Flame, Activity } from 'lucide-react';

export const ClinicalEthicsFirstAid: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'emergencies' | 'rules' | 'problems'>('emergencies');

  // Acute Emergency Protocols with Actionable Do/Don't Layout Cards
  const emergencyProtocols = [
    {
      id: 'cpr',
      title: 'Adult Cardiopulmonary Resuscitation (CPR)',
      trigger: 'Unresponsive, pulseless patient with absent or agonal breathing',
      dos: [
        'Call 112 immediately and request an Automated External Defibrillator (AED).',
        'Place heel of one hand in the center of the chest (lower half of sternum), interlock second hand.',
        'Compress at a rate of 100-120 compressions/minute at a depth of 5-6 cm (2-2.4 inches).',
        'Allow complete chest recoil between each compression.',
        'Maintain continuous compressions; rotate compressor every 2 minutes to prevent fatigue.'
      ],
      donts: [
        'Do not delay chest compressions to check for pulse for more than 10 seconds.',
        'Do not lean on the chest between compressions—prevents full ventricular refill.',
        'Do not interrupt compressions for more than 10 seconds even for rescue breaths.'
      ]
    },
    {
      id: 'choking',
      title: 'Severe Foreign Body Airway Obstruction (Choking)',
      trigger: 'Patient clutching throat, unable to speak, cough, or breathe (Universal Choking Sign)',
      dos: [
        'Ask "Are you choking?" If patient nods and cannot cough, initiate immediate intervention.',
        'Stand behind patient, wrap arms around waist, make a fist thumb-side against abdomen above navel.',
        'Deliver rapid, upward abdominal thrusts (Heimlich Maneuver) until object is dislodged.',
        'If patient becomes unresponsive, lower to ground and immediately begin standard CPR compressions.'
      ],
      donts: [
        'Do not perform blind finger sweeps in the oral cavity—it can push foreign body further into airway.',
        'Do not perform abdominal thrusts on infants under 1 year (use 5 back blows + 5 chest thrusts instead).'
      ]
    },
    {
      id: 'bleeding',
      title: 'Severe Arterial & Venous Hemorrhage',
      trigger: 'Pulsatile, spurting, or rapidly pooling bright red blood',
      dos: [
        'Apply firm, continuous direct pressure over the bleeding site with sterile dressing or clean cloth.',
        'If direct pressure fails on limbs, apply an arterial tourniquet 5-7 cm proximal to wound.',
        'Record the exact time of tourniquet application on the patient’s forehead or tourniquet band.',
        'Keep patient warm with blankets to prevent trauma-induced hypothermia and coagulopathy.'
      ],
      donts: [
        'Do not remove blood-soaked dressings—apply fresh dressings directly on top.',
        'Do not apply a tourniquet directly over a joint (elbow or knee).',
        'Do not loosen or remove a tourniquet once placed except in an operating theatre.'
      ]
    },
    {
      id: 'stroke',
      title: 'Acute Ischemic Stroke (FAST Protocol)',
      trigger: 'Sudden neurological deficit, unilateral weakness, or aphasia',
      dos: [
        'Assess FAST: Face drooping, Arm weakness, Speech difficulty, Time to call 112 immediately.',
        'Note the exact "Last Known Well" (LKW) timestamp; critical for IV thrombolysis window (<4.5 hrs).',
        'Position patient with head elevated 30° if tolerating; keep NPO (nothing by mouth).'
      ],
      donts: [
        'Do not give aspirin, blood thinners, food, or fluids before non-contrast head CT rules out hemorrhage.',
        'Do not aggressively lower high blood pressure unless systolic > 220 mmHg (permissive hypertension preserves ischemic penumbra).'
      ]
    },
    {
      id: 'anaphylaxis',
      title: 'Severe Anaphylactic Shock',
      trigger: 'Acute onset hives/swelling with respiratory stridor, wheezing, or hypotension',
      dos: [
        'Inject Epinephrine (1:1000) 0.3-0.5 mg intramuscularly (IM) into anterolateral mid-thigh immediately.',
        'Call 112; administer supplemental oxygen and elevate legs (Trendelenburg) if hypotensive.',
        'Repeat IM Epinephrine after 5-15 minutes if symptoms persist or deteriorate.'
      ],
      donts: [
        'Do not rely on oral antihistamines or inhalers—only Epinephrine reverses airway edema and shock.',
        'Do not make an anaphylactic patient stand up or walk; sudden venous pooling can cause cardiac arrest.'
      ]
    },
    {
      id: 'burns',
      title: 'Acute Thermal & Chemical Burns',
      trigger: 'Heat, fire, electrical contact, or corrosive chemical splash',
      dos: [
        'Cool thermal burns immediately under gentle cool running tap water for 10-20 minutes.',
        'Remove rings, watches, and tight clothing before progressive tissue edema develops.',
        'Cover with a clean, dry, sterile non-adherent dressing or plastic food wrap.'
      ],
      donts: [
        'Do not apply ice, ice water, butter, toothpaste, or greasy ointments—causes tissue ischemia.',
        'Do not burst intact blisters (they act as natural biological sterile barriers).'
      ]
    },
    {
      id: 'seizure',
      title: 'Generalized Tonic-Clonic Seizure',
      trigger: 'Sudden loss of consciousness, tonic stiffening followed by rhythmic clonic jerking',
      dos: [
        'Protect patient from traumatic injury: clear sharp objects and cushion head with folded jacket.',
        'Time the seizure duration carefully; status epilepticus (>5 min) requires emergency IV benzodiazepines.',
        'Once convulsions cease, roll patient into the lateral Recovery Position to maintain patent airway.'
      ],
      donts: [
        'Do not restrain patient’s limbs during active convulsive movements—causes bone fractures.',
        'Do not insert anything into the patient’s mouth (spoons, fingers, tongue depressors)—risk of choking.'
      ]
    }
  ];

  return (
    <div className="w-full space-y-6">
      {/* India National Emergency Number & Certification Banner */}
      <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-amber-950/80 border-2 border-rose-500/70 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/40 shrink-0">
            <PhoneCall className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-rose-300">
              India National Universal Emergency Telephony
            </div>
            <div className="text-3xl font-black font-mono text-white tracking-wide mt-0.5">
              DIAL 112
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              Unified national emergency response support system (Police, Fire, and Ambulance) across all States &amp; Union Territories of India.
            </p>
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl text-xs text-slate-300 max-w-sm shrink-0">
          <span className="font-bold text-amber-300 flex items-center gap-1.5 mb-1">
            <HeartPulse className="w-4 h-4 text-amber-400" /> Mandatory Hands-On Training
          </span>
          Digital platforms provide cognitive reinforcement. All healthcare personnel must maintain active, formal practical certification in Basic Life Support (BLS) and Advanced Cardiac Life Support (ACLS).
        </div>
      </div>

      {/* Sub-Navigation */}
      <div className="flex border-b border-slate-800 space-x-6 text-sm">
        <button
          onClick={() => setActiveSubTab('emergencies')}
          className={`pb-3 font-semibold transition-colors flex items-center gap-2 ${
            activeSubTab === 'emergencies'
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" /> Acute Medical Emergency &quot;Do / Don&apos;t&quot; Cards
        </button>

        <button
          onClick={() => setActiveSubTab('rules')}
          className={`pb-3 font-semibold transition-colors flex items-center gap-2 ${
            activeSubTab === 'rules'
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4" /> Nine Ethical Rules &amp; Five Golden Steps
        </button>

        <button
          onClick={() => setActiveSubTab('problems')}
          className={`pb-3 font-semibold transition-colors flex items-center gap-2 ${
            activeSubTab === 'problems'
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <AlertOctagon className="w-4 h-4" /> Healthcare Digital Problems &amp; Solutions
        </button>
      </div>

      {/* Subtab 1: Acute Emergencies Do/Don't Cards */}
      {activeSubTab === 'emergencies' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emergencyProtocols.map(proto => (
              <div
                key={proto.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <HeartPulse className="w-4 h-4 text-rose-400" />
                      {proto.title}
                    </h3>
                  </div>
                  <div className="text-[11px] text-amber-300 font-mono bg-amber-950/30 px-2.5 py-1 rounded-md border border-amber-800/40 mt-1.5">
                    Trigger: {proto.trigger}
                  </div>

                  {/* Do's */}
                  <div className="mt-3.5 space-y-1.5">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> What to DO
                    </span>
                    <ul className="space-y-1 pl-1">
                      {proto.dos.map((item, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">&bull;</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Don'ts */}
                  <div className="mt-3.5 space-y-1.5 pt-3 border-t border-slate-800/80">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-rose-400 flex items-center gap-1">
                      <X className="w-3.5 h-3.5" /> What NOT to do
                    </span>
                    <ul className="space-y-1 pl-1">
                      {proto.donts.map((item, idx) => (
                        <li key={idx} className="text-xs text-rose-200/90 flex items-start gap-2">
                          <span className="text-rose-400 font-bold">&bull;</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 2: Ethical Rules & Golden Steps */}
      {activeSubTab === 'rules' && (
        <div className="space-y-6">
          {/* Five Golden Steps */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              The Five Golden Steps of Medical AI Deployment
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-1">
              {[
                { step: '1. Data Provenance', desc: 'Audit dataset origin, regional ethnicity distribution, lab instruments, and inclusion biases.' },
                { step: '2. Stratified Validation', desc: 'Perform k-fold cross-validation preserving clinical demographic subgroups and classes.' },
                { step: '3. Explainability Check', desc: 'Verify parameter attribution (SHAP/coefficients) aligns with known human pathophysiology.' },
                { step: '4. Clinician Oversight', desc: 'Deploy within ambient EHR workflows with clear human-in-the-loop override pathways.' },
                { step: '5. Post-Market Drift', desc: 'Continuously track calibration drift and distribution shift across longitudinal patient cohorts.' }
              ].map((s, idx) => (
                <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
                  <div className="font-bold text-cyan-300 font-mono">{s.step}</div>
                  <p className="text-slate-400 mt-1.5 leading-relaxed text-[11px]">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Nine Ethical Rules */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
              The Nine Ethical Rules of Digital Medicine
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-1">
              {[
                { rule: 'I. Primum Non Nocere (First, Do No Harm)', text: 'Software code must adhere to the same non-maleficence oath as invasive surgery.' },
                { rule: 'II. Preservation of Patient Autonomy', text: 'Patients maintain absolute rights to informed consent and knowledge of AI involvement.' },
                { rule: 'III. Algorithmic Demographic Equity', text: 'Models must be calibrated to avoid discriminatory performance degradation across minority groups.' },
                { rule: 'IV. Data Provenance Transparency', text: 'All training cohort boundaries, limitations, and noise must be transparently documented.' },
                { rule: 'V. Cryptographic Privacy & Security', text: 'Patient health identifiers must be protected by zero-trust encryption and strict access controls.' },
                { rule: 'VI. Human Clinician Accountability', text: 'An algorithmic score is an advisor; final medical liability rests with licensed human clinicians.' },
                { rule: 'VII. Robustness to Distribution Shift', text: 'Systems must detect when test data deviates from training parameters and flag uncertainty.' },
                { rule: 'VIII. Non-Maleficence in Emergency Triage', text: 'High sensitivity must protect against false negative omissions in acute scenarios.' },
                { rule: 'IX. Sustainable & Open Scalability', text: 'Educational tools must promote global knowledge sharing without predatory algorithmic lock-in.' }
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="font-bold text-amber-300">{item.rule}</div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: Healthcare Problems & Solutions Handbook */}
      {activeSubTab === 'problems' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white">
              Healthcare Digitalization Problems &amp; Practical Solutions Handbook
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Core socio-technical failure modes encountered when translating data science into clinical hospitals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {[
              {
                problem: '1. Class Imbalance in Clinical Datasets',
                desc: 'Healthy populations vastly outnumber rare conditions in outpatient screening, while hospital datasets show reverse skew.',
                solution: 'Use Stratified K-Fold splits, report ROC-AUC / Precision-Recall curves rather than raw accuracy, and apply cost-sensitive loss weighting.'
              },
              {
                problem: '2. Automation Bias in Junior Clinicians',
                desc: 'Tired residents may over-trust machine scores, overlooking obvious physical bedside signs of patient deterioration.',
                solution: 'Design interfaces that require clinicians to record their provisional clinical hypothesis before the algorithmic score is unmasked.'
              },
              {
                problem: '3. Model Drift (Covariate & Concept Shift)',
                desc: 'Over time, hospital patient demographics shift, or new laboratory assay reagents alter enzyme reference calibration.',
                solution: 'Implement automated longitudinal monitoring routines flagging statistical distribution drift and scheduled periodic re-training.'
              },
              {
                problem: '4. Interoperability & Vendor Lock-in',
                desc: 'EHR vendors historically stored medical data in closed proprietary database schemas, blocking third-party analytical tools.',
                solution: 'Mandate strict adherence to HL7 FHIR standard JSON REST resources and LOINC/SNOMED-CT clinical ontologies.'
              },
              {
                problem: '5. Alert Fatigue & Workflow Disruption',
                desc: 'High-frequency interruptive alerts cause clinicians to subconsciously dismiss all pop-ups, creating life-safety risks.',
                solution: 'Embed non-interruptive passive indicators in the EHR header; reserve modal interrupts strictly for fatal drug interactions or cardiac arrest.'
              },
              {
                problem: '6. The Black-Box Algorithmic Dilemma',
                desc: 'Complex deep neural networks cannot explain why a particular patient is classified as high-risk, impeding clinical buy-in.',
                solution: 'Utilize Explainable AI methods (SHAP, LIME, logistic regression coefficients) to produce visual parameter waterfalls for clinicians.'
              },
              {
                problem: '7. Medical Cyber-Attacks & Ransomware',
                desc: 'Hospital networks are prime targets for ransomware attacks due to urgent life-or-death operational dependencies.',
                solution: 'Enforce zero-trust architecture, encrypted WAL SQLite databases, regular air-gapped backups, and strict RBAC session token controls.'
              },
              {
                problem: '8. Digital Divide & Algorithmic Exclusion',
                desc: 'Underfunded rural clinics lack high-speed connectivity or modern imaging devices, excluding rural patients from AI benefits.',
                solution: 'Architect lightweight, offline-capable progressive web apps that run locally on low-cost tablets with in-memory execution.'
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="font-bold text-cyan-300 text-sm">{item.problem}</div>
                <div className="text-slate-400 text-[11px] leading-relaxed">
                  <span className="font-semibold text-slate-300">Failure Mode:</span> {item.desc}
                </div>
                <div className="text-emerald-300/90 text-[11px] leading-relaxed bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-900/40">
                  <span className="font-semibold text-emerald-200">Engineering Solution:</span> {item.solution}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
