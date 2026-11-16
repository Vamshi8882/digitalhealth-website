/**
 * Digitalization in Healthcare - Hospital Patient Case Registry & Dynamic Clinical Analyzer
 * Real-world hospital records from AIIMS, CMC, Apollo, Johns Hopkins with dynamic case creation
 */

import React, { useState, useEffect } from 'react';
import {
  Building2,
  FileText,
  Activity,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  HeartPulse,
  Brain,
  Share2,
  Award,
  ChevronRight,
  X,
  Stethoscope,
  Trash2,
  Sparkles,
  BookOpen,
  HelpCircle,
  TrendingUp,
  Hospital
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  HospitalPatientCase,
  getStoredHospitalCases,
  saveStoredHospitalCases,
  getSolvedHospitalCaseIds,
  markHospitalCaseSolvedInStorage
} from '../data/hospitalCasesData';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';

interface HospitalCaseRegistryProps {
  onNavigateToSimulator?: () => void;
  onNavigateToCurriculum?: () => void;
}

export const HospitalCaseRegistry: React.FC<HospitalCaseRegistryProps> = ({
  onNavigateToSimulator,
  onNavigateToCurriculum
}) => {
  const { currentUser } = useAuth();
  const { awardXP } = useProgress();

  const [cases, setCases] = useState<HospitalPatientCase[]>([]);
  const [solvedCaseIds, setSolvedCaseIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHospital, setSelectedHospital] = useState<string>('All');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');

  // Active modal states
  const [activeCase, setActiveCase] = useState<HospitalPatientCase | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // New Case Form State
  const [newCase, setNewCase] = useState<Partial<HospitalPatientCase>>({
    hospitalName: 'All India Institute of Medical Sciences (AIIMS)',
    department: 'Department of Gastroenterology & Hepatology',
    location: 'New Delhi, India',
    age: 45,
    gender: 'Male',
    occupation: 'Self-employed',
    chiefComplaint: '',
    historyOfPresentIllness: '',
    severity: 'Moderate',
    labs: {
      totalBilirubin: 2.5,
      directBilirubin: 1.2,
      sgptAlt: 110,
      sgotAst: 95,
      alkalinePhosphatase: 160,
      totalProtein: 6.8,
      albumin: 3.4,
      agRatio: 1.0,
      platelets: 160,
      inr: 1.2,
      creatinine: 0.9,
      sodium: 138
    },
    ultrasoundImaging: 'Coarse parenchymal echotexture with mild splenomegaly.',
    definitiveDiagnosis: '',
    clinicalManagement: ['Bedside stabilization', 'Electrolyte monitoring'],
    clinicalPearls: ['Early transaminase tracking is key in assessing progression.'],
    quiz: {
      question: 'What is the most likely pathological mechanism?',
      options: ['Hepatocellular Necrosis', 'Biliary Canalicular Obstruction', 'Hemolytic Jaundice', 'Passive Venous Congestion'],
      correctIndex: 0,
      explanation: 'Marked transaminase elevations indicate hepatocyte cellular membrane disruption.'
    }
  });

  useEffect(() => {
    setCases(getStoredHospitalCases());
    setSolvedCaseIds(getSolvedHospitalCaseIds());
  }, []);

  const handleOpenCase = (c: HospitalPatientCase) => {
    setActiveCase(c);
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);
  };

  const handleMarkSolved = (c: HospitalPatientCase) => {
    const updated = markHospitalCaseSolvedInStorage(c.id);
    setSolvedCaseIds(updated);
    awardXP(150);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  const handleDeleteCase = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this case study?')) {
      const updated = cases.filter(c => c.id !== id);
      setCases(updated);
      saveStoredHospitalCases(updated);
      if (activeCase?.id === id) setActiveCase(null);
    }
  };

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCase.chiefComplaint || !newCase.definitiveDiagnosis) {
      alert('Please fill in the Chief Complaint and Definitive Diagnosis.');
      return;
    }

    const created: HospitalPatientCase = {
      id: `hosp-custom-${Date.now()}`,
      patientRef: `CASE-HOSP-${Math.floor(1000 + Math.random() * 9000)}`,
      hospitalName: newCase.hospitalName || 'Teaching Hospital',
      department: newCase.department || 'Internal Medicine',
      location: newCase.location || 'India',
      admissionDate: new Date().toISOString().split('T')[0],
      age: Number(newCase.age) || 45,
      gender: newCase.gender || 'Male',
      occupation: newCase.occupation || 'Patient',
      chiefComplaint: newCase.chiefComplaint,
      historyOfPresentIllness: newCase.historyOfPresentIllness || 'Patient presented with clinical symptoms for case study analysis.',
      pastMedicalHistory: ['Non-contributory'],
      vitals: {
        bp: '120/80 mmHg',
        hr: 78,
        rr: 16,
        temp: '98.6 °F',
        spo2: 98
      },
      physicalExamination: ['Mild scleral icterus', 'Soft abdomen with slight right hypochondrial tenderness'],
      labs: newCase.labs as any,
      ultrasoundImaging: newCase.ultrasoundImaging || 'Normal parenchymal architecture.',
      deRitisRatio: Number(((newCase.labs?.sgotAst || 1) / (newCase.labs?.sgptAlt || 1)).toFixed(2)),
      fib4Score: Number(((45 * (newCase.labs?.sgotAst || 1)) / ((newCase.labs?.platelets || 150) * Math.sqrt(newCase.labs?.sgptAlt || 1))).toFixed(2)),
      severity: newCase.severity as any || 'Moderate',
      differentialDiagnoses: ['Acute Hepatitis', 'Metabolic Liver Disease', 'Drug-Induced Liver Injury'],
      definitiveDiagnosis: newCase.definitiveDiagnosis,
      clinicalManagement: newCase.clinicalManagement || ['Standard supportive therapy'],
      clinicalPearls: newCase.clinicalPearls || ['Carefully evaluate laboratory trend over 48 hours.'],
      isCustomCase: true,
      createdBy: currentUser ? `${currentUser.titlePrefix} ${currentUser.fullName}` : 'Faculty Member',
      quiz: newCase.quiz as any
    };

    const updated = [created, ...cases];
    setCases(updated);
    saveStoredHospitalCases(updated);
    setShowAddModal(false);
    confetti({ particleCount: 50, spread: 50 });
  };

  // Unique hospitals for filter
  const uniqueHospitals = ['All', ...Array.from(new Set(cases.map(c => c.hospitalName)))];

  // Filter cases
  const filteredCases = cases.filter(c => {
    const matchesSearch =
      c.patientRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.definitiveDiagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesHospital = selectedHospital === 'All' || c.hospitalName === selectedHospital;
    const matchesSeverity = selectedSeverity === 'All' || c.severity === selectedSeverity;

    return matchesSearch && matchesHospital && matchesSeverity;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
              <Hospital className="w-3.5 h-3.5" />
              <span>Multi-Center Real Hospital Dossiers</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Hospital Patient Case Registry & Clinical Analyzer
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Study real-world anonymized patient records from premier institutes (AIIMS New Delhi, CMC Vellore, Apollo Hospitals, Johns Hopkins). Analyze complete liver panels, De Ritis kinetic ratios, ultrasound imaging, and clinical management pathways.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Dynamic Case Study</span>
            </button>
            <div className="bg-slate-950/70 border border-slate-800 px-4 py-2 rounded-2xl flex items-center gap-3">
              <Award className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cases Solved</div>
                <div className="text-sm font-bold text-white">
                  {solvedCaseIds.length} / {cases.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Filter Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by hospital, diagnosis, or patient ref..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 text-white pl-10 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedHospital}
                onChange={(e) => setSelectedHospital(e.target.value)}
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
              >
                {uniqueHospitals.map(h => (
                  <option key={h} value={h} className="bg-slate-900 text-white">{h}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-slate-900 text-white">All Severities</option>
                <option value="Mild" className="bg-slate-900 text-white">Mild</option>
                <option value="Moderate" className="bg-slate-900 text-white">Moderate</option>
                <option value="Severe" className="bg-slate-900 text-white">Severe</option>
                <option value="Critical" className="bg-slate-900 text-white">Critical</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Case Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredCases.map((c) => {
          const isSolved = solvedCaseIds.includes(c.id);
          const severityColors = {
            Mild: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            Moderate: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
            Severe: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
            Critical: 'bg-red-500/20 text-red-400 border-red-500/30'
          }[c.severity];

          return (
            <div
              key={c.id}
              onClick={() => handleOpenCase(c)}
              className={`bg-slate-900/90 border rounded-3xl p-6 transition-all duration-200 cursor-pointer hover:border-cyan-500/50 hover:shadow-xl relative flex flex-col justify-between ${
                isSolved ? 'border-emerald-500/30' : 'border-slate-800'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2.5 py-0.5 rounded-lg">
                        {c.patientRef}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${severityColors}`}>
                        {c.severity}
                      </span>
                      {isSolved && (
                        <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-lg flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Solved
                        </span>
                      )}
                      {c.isCustomCase && (
                        <span className="text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-lg">
                          Custom Contributed
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {c.definitiveDiagnosis}
                    </h3>
                  </div>

                  {c.isCustomCase && (
                    <button
                      onClick={(e) => handleDeleteCase(c.id, e)}
                      className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Delete custom case"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="font-medium text-slate-300">{c.hospitalName}</span>
                  <span className="text-slate-600">•</span>
                  <span>{c.location}</span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed bg-slate-950/50 p-3 rounded-2xl border border-slate-800/60">
                  <span className="font-semibold text-slate-400">Presentation: </span>
                  {c.chiefComplaint}
                </p>

                {/* Key Labs Strip */}
                <div className="grid grid-cols-4 gap-2 text-center pt-2">
                  <div className="bg-slate-950/70 border border-slate-800 p-2 rounded-xl">
                    <div className="text-[10px] text-slate-400">Total Bili</div>
                    <div className="text-xs font-bold text-white">{c.labs.totalBilirubin} <span className="text-[9px] text-slate-400">mg/dL</span></div>
                  </div>
                  <div className="bg-slate-950/70 border border-slate-800 p-2 rounded-xl">
                    <div className="text-[10px] text-slate-400">ALT / AST</div>
                    <div className="text-xs font-bold text-white">{c.labs.sgptAlt} / {c.labs.sgotAst}</div>
                  </div>
                  <div className="bg-slate-950/70 border border-slate-800 p-2 rounded-xl">
                    <div className="text-[10px] text-slate-400">Albumin</div>
                    <div className="text-xs font-bold text-white">{c.labs.albumin} <span className="text-[9px] text-slate-400">g/dL</span></div>
                  </div>
                  <div className="bg-slate-950/70 border border-slate-800 p-2 rounded-xl">
                    <div className="text-[10px] text-slate-400">De Ritis</div>
                    <div className={`text-xs font-bold ${c.deRitisRatio > 1.5 ? 'text-amber-400' : 'text-cyan-400'}`}>
                      {c.deRitisRatio}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-800/70 flex items-center justify-between text-xs">
                <div className="text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>{c.age}yo {c.gender}</span>
                </div>

                <span className="text-cyan-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Analyze Full Report</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* FULL REPORT ANALYZER MODAL */}
      {activeCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2.5 py-0.5 rounded-lg">
                    {activeCase.patientRef}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300">
                    {activeCase.severity} Severity
                  </span>
                  <span className="text-xs text-slate-400">
                    Admitted: {activeCase.admissionDate}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {activeCase.definitiveDiagnosis}
                </h2>
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <span className="font-semibold text-slate-200">{activeCase.hospitalName}</span>
                  <span className="text-slate-600">•</span>
                  <span>{activeCase.department}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveCase(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors"
                aria-label="Close Case Report"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Patient Overview Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <div>
                <span className="text-slate-400 block text-[11px]">Age & Gender</span>
                <span className="font-semibold text-white">{activeCase.age} Years • {activeCase.gender}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Blood Pressure</span>
                <span className="font-semibold text-white">{activeCase.vitals.bp}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Heart Rate / SpO2</span>
                <span className="font-semibold text-white">{activeCase.vitals.hr} bpm • {activeCase.vitals.spo2}%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">De Ritis / FIB-4</span>
                <span className="font-semibold text-cyan-400">{activeCase.deRitisRatio} • {activeCase.fib4Score}</span>
              </div>
            </div>

            {/* Clinical Presentation & History */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Clinical History & Symptoms</span>
              </h4>
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 space-y-2 text-xs text-slate-300 leading-relaxed">
                <p><span className="font-bold text-white">Chief Complaint: </span>{activeCase.chiefComplaint}</p>
                <p><span className="font-bold text-white">History of Present Illness: </span>{activeCase.historyOfPresentIllness}</p>
              </div>
            </div>

            {/* Complete Liver Function Laboratory Panel */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Certified Laboratory Diagnostic Panel</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl space-y-1">
                  <div className="text-[10px] text-slate-400">Total Bilirubin (0.2-1.2)</div>
                  <div className={`text-sm font-bold ${activeCase.labs.totalBilirubin > 1.2 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {activeCase.labs.totalBilirubin} mg/dL
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl space-y-1">
                  <div className="text-[10px] text-slate-400">Direct Bilirubin (0-0.3)</div>
                  <div className={`text-sm font-bold ${activeCase.labs.directBilirubin > 0.3 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {activeCase.labs.directBilirubin} mg/dL
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl space-y-1">
                  <div className="text-[10px] text-slate-400">ALT / SGPT (7-56 U/L)</div>
                  <div className={`text-sm font-bold ${activeCase.labs.sgptAlt > 56 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {activeCase.labs.sgptAlt} U/L
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl space-y-1">
                  <div className="text-[10px] text-slate-400">AST / SGOT (10-40 U/L)</div>
                  <div className={`text-sm font-bold ${activeCase.labs.sgotAst > 40 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {activeCase.labs.sgotAst} U/L
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl space-y-1">
                  <div className="text-[10px] text-slate-400">Alkaline Phos (44-147)</div>
                  <div className={`text-sm font-bold ${activeCase.labs.alkalinePhosphatase > 147 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {activeCase.labs.alkalinePhosphatase} U/L
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl space-y-1">
                  <div className="text-[10px] text-slate-400">Serum Albumin (3.5-5.0)</div>
                  <div className={`text-sm font-bold ${activeCase.labs.albumin < 3.5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {activeCase.labs.albumin} g/dL
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl space-y-1">
                  <div className="text-[10px] text-slate-400">A/G Ratio (1.2-2.2)</div>
                  <div className={`text-sm font-bold ${activeCase.labs.agRatio < 1.0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {activeCase.labs.agRatio}
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl space-y-1">
                  <div className="text-[10px] text-slate-400">Platelets (150-450k)</div>
                  <div className={`text-sm font-bold ${activeCase.labs.platelets < 150 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {activeCase.labs.platelets} k/µL
                  </div>
                </div>
              </div>
            </div>

            {/* Imaging & Histology */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Ultrasound & Histopathology Examination</span>
              </h4>
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 space-y-2">
                <p><span className="font-bold text-white">Ultrasound Finding: </span>{activeCase.ultrasoundImaging}</p>
                {activeCase.biopsyHistology && (
                  <p><span className="font-bold text-white">Biopsy / Elastography: </span>{activeCase.biopsyHistology}</p>
                )}
              </div>
            </div>

            {/* Clinical Management Implemented */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-cyan-400" />
                <span>Hospital Management Protocol</span>
              </h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
                {activeCase.clinicalManagement.map((m, idx) => (
                  <li key={idx} className="leading-relaxed">{m}</li>
                ))}
              </ul>
            </div>

            {/* Teaching Pearls */}
            <div className="space-y-3 bg-cyan-950/30 border border-cyan-800/40 rounded-2xl p-4">
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                <Brain className="w-4 h-4 text-cyan-400" />
                <span>Key Clinical Teaching Pearls</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeCase.clinicalPearls.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interactive Clinical Reasoning Quiz */}
            <div className="space-y-3 bg-slate-950/90 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>Clinical Reasoning Self-Assessment</span>
                </h4>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                  +150 XP
                </span>
              </div>

              <p className="text-xs text-slate-200 font-semibold">{activeCase.quiz.question}</p>

              <div className="space-y-2 pt-1">
                {activeCase.quiz.options.map((opt, optIdx) => {
                  const isSelected = selectedQuizAnswer === optIdx;
                  const isCorrect = optIdx === activeCase.quiz.correctIndex;

                  let optStyles = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';
                  if (quizSubmitted) {
                    if (isCorrect) {
                      optStyles = 'bg-emerald-950/70 border-emerald-500 text-emerald-200 font-semibold';
                    } else if (isSelected) {
                      optStyles = 'bg-rose-950/70 border-rose-500 text-rose-200';
                    }
                  } else if (isSelected) {
                    optStyles = 'bg-cyan-950/60 border-cyan-400 text-cyan-200';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={quizSubmitted}
                      onClick={() => setSelectedQuizAnswer(optIdx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs flex items-center justify-between transition-colors ${optStyles}`}
                    >
                      <span>{opt}</span>
                      {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>

              {!quizSubmitted ? (
                <button
                  type="button"
                  disabled={selectedQuizAnswer === null}
                  onClick={() => {
                    setQuizSubmitted(true);
                    if (selectedQuizAnswer === activeCase.quiz.correctIndex) {
                      handleMarkSolved(activeCase);
                    }
                  }}
                  className="mt-3 w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold py-2 rounded-xl text-xs transition-colors"
                >
                  Submit Clinical Reasoning
                </button>
              ) : (
                <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <span className="font-bold text-cyan-400">Explanation: </span>
                  {activeCase.quiz.explanation}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-400">
                Case dossier authenticated for medical student & resident education.
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleMarkSolved(activeCase)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Case Studied (+150 XP)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCase(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC CASE STUDY CREATION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-cyan-400" />
                  <span>Add Dynamic Hospital Case Study</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Contribute hospital cases to train fellow students and residents.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Hospital Institute</label>
                  <input
                    type="text"
                    required
                    value={newCase.hospitalName || ''}
                    onChange={(e) => setNewCase({ ...newCase, hospitalName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    placeholder="e.g. AIIMS, CMC Vellore, Apollo..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Clinical Department</label>
                  <input
                    type="text"
                    required
                    value={newCase.department || ''}
                    onChange={(e) => setNewCase({ ...newCase, department: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    placeholder="e.g. Hepatology / Internal Medicine"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Patient Age</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newCase.age || 45}
                    onChange={(e) => setNewCase({ ...newCase, age: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Gender</label>
                  <select
                    value={newCase.gender}
                    onChange={(e) => setNewCase({ ...newCase, gender: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Severity</label>
                  <select
                    value={newCase.severity}
                    onChange={(e) => setNewCase({ ...newCase, severity: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="Mild">Mild</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Chief Complaint & Onset</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Severe jaundice with RUQ pain for 10 days"
                  value={newCase.chiefComplaint || ''}
                  onChange={(e) => setNewCase({ ...newCase, chiefComplaint: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">History of Present Illness</label>
                <textarea
                  rows={2}
                  value={newCase.historyOfPresentIllness || ''}
                  onChange={(e) => setNewCase({ ...newCase, historyOfPresentIllness: e.target.value })}
                  placeholder="Detailed chronological presentation, drug history, alcohol, risk factors..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white resize-none"
                />
              </div>

              {/* Lab Values Panel */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="font-semibold text-cyan-400 block">Patient Laboratory Values</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400">Total Bilirubin (mg/dL)</span>
                    <input
                      type="number"
                      step="0.1"
                      value={newCase.labs?.totalBilirubin || 1.2}
                      onChange={(e) => setNewCase({ ...newCase, labs: { ...newCase.labs!, totalBilirubin: Number(e.target.value) } })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">ALT / SGPT (U/L)</span>
                    <input
                      type="number"
                      value={newCase.labs?.sgptAlt || 45}
                      onChange={(e) => setNewCase({ ...newCase, labs: { ...newCase.labs!, sgptAlt: Number(e.target.value) } })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">AST / SGOT (U/L)</span>
                    <input
                      type="number"
                      value={newCase.labs?.sgotAst || 40}
                      onChange={(e) => setNewCase({ ...newCase, labs: { ...newCase.labs!, sgotAst: Number(e.target.value) } })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Serum Albumin (g/dL)</span>
                    <input
                      type="number"
                      step="0.1"
                      value={newCase.labs?.albumin || 3.8}
                      onChange={(e) => setNewCase({ ...newCase, labs: { ...newCase.labs!, albumin: Number(e.target.value) } })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Definitive Clinical Diagnosis</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acute Idiosyncratic Drug-Induced Liver Injury (DILI)"
                  value={newCase.definitiveDiagnosis || ''}
                  onChange={(e) => setNewCase({ ...newCase, definitiveDiagnosis: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
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
                  Save & Publish Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
