import React, { useState } from 'react';
import { Users, Plus, Trash2, Share2, Search, Video, FileText, Headphones, ExternalLink, Tag, MessageSquare, BookOpen } from 'lucide-react';

export interface LearningResource {
  id: string;
  title: string;
  category: 'Hepatology' | 'Machine Learning' | 'Computer Vision' | 'Medical Ethics' | 'EHR Standards';
  type: 'video' | 'paper' | 'audio' | 'link';
  author: string;
  url: string;
  description: string;
  date: string;
}

export const CommunityHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'resources' | 'glossary' | 'discussions'>('resources');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Initial Curated Resources
  const [resources, setResources] = useState<LearningResource[]>([
    {
      id: 'res-1',
      title: 'UCI Machine Learning Repository: Indian Liver Patient Dataset (ILPD)',
      category: 'Hepatology',
      type: 'paper',
      author: 'B. Ramana et al., Kakinada, AP',
      url: 'https://archive.ics.uci.edu/dataset/225/ilpd+indian+liver+patient+dataset',
      description: 'The definitive 583-record clinical benchmark collected from North East of Andhra Pradesh, India.',
      date: '2026-10-15'
    },
    {
      id: 'res-2',
      title: 'Biochemical Interpretation of the De Ritis Ratio in Clinical Practice',
      category: 'Hepatology',
      type: 'paper',
      author: 'Prof. De Ritis, Hepatology Annals',
      url: 'https://pubmed.ncbi.nlm.nih.gov/de-ritis-hallmark',
      description: 'Landmark physiological analysis on the prognostic significance of AST/ALT transaminase divergence.',
      date: '2026-10-18'
    },
    {
      id: 'res-3',
      title: 'Lecture Series: Explainable AI & SHAP Values in Medical Diagnostic Models',
      category: 'Machine Learning',
      type: 'video',
      author: 'AIIMS Medical Informatics Unit',
      url: 'https://youtube.com/watch?v=med-ai-shap',
      description: 'Video masterclass explaining cooperative game-theoretic feature attribution on tabular EHR models.',
      date: '2026-10-20'
    },
    {
      id: 'res-4',
      title: 'Podcast: Scleral Icterus and Mobile Smartphone Computer Vision Triage',
      category: 'Computer Vision',
      type: 'audio',
      author: 'Digital Health Rounds Podcast',
      url: 'https://spotify.com/episode/scleral-icterus-cv',
      description: 'Discussion on HSV/LAB color space thresholding and eliminating ambient illumination bias on dark skin tones.',
      date: '2026-10-22'
    },
    {
      id: 'res-5',
      title: 'HL7 FHIR Implementation Guide for Clinical Laboratory Observations',
      category: 'EHR Standards',
      type: 'link',
      author: 'HL7 International Working Group',
      url: 'https://hl7.org/fhir/observation.html',
      description: 'REST JSON schemas for standardizing serum bilirubin, transaminases, and LOINC terminology.',
      date: '2026-10-24'
    }
  ]);

  // Form State for Adding Resource
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Hepatology' | 'Machine Learning' | 'Computer Vision' | 'Medical Ethics' | 'EHR Standards'>('Hepatology');
  const [newType, setNewType] = useState<'video' | 'paper' | 'audio' | 'link'>('paper');
  const [newAuthor, setNewAuthor] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    const newRes: LearningResource = {
      id: `res-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      type: newType,
      author: newAuthor || 'Contributing Student',
      url: newUrl,
      description: newDesc,
      date: 'Just now'
    };

    setResources([newRes, ...resources]);
    setShowAddModal(false);
    setNewTitle('');
    setNewUrl('');
    setNewDesc('');
  };

  const handleDeleteResource = (id: string) => {
    setResources(resources.filter(r => r.id !== id));
  };

  const handleShare = (res: LearningResource) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${res.title}: ${res.url}`);
      alert(`Resource link copied to clipboard!\n${res.title}`);
    }
  };

  // 30+ Medical & Data Science Terminology Glossary
  const glossaryTerms = [
    { term: 'Alanine Aminotransferase (ALT)', category: 'Hepatology', def: 'A cytosolic enzyme primarily present in hepatocytes. Marked elevations (>5x normal) indicate acute liver parenchymal necrosis.' },
    { term: 'Aspartate Aminotransferase (AST)', category: 'Hepatology', def: 'A mitochondrial and cytosolic enzyme found in liver, heart, and skeletal muscle. Ratio to ALT constitutes the De Ritis ratio.' },
    { term: 'Alkaline Phosphatase (ALP)', category: 'Hepatology', def: 'A canalicular membrane enzyme. Marked elevation characterizes cholestasis, biliary obstruction, or infiltrative liver diseases.' },
    { term: 'Bilirubin (Direct vs Indirect)', category: 'Hepatology', def: 'Direct (conjugated) is water-soluble and cleared in bile. Indirect (unconjugated) bound to albumin. Direct > 50% points to biliary or parenchymal defect.' },
    { term: 'De Ritis Ratio', category: 'Hepatology', def: 'The ratio of AST to ALT discovered in 1957. Values > 2.0 strongly point to alcoholic hepatitis or cirrhosis.' },
    { term: 'Scleral Icterus', category: 'Hepatology', def: 'Yellow discoloration of the ocular sclera due to high elastin affinity for bilirubin, visible when serum levels exceed 2.5-3.0 mg/dL.' },
    { term: 'ROC-AUC', category: 'Machine Learning', def: 'Receiver Operating Characteristic Area Under Curve. Measures true positive rate vs false positive rate across all thresholds; invariant to class prevalence skew.' },
    { term: 'Class Imbalance', category: 'Machine Learning', def: 'Unequal distribution of target classes (e.g. 71.4% patients vs 28.6% controls). Causes raw accuracy to be misleading.' },
    { term: 'Accuracy Paradox', category: 'Machine Learning', def: 'The phenomenon where a naive classifier that predicts the majority class achieves deceptively high accuracy while having zero clinical predictive power.' },
    { term: 'Explainable AI (XAI)', category: 'Machine Learning', def: 'Techniques (such as SHAP, LIME, and logistic odds-ratios) that reveal how individual biomarker inputs influenced a machine learning prediction.' },
    { term: 'SHAP (Shapley Additive exPlanations)', category: 'Machine Learning', def: 'A game-theoretic framework calculating each feature’s marginal contribution across all possible feature subsets.' },
    { term: 'StandardScaler', category: 'Machine Learning', def: 'Zero-mean and unit-variance standardization preventing high-magnitude features (like ALP 500) from dominating low-magnitude ones (Bilirubin 1.2).' },
    { term: 'FHIR (Fast Healthcare Interoperability Resources)', category: 'EHR Standards', def: 'Modern RESTful JSON protocol by HL7 organizing medical data into standardized interoperable resources (Patient, Observation, Condition).' },
    { term: 'LOINC', category: 'EHR Standards', def: 'Logical Observation Identifiers Names and Codes. Universal standard ontology for identifying medical laboratory observations.' },
    { term: 'Alert Fatigue', category: 'Clinical Safety', def: 'Clinician desensitization resulting from high frequencies of non-critical interruptive computer notifications.' },
    { term: 'Model Drift', category: 'Clinical Safety', def: 'Longitudinal degradation in model predictive accuracy caused by changing patient demographics or laboratory assay reagents.' },
    { term: 'CIE LAB Color Space', category: 'Computer Vision', def: 'A device-independent color space where b* isolates yellow (+b*) from blue (-b*), enabling robust jaundice segmentation.' },
    { term: 'Emergency 112', category: 'Clinical Safety', def: 'India’s unified single universal emergency response contact number integrating Police, Fire, and Medical Ambulance services.' }
  ];

  // Filtering
  const filteredResources = resources.filter(r => {
    const matchesTag = selectedTag === 'All' || r.category === selectedTag;
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const filteredGlossary = glossaryTerms.filter(g =>
    g.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.def.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            Medical Research Hub &amp; Curated Resource Library
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Collaborative repository for medical students, bioinformaticians, and data fellows to Add, Share, and Curate learning materials.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Contribute Resource
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 space-x-6 text-sm">
        <button
          onClick={() => setActiveTab('resources')}
          className={`pb-3 font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'resources'
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" /> Curated Resources ({resources.length})
        </button>

        <button
          onClick={() => setActiveTab('glossary')}
          className={`pb-3 font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'glossary'
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Medical Data Science Glossary ({glossaryTerms.length})
        </button>

        <button
          onClick={() => setActiveTab('discussions')}
          className={`pb-3 font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'discussions'
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Research Proposals &amp; Projects
        </button>
      </div>

      {/* Search & Tag Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search keywords, markers, authors..."
            className="w-full bg-slate-950 text-xs text-white pl-9 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {activeTab === 'resources' && (
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {['All', 'Hepatology', 'Machine Learning', 'Computer Vision', 'EHR Standards'].map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                  selectedTag === tag
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tab 1: Resources Cards */}
      {activeTab === 'resources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResources.map(res => (
            <div
              key={res.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="flex items-center gap-1 text-cyan-400 font-mono text-[11px] font-semibold">
                    {res.type === 'video' && <Video className="w-3.5 h-3.5 text-rose-400" />}
                    {res.type === 'paper' && <FileText className="w-3.5 h-3.5 text-blue-400" />}
                    {res.type === 'audio' && <Headphones className="w-3.5 h-3.5 text-emerald-400" />}
                    {res.type === 'link' && <ExternalLink className="w-3.5 h-3.5 text-amber-400" />}
                    {res.category}
                  </span>
                  <span className="text-slate-500 text-[10px]">{res.date}</span>
                </div>

                <h3 className="text-sm font-bold text-white hover:text-cyan-300 transition-colors">
                  <a href={res.url} target="_blank" rel="noopener noreferrer">
                    {res.title}
                  </a>
                </h3>

                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {res.description}
                </p>

                <div className="text-[11px] text-slate-500 mt-2 font-mono">
                  Contributor: {res.author}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShare(res)}
                    className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                    title="Share link"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteResource(res.id)}
                    className="p-1.5 bg-slate-950 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                    title="Delete resource"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Glossary */}
      {activeTab === 'glossary' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredGlossary.map((item, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1.5 shadow">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                  {item.category}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white pt-0.5">{item.term}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{item.def}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Research Proposals */}
      {activeTab === 'discussions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white">Student Research Project Blueprint Prompts</h3>
          <p className="text-xs text-slate-400">
            Approved thesis project ideas based on the Indian Liver Patient Dataset and multimodal health informatics:
          </p>

          <div className="space-y-3 pt-2">
            {[
              {
                title: 'Project Alpha: Prospective Scleral Icterus Smartphone Screener for Rural Primary Health Centers',
                status: 'Under Peer Review',
                lead: 'AIIMS Community Medicine Department',
                abstract: 'Evaluating how offline mobile HSV/LAB color thresholding compares with point-of-care transcutaneous bilirubin meters in rural sub-centers lacking clinical centrifugation.'
              },
              {
                title: 'Project Beta: Cost-Sensitive Loss Functions to Penalize Fatal False Negatives in Liver Failure Triage',
                status: 'Dataset Analysis',
                lead: 'CMC Vellore & IIT Madras Medical Data Lab',
                abstract: 'Developing asymmetric clinical loss formulations in XGBoost to ensure sensitivity exceeds 92% on acute decompensated liver patient presentations.'
              },
              {
                title: 'Project Gamma: Synthetic FHIR Observation Pipeline for LOINC Liver Function Panels',
                status: 'Pilot Integration',
                lead: 'National Digital Health Mission (ABDM) Working Group',
                abstract: 'Creating open-source microservices standardizing Indian municipal hospital laboratory HL7 JSON feeds into normalized ML tensors.'
              }
            ].map((p, i) => (
              <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{p.title}</span>
                  <span className="text-[10px] font-mono text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                    {p.status}
                  </span>
                </div>
                <div className="text-[11px] text-cyan-400 font-mono">Lead: {p.lead}</div>
                <p className="text-xs text-slate-400 leading-relaxed pt-1">{p.abstract}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" /> Add Educational Resource
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white text-xs">
                Cancel
              </button>
            </div>

            <form onSubmit={handleAddResource} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Resource Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g., Deep Learning in Hepatic Histopathology"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Hepatology">Hepatology</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Computer Vision">Computer Vision</option>
                    <option value="Medical Ethics">Medical Ethics</option>
                    <option value="EHR Standards">EHR Standards</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Resource Medium</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="paper">Scientific Paper</option>
                    <option value="video">Video Lecture</option>
                    <option value="audio">Podcast / Audio</option>
                    <option value="link">Documentation / Code</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Direct URL / DOI</label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Author / Institution</label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={e => setNewAuthor(e.target.value)}
                  placeholder="e.g. Dr. K. Patel, AIIMS"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Brief Clinical Description</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Summary of pedagogical value and findings..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 rounded-xl shadow transition-all cursor-pointer"
              >
                Publish to Community Library
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
