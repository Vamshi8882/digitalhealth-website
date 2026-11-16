import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle,
  ArrowRight,
  Award,
  HelpCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Database,
  Save,
  Check,
  Search,
  PlusCircle,
  Trash2,
  X,
  Sparkles,
  ShieldCheck,
  Filter,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';

export interface CurriculumModule {
  id: number;
  title: string;
  duration: string;
  category: 'Foundations' | 'Data & Features' | 'Machine Learning' | 'Clinical Deployment' | 'Ethics & Vision';
  summary: string;
  isCertified?: boolean;
  isCustom?: boolean;
  createdBy?: string;
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
    isCertified: true,
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
    isCertified: true,
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
    isCertified: true,
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
    isCertified: true,
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
    isCertified: true,
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
    isCertified: true,
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
    isCertified: true,
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
    isCertified: true,
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
    isCertified: true,
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
    isCertified: true,
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

const MODULES_STORAGE_KEY = 'dhp_curriculum_modules_v2';

function getStoredModules(): CurriculumModule[] {
  try {
    const raw = localStorage.getItem(MODULES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading stored modules:', e);
  }
  return MODULES_DATA;
}

function saveStoredModules(mods: CurriculumModule[]): void {
  try {
    localStorage.setItem(MODULES_STORAGE_KEY, JSON.stringify(mods));
  } catch (e) {
    console.error('Error saving modules:', e);
  }
}

interface LearningModulesProps {
  initialModuleId?: number;
}

export const LearningModules: React.FC<LearningModulesProps> = ({ initialModuleId }) => {
  const {
    completedModules,
    markModuleComplete,
    quizAnswers,
    storageEngine
  } = useProgress();
  const { currentUser, updateProfile } = useAuth();

  const [modulesList, setModulesList] = useState<CurriculumModule[]>(getStoredModules);
  const [selectedModule, setSelectedModule] = useState<CurriculumModule>(() => {
    if (initialModuleId) {
      const found = modulesList.find(m => m.id === initialModuleId);
      if (found) return found;
    }
    return modulesList[0] || MODULES_DATA[0];
  });
  const [showQuizResult, setShowQuizResult] = useState<Record<number, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New module state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<CurriculumModule['category']>('Foundations');
  const [newDuration, setNewDuration] = useState('30 min');
  const [newSummary, setNewSummary] = useState('');
  const [newHeading, setNewHeading] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newPearl, setNewPearl] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newOption0, setNewOption0] = useState('');
  const [newOption1, setNewOption1] = useState('');
  const [newOption2, setNewOption2] = useState('');
  const [newOption3, setNewOption3] = useState('');
  const [newCorrectIdx, setNewCorrectIdx] = useState(0);
  const [newExplanation, setNewExplanation] = useState('');

  useEffect(() => {
    if (initialModuleId) {
      const found = modulesList.find(m => m.id === initialModuleId);
      if (found) setSelectedModule(found);
    }
  }, [initialModuleId, modulesList]);

