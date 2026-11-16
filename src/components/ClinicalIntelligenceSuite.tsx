/**
 * Digitalization in Healthcare - Master Clinical Intelligence Suite
 *
 * Unifies comprehensive clinical data science, explainable AI, and medical education:
 * - Longitudinal Patient Records & Multi-Year Biomarker Dynamics
 * - Explainable AI (XAI) & SHAP Feature Attribution Waterfall
 * - Prevention, Dietary Protocols, Weight Loss Milestones & Drug Safety
 * - Interactive Clinical Decision Simulation with Attending Supervision
 * - Cognitive Knowledge Assessment & Personalized Learning Engine
 * - Multi-Disease Prediction (MASLD, ALD, Cirrhosis, Cholestasis, ALF) & Triage
 * - Medical Report OCR Extraction (PDF/Image)
 * - Ultrasound CNN Feature Maps & Grad-CAM Radiomics
 * - Relational Medical Knowledge Graph
 * - Digital Voice Assistant (STT & TTS)
 * - Clinical Guidelines (AASLD/EASL) & Calculators (FIB-4, Child-Pugh)
 * - Data Privacy Management & Model Drift Surveillance (PSI)
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  FileText,
  Eye,
  Share2,
  Mic,
  BookOpen,
  Brain,
  ShieldCheck,
  Activity,
  ArrowRight,
  Calendar,
  Sliders,
  HeartPulse,
  Stethoscope,
  Target,
  BarChart2
} from 'lucide-react';
import { MultiDiseaseAndAnomaly } from './intelligence/MultiDiseaseAndAnomaly';
import { ReportAnalyzerOCR } from './intelligence/ReportAnalyzerOCR';
import { UltrasoundCNNViewer } from './intelligence/UltrasoundCNNViewer';
import { KnowledgeGraphExplorer } from './intelligence/KnowledgeGraphExplorer';
import { DigitalHealthVoiceAssistant } from './intelligence/DigitalHealthVoiceAssistant';
import { GuidelinesAndCalculators } from './intelligence/GuidelinesAndCalculators';
import { StudentPerformanceAndQuiz } from './intelligence/StudentPerformanceAndQuiz';
import { PrivacyAndDriftHub } from './intelligence/PrivacyAndDriftHub';
import { LongitudinalCaseViewer } from './intelligence/LongitudinalCaseViewer';
import { MLPredictionExplainer } from './intelligence/MLPredictionExplainer';
import { PreventionAndPrecautionGuide } from './intelligence/PreventionAndPrecautionGuide';
import { InteractiveDecisionSimulation } from './intelligence/InteractiveDecisionSimulation';
import { PersonalizedLearningEngine } from './intelligence/PersonalizedLearningEngine';
import { useProgress } from '../context/ProgressContext';

export type IntelligenceModuleTab =
  | 'multidisease'
  | 'longitudinal'
  | 'ml_explain'
  | 'prevention'
  | 'decision_sim'
  | 'personalized_learn'
  | 'report_ocr'
  | 'ultrasound_cnn'
  | 'knowledge_graph'
  | 'voice_assistant'
  | 'guidelines_calc'
  | 'privacy_drift';

interface ClinicalIntelligenceSuiteProps {
  initialTab?: IntelligenceModuleTab;
  onNavigateToView?: (viewId: string) => void;
  onTransferToPredictor?: (labs: any) => void;
}

export const ClinicalIntelligenceSuite: React.FC<ClinicalIntelligenceSuiteProps> = ({
  initialTab = 'multidisease',
  onNavigateToView,
  onTransferToPredictor
}) => {
  const { awardXP } = useProgress();
  const [activeTab, setActiveTab] = useState<IntelligenceModuleTab>(initialTab);
  const [transferredLabs, setTransferredLabs] = useState<any>(null);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleOcrTransfer = (labs: any) => {
    setTransferredLabs(labs);
    setActiveTab('multidisease');
    if (onTransferToPredictor) {
      onTransferToPredictor(labs);
    }
  };

  const handleNavigateToCurriculumModule = (moduleId: number) => {
    if (onNavigateToView) {
      onNavigateToView('learn');
    }
  };

  const tabsConfig: {
    id: IntelligenceModuleTab;
    label: string;
    category: 'Diagnostic & Longitudinal' | 'Explainable AI & Prevention' | 'Decision & Learning' | 'Imaging & Systems';
    icon: React.ComponentType<{ className?: string }>;
    description: string;
  }[] = [
    // Category 1: Diagnostic & Longitudinal
    {
      id: 'multidisease',
      label: 'Multi-Disease Triage',
      category: 'Diagnostic & Longitudinal',
      icon: Layers,
      description: 'MASLD, ALD, Cirrhosis, ALF, Isolation Forest Outliers & Red-Flag Triage'
    },
    {
      id: 'longitudinal',
      label: 'Longitudinal Records',
      category: 'Diagnostic & Longitudinal',
      icon: Calendar,
      description: 'Multi-year patient records, changing lab biomarker dynamics, and stage transitions'
    },
    {
      id: 'report_ocr',
      label: 'Lab Report OCR',
      category: 'Diagnostic & Longitudinal',
      icon: FileText,
      description: 'Upload PDF/Images, extract biochemical panels with confidence scoring'
    },

    // Category 2: Explainable AI & Prevention
    {
      id: 'ml_explain',
      label: 'ML Explainability & SHAP',
      category: 'Explainable AI & Prevention',
      icon: Brain,
      description: 'SHAP feature attribution waterfall, counterfactual what-if simulation, and transaminase burn-out'
    },
    {
      id: 'prevention',
      label: 'Prevention & Safety Guide',
      category: 'Explainable AI & Prevention',
      icon: HeartPulse,
      description: 'Mediterranean diet, weight-loss milestones, acetaminophen 2g ceiling, and red flags'
    },
    {
      id: 'knowledge_graph',
      label: 'Knowledge Graph',
      category: 'Explainable AI & Prevention',
      icon: Share2,
      description: 'Relational network connecting diseases, biomarkers, symptoms, and therapies'
    },

    // Category 3: Decision & Learning
    {
      id: 'decision_sim',
      label: 'Decision Simulation',
      category: 'Decision & Learning',
      icon: Stethoscope,
      description: 'Simulated patient cases: diagnostic workups, management orders, and attending supervision'
    },
    {
      id: 'personalized_learn',
      label: 'Personalized Learning',
      category: 'Decision & Learning',
      icon: Target,
      description: 'Clinical reasoning quizzes, 5-domain competency diagnostics, and learning prescriptions'
    },
    {
      id: 'voice_assistant',
      label: 'Digital Voice Assistant',
      category: 'Decision & Learning',
      icon: Mic,
      description: 'Web Speech STT/TTS for verbal clinical education and voice navigation'
    },

    // Category 4: Imaging & Systems
    {
      id: 'ultrasound_cnn',
      label: 'Ultrasound CNN',
      category: 'Imaging & Systems',
      icon: Eye,
      description: 'B-mode radiomics, Grad-CAM saliency heatmaps, and multimodal AI synthesis'
    },
    {
      id: 'guidelines_calc',
      label: 'Guidelines & Calculators',
      category: 'Imaging & Systems',
      icon: BookOpen,
      description: 'AASLD/EASL/WHO guidelines, FIB-4 index, and Child-Pugh cirrhosis staging'
    },
    {
      id: 'privacy_drift',
      label: 'Privacy & Drift Hub',
      category: 'Imaging & Systems',
      icon: ShieldCheck,
      description: 'HIPAA encryption, PSI model drift monitoring, and 6-language translator'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Top Clinical Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Medical Intelligence &amp; Clinical Decision Architecture</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400 font-normal">Integrated Education Suite</span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">
              AI Clinical Intelligence Suite
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-4xl leading-relaxed">
              Unified clinical data science workspace: explore longitudinal disease trajectories, interrogate explainable AI (XAI) feature attributions, study evidence-based prevention guidelines, execute simulated clinical decisions under attending feedback, and identify individual learning gaps.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center">
            <span className="text-xs text-slate-400">Active Module:</span>
            <span className="text-xs font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-800 px-3 py-1.5 rounded-xl">
              {tabsConfig.find((t) => t.id === activeTab)?.label}
            </span>
          </div>
        </div>

        {/* Clean Segmented Navigation Controls */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {tabsConfig.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTab(t.id);
                    awardXP(5);
                  }}
                  className={`p-3 rounded-2xl flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950/40 ring-1 ring-cyan-400'
                      : 'bg-slate-950/70 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800/80'
                  }`}
                  title={t.description}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
                  <div className="truncate">
                    <span className="text-xs font-semibold leading-tight block truncate">{t.label}</span>
                    <span className={`text-[10px] block truncate ${isActive ? 'text-slate-800' : 'text-slate-500'}`}>
                      {t.category.split(' ')[0]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Render Active Sub-Module View */}
      <div className="transition-all duration-200">
        {activeTab === 'multidisease' && (
          <MultiDiseaseAndAnomaly
            initialLabs={transferredLabs}
            onNavigateToKnowledgeGraph={() => setActiveTab('knowledge_graph')}
            onNavigateToGuidelines={() => setActiveTab('guidelines_calc')}
          />
        )}

        {activeTab === 'longitudinal' && <LongitudinalCaseViewer />}

        {activeTab === 'ml_explain' && <MLPredictionExplainer />}

        {activeTab === 'prevention' && <PreventionAndPrecautionGuide />}

        {activeTab === 'decision_sim' && <InteractiveDecisionSimulation />}

        {activeTab === 'personalized_learn' && (
          <PersonalizedLearningEngine
            onNavigateToModule={handleNavigateToCurriculumModule}
            onNavigateToSimulator={() => setActiveTab('decision_sim')}
          />
        )}

        {activeTab === 'report_ocr' && (
          <ReportAnalyzerOCR
            onTransferToPredictor={handleOcrTransfer}
            onNavigateToMultiDisease={() => setActiveTab('multidisease')}
          />
        )}

        {activeTab === 'ultrasound_cnn' && (
          <UltrasoundCNNViewer currentLabs={transferredLabs} />
        )}

        {activeTab === 'knowledge_graph' && <KnowledgeGraphExplorer />}

        {activeTab === 'voice_assistant' && (
          <DigitalHealthVoiceAssistant onNavigateToView={onNavigateToView} />
        )}

        {activeTab === 'guidelines_calc' && <GuidelinesAndCalculators />}

        {activeTab === 'privacy_drift' && <PrivacyAndDriftHub />}
      </div>
    </div>
  );
};
