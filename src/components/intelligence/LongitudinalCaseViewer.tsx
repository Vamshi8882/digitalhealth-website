/**
 * Digitalization in Healthcare - Longitudinal Patient Case Learning
 *
 * Allows students to study long-term patient records across months and years,
 * observe changing laboratory values (AST, ALT, Bilirubin, Platelets, FIB-4),
 * explore disease progression milestones, test clinical reasoning at progression checkpoints,
 * and add new follow-up visits or custom patient cases to the registry.
 */

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ChevronRight,
  Layers,
  Sparkles,
  Info,
  RotateCcw,
  Award,
  Plus,
  X,
  UserPlus,
  PlusCircle
} from 'lucide-react';
import { LONGITUDINAL_COHORTS, LongitudinalCohort, LongitudinalVisit } from '../../data/longitudinalAndExplainabilityData';
import { useProgress } from '../../context/ProgressContext';

export const LongitudinalCaseViewer: React.FC = () => {
  const { awardXP } = useProgress();

  // Registry of patient cohorts (with ability to add new cohorts and visits)
  const [cohorts, setCohorts] = useState<LongitudinalCohort[]>(LONGITUDINAL_COHORTS);
  const [selectedCohortId, setSelectedCohortId] = useState<string>(LONGITUDINAL_COHORTS[0].id);
  const [selectedVisitIndex, setSelectedVisitIndex] = useState<number>(0);
  const [activeMetric, setActiveMetric] = useState<'alt_ast' | 'platelets' | 'fib4' | 'bilirubin'>('alt_ast');

  // Checkpoint question state
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [completedCheckpoints, setCompletedCheckpoints] = useState<Record<string, boolean>>({});

  // Modals for adding visits or cohorts
  const [isAddVisitOpen, setIsAddVisitOpen] = useState<boolean>(false);
  const [isAddCohortOpen, setIsAddCohortOpen] = useState<boolean>(false);

  // New Visit form state
  const [newVisitForm, setNewVisitForm] = useState({
    month: 72,
    dateLabel: 'Month 72 (Follow-up)',
    stage: 'Stage: Extended Surveillance',
    stageSeverity: 'moderate' as 'normal' | 'mild' | 'moderate' | 'advanced' | 'decompensated',
    clinicalNote: 'Routine hepatology follow-up evaluation. Compliant with prescribed lifestyle modifications.',
    event: 'Repeat laboratory evaluation & non-invasive elastography monitoring.',
    imagingSummary: 'Ultrasound: Stable coarsened architecture, no new focal lesions.',
    ast: 52,
    alt: 58,
    totalBilirubin: 1.3,
    directBilirubin: 0.5,
    alkphos: 125,
    albumin: 3.9,
    totalProteins: 6.9,
    platelets: 185,
    inr: 1.10,
    bmi: 31.0
  });

  // New Cohort form state
  const [newCohortForm, setNewCohortForm] = useState({
    patientName: 'Kavita Rao (Age 39)',
    age: 39,
    gender: 'Female' as 'Male' | 'Female',
    etiology: 'Autoimmune Hepatitis (AIH) / Overlap Syndrome',
    initialPresentation: 'Fatigue, joint pains, and marked elevation of transaminases with elevated IgG levels.',
    description: 'Longitudinal follow-up of autoimmune hepatitis initiating corticosteroid induction and azathioprine maintenance.',
    summaryPearl: 'Watch for the dramatic transaminase response upon corticosteroid initiation, followed by careful monitoring of steroid-sparing immunosuppression.'
  });

  const currentCohort: LongitudinalCohort =
    cohorts.find((c) => c.id === selectedCohortId) || cohorts[0];

  const currentVisit: LongitudinalVisit = currentCohort.visits[selectedVisitIndex] || currentCohort.visits[0];

  const handleCohortChange = (cohortId: string) => {
    setSelectedCohortId(cohortId);
    setSelectedVisitIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
  };

  const handleVisitSelect = (index: number) => {
    setSelectedVisitIndex(index);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null || !currentVisit.checkpointQuestion) return;
    setIsAnswerSubmitted(true);
    const isCorrect = selectedAnswer === currentVisit.checkpointQuestion.correctIndex;
    if (isCorrect) {
      awardXP(25);
      setCompletedCheckpoints((prev) => ({
        ...prev,
        [`${currentCohort.id}-${currentVisit.visitId}`]: true
      }));
    }
  };

  // Add a new visit to the active cohort
  const handleSaveVisit = (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-calculate FIB-4: (Age * AST) / (Platelets * sqrt(ALT))
    const calcFib4 = Number(
      (
        (currentCohort.age * newVisitForm.ast) /
        (Math.max(1, newVisitForm.platelets) * Math.sqrt(Math.max(1, newVisitForm.alt)))
      ).toFixed(2)
    );

    const newVisitObj: LongitudinalVisit = {
      visitId: `v-${Date.now()}`,
      month: Number(newVisitForm.month),
      dateLabel: newVisitForm.dateLabel || `Month ${newVisitForm.month}`,
      stage: newVisitForm.stage,
      stageSeverity: newVisitForm.stageSeverity,
      clinicalNote: newVisitForm.clinicalNote,
      event: newVisitForm.event,
      imagingSummary: newVisitForm.imagingSummary,
      labs: {
        totalBilirubin: Number(newVisitForm.totalBilirubin),
        directBilirubin: Number(newVisitForm.directBilirubin),
        ast: Number(newVisitForm.ast),
        alt: Number(newVisitForm.alt),
        alkphos: Number(newVisitForm.alkphos),
        totalProteins: Number(newVisitForm.totalProteins),
        albumin: Number(newVisitForm.albumin),
        platelets: Number(newVisitForm.platelets),
        inr: Number(newVisitForm.inr),
        bmi: Number(newVisitForm.bmi),
        fib4: calcFib4
      }
    };

    setCohorts((prev) =>
      prev.map((c) => {
        if (c.id === currentCohort.id) {
          const updatedVisits = [...c.visits, newVisitObj].sort((a, b) => a.month - b.month);
          return { ...c, visits: updatedVisits };
        }
        return c;
      })
    );

    setIsAddVisitOpen(false);
    awardXP(30);

    // Auto-navigate to the new visit
    setTimeout(() => {
      setSelectedVisitIndex(currentCohort.visits.length);
    }, 50);
  };

  // Add a brand new patient cohort
  const handleSaveCohort = (e: React.FormEvent) => {
    e.preventDefault();

    const newCohortId = `cohort-${Date.now()}`;
    const baselineVisit: LongitudinalVisit = {
      visitId: `v0-${Date.now()}`,
      month: 0,
      dateLabel: 'Month 0 (Initial Presentation)',
      stage: 'Baseline Clinical Intake',
      stageSeverity: 'moderate',
      clinicalNote: newCohortForm.initialPresentation,
      event: 'Initial diagnostic assessment and formulation of management plan.',
      labs: {
        totalBilirubin: 1.5,
        directBilirubin: 0.6,
        ast: 88,
        alt: 112,
        alkphos: 140,
        totalProteins: 7.2,
        albumin: 3.8,
        platelets: 220,
        inr: 1.10,
        bmi: 27.5,
        fib4: 1.84
      }
    };

    const createdCohort: LongitudinalCohort = {
      id: newCohortId,
      patientName: newCohortForm.patientName,
      age: Number(newCohortForm.age),
      gender: newCohortForm.gender,
      etiology: newCohortForm.etiology,
      initialPresentation: newCohortForm.initialPresentation,
      description: newCohortForm.description,
      summaryPearl: newCohortForm.summaryPearl,
      visits: [baselineVisit]
    };

    setCohorts((prev) => [...prev, createdCohort]);
    setSelectedCohortId(newCohortId);
    setSelectedVisitIndex(0);
    setIsAddCohortOpen(false);
    awardXP(50);
  };

  // Generate SVG points for the multi-metric longitudinal chart
  const chartWidth = 560;
  const chartHeight = 180;
  const paddingX = 40;
  const paddingY = 25;
  const visitsCount = currentCohort.visits.length;

  const getCoordinates = (index: number, value: number, minVal: number, maxVal: number) => {
    const x = paddingX + (index / Math.max(1, visitsCount - 1)) * (chartWidth - 2 * paddingX);
    const range = maxVal - minVal || 1;
    const y = chartHeight - paddingY - ((value - minVal) / range) * (chartHeight - 2 * paddingY);
    return { x, y };
  };

  // Metric calculation ranges
  let metricSeries: { label: string; color: string; points: { x: number; y: number; val: number; month: number }[] }[] = [];
  if (activeMetric === 'alt_ast') {
    const allVals = currentCohort.visits.flatMap((v) => [v.labs.alt, v.labs.ast]);
    const maxVal = Math.max(...allVals, 150);
    const minVal = 0;
    const altPoints = currentCohort.visits.map((v, i) => {
      const { x, y } = getCoordinates(i, v.labs.alt, minVal, maxVal);
      return { x, y, val: v.labs.alt, month: v.month };
    });
    const astPoints = currentCohort.visits.map((v, i) => {
      const { x, y } = getCoordinates(i, v.labs.ast, minVal, maxVal);
      return { x, y, val: v.labs.ast, month: v.month };
    });
    metricSeries = [
      { label: 'ALT (SGPT) [IU/L]', color: '#06b6d4', points: altPoints },
      { label: 'AST (SGOT) [IU/L]', color: '#f59e0b', points: astPoints }
    ];
  } else if (activeMetric === 'platelets') {
    const allVals = currentCohort.visits.map((v) => v.labs.platelets);
    const maxVal = 350;
    const minVal = 50;
    const points = currentCohort.visits.map((v, i) => {
      const { x, y } = getCoordinates(i, v.labs.platelets, minVal, maxVal);
      return { x, y, val: v.labs.platelets, month: v.month };
    });
    metricSeries = [{ label: 'Platelets [x10³/µL]', color: '#a855f7', points }];
  } else if (activeMetric === 'fib4') {
    const allVals = currentCohort.visits.map((v) => v.labs.fib4);
    const maxVal = Math.max(...allVals, 4.0);
    const minVal = 0;
    const points = currentCohort.visits.map((v, i) => {
      const { x, y } = getCoordinates(i, v.labs.fib4, minVal, maxVal);
      return { x, y, val: v.labs.fib4, month: v.month };
    });
    metricSeries = [{ label: 'FIB-4 Fibrosis Score', color: '#ef4444', points }];
  } else if (activeMetric === 'bilirubin') {
    const allVals = currentCohort.visits.map((v) => v.labs.totalBilirubin);
    const maxVal = Math.max(...allVals, 5.0);
    const minVal = 0;
    const points = currentCohort.visits.map((v, i) => {
      const { x, y } = getCoordinates(i, v.labs.totalBilirubin, minVal, maxVal);
      return { x, y, val: v.labs.totalBilirubin, month: v.month };
    });
    metricSeries = [{ label: 'Total Bilirubin [mg/dL]', color: '#eab308', points }];
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              <Calendar className="w-4 h-4" />
              <span>Longitudinal Clinical Case Registry</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400 font-normal">Disease Evolution Over Time</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Multi-Year Patient Trajectories &amp; Lab Biomarker Dynamics
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Experience authentic long-term patient records. Trace how inflammatory steatohepatitis transitions into bridging fibrosis, examine transaminase &quot;burn-out&quot; in cirrhosis, and add new follow-up encounters or custom cohorts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAddVisitOpen(true)}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Encounter</span>
            </button>

            <button
              onClick={() => setIsAddCohortOpen(true)}
              className="bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-cyan-800/60 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Patient</span>
            </button>
          </div>
        </div>

        {/* Cohort Selector Tabs */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400 mr-1">Registry Cohorts:</span>
            {cohorts.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCohortChange(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCohortId === c.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-950/70 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {c.patientName.split(' ')[0]} ({c.visits.length} Visits)
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400">
            <span className="text-slate-200 font-bold">{currentCohort.patientName}</span> &bull; {currentCohort.etiology}
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Chart + Timeline + Encounter Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Timeline & Graph (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Longitudinal Chart Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  Longitudinal Biomarker Trajectory
                </h3>
                <p className="text-[11px] text-slate-400">
                  Click on timeline nodes below to examine patient status at each follow-up.
                </p>
              </div>

              {/* Metric Selector Buttons */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
                <button
                  onClick={() => setActiveMetric('alt_ast')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    activeMetric === 'alt_ast'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ALT / AST
                </button>
                <button
                  onClick={() => setActiveMetric('platelets')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    activeMetric === 'platelets'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Platelets
                </button>
                <button
                  onClick={() => setActiveMetric('fib4')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    activeMetric === 'fib4'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  FIB-4
                </button>
                <button
                  onClick={() => setActiveMetric('bilirubin')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    activeMetric === 'bilirubin'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Bilirubin
                </button>
              </div>
            </div>

            {/* SVG Interactive Multi-Line Graph */}
            <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800/80 relative overflow-hidden">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44">
                {/* Horizontal grid lines */}
                <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="#1e293b" strokeDasharray="3 3" />
                <line x1={paddingX} y1={chartHeight / 2} x2={chartWidth - paddingX} y2={chartHeight / 2} stroke="#1e293b" strokeDasharray="3 3" />
                <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="#334155" />

                {/* Draw Lines */}
                {metricSeries.map((series, sIdx) => {
                  const pathData = series.points
                    .map((pt, pIdx) => `${pIdx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`)
                    .join(' ');

                  return (
                    <g key={sIdx}>
                      <path
                        d={pathData}
                        fill="none"
                        stroke={series.color}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Points */}
                      {series.points.map((pt, pIdx) => {
                        const isSelected = pIdx === selectedVisitIndex;
                        return (
                          <g key={pIdx} className="cursor-pointer" onClick={() => handleVisitSelect(pIdx)}>
                            {isSelected && (
                              <circle cx={pt.x} cy={pt.y} r="8" fill={series.color} opacity="0.3" />
                            )}
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r={isSelected ? 5 : 3.5}
                              fill={isSelected ? '#ffffff' : series.color}
                              stroke={series.color}
                              strokeWidth="2"
                            />
                            <text
                              x={pt.x}
                              y={pt.y - 9}
                              textAnchor="middle"
                              fill={series.color}
                              fontSize="10"
                              fontWeight="bold"
                              fontFamily="monospace"
                            >
                              {pt.val}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  );
                })}

                {/* X Axis Time Labels */}
                {currentCohort.visits.map((v, i) => {
                  const x = paddingX + (i / Math.max(1, visitsCount - 1)) * (chartWidth - 2 * paddingX);
                  const isSelected = i === selectedVisitIndex;
                  return (
                    <text
                      key={i}
                      x={x}
                      y={chartHeight - 8}
                      textAnchor="middle"
                      fill={isSelected ? '#38bdf8' : '#64748b'}
                      fontSize="9"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                    >
                      Mo {v.month}
                    </text>
                  );
                })}
              </svg>

              {/* Legend */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                <div className="flex items-center gap-4">
                  {metricSeries.map((s, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-slate-300 font-medium">{s.label}</span>
                    </div>
                  ))}
                </div>
                <span className="text-[10px] text-slate-500">Click any dot to load clinical encounter</span>
              </div>
            </div>

            {/* Timeline Stepper */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Clinical Visit Timeline ({currentCohort.visits.length} checkpoints):
                </span>
                <button
                  onClick={() => setIsAddVisitOpen(true)}
                  className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Encounter</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {currentCohort.visits.map((v, idx) => {
                  const isSelected = idx === selectedVisitIndex;
                  return (
                    <button
                      key={v.visitId}
                      onClick={() => handleVisitSelect(idx)}
                      className={`p-2.5 rounded-2xl text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-950/60 border-cyan-500 shadow-md ring-1 ring-cyan-500/50'
                          : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className={isSelected ? 'text-cyan-400 font-bold' : 'text-slate-500'}>
                          M{v.month}
                        </span>
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            v.stageSeverity === 'decompensated' ? 'bg-rose-500' :
                            v.stageSeverity === 'advanced' ? 'bg-amber-500' :
                            v.stageSeverity === 'moderate' ? 'bg-cyan-400' : 'bg-emerald-400'
                          }`}
                        />
                      </div>
                      <div className={`text-xs font-bold mt-1 line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {v.dateLabel}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {v.stage.split(':')[1] || v.stage}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Attending Teaching Pearl */}
          <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-900/60 rounded-3xl p-5 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                <Info className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Attending Clinical Pearl &bull; Longitudinal Pattern Recognition
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentCohort.summaryPearl}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Active Visit Lab Record & Checkpoint Question (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Visit Detailed Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                  Active Clinical Record &bull; {currentVisit.dateLabel}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {currentVisit.stage}
                </h3>
              </div>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  currentVisit.stageSeverity === 'decompensated' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                  currentVisit.stageSeverity === 'advanced' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                  currentVisit.stageSeverity === 'moderate' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {currentVisit.stageSeverity.toUpperCase()}
              </span>
            </div>

            {/* Clinical Encounter Note */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5 text-[11px]">
                <Activity className="w-3.5 h-3.5 text-cyan-400" /> Subjective &amp; Physical Exam Note:
              </span>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                {currentVisit.clinicalNote}
              </p>
              {currentVisit.event && (
                <div className="mt-2 pt-2 border-t border-slate-800/80 text-cyan-300 text-[11px] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                  <span><strong>Milestone:</strong> {currentVisit.event}</span>
                </div>
              )}
            </div>

            {/* Lab Values Grid */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Laboratory Biomarker Assay (Visit M{currentVisit.month}):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="text-[10px] text-slate-400">ALT (SGPT)</div>
                  <div className={`text-sm font-bold font-mono ${currentVisit.labs.alt > 45 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {currentVisit.labs.alt} IU/L
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="text-[10px] text-slate-400">AST (SGOT)</div>
                  <div className={`text-sm font-bold font-mono ${currentVisit.labs.ast > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {currentVisit.labs.ast} IU/L
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="text-[10px] text-slate-400">De Ritis Ratio</div>
                  <div className="text-sm font-bold font-mono text-cyan-400">
                    {(currentVisit.labs.ast / Math.max(1, currentVisit.labs.alt)).toFixed(2)}x
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="text-[10px] text-slate-400">Total Bilirubin</div>
                  <div className={`text-sm font-bold font-mono ${currentVisit.labs.totalBilirubin > 1.2 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {currentVisit.labs.totalBilirubin} mg/dL
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="text-[10px] text-slate-400">Serum Albumin</div>
                  <div className={`text-sm font-bold font-mono ${currentVisit.labs.albumin < 3.5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {currentVisit.labs.albumin} g/dL
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="text-[10px] text-slate-400">Platelet Count</div>
                  <div className={`text-sm font-bold font-mono ${currentVisit.labs.platelets < 150 ? 'text-rose-400' : 'text-purple-400'}`}>
                    {currentVisit.labs.platelets} k/µL
                  </div>
                </div>
              </div>

              {/* Calculated FIB-4 Score */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">Calculated FIB-4 Index:</span>
                  <div className="text-xs font-bold text-white">
                    {currentVisit.labs.fib4 < 1.30 ? 'Low Fibrosis Risk (<1.30)' :
                     currentVisit.labs.fib4 < 2.67 ? 'Indeterminate Risk (1.30-2.67)' :
                     'High Advanced Fibrosis Risk (>2.67)'}
                  </div>
                </div>
                <span className={`text-lg font-bold font-mono ${currentVisit.labs.fib4 >= 2.67 ? 'text-rose-400' : currentVisit.labs.fib4 >= 1.30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {currentVisit.labs.fib4.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Interactive Progression Checkpoint Quiz */}
            {currentVisit.checkpointQuestion && (
              <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4" /> Progression Reasoning Checkpoint
                  </span>
                  <span className="text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    +25 XP
                  </span>
                </div>

                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  {currentVisit.checkpointQuestion.question}
                </p>

                <div className="space-y-2">
                  {currentVisit.checkpointQuestion.options.map((opt, oIdx) => {
                    const isSelected = selectedAnswer === oIdx;
                    let style = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

                    if (isAnswerSubmitted) {
                      if (oIdx === currentVisit.checkpointQuestion?.correctIndex) {
                        style = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                      } else if (isSelected) {
                        style = 'bg-rose-950/40 border-rose-500 text-rose-200';
                      }
                    } else if (isSelected) {
                      style = 'bg-cyan-950/60 border-cyan-500 text-white';
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={isAnswerSubmitted}
                        onClick={() => setSelectedAnswer(oIdx)}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 cursor-pointer ${style}`}
                      >
                        <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center shrink-0 text-[10px] font-mono mt-0.5">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="leading-snug">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {!isAnswerSubmitted ? (
                  <button
                    disabled={selectedAnswer === null}
                    onClick={handleAnswerSubmit}
                    className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    <span>Submit Clinical Reasoning</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center gap-2">
                      {selectedAnswer === currentVisit.checkpointQuestion.correctIndex ? (
                        <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4" /> Correct Answer (+25 XP Awarded)
                        </div>
                      ) : (
                        <div className="text-rose-400 font-bold flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4" /> Review Clinical Rationale
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {currentVisit.checkpointQuestion.rationale}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: ADD FOLLOW-UP VISIT */}
      {isAddVisitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-cyan-400" />
                  Add Follow-Up Clinical Encounter
                </h3>
                <p className="text-xs text-slate-400">
                  Record new visit data for {currentCohort.patientName}
                </p>
              </div>
              <button
                onClick={() => setIsAddVisitOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVisit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Follow-Up Month (e.g. 72)</label>
                  <input
                    type="number"
                    value={newVisitForm.month}
                    onChange={(e) => setNewVisitForm({ ...newVisitForm, month: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Stage Severity</label>
                  <select
                    value={newVisitForm.stageSeverity}
                    onChange={(e) => setNewVisitForm({ ...newVisitForm, stageSeverity: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="normal">Normal / Remission</option>
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="advanced">Advanced (Bridging/F4)</option>
                    <option value="decompensated">Decompensated</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Stage Classification Title</label>
                <input
                  type="text"
                  value={newVisitForm.stage}
                  onChange={(e) => setNewVisitForm({ ...newVisitForm, stage: e.target.value })}
                  placeholder="e.g. Stage 4: Extended Antiviral Surveillance"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Clinical Encounter &amp; Exam Notes</label>
                <textarea
                  value={newVisitForm.clinicalNote}
                  onChange={(e) => setNewVisitForm({ ...newVisitForm, clinicalNote: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              {/* Lab Markers Grid */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Encounter Biomarkers:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-400 text-[10px]">ALT (SGPT) [IU/L]</label>
                    <input
                      type="number"
                      value={newVisitForm.alt}
                      onChange={(e) => setNewVisitForm({ ...newVisitForm, alt: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px]">AST (SGOT) [IU/L]</label>
                    <input
                      type="number"
                      value={newVisitForm.ast}
                      onChange={(e) => setNewVisitForm({ ...newVisitForm, ast: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px]">Total Bilirubin [mg/dL]</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newVisitForm.totalBilirubin}
                      onChange={(e) => setNewVisitForm({ ...newVisitForm, totalBilirubin: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px]">Platelets [k/µL]</label>
                    <input
                      type="number"
                      value={newVisitForm.platelets}
                      onChange={(e) => setNewVisitForm({ ...newVisitForm, platelets: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px]">Albumin [g/dL]</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newVisitForm.albumin}
                      onChange={(e) => setNewVisitForm({ ...newVisitForm, albumin: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px]">Alkaline Phosphatase</label>
                    <input
                      type="number"
                      value={newVisitForm.alkphos}
                      onChange={(e) => setNewVisitForm({ ...newVisitForm, alkphos: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddVisitOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Commit Visit to Trajectory (+30 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW PATIENT CASE */}
      {isAddCohortOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-cyan-400" />
                  Add Custom Patient Cohort to Registry
                </h3>
                <p className="text-xs text-slate-400">
                  Initialize a new longitudinal patient profile for educational tracking
                </p>
              </div>
              <button
                onClick={() => setIsAddCohortOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCohort} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-300 mb-1 font-medium">Patient Identifier / Name</label>
                  <input
                    type="text"
                    value={newCohortForm.patientName}
                    onChange={(e) => setNewCohortForm({ ...newCohortForm, patientName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Age</label>
                  <input
                    type="number"
                    value={newCohortForm.age}
                    onChange={(e) => setNewCohortForm({ ...newCohortForm, age: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Etiology / Primary Diagnosis</label>
                <input
                  type="text"
                  value={newCohortForm.etiology}
                  onChange={(e) => setNewCohortForm({ ...newCohortForm, etiology: e.target.value })}
                  placeholder="e.g. Wilson Disease or Autoimmune Hepatitis"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Initial Presentation Vignette</label>
                <textarea
                  value={newCohortForm.initialPresentation}
                  onChange={(e) => setNewCohortForm({ ...newCohortForm, initialPresentation: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Educational Teaching Pearl</label>
                <textarea
                  value={newCohortForm.summaryPearl}
                  onChange={(e) => setNewCohortForm({ ...newCohortForm, summaryPearl: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddCohortOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Create Registry Cohort (+50 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
