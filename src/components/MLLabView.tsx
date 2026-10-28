import React, { useState } from 'react';
import { runMLLabExperiment, MLLabExperimentResult } from '../ml/engine';
import { Terminal, Cpu, Award, Zap, CheckCircle, HelpCircle, Sparkles, AlertCircle, Play } from 'lucide-react';

interface HallOfFameEntry {
  studentName: string;
  experimentPrompt: string;
  model: string;
  cvRocAuc: number;
  accuracy: number;
  date: string;
}

export const MLLabView: React.FC = () => {
  const [promptInput, setPromptInput] = useState<string>(
    'Train a Random Forest with depth 4 and 35 trees using bilirubin and enzymes'
  );
  const [isTraining, setIsTraining] = useState(false);
  const [currentExperiment, setCurrentExperiment] = useState<MLLabExperimentResult | null>(null);

  // Hall of Fame leaderboard with realistic medical student experiments
  const [hallOfFame, setHallOfFame] = useState<HallOfFameEntry[]>([
    {
      studentName: 'Dr. Aarav Patel (AIIMS Resident)',
      experimentPrompt: 'Random forest depth 5 with 45 estimators using bilirubin, enzymes and proteins',
      model: 'Random Forest',
      cvRocAuc: 0.782,
      accuracy: 0.755,
      date: 'Today, 08:30'
    },
    {
      studentName: 'Priya Sharma (Medical Data Fellow)',
      experimentPrompt: 'Logistic regression with l2 regularization on all engineered features',
      model: 'Logistic Regression',
      cvRocAuc: 0.768,
      accuracy: 0.741,
      date: 'Yesterday, 14:15'
    },
    {
      studentName: 'Kavita Nair (3rd Year MBBS)',
      experimentPrompt: 'Random forest depth 4 with 30 trees using De Ritis ratio and direct bilirubin',
      model: 'Random Forest',
      cvRocAuc: 0.761,
      accuracy: 0.738,
      date: 'Oct 26, 11:20'
    },
    {
      studentName: 'Rohan Deshmukh (Biomedical Intern)',
      experimentPrompt: 'Decision tree with depth 3 and alkaline phosphatase',
      model: 'Decision Tree',
      cvRocAuc: 0.695,
      accuracy: 0.682,
      date: 'Oct 25, 17:40'
    }
  ]);

  const samplePrompts = [
    'Train Random Forest with depth 4 and 40 estimators using bilirubin and enzymes',
    'Logistic Regression with bilirubin and alkaline phosphatase',
    'Decision Tree with depth 3 on transaminases and albumin',
    'K-Nearest Neighbors with k=7 using all clinical markers',
    'Random Forest depth 5 with 50 trees using De Ritis ratio and proteins'
  ];

  const handleTrain = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptInput.trim()) return;

    setIsTraining(true);
    setTimeout(() => {
      const res = runMLLabExperiment(promptInput);
      setCurrentExperiment(res);
      setIsTraining(false);

      // Add to hall of fame if worthy
      if (res.cvRocAuc >= 0.72) {
        setHallOfFame(prev => [
          {
            studentName: 'Current Student (You)',
            experimentPrompt: promptInput,
            model: res.modelName,
            cvRocAuc: res.cvRocAuc,
            accuracy: res.accuracy,
            date: 'Just now'
          },
          ...prev
        ].sort((a, b) => b.cvRocAuc - a.cvRocAuc).slice(0, 8));
      }
    }, 450);
  };

  return (
    <div className="w-full space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            Medical Machine Learning Laboratory &amp; NLP Console
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Specify clinical model experiments in natural plain English. The underlying NLP token-parser extracts architecture choices, clamps hyperparameters within safe runtime bounds, and executes 5-fold cross-validation in real-time.
          </p>
        </div>

        <div className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center gap-2 shrink-0">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Hyperparameter Safety Clamps: Depth &le; 5, Trees &le; 50</span>
        </div>
      </div>

      {/* Experiment Input Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Quick Suggestion Prompts:</span>
          {samplePrompts.map((sp, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPromptInput(sp);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[11px] transition-colors"
            >
              {sp}
            </button>
          ))}
        </div>

        <form onSubmit={handleTrain} className="relative">
          <div className="relative">
            <Terminal className="absolute top-3.5 left-3.5 w-4 h-4 text-cyan-400" />
            <input
              type="text"
              value={promptInput}
              onChange={e => setPromptInput(e.target.value)}
              placeholder="e.g., Train a random forest with depth 4 and 30 estimators using bilirubin and enzymes"
              className="w-full bg-slate-950 font-mono text-xs text-white pl-10 pr-32 py-3.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 shadow-inner"
            />
            <button
              type="submit"
              disabled={isTraining}
              className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-4 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isTraining ? 'Training...' : 'Run Experiment'}
            </button>
          </div>
        </form>
      </div>

      {/* Experiment Results Grid */}
      {currentExperiment && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Metrics & Parameters (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-semibold uppercase text-cyan-400 font-mono">Custom Run Output</span>
                <h3 className="text-base font-bold text-white">{currentExperiment.modelName}</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                Fit in {currentExperiment.trainingTimeMs} ms
              </span>
            </div>

            {/* Clamped Parsed Parameters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Max Depth</span>
                <span className="text-sm font-bold text-white font-mono">{currentExperiment.parameters.maxDepth}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Estimators</span>
                <span className="text-sm font-bold text-white font-mono">{currentExperiment.parameters.nEstimators}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">5-Fold ROC-AUC</span>
                <span className="text-sm font-bold text-amber-400 font-mono">{currentExperiment.cvRocAuc.toFixed(3)}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Test Recall</span>
                <span className="text-sm font-bold text-cyan-400 font-mono">{(currentExperiment.recall * 100).toFixed(1)}%</span>
              </div>
            </div>

            {/* Selected Features */}
            <div>
              <span className="text-xs text-slate-400 font-medium block mb-1.5">Parsed Active Biomarker Features:</span>
              <div className="flex flex-wrap gap-1.5">
                {currentExperiment.selectedFeatures.map((feat, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-800/60"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            </div>

            {/* Diagnostic Clinical Lesson */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Diagnostic Pedagogical Feedback
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentExperiment.diagnosticLesson}
              </p>
            </div>
          </div>

          {/* Confusion Matrix 2x2 Grid (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Test Confusion Matrix (117 records)</span>
              <span className="text-xs text-slate-400">Class 1: Patient / Class 2: Control</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              {/* True Positive */}
              <div className="bg-emerald-950/40 border border-emerald-600/50 p-3 rounded-xl">
                <div className="text-[10px] uppercase tracking-wider font-bold text-emerald-400">True Positive (TP)</div>
                <div className="text-2xl font-bold font-mono text-emerald-200 mt-1">
                  {currentExperiment.confusionMatrix.tp}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Correctly caught liver patients</div>
              </div>

              {/* False Positive */}
              <div className="bg-amber-950/40 border border-amber-600/50 p-3 rounded-xl">
                <div className="text-[10px] uppercase tracking-wider font-bold text-amber-400">False Positive (FP)</div>
                <div className="text-2xl font-bold font-mono text-amber-200 mt-1">
                  {currentExperiment.confusionMatrix.fp}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Healthy flagged as disease</div>
              </div>

              {/* False Negative */}
              <div className="bg-rose-950/40 border border-rose-600/50 p-3 rounded-xl">
                <div className="text-[10px] uppercase tracking-wider font-bold text-rose-400">False Negative (FN)</div>
                <div className="text-2xl font-bold font-mono text-rose-200 mt-1">
                  {currentExperiment.confusionMatrix.fn}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Critical missed diagnoses</div>
              </div>

              {/* True Negative */}
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
                <div className="text-[10px] uppercase tracking-wider font-bold text-cyan-400">True Negative (TN)</div>
                <div className="text-2xl font-bold font-mono text-cyan-200 mt-1">
                  {currentExperiment.confusionMatrix.tn}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Correctly cleared healthy controls</div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 leading-snug pt-1">
              Note that in clinical epidemiology, maximizing Sensitivity (minimizing FN) is prioritized to prevent untreated hepatic failure.
            </div>
          </div>
        </div>
      )}

      {/* Global Hall of Fame Leaderboard */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            ML Lab Experiment &quot;Hall of Fame&quot;
          </h3>
          <span className="text-xs text-slate-400">Ranked by 5-Fold Stratified ROC-AUC</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[11px]">
                <th className="py-2 px-3">Rank</th>
                <th className="py-2 px-3">Student / Researcher</th>
                <th className="py-2 px-3">Model</th>
                <th className="py-2 px-3">NLP Experiment Prompt</th>
                <th className="py-2 px-3">ROC-AUC</th>
                <th className="py-2 px-3">Accuracy</th>
                <th className="py-2 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {hallOfFame.map((entry, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3">
                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                      idx === 0 ? 'bg-amber-400 text-slate-950' :
                      idx === 1 ? 'bg-slate-300 text-slate-950' :
                      idx === 2 ? 'bg-amber-700 text-white' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {idx + 1}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-sans font-bold text-white">{entry.studentName}</td>
                  <td className="py-2.5 px-3 font-sans text-cyan-300">{entry.model}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-300 max-w-xs truncate" title={entry.experimentPrompt}>
                    {entry.experimentPrompt}
                  </td>
                  <td className="py-2.5 px-3 text-amber-400 font-bold">{entry.cvRocAuc.toFixed(3)}</td>
                  <td className="py-2.5 px-3 text-slate-300">{(entry.accuracy * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 font-sans text-slate-500 text-[11px]">{entry.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
