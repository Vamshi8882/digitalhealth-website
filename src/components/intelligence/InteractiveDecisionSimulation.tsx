/**
 * Digitalization in Healthcare - Interactive Clinical Decision Simulation
 *
 * Provides simulated patient scenarios where students review clinical reports,
 * interpret ML risk predictions, and execute sequential diagnostic & therapeutic decisions
 * under simulated attending physician supervision.
 */

import React, { useState } from 'react';
import {
  Stethoscope,
  Activity,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Award,
  Layers,
  FileText,
  User,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import {
  DECISION_SIMULATION_SCENARIOS,
  DecisionSimulationScenario,
  DecisionStep
} from '../../data/longitudinalAndExplainabilityData';
import { useProgress } from '../../context/ProgressContext';

export const InteractiveDecisionSimulation: React.FC = () => {
  const { awardXP } = useProgress();

  const [activeScenarioIndex, setActiveScenarioIndex] = useState<number>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [stepSubmitted, setStepSubmitted] = useState<boolean>(false);
  const [accumulatedScore, setAccumulatedScore] = useState<number>(0);
  const [historyLog, setHistoryLog] = useState<{ stepNumber: number; actionText: string; isOptimal: boolean; feedback: string }[]>([]);

  const scenario: DecisionSimulationScenario =
    DECISION_SIMULATION_SCENARIOS[activeScenarioIndex] || DECISION_SIMULATION_SCENARIOS[0];

  const currentStep: DecisionStep = scenario.steps[currentStepIndex];

  const handleOptionSelect = (optId: string) => {
    if (stepSubmitted) return;
    setSelectedOptionId(optId);
  };

  const handleStepSubmit = () => {
    if (!selectedOptionId || !currentStep) return;

    const chosenOption = currentStep.options.find((o) => o.id === selectedOptionId);
    if (!chosenOption) return;

    setStepSubmitted(true);
    setAccumulatedScore((prev) => prev + chosenOption.xpPoints);
    awardXP(chosenOption.xpPoints);

    setHistoryLog((prev) => [
      ...prev,
      {
        stepNumber: currentStep.stepNumber,
        actionText: chosenOption.action,
        isOptimal: chosenOption.isOptimal,
        feedback: chosenOption.attendingFeedback
      }
    ]);
  };

  const handleNextStep = () => {
    if (currentStepIndex < scenario.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setStepSubmitted(false);
    }
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setSelectedOptionId(null);
    setStepSubmitted(false);
    setAccumulatedScore(0);
    setHistoryLog([]);
  };

  const isCompleted = currentStepIndex === scenario.steps.length - 1 && stepSubmitted;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              <Stethoscope className="w-4 h-4" />
              <span>Simulated Attending Rounds</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400 font-normal">Supervised Clinical Decision Pathways</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Interactive Clinical Decision Simulation
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Step into the role of the primary clinical evaluator. Formulate multi-stage diagnostic workups, select evidence-backed therapeutics, and review feedback from your attending hepatologist.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Session Score</span>
              <span className="text-base font-bold font-mono text-cyan-400">{accumulatedScore} XP</span>
            </div>
            <button
              onClick={handleRestart}
              className="p-3 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded-2xl border border-slate-800 transition-colors"
              title="Restart Simulation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Case Scenario Selector Tabs */}
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Select Patient Case Scenario ({DECISION_SIMULATION_SCENARIOS.length} Available):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {DECISION_SIMULATION_SCENARIOS.map((sc, sIdx) => {
              const isSelected = activeScenarioIndex === sIdx;
              return (
                <button
                  key={sc.id}
                  onClick={() => {
                    setActiveScenarioIndex(sIdx);
                    setCurrentStepIndex(0);
                    setSelectedOptionId(null);
                    setStepSubmitted(false);
                    setHistoryLog([]);
                  }}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-500 shadow-md ring-1 ring-cyan-500/50'
                      : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="text-[10px] font-mono text-cyan-400 font-bold">Case {sIdx + 1}</div>
                  <div className={`text-xs font-bold mt-0.5 line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {sc.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Patient Case Vignette Box */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              {scenario.title}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Step {currentStepIndex + 1} of {scenario.steps.length}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
            {scenario.patientVignette}
          </p>

          {/* Quick Lab Snapshot */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400">AST</div>
              <div className="font-mono font-bold text-amber-400">{scenario.initialLabs.ast} IU/L</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400">ALT</div>
              <div className="font-mono font-bold text-cyan-400">{scenario.initialLabs.alt} IU/L</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400">De Ritis</div>
              <div className="font-mono font-bold text-white">
                {(scenario.initialLabs.ast / scenario.initialLabs.alt).toFixed(2)}x
              </div>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400">Bilirubin</div>
              <div className="font-mono font-bold text-emerald-400">{scenario.initialLabs.totalBilirubin} mg/dL</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400">Albumin</div>
              <div className="font-mono font-bold text-white">{scenario.initialLabs.albumin} g/dL</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400">Platelets</div>
              <div className="font-mono font-bold text-purple-400">{scenario.initialLabs.platelets / 1000}k/µL</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Active Decision Step */}
      {!isCompleted ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-white">
              {currentStep.stepTitle}
            </h3>
            <span className="text-[11px] text-cyan-300 font-medium">
              Progress: {Math.round(((currentStepIndex) / scenario.steps.length) * 100)}%
            </span>
          </div>

          <p className="text-xs text-slate-200 font-medium leading-relaxed">
            {currentStep.prompt}
          </p>

          {/* Options List */}
          <div className="space-y-3">
            {currentStep.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              let style = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

              if (stepSubmitted) {
                if (option.isOptimal) {
                  style = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                } else if (isSelected) {
                  style = 'bg-rose-950/40 border-rose-500 text-rose-200';
                }
              } else if (isSelected) {
                style = 'bg-cyan-950/60 border-cyan-500 text-white';
              }

              return (
                <button
                  key={option.id}
                  disabled={stepSubmitted}
                  onClick={() => handleOptionSelect(option.id)}
                  className={`w-full p-4 rounded-2xl border text-left text-xs transition-all flex items-start gap-3 cursor-pointer ${style}`}
                >
                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center shrink-0 text-xs font-mono mt-0.5">
                    {option.id.slice(-1).toUpperCase()}
                  </span>
                  <div className="space-y-1.5 flex-1">
                    <p className="leading-relaxed font-semibold">{option.action}</p>
                    {stepSubmitted && isSelected && (
                      <div className={`text-[11px] pt-2 border-t ${option.isOptimal ? 'border-emerald-700 text-emerald-300' : 'border-rose-700 text-rose-300'}`}>
                        <strong>Attending Debrief:</strong> {option.attendingFeedback}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {!stepSubmitted ? (
              <button
                disabled={!selectedOptionId}
                onClick={handleStepSubmit}
                className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <span>Commit Clinical Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleNextStep}
                className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <span>Proceed to Step {currentStepIndex + 2}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Case Completion Summary */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1 max-w-xl mx-auto">
            <h3 className="text-xl font-bold text-white">
              Clinical Decision Simulation Completed!
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              You navigated the diagnostic and therapeutic pathway for {scenario.title} under supervisory guidance. Total score earned: <strong>{accumulatedScore} XP</strong>.
            </p>
          </div>

          {/* Decision Timeline Log */}
          <div className="space-y-3 text-left max-w-2xl mx-auto">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Simulation Decision Trail:
            </span>
            {historyLog.map((log, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Step {log.stepNumber} Decision</span>
                  <span className={`text-[10px] font-semibold ${log.isOptimal ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {log.isOptimal ? 'Optimal Choice' : 'Suboptimal Alternative'}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px]">{log.actionText}</p>
                <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                  {log.feedback}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={handleRestart}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs inline-flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Case Simulation</span>
          </button>
        </div>
      )}
    </div>
  );
};
