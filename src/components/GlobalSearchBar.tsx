/**
 * Digitalization in Healthcare - Universal Clinical Global Search Bar & Command Palette
 *
 * Full-text keyword index across:
 * 1. Individual Clinical Case Scenarios & Diagnostic Simulations (Case Simulator)
 * 2. Accredited Curriculum Modules (1 to 10)
 * 3. Clinical Informatics Tools, 3D Viewers, and Screener Suites
 * 4. Dataset Biomarkers, Reference Ranges, Features & SQL Console Queries
 *
 * Provides high-contrast category badges ('Curriculum', 'Tool', 'Dataset', 'Case Scenario')
 * engineered for WCAG AAA compliance in both High-Contrast Dark and Clinical White themes.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  X,
  BookOpen,
  Stethoscope,
  Activity,
  Database,
  Sparkles,
  Layers,
  Eye,
  Cpu,
  ShieldAlert,
  Gamepad2,
  Trophy,
  ArrowRight,
  Flame,
  CheckCircle2,
  Sliders,
  FileText,
  AlertCircle,
  HelpCircle,
  Zap,
  CornerDownLeft,
  Bot
} from 'lucide-react';
import { CLINICAL_CASES, PatientCase } from './ClinicalCaseSimulator';
import { MODULES_DATA, CurriculumModule } from './LearningModules';
import { LAB_REFERENCES } from '../data/ilpdData';

export type SearchCategory = 'Case Scenario' | 'Curriculum' | 'Tool' | 'Dataset';

export interface GlobalSearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: SearchCategory;
  viewId: string;
  keywords: string[];
  // Navigation payloads
  caseId?: string;
  caseTab?: 'chart' | 'labs' | 'imaging' | 'diagnosis' | 'debrief';
  moduleId?: number;
  intelligenceTab?: string;
  dashboardTab?: 'demographics' | 'models' | 'sql';
  // Rich clinical metadata
  metaBadge?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  scoreOrReward?: string;
  labRange?: string;
  tag?: string;
}

interface GlobalSearchBarProps {
  onNavigate: (
    viewId: string,
    options?: {
      caseId?: string;
      caseTab?: 'chart' | 'labs' | 'imaging' | 'diagnosis' | 'debrief';
      moduleId?: number;
      intelligenceTab?: string;
      dashboardTab?: 'demographics' | 'models' | 'sql';
    }
  ) => void;
  className?: string;
}

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({ onNavigate, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'All' | SearchCategory>('All');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // -------------------------------------------------------------
  // Construct Comprehensive Platform Index
  // -------------------------------------------------------------
  const allSearchIndex: GlobalSearchItem[] = useMemo(() => {
    const items: GlobalSearchItem[] = [];

    // 1. Index Individual Clinical Case Scenarios
    CLINICAL_CASES.forEach((c: PatientCase) => {
      // Main Case Entry
      items.push({
        id: `case-${c.id}`,
        title: `Case: ${c.patientName} (${c.age}${c.gender === 'Male' ? 'M' : 'F'}) – ${c.chiefComplaint.slice(0, 75)}...`,
        subtitle: `Bed: ${c.bedNumber} • ${c.admissionDate} • ${c.historyOfPresentIllness.slice(0, 110)}...`,
        category: 'Case Scenario',
        viewId: 'cases',
        caseId: c.id,
        caseTab: 'chart',
        difficulty: c.difficulty,
        scoreOrReward: `+${c.xpReward} XP`,
        metaBadge: `${c.difficulty} Tier`,
        keywords: [
          c.patientName.toLowerCase(),
          c.bedNumber.toLowerCase(),
          c.difficulty.toLowerCase(),
          c.clinicalRank.toLowerCase(),
          c.chiefComplaint.toLowerCase(),
          'case',
          'patient',
          'simulation',
          'inpatient',
          'ward',
          'roleplay',
          'diagnosis',
          c.occupation.toLowerCase(),
          // include key biomarker indicators from lab panel
          `ast ${c.laboratoryPanel.ast}`,
          `alt ${c.laboratoryPanel.alt}`,
          `bilirubin ${c.laboratoryPanel.totalBilirubin}`
        ]
      });

      // Index Case Diagnostic Simulation Sub-sections
      items.push({
        id: `sim-labs-${c.id}`,
        title: `Lab Panel & De Ritis Analysis: ${c.patientName}`,
        subtitle: `AST: ${c.laboratoryPanel.ast} IU/L, ALT: ${c.laboratoryPanel.alt} IU/L (De Ritis ${(c.laboratoryPanel.ast / Math.max(1, c.laboratoryPanel.alt)).toFixed(2)}), TBIL: ${c.laboratoryPanel.totalBilirubin} mg/dL`,
        category: 'Case Scenario',
        viewId: 'cases',
        caseId: c.id,
        caseTab: 'labs',
        difficulty: c.difficulty,
        scoreOrReward: `Labs Simulation`,
        metaBadge: 'Diagnostic Labs',
        keywords: [
          'lab',
          'panel',
          'de ritis',
          'transaminases',
          'bilirubin',
          'enzymes',
          c.patientName.toLowerCase(),
          c.id
        ]
      });

      items.push({
        id: `sim-imaging-${c.id}`,
        title: `Ultrasound & Radiomics: ${c.patientName}`,
        subtitle: `${c.ultrasoundAndImaging.modality}: ${c.ultrasoundAndImaging.radiologyImpression}`,
        category: 'Case Scenario',
        viewId: 'cases',
        caseId: c.id,
        caseTab: 'imaging',
        difficulty: c.difficulty,
        scoreOrReward: `Imaging Simulation`,
        metaBadge: 'Bedside Ultrasound',
        keywords: [
          'ultrasound',
          'imaging',
          'doppler',
          'radiology',
          'cbd',
          'gallbladder',
          'ascites',
          c.patientName.toLowerCase(),
          c.id
        ]
      });

      items.push({
        id: `sim-differential-${c.id}`,
        title: `Differential Diagnosis & Orders: ${c.patientName}`,
        subtitle: `Phenotype categorization, differential diagnosis, and clinical management orders.`,
        category: 'Case Scenario',
        viewId: 'cases',
        caseId: c.id,
        caseTab: 'diagnosis',
        difficulty: c.difficulty,
        scoreOrReward: `Differential Simulation`,
        metaBadge: 'Clinical Orders',
        keywords: [
          'differential',
          'diagnosis',
          'orders',
          'phenotype',
          'management',
          c.patientName.toLowerCase(),
          c.id
        ]
      });
    });

    // 2. Index Curriculum Modules (1 to 10)
    MODULES_DATA.forEach((m: CurriculumModule) => {
      items.push({
        id: `module-${m.id}`,
        title: `Module ${m.id}: ${m.title}`,
        subtitle: `${m.category} • ${m.duration} • ${m.summary.slice(0, 110)}...`,
        category: 'Curriculum',
        viewId: 'learn',
        moduleId: m.id,
        scoreOrReward: '+100 XP',
        metaBadge: `Module ${m.id}`,
        keywords: [
          `module ${m.id}`,
          `mod ${m.id}`,
          m.title.toLowerCase(),
          m.category.toLowerCase(),
          m.summary.toLowerCase(),
          'curriculum',
          'lesson',
          'lecture',
          'study',
          'quiz'
        ]
      });
    });

    // 3. Index Platform Clinical Tools & Suites
    const tools: GlobalSearchItem[] = [
      {
        id: 'tool-case-simulator',
        title: 'Clinical Case Simulator Ward',
        subtitle: 'High-fidelity inpatient medical student roleplay environment with peer high scores and difficulty tiers.',
        category: 'Tool',
        viewId: 'cases',
        metaBadge: 'Ward Simulation',
        scoreOrReward: 'Up to 500 XP/Case',
        keywords: ['case simulator', 'roleplay', 'ward', 'inpatient', 'simulator', 'cases', 'diagnosis', 'patients']
      },
      {
        id: 'tool-ai-suite',
        title: 'AI Clinical Intelligence Suite',
        subtitle: '15 advanced capabilities: multi-disease triage, report OCR, ultrasound CNN, voice assistant, and knowledge graph.',
        category: 'Tool',
        viewId: 'intelligence',
        metaBadge: 'AI Suite (15 Tools)',
        scoreOrReward: 'Full Multi-Modal AI',
        keywords: ['ai suite', 'intelligence', 'multi-disease', 'ocr', 'cnn', 'knowledge graph', 'voice assistant', 'radiomics']
      },
      {
        id: 'tool-predictor',
        title: 'Supervised ML Risk Predictor',
        subtitle: 'Direct laboratory parameter estimation with De Ritis calculation and Shapley Explainable AI attribution.',
        category: 'Tool',
        viewId: 'predictor',
        metaBadge: 'Risk Model',
        scoreOrReward: 'XAI Attribution',
        keywords: ['predictor', 'risk predictor', 'machine learning', 'predict', 'estimation', 'shap', 'xai', 'lft']
      },
      {
        id: 'tool-anatomy-3d',
        title: '3D Hepatic Spatial Anatomy & Icterus Engine',
        subtitle: 'Procedural Couinaud segment visualization, vascular triad, exploded view, and real-time tissue bilirubin slider.',
        category: 'Tool',
        viewId: 'anatomy',
        metaBadge: 'Three.js 3D',
        scoreOrReward: 'Interactive 3D',
        keywords: ['3d', 'anatomy', 'liver model', 'couinaud', 'segments', 'icterus', 'jaundice slider', 'lobule', 'threejs']
      },
      {
        id: 'tool-dashboard',
        title: 'ILPD Dataset Explorer & SQL Console',
        subtitle: '583 patient records from Andhra Pradesh, demographic cuts, 5-fold cross validation ROC-AUC benchmarks, and in-browser SQLite.',
        category: 'Tool',
        viewId: 'dashboard',
        dashboardTab: 'demographics',
        metaBadge: 'Data Explorer',
        scoreOrReward: 'SQLite WAL Engine',
        keywords: ['dataset', 'ilpd', 'sql', 'sqlite', 'dashboard', 'demographics', 'cross-validation', 'roc-auc']
      },
      {
        id: 'tool-cv-screener',
        title: 'Computer Vision Scleral Icterus Screener',
        subtitle: 'HSV and CIE LAB b* yellow chrominance colorimetry segmentation for non-invasive jaundice detection.',
        category: 'Tool',
        viewId: 'screening',
        metaBadge: 'Computer Vision',
        scoreOrReward: 'CIE LAB b*',
        keywords: ['computer vision', 'cv', 'scleral icterus', 'eye', 'jaundice', 'hsv', 'lab b*', 'yellow pixels']
      },
      {
        id: 'tool-ml-lab',
        title: 'Interactive Machine Learning Lab',
        subtitle: 'Compare Random Forest, Logistic Regression, Decision Trees, and Gradient Boosting with live ROC-AUC curves.',
        category: 'Tool',
        viewId: 'mllab',
        metaBadge: 'Model Lab',
        scoreOrReward: 'Hyperparameter Tuning',
        keywords: ['ml lab', 'hyperparameters', 'random forest', 'logistic regression', 'roc-auc', 'decision tree', 'models']
      },
      {
        id: 'tool-ethics',
        title: 'Clinical Ethics & Universal First-Aid',
        subtitle: 'The 9 Ethical Rules of Digital Medicine, SaMD regulatory guidelines, and Emergency 112 universal triage protocols.',
        category: 'Tool',
        viewId: 'ethics',
        metaBadge: 'Ethics & Safety',
        scoreOrReward: 'Emergency 112 Protocol',
        keywords: ['ethics', 'first aid', 'emergency', '112', 'samd', 'bias', 'privacy', 'regulatory', 'resuscitation']
      },
      {
        id: 'tool-arcade',
        title: 'Play Arcade: Clinical Mini-Games',
        subtitle: 'Biomarker Dash, Rapid Triage, SQL Challenge, Quiz Bowl, and Memory Matrix with gamified rewards.',
        category: 'Tool',
        viewId: 'play',
        metaBadge: '6 Mini-Games',
        scoreOrReward: 'XP Arcade',
        keywords: ['arcade', 'games', 'triage game', 'biomarker dash', 'quiz bowl', 'play', 'gamification']
      },
      {
        id: 'tool-leaderboard',
        title: 'Global Clinical Leaderboard & Hub',
        subtitle: 'National ranking of top medical students and resident fellows across academic teaching hospitals.',
        category: 'Tool',
        viewId: 'community',
        metaBadge: 'Platform Ranking',
        scoreOrReward: 'Top 10 Clinicians',
        keywords: ['leaderboard', 'rank', 'community', 'top performers', 'fellows', 'aiims', 'cmc', 'high score']
      },
      {
        id: 'tool-hospital-cases',
        title: 'Hospital Patient Case Registry & Dynamic Clinical Analyzer',
        subtitle: 'Real-world hospital records from AIIMS, CMC, Apollo, Johns Hopkins with labs, ultrasound, and case study creator.',
        category: 'Tool',
        viewId: 'hospital_cases',
        metaBadge: 'Hospital Registry',
        scoreOrReward: '+150 XP per Case',
        keywords: ['hospital', 'hospital cases', 'registry', 'aiims', 'cmc', 'apollo', 'johns hopkins', 'clinical report', 'dynamic cases']
      },
      {
        id: 'tool-medical-library',
        title: 'Medical Library & Hepatobiliary Research Hub',
        subtitle: 'Standard medical textbooks (Sherlock, Sleisenger, Robbins, Harrison), video masterclasses with timestamps, and clinical guidelines.',
        category: 'Tool',
        viewId: 'library',
        metaBadge: 'Academic Library',
        scoreOrReward: 'Textbooks & Videos',
        keywords: ['library', 'textbooks', 'books', 'sherlock', 'sleisenger', 'robbins', 'harrison', 'guidelines', 'aasld', 'easl', 'video lectures']
      },
      {
        id: 'tool-medical-blogs',
        title: 'Medical Blogs & Clinical Discussion Forum',
        subtitle: 'Interactive discussions between medical students, professors, and specialists. Ask doubts, share clinical cases, and review literature.',
        category: 'Tool',
        viewId: 'blogs',
        metaBadge: 'Clinical Forum',
        scoreOrReward: 'Knowledge Exchange',
        keywords: ['blogs', 'forum', 'doubts', 'discussions', 'professors', 'students', 'intellectual', 'clinical experience']
      },
      {
        id: 'tool-profile',
        title: 'Clinician Dossier & Credentials',
        subtitle: 'Review earned XP, streak longevity, unlocked residency honors, and exportable JSON portfolio backup.',
        category: 'Tool',
        viewId: 'profile',
        metaBadge: 'Student Dossier',
        scoreOrReward: 'Accredited Portfolio',
        keywords: ['profile', 'dossier', 'credentials', 'xp', 'streak', 'portfolio', 'resume', 'username', 'phone', 'address']
      }
    ];
    items.push(...tools);

    // 4. Index Dataset Features & Biochemical Markers
    Object.entries(LAB_REFERENCES).forEach(([key, ref]) => {
      items.push({
        id: `dataset-ref-${key}`,
        title: `Biomarker: ${ref.name} (${ref.abbreviation})`,
        subtitle: `Ref: ${ref.minNormal} - ${ref.maxNormal} ${ref.unit} • ${ref.clinicalSignificance}`,
        category: 'Dataset',
        viewId: 'dashboard',
        dashboardTab: 'demographics',
        metaBadge: `${ref.minNormal} - ${ref.maxNormal} ${ref.unit}`,
        labRange: `${ref.minNormal} - ${ref.maxNormal} ${ref.unit}`,
        keywords: [
          ref.name.toLowerCase(),
          ref.abbreviation.toLowerCase(),
          key.toLowerCase(),
          'biomarker',
          'lab test',
          'reference range',
          'assay',
          'dataset feature',
          ref.clinicalSignificance.toLowerCase(),
          ref.hepatologyRelevance.toLowerCase()
        ]
      });
    });

    // Special Engineered Features in Dataset
    const engineeredFeatures: GlobalSearchItem[] = [
      {
        id: 'dataset-feat-deritis',
        title: 'Feature: Fernando De Ritis Ratio (AST / ALT)',
        subtitle: 'Key enzyme ratio documented in 1957. >2.0 indicates alcoholic hepatitis or advanced cirrhosis; <1.0 indicates viral/NAFLD.',
        category: 'Dataset',
        viewId: 'dashboard',
        dashboardTab: 'demographics',
        metaBadge: 'Engineered Ratio',
        keywords: ['de ritis', 'ast alt ratio', 'enzyme ratio', 'fernando de ritis', 'alcoholic hepatitis', '1957']
      },
      {
        id: 'dataset-feat-conjugation',
        title: 'Feature: Bilirubin Conjugation Fraction (DBIL / TBIL)',
        subtitle: 'Direct (conjugated) to Total Bilirubin percentage. >50% indicates cholestatic or parenchymal biliary flow impairment.',
        category: 'Dataset',
        viewId: 'dashboard',
        dashboardTab: 'demographics',
        metaBadge: 'Conjugation Ratio',
        keywords: ['conjugation fraction', 'bilirubin ratio', 'direct bilirubin', 'cholestasis', 'jaundice fraction']
      },
      {
        id: 'dataset-feat-cohort-stats',
        title: 'Dataset Feature: ILPD Andhra Pradesh Demographic Cohort',
        subtitle: '583 total records (416 liver patients / 167 controls), 75.6% male distribution, peak risk interval 46-60 years.',
        category: 'Dataset',
        viewId: 'dashboard',
        dashboardTab: 'demographics',
        metaBadge: '583 Cohort Records',
        keywords: ['cohort', 'andhra pradesh', '583 records', 'uci repository', 'demographics', 'age', 'gender']
      },
      {
        id: 'dataset-sql-console',
        title: 'Dataset Query: SQL Clinical Database Console',
        subtitle: 'Interactive queries: Gender aggregations, Severe Cholestasis (ALP > 300), High AST/ALT Hallmarks (>2.0), Hypoalbuminemia.',
        category: 'Dataset',
        viewId: 'dashboard',
        dashboardTab: 'sql',
        metaBadge: 'SQLite Queries',
        keywords: ['sql', 'sqlite', 'database query', 'select', 'where', 'group by', 'in-memory table']
      }
    ];
    items.push(...engineeredFeatures);

    return items;
  }, []);

  // -------------------------------------------------------------
  // Filtered Results Calculation
  // -------------------------------------------------------------
  const filteredResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();

    let list = allSearchIndex;

    // Apply category filter if active
    if (activeCategoryFilter !== 'All') {
      list = list.filter(item => item.category === activeCategoryFilter);
    }

    if (!trimmed) {
      // Return featured recommendations when query is empty
      return list.slice(0, 12);
    }

    const queryTokens = trimmed.split(/\s+/).filter(Boolean);

    return list
      .map(item => {
        let matchScore = 0;

        const titleLower = item.title.toLowerCase();
        const subtitleLower = item.subtitle.toLowerCase();

        // Exact full phrase in title (huge boost)
        if (titleLower.includes(trimmed)) matchScore += 100;
        if (subtitleLower.includes(trimmed)) matchScore += 40;

        // Token matches
        for (const token of queryTokens) {
          if (titleLower.includes(token)) matchScore += 30;
          if (subtitleLower.includes(token)) matchScore += 15;

          const matchedKeyword = item.keywords.some(k => k.includes(token));
          if (matchedKeyword) matchScore += 20;

          if (item.category.toLowerCase().includes(token)) matchScore += 25;
          if (item.metaBadge?.toLowerCase().includes(token)) matchScore += 20;
          if (item.difficulty?.toLowerCase().includes(token)) matchScore += 25;
        }

        return { item, matchScore };
      })
      .filter(({ matchScore }) => matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .map(({ item }) => item)
      .slice(0, 25);
  }, [allSearchIndex, query, activeCategoryFilter]);

  // Keep selection within bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults]);

  // Scroll active item into view
  useEffect(() => {
    if (!resultsContainerRef.current) return;
    const selectedEl = resultsContainerRef.current.children[selectedIndex] as HTMLElement;
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  // Global Keyboard Shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle Selection Action
  const handleSelectItem = (item: GlobalSearchItem) => {
    setIsOpen(false);
    onNavigate(item.viewId, {
      caseId: item.caseId,
      caseTab: item.caseTab,
      moduleId: item.moduleId,
      intelligenceTab: item.intelligenceTab,
      dashboardTab: item.dashboardTab
    });
  };

  // Keyboard navigation within command palette
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1 < filteredResults.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 >= 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelectItem(filteredResults[selectedIndex]);
      }
    }
  };

  // Category Badge Render Helper with High-Contrast Styling
  const renderCategoryBadge = (category: SearchCategory) => {
    switch (category) {
      case 'Case Scenario':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border transition-colors bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-700/60 shadow-xs shrink-0">
            <Stethoscope className="w-3 h-3 text-amber-700 dark:text-amber-400" />
            Case Scenario
          </span>
        );
      case 'Curriculum':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border transition-colors bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-700/60 shadow-xs shrink-0">
            <BookOpen className="w-3 h-3 text-indigo-700 dark:text-indigo-400" />
            Curriculum
          </span>
        );
      case 'Tool':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border transition-colors bg-cyan-100 text-cyan-950 border-cyan-300 dark:bg-cyan-950/80 dark:text-cyan-300 dark:border-cyan-700/60 shadow-xs shrink-0">
            <Activity className="w-3 h-3 text-cyan-700 dark:text-cyan-400" />
            Tool
          </span>
        );
      case 'Dataset':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border transition-colors bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700/60 shadow-xs shrink-0">
            <Database className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
            Dataset
          </span>
        );
    }
  };

  // Helper for Result Item Icon
  const getItemIcon = (item: GlobalSearchItem) => {
    if (item.category === 'Case Scenario') {
      return <Stethoscope className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    }
    if (item.category === 'Curriculum') {
      return <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
    }
    if (item.category === 'Dataset') {
      return <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    }
    // Tools
    if (item.id.includes('anatomy')) return <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />;
    if (item.id.includes('cv') || item.id.includes('screening')) return <Eye className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />;
    if (item.id.includes('lab') || item.id.includes('ml')) return <Cpu className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />;
    if (item.id.includes('ethics')) return <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
    if (item.id.includes('arcade')) return <Gamepad2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    if (item.id.includes('leaderboard')) return <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    return <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />;
  };

  return (
    <>
      {/* -------------------------------------------------------------
       * Header Trigger Button
       * ----------------------------------------------------------- */}
      <button
        onClick={() => setIsOpen(true)}
        className={`relative flex items-center justify-between gap-2.5 px-3 py-1.5 rounded-xl border text-xs transition-all cursor-pointer group shadow-2xs ${
          className
        } bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700 hover:text-slate-950 dark:bg-slate-900/90 dark:hover:bg-slate-850 dark:border-slate-800 dark:text-slate-300 dark:hover:text-white dark:hover:border-cyan-500/50`}
        aria-label="Open global search bar and command palette"
        title="Search clinical cases, curriculum modules, tools, and dataset features [Shortcut: Ctrl+K / Cmd+K]"
      >
        <div className="flex items-center gap-2 min-w-0">
          <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-600 dark:text-slate-400 dark:group-hover:text-cyan-400 transition-colors shrink-0" />
          <span className="truncate hidden sm:inline text-left text-[11px] font-medium text-slate-600 dark:text-slate-300">
            Search cases, modules, tools...
          </span>
          <span className="inline sm:hidden text-[11px] font-medium text-slate-600 dark:text-slate-300">
            Search...
          </span>
        </div>

        <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-mono font-bold rounded border bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800 shadow-2xs group-hover:border-cyan-500/40">
          <span className="text-[10px]">⌘</span>K
        </kbd>
      </button>

      {/* -------------------------------------------------------------
       * Command Palette Modal Dialog
       * ----------------------------------------------------------- */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="global-search-title"
          className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 sm:pt-14 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col transition-all bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 max-h-[85vh]">
            {/* Search Input Bar */}
            <div className="p-4 sm:p-4.5 border-b flex items-center gap-3 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-cyan-100 text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800">
                <Search className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <h2 id="global-search-title" className="sr-only">
                  Platform Global Search
                </h2>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Type to search clinical cases, curriculum modules, tools, biomarkers (e.g. 'alcoholic', 'APAP', 'bilirubin', 'ROC')..."
                  className="w-full bg-transparent border-0 p-0 text-sm sm:text-base font-semibold focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-white"
                />
              </div>

              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  aria-label="Clear search input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => setIsOpen(false)}
                className="px-2 py-1 rounded-lg text-[11px] font-mono font-bold border hover:bg-slate-200 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                title="Press Escape to close"
              >
                ESC
              </button>
            </div>

            {/* Category Filter Chips Bar */}
            <div className="px-4 py-2 border-b flex items-center justify-between gap-2 overflow-x-auto bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 shrink-0">
                {(['All', 'Case Scenario', 'Curriculum', 'Tool', 'Dataset'] as const).map((cat) => {
                  const isActive = activeCategoryFilter === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-cyan-500 text-slate-950 shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-950 dark:hover:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <span>{cat === 'All' ? 'All Items' : cat === 'Case Scenario' ? 'Case Scenarios' : cat}</span>
                      <span className={`text-[10px] font-mono px-1 rounded ${isActive ? 'bg-slate-900/20 text-slate-950' : 'text-slate-500 dark:text-slate-400'}`}>
                        {cat === 'All'
                          ? allSearchIndex.length
                          : allSearchIndex.filter((i) => i.category === cat).length}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 hidden sm:block shrink-0">
                {filteredResults.length} {filteredResults.length === 1 ? 'match' : 'matches'}
              </div>
            </div>

            {/* Results Scroll Container */}
            <div
              ref={resultsContainerRef}
              className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 max-h-[55vh] custom-scrollbar"
            >
              {filteredResults.length > 0 ? (
                filteredResults.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer text-left flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'bg-cyan-50/90 dark:bg-slate-950 border-cyan-500 shadow-md ring-1 ring-cyan-500/50'
                          : 'bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-950'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border mt-0.5 transition-colors ${
                            isSelected
                              ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          {getItemIcon(item)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            {renderCategoryBadge(item.category)}

                            {item.difficulty && (
                              <span
                                className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                                  item.difficulty === 'Beginner'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800'
                                    : item.difficulty === 'Intermediate'
                                    ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800'
                                    : 'bg-purple-50 text-purple-800 border-purple-300 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-800'
                                }`}
                              >
                                {item.difficulty}
                              </span>
                            )}

                            {item.scoreOrReward && (
                              <span className="text-[10px] font-mono font-semibold text-slate-600 dark:text-slate-400">
                                {item.scoreOrReward}
                              </span>
                            )}
                          </div>

                          <h3
                            className={`text-sm font-bold truncate leading-snug ${
                              isSelected
                                ? 'text-cyan-900 dark:text-white'
                                : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {item.title}
                          </h3>

                          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2 self-center pl-2">
                        <span
                          className={`hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg transition-colors ${
                            isSelected
                              ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                              : 'text-slate-500 dark:text-slate-400 group-hover:text-cyan-600'
                          }`}
                        >
                          <span>Open</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                        <ArrowRight className="w-4 h-4 sm:hidden text-cyan-600 dark:text-cyan-400" />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center space-y-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-full mx-auto flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      No matching records found
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                      No cases, curriculum modules, tools, or biomarkers match &ldquo;{query}&rdquo;. Try keywords like &ldquo;alcoholic&rdquo;, &ldquo;bilirubin&rdquo;, &ldquo;ultrasound&rdquo;, or &ldquo;APAP&rdquo;.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5">
                    {['Alcoholic Hepatitis', 'Acetaminophen Overdose', 'Total Bilirubin', 'De Ritis Ratio', 'Module 4', 'Ultrasound CNN'].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setQuery(suggestion)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-cyan-700 dark:text-cyan-300 hover:border-cyan-500 cursor-pointer"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Navigation Bar */}
            <div className="px-4 py-2.5 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-bold text-[10px]">
                    ↑
                  </kbd>
                  <kbd className="px-1.5 py-0.5 rounded border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-bold text-[10px]">
                    ↓
                  </kbd>{' '}
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-bold text-[10px]">
                    ↵
                  </kbd>{' '}
                  Select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-bold text-[10px]">
                    ESC
                  </kbd>{' '}
                  Close
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Indexed: 8 Clinical Cases • 10 Modules • 11 Tools • 14 Biomarkers</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
