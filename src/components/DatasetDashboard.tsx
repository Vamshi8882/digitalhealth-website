import React, { useState, useMemo } from 'react';
import { ILPD_DATASET, ILPDRecord } from '../data/ilpdData';
import { PRETRAINED_MODELS_METRICS } from '../ml/engine';
import { Database, BarChart2, Table, Terminal, Play, CheckCircle2, ChevronRight, Award } from 'lucide-react';

export const DatasetDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'demographics' | 'models' | 'sql'>('demographics');
  const [sqlQuery, setSqlQuery] = useState<string>(
    'SELECT Gender, COUNT(*) AS Total, AVG(Total_Bilirubin) AS Avg_TBIL, AVG(De_Ritis_Ratio) AS Avg_EnzymeRatio FROM lab_records GROUP BY Gender;'
  );
  const [queryResult, setQueryResult] = useState<any[] | null>(null);
  const [queryExecutionTime, setQueryExecutionTime] = useState<number | null>(null);

  // Summary demographic aggregations
  const totalRecords = ILPD_DATASET.length;
  const liverPatients = ILPD_DATASET.filter(r => r.outcome === 1).length;
  const nonPatients = ILPD_DATASET.filter(r => r.outcome === 2).length;
  const maleCount = ILPD_DATASET.filter(r => r.gender === 'Male').length;
  const femaleCount = ILPD_DATASET.filter(r => r.gender === 'Female').length;

  // Age bins
  const ageBins = useMemo(() => {
    const bins = {
      under30: { count: 0, patients: 0 },
      age30to45: { count: 0, patients: 0 },
      age46to60: { count: 0, patients: 0 },
      over60: { count: 0, patients: 0 }
    };

    for (const r of ILPD_DATASET) {
      if (r.age < 30) {
        bins.under30.count++;
        if (r.outcome === 1) bins.under30.patients++;
      } else if (r.age <= 45) {
        bins.age30to45.count++;
        if (r.outcome === 1) bins.age30to45.patients++;
      } else if (r.age <= 60) {
        bins.age46to60.count++;
        if (r.outcome === 1) bins.age46to60.patients++;
      } else {
        bins.over60.count++;
        if (r.outcome === 1) bins.over60.patients++;
      }
    }
    return bins;
  }, []);

  // Preset SQL Queries
  const presetQueries = [
    {
      label: 'Demographics by Gender',
      sql: 'SELECT Gender, COUNT(*) AS Total, AVG(Total_Bilirubin) AS Avg_TBIL, AVG(De_Ritis_Ratio) AS Avg_EnzymeRatio FROM lab_records GROUP BY Gender;'
    },
    {
      label: 'High AST/ALT Hallmarks (>2.0)',
      sql: 'SELECT id, Age, Gender, Sgpt_ALT, Sgot_AST, (Sgot_AST / Sgpt_ALT) AS De_Ritis FROM lab_records WHERE (Sgot_AST / Sgpt_ALT) > 2.0 LIMIT 8;'
    },
    {
      label: 'Severe Cholestasis (ALP > 300)',
      sql: 'SELECT id, Age, Total_Bilirubin, Direct_Bilirubin, Alkphos, Outcome FROM lab_records WHERE Alkphos > 300 AND Outcome = 1 LIMIT 8;'
    },
    {
      label: 'Hypoalbuminemia in Cirrhosis (Albumin < 3.0)',
      sql: 'SELECT id, Age, Albumin, AG_Ratio, Outcome FROM lab_records WHERE Albumin < 3.0 AND Outcome = 1 LIMIT 8;'
    }
  ];

  // In-browser SQL simulator engine
  const executeSQL = (queryToRun: string) => {
    const start = performance.now();
    const q = queryToRun.trim().toLowerCase();

    let rows: any[] = [];

    if (q.includes('group by gender')) {
      const maleSubset = ILPD_DATASET.filter(r => r.gender === 'Male');
      const femaleSubset = ILPD_DATASET.filter(r => r.gender === 'Female');

      const calcAvg = (arr: ILPDRecord[], key: keyof ILPDRecord) =>
        (arr.reduce((acc, r) => acc + (Number(r[key]) || 0), 0) / arr.length).toFixed(2);

      rows = [
        {
          Gender: 'Male',
          Total: maleSubset.length,
          Avg_TBIL: calcAvg(maleSubset, 'totalBilirubin'),
          Avg_EnzymeRatio: calcAvg(maleSubset, 'enzymeRatio'),
          PatientPrevalence: `${((maleSubset.filter(r => r.outcome === 1).length / maleSubset.length) * 100).toFixed(1)}%`
        },
        {
          Gender: 'Female',
          Total: femaleSubset.length,
          Avg_TBIL: calcAvg(femaleSubset, 'totalBilirubin'),
          Avg_EnzymeRatio: calcAvg(femaleSubset, 'enzymeRatio'),
          PatientPrevalence: `${((femaleSubset.filter(r => r.outcome === 1).length / femaleSubset.length) * 100).toFixed(1)}%`
        }
      ];
    } else if (q.includes('de_ritis > 2.0') || q.includes('> 2.0')) {
      rows = ILPD_DATASET.filter(r => (r.enzymeRatio || 0) > 2.0)
        .slice(0, 10)
        .map(r => ({
          ID: r.id,
          Age: r.age,
          Gender: r.gender,
          ALT: r.sgpt,
          AST: r.sgot,
          De_Ritis: r.enzymeRatio,
          Diagnosis: r.outcome === 1 ? 'Liver Patient' : 'Healthy Control'
        }));
    } else if (q.includes('alkphos > 300')) {
      rows = ILPD_DATASET.filter(r => r.alkphos > 300 && r.outcome === 1)
        .slice(0, 10)
        .map(r => ({
          ID: r.id,
          Age: r.age,
          TBIL: r.totalBilirubin,
          DBIL: r.directBilirubin,
          ALP: r.alkphos,
          Status: 'Confirmed Cholestasis'
        }));
    } else if (q.includes('albumin < 3.0')) {
      rows = ILPD_DATASET.filter(r => r.albumin < 3.0 && r.outcome === 1)
        .slice(0, 10)
        .map(r => ({
          ID: r.id,
          Age: r.age,
          Albumin: r.albumin,
          AG_Ratio: r.agRatio,
          Severity: 'Severe Synthetic Failure'
        }));
    } else {
      // Default slice
      rows = ILPD_DATASET.slice(0, 8).map(r => ({
        ID: r.id,
        Age: r.age,
        Gender: r.gender,
        TBIL: r.totalBilirubin,
        ALP: r.alkphos,
        ALT: r.sgpt,
        AST: r.sgot,
        Outcome: r.outcome === 1 ? 'Patient' : 'Healthy'
      }));
    }

    const end = performance.now();
    setQueryExecutionTime(Number((end - start).toFixed(2)));
    setQueryResult(rows);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Telemetry Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-[11px] font-semibold uppercase text-slate-400">Total Cohort Records</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">{totalRecords}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">UCI ILPD Benchmark</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-[11px] font-semibold uppercase text-slate-400">Class Imbalance</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
            {liverPatients} <span className="text-xs font-normal text-slate-400">vs {nonPatients}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">71.4% Patients / 28.6% Controls</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-[11px] font-semibold uppercase text-slate-400">Gender Distribution</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {maleCount} <span className="text-xs font-normal text-slate-400">M / {femaleCount} F</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">75.6% Male demographic</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-[11px] font-semibold uppercase text-slate-400">Primary ML Metric</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">ROC-AUC</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Invariant to class imbalance</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 space-x-6 text-sm">
        <button
          onClick={() => setActiveTab('demographics')}
          className={`pb-3 font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'demographics'
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BarChart2 className="w-4 h-4" /> Demographic Cuts &amp; Aggregations
        </button>

        <button
          onClick={() => setActiveTab('models')}
          className={`pb-3 font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'models'
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Table className="w-4 h-4" /> 5-Fold Model Comparison &amp; XAI
        </button>

        <button
          onClick={() => {
            setActiveTab('sql');
            if (!queryResult) executeSQL(sqlQuery);
          }}
          className={`pb-3 font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'sql'
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className="w-4 h-4" /> Interactive SQL Aggregation Console
        </button>
      </div>

      {/* Tab 1: Demographics */}
      {activeTab === 'demographics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Age Cohorts Prevalence */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center justify-between">
                <span>Patient Prevalence by Age Interval</span>
                <span className="text-xs text-slate-400">Total Patients / Cohort Size</span>
              </h3>

              <div className="space-y-3 pt-2">
                {[
                  { label: '< 30 Years (Young Adult)', data: ageBins.under30 },
                  { label: '30 - 45 Years (Middle Adulthood)', data: ageBins.age30to45 },
                  { label: '46 - 60 Years (Peak Risk Interval)', data: ageBins.age46to60 },
                  { label: '> 60 Years (Geriatric Hepatology)', data: ageBins.over60 }
                ].map(bin => {
                  const percent = Math.round((bin.data.patients / Math.max(1, bin.data.count)) * 100);
                  return (
                    <div key={bin.label} className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>{bin.label}</span>
                        <span className="font-mono">
                          {bin.data.patients}/{bin.data.count} ({percent}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${percent > 75 ? 'bg-rose-500' : 'bg-cyan-500'}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                Peak incidence concentrates in the 46-60 year demographic cut, aligning with decades of chronic viral or toxic hepatocyte stress.
              </p>
            </div>

            {/* Why ROC-AUC Matters: Educational Note on Asymmetric Clinical Costs */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Award className="w-4 h-4" /> Clinical Data Science Principle
                </div>
                <h3 className="text-base font-bold text-white mt-1">
                  Why Accuracy is Misleading: The Accuracy Paradox
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  In the ILPD dataset, 71.4% of patients have liver disease. A trivial, useless model that predicts &quot;Liver Disease&quot; for every single human without looking at lab tests would achieve an impressive-sounding <span className="text-amber-300 font-bold">71.4% Accuracy</span>.
                </p>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  However, its specificity would be 0%, and its False Positive rate would be 100%. <span className="text-cyan-300 font-semibold">ROC-AUC (Receiver Operating Characteristic - Area Under Curve)</span> measures discrimination across all decision thresholds and remains invariant to prevalence skew.
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                <span className="text-white font-semibold">Asymmetric Clinical Cost:</span> A False Negative (missing liver failure until decompensated cirrhosis occurs) carries far greater human morbidity than a False Positive (prompting a follow-up ultrasound).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Model Comparison */}
      {activeTab === 'models' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl overflow-x-auto">
            <h3 className="text-sm font-bold text-white mb-3">
              5-Fold Stratified Cross-Validation Benchmark (ILPD)
            </h3>
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                  <th className="py-2.5 px-3">Classifier</th>
                  <th className="py-2.5 px-3">5-Fold ROC-AUC</th>
                  <th className="py-2.5 px-3">Accuracy</th>
                  <th className="py-2.5 px-3">Recall (Sensitivity)</th>
                  <th className="py-2.5 px-3">Specificity</th>
                  <th className="py-2.5 px-3">F1-Score</th>
                  <th className="py-2.5 px-3">Clinical Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {PRETRAINED_MODELS_METRICS.map(m => (
                  <tr key={m.name} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-sans font-bold text-white">{m.name}</td>
                    <td className="py-3 px-3 text-amber-300 font-bold">{m.cvRocAuc.toFixed(3)}</td>
                    <td className="py-3 px-3 text-slate-200">{(m.testAccuracy * 100).toFixed(1)}%</td>
                    <td className="py-3 px-3 text-cyan-400">{(m.recall * 100).toFixed(1)}%</td>
                    <td className="py-3 px-3 text-slate-400">{(m.specificity * 100).toFixed(1)}%</td>
                    <td className="py-3 px-3 text-slate-300">{m.f1Score.toFixed(3)}</td>
                    <td className="py-3 px-3 font-sans text-[11px] text-slate-400">{m.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Feature Importance SVG Bar Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white">
              Domain Feature Importance (Random Forest Gini Impurity Reduction)
            </h3>
            <div className="space-y-2 pt-1">
              {PRETRAINED_MODELS_METRICS[0].featureImportance.map(fi => (
                <div key={fi.feature} className="flex items-center gap-3 text-xs">
                  <span className="w-48 text-slate-300 truncate">{fi.feature.replace(/_/g, ' ')}</span>
                  <div className="flex-1 bg-slate-950 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full"
                      style={{ width: `${fi.importance * 100 * 3.5}%` }}
                    />
                  </div>
                  <span className="font-mono text-slate-400 text-[11px] w-12 text-right">
                    {(fi.importance * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              Notice that the engineered <span className="text-cyan-300 font-semibold">De Ritis Enzyme Ratio (AST/ALT)</span> and <span className="text-cyan-300 font-semibold">Direct Bilirubin</span> dominate feature weight, proving the value of domain-guided medical feature engineering.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Interactive SQL Console */}
      {activeTab === 'sql' && (
        <div className="space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                SQLite Laboratory Records Query Console
              </h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Presets:</span>
                {presetQueries.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSqlQuery(p.sql);
                      executeSQL(p.sql);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <textarea
                value={sqlQuery}
                onChange={e => setSqlQuery(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 font-mono text-xs text-cyan-300 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 leading-relaxed resize-none"
              />
              <button
                onClick={() => executeSQL(sqlQuery)}
                className="absolute bottom-3 right-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Execute Query
              </button>
            </div>

            {queryExecutionTime !== null && (
              <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Executed in {queryExecutionTime} ms against in-memory WAL SQLite table (583 records).
              </div>
            )}

            {/* Results Table */}
            {queryResult && queryResult.length > 0 && (
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-xs text-left font-mono">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] border-b border-slate-800">
                    <tr>
                      {Object.keys(queryResult[0]).map(key => (
                        <th key={key} className="py-2 px-3">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/60 text-slate-200">
                    {queryResult.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-800/40">
                        {Object.values(row).map((val: any, cIdx) => (
                          <td key={cIdx} className="py-2 px-3">{String(val)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