  const handleSelectQuizOption = (moduleId: number, optionIdx: number) => {
    setShowQuizResult(prev => ({ ...prev, [moduleId]: true }));
    markModuleComplete(moduleId, optionIdx);

    // Sync with auth profile completed modules
    if (currentUser) {
      const existing = currentUser.completedModulesList || [];
      if (!existing.includes(moduleId)) {
        updateProfile({
          completedModulesList: [...existing, moduleId]
        });
      }
    }
  };

  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) {
      alert('Please fill out the title and summary.');
      return;
    }

    const nextId = Math.max(...modulesList.map(m => m.id), 0) + 1;
    const created: CurriculumModule = {
      id: nextId,
      title: newTitle.trim(),
      duration: newDuration.trim() || '25 min',
      category: newCategory,
      summary: newSummary.trim(),
      isCertified: currentUser?.userType === 'faculty',
      isCustom: true,
      createdBy: currentUser ? `${currentUser.titlePrefix} ${currentUser.fullName}` : 'Faculty Member',
      sections: [
        {
          heading: newHeading.trim() || 'Core Clinical Concepts',
          content: newContent.trim() || 'Clinical knowledge and analytical principles for medical student training.',
          clinicalPearl: newPearl.trim() || 'Always correlate laboratory values with bedside patient physical presentation.'
        }
      ],
      quiz: {
        question: newQuestion.trim() || 'What is the primary clinical objective of this module?',
        options: [
          newOption0.trim() || 'To standardize diagnostic reasoning',
          newOption1.trim() || 'To replace biological pathology tests',
          newOption2.trim() || 'To bypass clinical examination',
          newOption3.trim() || 'None of the above'
        ],
        correctIndex: newCorrectIdx,
        explanation: newExplanation.trim() || 'Medical curriculum modules are constructed to instill disciplined diagnostic methodology.'
      }
    };

    const updated = [...modulesList, created];
    setModulesList(updated);
    saveStoredModules(updated);
    setSelectedModule(created);
    setShowAddModal(false);
    confetti({ particleCount: 50, spread: 60 });
  };

  const handleDeleteModule = (moduleId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this custom curriculum resource?')) {
      const updated = modulesList.filter(m => m.id !== moduleId);
      setModulesList(updated);
      saveStoredModules(updated);
      if (selectedModule.id === moduleId) {
        setSelectedModule(updated[0] || MODULES_DATA[0]);
      }
    }
  };

  const filteredModules = modulesList.filter(m => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const progressPercent = Math.round((completedModules.length / modulesList.length) * 100);

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      {/* Curriculum Header & Progress */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Certified Medical AI & Hepatology Education</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            Medical Data Science &amp; Digitalization Curriculum
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Standardized accredited modules for MBBS students, internal medicine residents, and data scientists. Search certified curriculum resources, study domain pearls, and take mastery checks.
          </p>
        </div>

        {/* Action Controls & Gamified Progress */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Module Resource</span>
          </button>

          <div className="bg-slate-950/80 px-4 py-3 rounded-2xl border border-slate-800 min-w-[200px]">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" /> Progress
              </span>
              <span className="font-mono font-bold text-white">
                {completedModules.length} / {modulesList.length} ({progressPercent}%)
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

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search curriculum modules, topics, biomarkers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-white pl-10 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
          {['All', 'Foundations', 'Data & Features', 'Machine Learning', 'Clinical Deployment', 'Ethics & Vision'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Left Module Index (4 cols) & Right Reader (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Module Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1 mb-2 flex items-center justify-between">
            <span>Modules ({filteredModules.length})</span>
            <span className="text-[10px] text-cyan-400 font-mono">Select to Read</span>
          </div>
          <div className="space-y-2 max-h-[720px] overflow-y-auto pr-1">
            {filteredModules.map(mod => {
              const isSelected = selectedModule.id === mod.id;
              const isCompleted = completedModules.includes(mod.id);

              return (
                <div
                  key={mod.id}
                  onClick={() => setSelectedModule(mod)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 cursor-pointer group ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-500/70 shadow-md'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5 shrink-0">
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <span className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center text-[10px] text-slate-400 font-mono">
                          {mod.id}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800">
                          {mod.category}
                        </span>
                        {mod.isCertified ? (
                          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Certified
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-purple-400 bg-purple-950/60 border border-purple-800/40 px-1.5 py-0.5 rounded">
                            Contributed
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono">{mod.duration}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {mod.title}
                      </h4>
                    </div>
                  </div>

                  {mod.isCustom && (
                    <button
                      onClick={(e) => handleDeleteModule(mod.id, e)}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded-lg shrink-0"
                      title="Delete custom module"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Reader Pane */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          {/* Module Title Banner */}
          <div className="border-b border-slate-800 pb-5 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                Module {selectedModule.id} • {selectedModule.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Duration: {selectedModule.duration}
              </span>
              {selectedModule.isCertified ? (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Medical Board Accredited
                </span>
              ) : (
                <span className="text-xs font-bold text-purple-400 bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded-lg">
                  Author: {selectedModule.createdBy || 'Faculty Contributed'}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              {selectedModule.title}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              {selectedModule.summary}
            </p>
          </div>

          {/* Module Sections */}
          <div className="space-y-6">
            {selectedModule.sections.map((sec, idx) => (
              <div key={idx} className="space-y-2.5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>{sec.heading}</span>
                </h3>
                <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line pl-4 border-l border-slate-800">
                  {sec.content}
                </div>
                {sec.clinicalPearl && (
                  <div className="ml-4 mt-3 bg-amber-950/30 border border-amber-800/40 rounded-2xl p-4 text-xs text-amber-200/90 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-300 block mb-0.5">Clinical Pearl:</strong>
                      <span>{sec.clinicalPearl}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Interactive Quiz / Mastery Check */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
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
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
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
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <span className="font-semibold text-white">Explanation: </span>
                {selectedModule.quiz.explanation}
              </div>
            )}
          </div>

          {/* Module Bottom Navigation & Mark Complete */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => markModuleComplete(selectedModule.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                completedModules.includes(selectedModule.id)
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              {completedModules.includes(selectedModule.id) ? 'Completed (+100 XP)' : 'Mark Module Complete'}
            </button>

            {selectedModule.id < modulesList.length && (
              <button
                onClick={() => {
                  const nextMod = modulesList.find(m => m.id === selectedModule.id + 1) || modulesList[0];
                  setSelectedModule(nextMod);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Next Module</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ADD CURRICULUM MODULE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-cyan-400" />
                  <span>Add Curriculum Resource / Module</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Expand the learning syllabus with certified concepts or faculty topics.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddModule} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Module Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Transient Elastography vs Biopsy in Staging Hepatic Fibrosis"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="Foundations">Foundations</option>
                    <option value="Data & Features">Data & Features</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Clinical Deployment">Clinical Deployment</option>
                    <option value="Ethics & Vision">Ethics & Vision</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Estimated Duration</label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    placeholder="e.g. 30 min"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Curriculum Summary</label>
                <textarea
                  rows={2}
                  required
                  placeholder="High-level overview of core learning outcomes..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Section 1 Heading & Content</label>
                <input
                  type="text"
                  placeholder="Heading..."
                  value={newHeading}
                  onChange={(e) => setNewHeading(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white mb-2"
                />
                <textarea
                  rows={4}
                  placeholder="Detailed clinical instructional content..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-amber-300">Clinical Pearl (Key Takeaway)</label>
                <input
                  type="text"
                  placeholder="Essential diagnostic or prognostic pearl..."
                  value={newPearl}
                  onChange={(e) => setNewPearl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="font-semibold text-cyan-400 block">Interactive Mastery Quiz</label>
                <input
                  type="text"
                  placeholder="Quiz question..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                />

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Option 1 (Default Correct)"
                    value={newOption0}
                    onChange={(e) => setNewOption0(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Option 2"
                    value={newOption1}
                    onChange={(e) => setNewOption1(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Option 3"
                    value={newOption2}
                    onChange={(e) => setNewOption2(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Option 4"
                    value={newOption3}
                    onChange={(e) => setNewOption3(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2 rounded-xl"
                >
                  Publish Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
