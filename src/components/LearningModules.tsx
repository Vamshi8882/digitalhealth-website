import React, { useState } from 'react';
import { BookOpen, CheckCircle, ArrowRight, Award, HelpCircle, AlertCircle, ChevronDown, ChevronUp, Database, Save, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useProgress } from '../context/ProgressContext';

export interface CurriculumModule {
  id: number;
  title: string;
  duration: string;
  category: 'Foundations' | 'Data & Features' | 'Machine Learning' | 'Clinical Deployment' | 'Ethics & Vision';
  summary: string;
  sections: {
    heading: string;
    content: string;
    clinicalPearl?: string;
  }[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export const MODULES_DATA: CurriculumModule[] = [
  {
    id: 1,
    title: 'Digital Transformation in Medicine: From Paper Charts to Clinical AI',
    duration: '25 min',
    category: 'Foundations',
    summary: 'Explore how digitized medical workflows, electronic health records (EHRs), and clinical analytics transform patient safety, clinical triage, and medical research.',
    sections: [
      {
        heading: 'The Evolutionary Trajectory of Clinical Record Keeping',
        content: 'For centuries, clinical documentation relied on handwriting in physical paper folders. This resulted in fragmented records, legibility hazards, lost charts, and siloed epidemiological data. The introduction of Electronic Health Record (EHR) systems digitized progress notes, medication orders, and laboratory telemetry, setting the computational substrate required for predictive medical software.'
      },
      {
        heading: 'The 4-Step Medical AI Pipeline',
        content: '1. Structured Data Ingestion (Standardized laboratory instruments & FHIR APIs)\n2. Preprocessing & Imputation (Handling missing assays and clinical outliers)\n3. Model Training & Validation (Cross-validation ensuring generalization to external hospitals)\n4. Clinician-in-the-Loop Decision Support (Surfacing actionable risk scores without automating critical diagnosis).',
        clinicalPearl: 'A medical AI system must never replace clinician clinical judgement; its primary role is cognitive augmentation—reducing diagnostic delays and triage oversights.'
      }
    ],
    quiz: {
      question: 'What is the primary role of clinical machine learning software in modern hospital workflows?',
      options: [
        'To autonomously discharge patients without physician sign-off',
        'To augment clinical decision-making, detect subtle patterns, and prioritize triage',
        'To eliminate the need for biological laboratory blood tests',
        'To replace human nursing and resident physician documentation'
      ],
      correctIndex: 1,
      explanation: 'Clinical decision support systems augment human clinicians by highlighting elevated risks and prioritizing triage; they do not replace physician authority or physical diagnostic testing.'
    }
  },
  {
    id: 2,
    title: 'Healthcare Data Architecture & EHR Standards (HL7, FHIR, DICOM)',
    duration: '30 min',
    category: 'Foundations',
    summary: 'Master the standards governing modern health informatics: Fast Healthcare Interoperability Resources (FHIR), HL7 v2 messaging, and DICOM imaging pipelines.',
    sections: [
      {
        heading: 'Interoperability & Syntactic vs Semantic Standards',
        content: 'Healthcare data is inherently heterogeneous—laboratory values, imaging series, waveforms, and genomic sequencing. Without syntactic and semantic harmonization, models trained in Hospital A cannot run on Hospital B.'
      },
      {
        heading: 'HL7 FHIR: JSON REST APIs for Clinical Resources',
        content: 'FHIR (Fast Healthcare Interoperability Resources) organizes medical data into standard REST resources: Patient, Observation (e.g. Bilirubin assay), DiagnosticReport, and MedicationRequest. This allows seamless JSON communication between hospital servers and ML microservices.',
        clinicalPearl: 'The LOINC code 1975-2 specifically designates Total Bilirubin in serum or plasma. Standardized terminology prevents fatal unit mismatches across institutions.'
      }
    ],
    quiz: {
      question: 'Why is HL7 FHIR favored over legacy HL7 v2 for machine learning integration?',
      options: [
        'It uses legacy pipe-delimited text files requiring specialized mainframes',
        'It leverages modern RESTful architecture and JSON objects easily parsed by ML pipelines',
        'It prevents hospitals from collecting patient laboratory data',
        'It only works with radiological MRI scanners'
      ],
      correctIndex: 1,
      explanation: 'FHIR uses standard HTTP REST endpoints with structured JSON schemas, enabling direct serialization into modern Python and TypeScript data science workflows.'
    }
  },
  {
    id: 3,
    title: 'The Indian Liver Patient Dataset (ILPD): Hepatology Biomarkers Deep Dive',
    duration: '35 min',
    category: 'Data & Features',
    summary: 'A comprehensive biochemical exploration of the 583-patient ILPD cohort from Andhra Pradesh, India. Understand each serum marker and its physiological role.',
    sections: [
      {
        heading: 'The 10 Laboratory Measurements in ILPD',
        content: 'The dataset comprises Age, Gender, Total Bilirubin, Direct Bilirubin, Alkaline Phosphatase (ALP), ALT (SGPT), AST (SGOT), Total Proteins, Albumin, and the A/G Ratio. The target variable is dichotomous: 1 = Liver patient (416 records), 2 = Non-liver patient (167 records).'
      },
      {
        heading: 'Hepatocellular vs Cholestatic Liver Injury',
        content: 'Hepatocellular injury is characterized by disproportionate elevations in transaminases (ALT & AST > 5x normal), indicating direct hepatocyte necrosis. Cholestatic injury manifests as marked elevations in Alkaline Phosphatase and Direct (Conjugated) Bilirubin, indicating bile flow obstruction.',
        clinicalPearl: 'Direct Bilirubin > 50% of Total Bilirubin indicates conjugated hyperbilirubinemia, pointing directly to hepatic parenchymal dysfunction or biliary tract stones.'
      }
    ],
    quiz: {
      question: 'Which laboratory pattern specifically distinguishes cholestatic jaundice from pure hemolytic jaundice?',
      options: [
        'Isolated unconjugated bilirubin elevation with normal ALP',
        'Marked elevation of Alkaline Phosphatase (ALP) and Direct Conjugated Bilirubin',
        'Elevated Albumin above 6.0 g/dL',
        'Decreased patient age below 10 years'
      ],
      correctIndex: 1,
      explanation: 'Cholestasis (bile obstruction) causes conjugated direct bilirubin to regurgitate into blood alongside canalicular Alkaline Phosphatase, whereas hemolysis yields unconjugated (indirect) hyperbilirubinemia with normal ALP.'
    }
  },
  {
    id: 4,
    title: 'Clinical Feature Engineering: De Ritis Ratio (AST/ALT) & Bilirubin Conjugation',
    duration: '30 min',
    category: 'Data & Features',
    summary: 'Discover how domain-guided mathematical combinations of raw features dramatically enhance model predictive power over naive raw inputs.',
    sections: [
      {
        heading: 'The De Ritis Ratio (AST / ALT)',
        content: 'Discovered in 1957 by Fernando De Ritis, the ratio AST/ALT is one of medicine’s most enduring diagnostic ratios. In typical viral hepatitis and non-alcoholic fatty liver disease (NAFLD), ALT is higher than AST (Ratio < 1.0). In alcoholic hepatitis and advanced cirrhotic fibrosis, AST exceeds ALT, often surpassing 2.0.'
      },
      {
        heading: 'The Bilirubin Conjugation Ratio (Direct / Total)',
        content: 'Direct Bilirubin divided by Total Bilirubin yields the proportion of bilirubin successfully conjugated by hepatic glucuronyl transferase. Ratios > 0.40 confirm post-hepatic or hepatocellular origin, filtering out benign physiological pre-hepatic conditions like Gilbert syndrome.',
        clinicalPearl: 'Feeding engineered ratios into machine learning models allows linear and tree-based classifiers to separate complex pathological sub-groups without requiring extreme model depth.'
      }
    ],
    quiz: {
      question: 'What is the diagnostic significance of a De Ritis Ratio (AST / ALT) exceeding 2.0?',
      options: [
        'It confirms normal healthy liver physiology',
        'It is a classic hallmark of alcoholic liver disease and advanced cirrhotic fibrosis',
        'It proves acute viral Hepatitis A infection',
        'It indicates acute bone fracture'
      ],
      correctIndex: 1,
      explanation: 'In alcoholic hepatitis, alcohol exerts toxic mitochondrial injury (releasing mitochondrial AST) and induces pyridoxal-5-phosphate deficiency (reducing cytoplasmic ALT synthesis), pushing the AST/ALT ratio well above 2.0.'
    }
  },
  {
    id: 5,
    title: 'Supervised Machine Learning in Diagnostic Decision Support',
    duration: '40 min',
    category: 'Machine Learning',
    summary: 'Compare core supervised learning algorithms: Logistic Regression, Decision Trees, Random Forests, Support Vector Machines, and Gradient Boosting.',
    sections: [
      {
        heading: 'Probabilistic Linear Models vs Non-Linear Ensembles',
        content: 'Logistic Regression provides direct probabilistic calibration through log-odds coefficients. While Random Forests and Gradient Boosted Trees capture complex non-linear interactions between enzymes, they require explicit calibration techniques (Platt scaling or isotonic regression) before their output probabilities can be trusted for clinical triage.'
      },
      {
        heading: 'Overfitting in Constrained Clinical Datasets',
        content: 'With only 583 records, unconstrained deep trees will memorize idiosyncratic laboratory noise. Restricting tree depth (max_depth <= 4) and using bootstrap aggregation (bagging) prevents destructive overfitting.',
        clinicalPearl: 'In medical ML, simpler models with domain-engineered features often beat deep complex networks while offering transparent clinical verification.'
      }
    ],
    quiz: {
      question: 'Why must Random Forest tree depths be restricted when training on the 583-record ILPD dataset?',
      options: [
        'Deep trees run out of memory on supercomputers',
        'Unconstrained deep trees easily overfit the small 167-case healthy control cohort, hurting real-world generalization',
        'Medical boards prohibit any tree with more than 2 leaves',
        'Tree depth has no effect on machine learning performance'
      ],
      correctIndex: 1,
      explanation: 'Because the dataset is small and noisy, unpruned deep trees memorize specific patient anomalies rather than generalizable pathophysiological rules, leading to severe test-set drop-off.'
    }
  },
  {
    id: 6,
    title: 'Model Evaluation in Medicine: ROC-AUC vs Accuracy & Asymmetric Costs',
    duration: '35 min',
    category: 'Machine Learning',
    summary: 'Learn why standard software engineering accuracy metrics fail in healthcare, and how to calibrate decision thresholds based on clinical cost matrices.',
    sections: [
      {
        heading: 'The Accuracy Paradox and Hospital Prevalence',
        content: 'If 80% of ICU patients survive sepsis, a dummy model that predicts "Survives" every time is 80% accurate but 0% useful. ROC-AUC evaluates the True Positive Rate against the False Positive Rate across all thresholds, proving true discriminative separation.'
      },
      {
        heading: 'Asymmetric Clinical Cost Matrices',
        content: 'Missing an acute liver failure (False Negative) can lead to patient mortality within 48 hours. In contrast, a False Positive triggers a harmless confirmatory serum assay or ultrasound. Clinical thresholds must be tuned to prioritize Recall (Sensitivity) over precision.',
        clinicalPearl: 'Never report raw accuracy in medical literature without accompanied Sensitivity, Specificity, Positive Predictive Value (PPV), and Area Under the ROC Curve.'
      }
    ],
    quiz: {
      question: 'If a screening test for a life-threatening liver ailment is deployed, which metric must be prioritized during threshold tuning?',
      options: [
        'Overall Raw Accuracy',
        'Recall (Sensitivity) to minimize fatal False Negatives',
        'Model training speed in microseconds',
        'Number of decision trees in the ensemble'
      ],
      correctIndex: 1,
      explanation: 'In life-threatening medical conditions, missing a sick patient (False Negative) is unacceptable. High sensitivity ensures that virtually all true patients are flagged for confirmatory workup.'
    }
  },
  {
    id: 7,
    title: 'Explainable AI (XAI): SHAP, LIME, and Demystifying Black-Box Algorithms',
    duration: '30 min',
    category: 'Clinical Deployment',
    summary: 'Explore techniques to extract individual feature contributions: SHAP (Shapley Additive exPlanations), LIME, and logistic odds-ratio waterfalls.',
    sections: [
      {
        heading: 'The Black-Box Dilemma in Medicine',
        content: 'Physicians cannot legally or ethically act on an algorithmic recommendation without knowing why the model reached that conclusion. If a model predicts "92% Risk of Cirrhosis", the clinician must see which specific markers (e.g. Inverted A/G ratio + high Direct Bilirubin) triggered the score.'
      },
      {
        heading: 'Game-Theoretic Feature Attribution (SHAP)',
        content: 'Rooted in cooperative game theory (Lloyd Shapley, 1953), Shapley values calculate each feature’s marginal contribution across all possible feature coalitions, guaranteeing local accuracy and consistency.',
        clinicalPearl: 'XAI not only builds clinician trust but also acts as a safety auditor—detecting when a model erroneously fixates on spurious dataset artifacts like patient ID or hospital site code.'
      }
    ],
    quiz: {
      question: 'Why is Explainable AI (XAI) legally and clinically essential in clinical decision support?',
      options: [
        'It allows clinicians to understand and verify the biochemical rationale behind risk predictions',
        'It automatically reduces patient hospital bills',
        'It prevents computers from using electricity',
        'It eliminates the need for software code testing'
      ],
      correctIndex: 0,
      explanation: 'Physicians hold final legal accountability for patient care. XAI provides transparent parameter contributions so doctors can confirm the algorithm aligns with established pathophysiology before taking action.'
    }
  },
  {
    id: 8,
    title: 'Clinical Decision Support Systems (CDSS) & Workflow Integration',
    duration: '35 min',
    category: 'Clinical Deployment',
    summary: 'How to deploy machine learning within real-world hospital workflows: avoiding alert fatigue, ensuring five rights of CDSS, and managing model drift.',
    sections: [
      {
        heading: 'The Five Rights of Clinical Decision Support',
        content: '1. The right information (evidence-based recommendations)\n2. To the right person (attending physician, nurse, or pharmacist)\n3. In the right format (subtle order suggestion, not intrusive pop-ups)\n4. Through the right channel (EHR embedded, mobile push)\n5. At the right time in workflow (during lab ordering, not post-discharge).'
      },
      {
        heading: 'The Danger of Alert Fatigue',
        content: 'When hospital systems bombard clinicians with excessive or low-specificity alerts, doctors develop subconscious alert fatigue, clicking "Dismiss" without reading. This has contributed to documented fatal medication errors.',
        clinicalPearl: 'Reserve high-interrupt modal alerts exclusively for imminent life-safety events. Predictive risk scores should live as ambient indicators within the patient summary chart.'
      }
    ],
    quiz: {
      question: 'What is alert fatigue in healthcare IT, and what is its primary hazard?',
      options: [
        'Computers slowing down during peak internet hours',
        'Clinicians becoming desensitized to frequent alerts and accidentally dismissing critical life-safety warnings',
        'Patients forgetting their appointment times',
        'Laboratory instruments running out of chemical reagents'
      ],
      correctIndex: 1,
      explanation: 'Alert fatigue happens when clinicians are overwhelmed by non-critical notifications, causing them to reflexively bypass warnings, potentially overlooking catastrophic drug interactions or severe organ failure.'
    }
  },
  {
    id: 9,
    title: 'Medical Computer Vision: Color Spaces (HSV/LAB) for Scleral Icterus',
    duration: '35 min',
    category: 'Ethics & Vision',
    summary: 'Understand the optical physics and computer vision mathematics behind automated jaundice screening using HSV hue filtering and CIE LAB b* chrominance.',
    sections: [
      {
        heading: 'Anatomy of Scleral Icterus',
        content: 'Bilirubin has a high affinity for elastin, a structural protein abundant in the bulbar sclera of the eye. Consequently, scleral icterus (yellow eyes) is the earliest visible clinical manifestation of hyperbilirubinemia, detectable when serum bilirubin exceeds 2.5 - 3.0 mg/dL.'
      },
      {
        heading: 'RGB vs HSV vs CIE LAB Color Spaces',
        content: 'Standard RGB pixels confound color with brightness. A dim yellow sclera and a bright white sclera can have overlapping RGB values. By converting to HSV (Hue 20°-45°) and CIE LAB (b* positive yellow channel), computer vision algorithms isolate pure pigment independent of illumination.',
        clinicalPearl: 'Automated camera jaundice tools must incorporate color calibration cards (Macbeth charts) to correct for ambient warm incandescent lighting that mimics jaundice.'
      }
    ],
    quiz: {
      question: 'Why is standard RGB color space inadequate for robust computer vision detection of jaundice in variable lighting?',
      options: [
        'RGB cannot represent yellow colors at all',
        'In RGB, chromaticity is entangled with brightness, making illumination changes mimic jaundice',
        'RGB images cannot be stored on modern computers',
        'RGB is only used for audio waveforms'
      ],
      correctIndex: 1,
      explanation: 'In RGB, changes in ambient lighting directly alter R, G, and B channel intensities. In contrast, HSV and LAB separate luminance from chrominance, enabling robust pigment isolation across varied lighting.'
    }
  },
  {
    id: 10,
    title: 'Medical AI Ethics, Algorithmic Bias & Regulatory Compliance (FDA/CE-IVD)',
    duration: '40 min',
    category: 'Ethics & Vision',
    summary: 'The ethical, legal, and safety standards governing Software as a Medical Device (SaMD): HIPAA privacy, demographic bias, and Good Machine Learning Practice (GMLP).',
    sections: [
      {
        heading: 'Algorithmic Demographic Bias in Clinical Datasets',
        content: 'The ILPD dataset contains 75.6% male records and originates from a single geographical region in India. A model trained on this data might perform sub-optimally when evaluated on pediatric cohorts, pregnant females, or diverse international populations.'
      },
      {
        heading: 'Software as a Medical Device (SaMD) Regulations',
        content: 'The FDA (US), EMA/CE-IVDR (Europe), and CDSCO (India) classify clinical ML models based on potential patient risk. Software informing clinical management requires prospective clinical trials, rigorous validation against ground-truth biopsies, and post-market drift surveillance.',
        clinicalPearl: 'The Nine Ethical Rules of Digital Medicine dictate: Primum Non Nocere (First, Do No Harm) must govern code just as it governs surgery.'
      }
    ],
    quiz: {
      question: 'If an AI model trained strictly on adult male hospital records is applied to pediatric patients, what clinical danger occurs?',
      options: [
        'The computer will overheat and catch fire',
        'Distribution shift / covariate shift leads to erroneous predictions because pediatric liver physiology and enzyme baselines differ',
        'Pediatric patients will refuse to look at the screen',
        'The model will automatically improve itself without human oversight'
      ],
      correctIndex: 1,
      explanation: 'Pediatric liver enzyme baselines (e.g. ALP is physiologically much higher in growing children due to active bone growth) differ drastically from adults. Applying an adult-trained model without re-calibration causes dangerous misdiagnoses.'
    }
  }
];

export const LearningModules: React.FC = () => {
  const {
    completedModules,
    markModuleComplete,
    quizAnswers,
    storageEngine
  } = useProgress();

  const [selectedModule, setSelectedModule] = useState<CurriculumModule>(MODULES_DATA[0]);
  const [showQuizResult, setShowQuizResult] = useState<Record<number, boolean>>({});

  const handleSelectQuizOption = (moduleId: number, optionIdx: number) => {
    setShowQuizResult(prev => ({ ...prev, [moduleId]: true }));
    markModuleComplete(moduleId, optionIdx);
  };

  const progressPercent = Math.round((completedModules.length / MODULES_DATA.length) * 100);

  return (
    <div className="w-full space-y-6">
      {/* Curriculum Header & Progress */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            Medical Data Science &amp; Digitalization Curriculum
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            10 programmatic accredited modules designed for medical students, healthcare developers, and clinical AI researchers.
          </p>
        </div>

        {/* Gamified Progress Bar & Storage Badge */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>State Saved: <strong className="text-slate-200">{storageEngine}</strong></span>
          </div>

          <div className="bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 min-w-[220px]">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" /> Curriculum Progress
              </span>
              <span className="font-mono font-bold text-white">
                {completedModules.length} / {MODULES_DATA.length} ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout: Left Module Index (4 cols) & Right Reader (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Module Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1 mb-2">
            Curriculum Sequence (10 Modules)
          </div>
          <div className="space-y-1.5 max-h-[680px] overflow-y-auto pr-1">
            {MODULES_DATA.map(mod => {
              const isSelected = selectedModule.id === mod.id;
              const isCompleted = completedModules.includes(mod.id);

              return (
                <button
                  key={mod.id}
                  onClick={() => setSelectedModule(mod)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-500/60 shadow-md'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px] text-slate-400 font-mono">
                        {mod.id}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                      <span className="text-cyan-400 font-medium">{mod.category}</span>
                      <span>{mod.duration}</span>
                    </div>
                    <div className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {mod.title}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Module Content Reader */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          {/* Module Title Header */}
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span className="text-cyan-400 font-semibold uppercase tracking-wider font-mono">
                Module {selectedModule.id} &bull; {selectedModule.category}
              </span>
              <span>Estimated Reading: {selectedModule.duration}</span>
            </div>
            <h1 className="text-xl font-bold text-white">{selectedModule.title}</h1>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              {selectedModule.summary}
            </p>
          </div>

          {/* Core Content Sections */}
          <div className="space-y-6">
            {selectedModule.sections.map((sec, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  {sec.heading}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line pl-3 border-l-2 border-slate-800">
                  {sec.content}
                </p>
                {sec.clinicalPearl && (
                  <div className="mt-3 bg-cyan-950/40 border border-cyan-800/50 rounded-xl p-3 text-xs text-cyan-200 flex items-start gap-2.5">
                    <Award className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-cyan-100">Clinical Pearl: </span>
                      {sec.clinicalPearl}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Interactive Check-Point Quiz */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                Interactive Mastery Check (Module {selectedModule.id})
              </span>
              <span className="text-[10px] text-amber-400 font-mono">+100 XP upon completion</span>
            </div>

            <p className="text-xs text-slate-200 font-medium">
              {selectedModule.quiz.question}
            </p>

            <div className="space-y-2">
              {selectedModule.quiz.options.map((opt, optIdx) => {
                const userSelected = quizAnswers[selectedModule.id] === optIdx;
                const isSubmitted = showQuizResult[selectedModule.id];
                const isCorrectOption = optIdx === selectedModule.quiz.correctIndex;

                let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';
                if (isSubmitted) {
                  if (isCorrectOption) {
                    btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold';
                  } else if (userSelected) {
                    btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                  }
                } else if (userSelected) {
                  btnStyle = 'border-cyan-500 bg-slate-800 text-white';
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectQuizOption(selectedModule.id, optIdx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isSubmitted && isCorrectOption && (
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {showQuizResult[selectedModule.id] && (
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <span className="font-semibold text-white">Explanation: </span>
                {selectedModule.quiz.explanation}
              </div>
            )}
          </div>

          {/* Module Bottom Navigation & Mark Complete */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => markModuleComplete(selectedModule.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                completedModules.includes(selectedModule.id)
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              {completedModules.includes(selectedModule.id) ? 'Completed (+100 XP)' : 'Mark Module Complete'}
            </button>

            {selectedModule.id < MODULES_DATA.length && (
              <button
                onClick={() => setSelectedModule(MODULES_DATA[selectedModule.id])}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1.5 transition-colors"
              >
                <span>Next Module</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
