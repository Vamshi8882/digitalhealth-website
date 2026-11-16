/**
 * Digitalization in Healthcare - Knowledge Assessment & Personalized Learning Engine
 *
 * Conducts clinical reasoning quizzes, evaluates competency profiles across 5 domains,
 * detects specific student knowledge gaps, and generates targeted learning prescriptions
 * linking directly to relevant curriculum modules and case simulators.
 */

import React, { useState } from 'react';
import {
  Brain,
  Award,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Target,
  Sparkles,
  RotateCcw,
  Info,
  CheckCircle2,
  Stethoscope
} from 'lucide-react';
import {
  INITIAL_COMPETENCIES,
  ClinicalCompetency
} from '../../data/longitudinalAndExplainabilityData';
import { useProgress } from '../../context/ProgressContext';

interface QuizQuestion {
  id: string;
  competencyId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const ASSESSMENT_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-1',
    competencyId: 'comp-biomarkers',
    question: 'A 46-year-old male presents with AST 290 IU/L and ALT 110 IU/L (De Ritis ratio = 2.64). Which biochemical mechanism explains this disproportionate elevation?',
    options: [
      'Selective renal excretion of ALT in chronic hepatitis',
      'Alcohol-induced mitochondrial membrane damage releasing mitochondrial AST, plus pyridoxal-5-phosphate deficiency suppressing ALT',
      'Increased hepatic synthesis of AST induced by fructose',
      'Canalicular obstruction releasing cytosolic transaminases'
    ],
    correctIndex: 1,
    explanation: 'Alcohol directly injures mitochondrial membranes where 80% of hepatic AST resides. Concurrently, alcoholics are deficient in pyridoxal-5-phosphate (Vitamin B6), an obligatory co-factor for ALT synthesis.'
  },
  {
    id: 'q-2',
    competencyId: 'comp-cholestasis',
    question: 'A patient with jaundice has Total Bilirubin 8.4 mg/dL and Direct Bilirubin 6.8 mg/dL (81% direct fraction) with Alkaline Phosphatase 380 IU/L. What is the primary anatomical origin?',
    options: [
      'Pre-hepatic intravascular hemolysis',
      'Gilbert syndrome with UGT1A1 promoter mutation',
      'Cholestatic (biliary excretory impairment or extrahepatic obstruction)',
      'Isolated muscle trauma / rhabdomyolysis'
    ],
    correctIndex: 2,
    explanation: 'A direct (conjugated) bilirubin fraction > 50% combined with marked Alkaline Phosphatase elevation (>3x ULN) confirms cholestasis or biliary obstruction.'
  },
  {
    id: 'q-3',
    competencyId: 'comp-xai',
    question: 'An explainable AI model flags a patient with AST 35 IU/L, ALT 32 IU/L, and Albumin 2.1 g/dL as having a 91% probability of severe liver disease. Why did the model not consider normal transaminases as reassuring?',
    options: [
      'The model suffered from algorithmic bias and random forest overfitting',
      'SHAP feature attributions detected the "burn-out" effect, recognizing that depleted functional hepatocytes in end-stage cirrhosis can no longer produce high enzyme surges',
      'The model ignored transaminases entirely',
      'Albumin is unrelated to liver function'
    ],
    correctIndex: 1,
    explanation: 'In end-stage cirrhosis, remaining viable parenchymal mass is severely depleted, causing transaminases to deceptively normalize ("burn-out"). The model correctly weights severe hypoalbuminemia as indicative of end-stage failure.'
  },
  {
    id: 'q-4',
    competencyId: 'comp-prevention',
    question: 'What is the recommended maximum 24-hour ceiling for Acetaminophen (Paracetamol) in a patient with compensated Child-Pugh A cirrhosis requiring analgesia?',
    options: [
      '0 mg (Acetaminophen is strictly contraindicated in all liver disease)',
      '2,000 mg / 24 hours (divided doses)',
      '4,000 mg / 24 hours (standard adult dose)',
      '8,000 mg / 24 hours'
    ],
    correctIndex: 1,
    explanation: 'In cirrhosis, Acetaminophen is preferred over NSAIDs (which precipitate renal failure and GI bleeding), but should be restricted to <= 2.0 g/day due to diminished hepatic glutathione reserves.'
  },
  {
    id: 'q-5',
    competencyId: 'comp-decision',
    question: 'A 50-year-old patient with MASLD has a FIB-4 index of 1.10. What is the evidence-based management according to AASLD clinical guidelines?',
    options: [
      'Immediate referral to hepatology for transjugular liver biopsy',
      'Low risk of advanced fibrosis (<1.30 cutoff); repeat non-invasive assessment in 2-3 years and continue lifestyle modification in primary care',
      'Emergency admission for variceal screening endoscopy',
      'Start high-dose immunosuppression'
    ],
    correctIndex: 1,
    explanation: 'A FIB-4 < 1.30 has a negative predictive value > 90% for excluding advanced fibrosis. Such patients can safely remain in primary care with periodic reassessment.'
  }
];

interface PersonalizedLearningEngineProps {
  onNavigateToModule?: (moduleId: number) => void;
  onNavigateToSimulator?: () => void;
}

export const PersonalizedLearningEngine: React.FC<PersonalizedLearningEngineProps> = ({
  onNavigateToModule,
  onNavigateToSimulator
}) => {
  const { awardXP } = useProgress();

  const [competencies, setCompetencies] = useState<ClinicalCompetency[]>(INITIAL_COMPETENCIES);
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [quizResponses, setQuizResponses] = useState<{ isCorrect: boolean; compId: string }[]>([]);

  const currentQuestion = ASSESSMENT_QUESTIONS[currentQuizIndex];

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return;

    setIsAnswerSubmitted(true);
    const isCorrect = selectedAnswer === currentQuestion.correctIndex;

    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
      awardXP(20);
    }

    setQuizResponses((prev) => [
      ...prev,
      { isCorrect, compId: currentQuestion.competencyId }
    ]);
  };

  const handleNextQuestion = () => {
    if (currentQuizIndex < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      // Finalize quiz & update competencies
      setIsQuizCompleted(true);
      awardXP(50);

      // Recompute competency scores based on answers
      setCompetencies((prev) =>
        prev.map((comp) => {
          const resp = quizResponses.find((r) => r.compId === comp.id);
          if (!resp) return comp;
          const newScore = resp.isCorrect ? Math.min(100, comp.scorePct + 15) : Math.max(30, comp.scorePct - 20);
          return {
            ...comp,
            scorePct: newScore,
            status: newScore >= 80 ? 'Mastered' : newScore >= 65 ? 'Competent' : 'Review Needed'
          };
        })
      );
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);
    setIsQuizCompleted(false);
    setQuizResponses([]);
  };

  // Identify knowledge gaps (competencies with Review Needed or lowest score)
  const knowledgeGaps = competencies.filter((c) => c.status === 'Review Needed');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              <Brain className="w-4 h-4" />
              <span>Cognitive Assessment &amp; Skill Diagnostics</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400 font-normal">Personalized Learning Engine</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Clinical Reasoning Assessment &amp; Knowledge Gap Analysis
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Take the 5-domain clinical diagnostic quiz. Our cognitive engine models your reasoning strengths, isolates specific biomarker misconceptions, and issues a targeted learning prescription.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Mastery Index:</span>
            <span className="text-base font-bold font-mono text-cyan-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              {Math.round(competencies.reduce((a, b) => a + b.scorePct, 0) / competencies.length)}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Diagnostic Quiz (7 cols) vs Competencies & Recommendations (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Adaptive Quiz Card (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            {!isQuizCompleted ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                      Question {currentQuizIndex + 1} of {ASSESSMENT_QUESTIONS.length}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5">
                      Clinical Competency Assessment
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    Score: {quizScore} / {ASSESSMENT_QUESTIONS.length}
                  </span>
                </div>

                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  {currentQuestion.question}
                </p>

                {/* Options */}
                <div className="space-y-2.5">
                  {currentQuestion.options.map((opt, idx) => {
                    const isSelected = selectedAnswer === idx;
                    let style = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

                    if (isAnswerSubmitted) {
                      if (idx === currentQuestion.correctIndex) {
                        style = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                      } else if (isSelected) {
                        style = 'bg-rose-950/40 border-rose-500 text-rose-200';
                      }
                    } else if (isSelected) {
                      style = 'bg-cyan-950/60 border-cyan-500 text-white';
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswerSubmitted}
                        onClick={() => setSelectedAnswer(idx)}
                        className={`w-full p-3.5 rounded-2xl border text-left text-xs transition-all flex items-start gap-3 cursor-pointer ${style}`}
                      >
                        <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center shrink-0 text-xs font-mono mt-0.5">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-relaxed">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation on submit */}
                {isAnswerSubmitted && (
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      {selectedAnswer === currentQuestion.correctIndex ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4" /> Correct Clinical Reasoning (+20 XP)
                        </span>
                      ) : (
                        <span className="text-rose-400 font-bold flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4" /> Misconception Flagged
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                )}

                {/* Submit / Next Button */}
                <div className="flex justify-end pt-2">
                  {!isAnswerSubmitted ? (
                    <button
                      disabled={selectedAnswer === null}
                      onClick={handleAnswerSubmit}
                      className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
                    >
                      <span>Submit Answer</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
                    >
                      <span>
                        {currentQuizIndex < ASSESSMENT_QUESTIONS.length - 1 ? 'Next Question' : 'View Diagnostic Results'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </>
            ) : (
              /* Quiz Finished Screen */
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Assessment Completed! Score: {quizScore} / {ASSESSMENT_QUESTIONS.length}
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Your competency radar and learning prescription have been updated below based on your clinical decisions.
                </p>
                <button
                  onClick={handleRestartQuiz}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-2 border border-slate-700 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Diagnostic Quiz</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Competency Profiles & Learning Prescription (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Competency Profiles */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                Clinical Competency Profile
              </h3>
              <span className="text-[10px] text-slate-500">5 Evaluated Domains</span>
            </div>

            <div className="space-y-3">
              {competencies.map((comp) => (
                <div key={comp.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white truncate max-w-[200px]">{comp.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        comp.status === 'Mastered' ? 'bg-emerald-500/20 text-emerald-300' :
                        comp.status === 'Competent' ? 'bg-cyan-500/20 text-cyan-300' :
                        'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {comp.scorePct}% &bull; {comp.status}
                    </span>
                  </div>

                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        comp.status === 'Mastered' ? 'bg-emerald-500' :
                        comp.status === 'Competent' ? 'bg-cyan-500' :
                        'bg-amber-500'
                      }`}
                      style={{ width: `${comp.scorePct}%` }}
                    />
                  </div>

                  <p className="text-[10px] text-slate-400 leading-tight">
                    {comp.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Targeted Learning Prescription */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                Personalized Learning Prescription
              </h3>
              <span className="text-[10px] text-amber-300 font-mono">
                {knowledgeGaps.length} Target Areas
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Based on your assessment, our cognitive tutor recommends prioritizing these exact curriculum modules:
            </p>

            <div className="space-y-2.5">
              {knowledgeGaps.map((gap) => (
                <div
                  key={gap.id}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-400 font-bold text-[10px] uppercase tracking-wider">
                      Knowledge Gap: {gap.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Module {gap.recommendedModuleId}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {gap.recommendedModuleName}
                  </h4>

                  <p className="text-[10px] text-slate-400 leading-tight">
                    Review this module to master differential diagnosis and avoid common laboratory calculation errors.
                  </p>

                  {onNavigateToModule && (
                    <button
                      onClick={() => onNavigateToModule(gap.recommendedModuleId)}
                      className="text-[11px] text-cyan-400 font-semibold hover:underline flex items-center gap-1 pt-1"
                    >
                      <span>Study Module {gap.recommendedModuleId}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
