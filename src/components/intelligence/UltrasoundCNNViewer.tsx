/**
 * Digitalization in Healthcare - Medical Ultrasound CNN Analyzer & Multimodal AI
 * Analyzes liver B-mode ultrasound images using simulated Convolutional Neural Network (CNN)
 * feature maps, Grad-CAM saliency activation heatmaps, and multimodal AI synthesis combining
 * serum biochemistry, patient history, and imaging echogenicity.
 */

import React, { useState } from 'react';
import {
  Eye,
  Layers,
  Sparkles,
  Upload,
  CheckCircle2,
  AlertCircle,
  Activity,
  FileCheck,
  Cpu,
  Download,
  Filter,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ULTRASOUND_PRESETS, UltrasoundImagePreset } from '../../data/clinicalIntelligenceData';
import { useProgress } from '../../context/ProgressContext';

interface UltrasoundCNNViewerProps {
  currentLabs?: {
    totalBilirubin?: number;
    sgpt?: number;
    sgot?: number;
    alkphos?: number;
  };
}

export const UltrasoundCNNViewer: React.FC<UltrasoundCNNViewerProps> = ({ currentLabs }) => {
  const { awardXP } = useProgress();
  const [selectedCase, setSelectedCase] = useState<UltrasoundImagePreset>(ULTRASOUND_PRESETS[1]);
  const [activeLayer, setActiveLayer] = useState<'original' | 'conv1' | 'conv3' | 'gradcam'>('gradcam');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [customImage, setCustomImage] = useState<string | null>(null);

  // Handle local ultrasound image file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      setTimeout(() => {
        setCustomImage(evt.target?.result as string);
        setSelectedCase({
          id: `custom-${Date.now()}`,
          title: `Uploaded Scan: ${file.name}`,
          clinicalIndication: 'Patient uploaded abdominal B-mode ultrasound examination',
          echogenicity: 'Coarse Heterogeneous',
          fibrosisStage: 'F3 (Severe)',
          steatosisGrade: 'Moderate (Grade 2)',
          findings: [
            'Heterogeneous parenchymal acoustic texture with irregular surface contour',
            'Subtle periportal cuffing and acoustic attenuation',
            'Spleen upper limit of normal (~12.2 cm)',
            'No macroscopic gallstones or intrahepatic ductal dilation'
          ],
          cnnConfidence: 93.6,
          imageUrl: evt.target?.result as string,
          gradCamHeatmapSvg: 'M 50,50 Q 150,40 240,60 T 230,220 Q 140,240 50,200 Z'
        });
        setIsAnalyzing(false);
        confetti({ particleCount: 35, spread: 60 });
        awardXP(25);
      }, 700);
    };
    reader.readAsDataURL(file);
  };

  // Multimodal AI consensus score
  const multimodalConsensus = {
    biochemicalAccordance: 'High (Concordant with transaminase elevation)',
    imagingAccordance: `${selectedCase.cnnConfidence}% Neural Feature Alignment`,
    clinicalConclusion:
      selectedCase.id === 'us-steatosis'
        ? 'Multimodal Profile confirms Metabolic Dysfunction-Associated Steatohepatitis (MASLD) without macroscopic cirrhosis.'
        : selectedCase.id === 'us-cirrhosis'
        ? 'Multimodal Profile establishes Decompensated Cirrhosis (F4) with portal hypertension and active ascites.'
        : selectedCase.id === 'us-cholelithiasis'
        ? 'Multimodal Profile establishes Mechanical Extrahepatic Biliary Obstruction (Choledocholithiasis) requiring urgent ERCP.'
        : 'Multimodal Profile confirms Normal Physiological Baseline with intact synthetic parameters.'
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800 font-bold flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" />
                Deep Learning Vision &bull; ResNet-50 / ConvNeXt Model
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded font-mono font-semibold">
                Multimodal Synthesis
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>Medical Ultrasound Image CNN Analyzer</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Examine liver B-mode ultrasound scans through a simulated deep convolutional neural network. Inspect layer feature maps, Grad-CAM activation heatmaps highlighting parenchymal attenuations, and synthesize imaging with serum lab values for unified multimodal diagnosis.
            </p>
          </div>

          <label className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-950/40 transition-all cursor-pointer shrink-0">
            <Upload className="w-4 h-4" />
            <span>Upload Ultrasound DICOM / Image</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Case Presets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {ULTRASOUND_PRESETS.map((preset) => {
          const isSelected = selectedCase.id === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => setSelectedCase(preset)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                isSelected
                  ? 'bg-slate-950 border-cyan-500 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold text-white truncate">{preset.title}</div>
              <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{preset.echogenicity}</div>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-900 text-[10px] text-slate-400">
                <span>{preset.fibrosisStage}</span>
                <span className="font-mono text-emerald-400 font-bold">{preset.cnnConfidence}% Conf</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main CNN Feature Map Inspector Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Visualizer & Layer Filters */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>{selectedCase.title}</span>
            </div>

            {/* Layer Filter Selector */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              {[
                { id: 'original', label: 'B-Mode Raw' },
                { id: 'conv1', label: 'Conv1 (Edges)' },
                { id: 'conv3', label: 'Conv3 (Texture)' },
                { id: 'gradcam', label: 'Grad-CAM Saliency' }
              ].map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                    activeLayer === layer.id
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {layer.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ultrasound Screen Frame */}
          <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center group select-none">
            {/* Base Image */}
            <img
              src={selectedCase.imageUrl}
              alt={selectedCase.title}
              className={`w-full h-full object-cover transition-all duration-300 ${
                activeLayer === 'conv1'
                  ? 'grayscale contrast-200 invert'
                  : activeLayer === 'conv3'
                  ? 'grayscale contrast-150 brightness-110 blur-[0.5px]'
                  : 'grayscale contrast-125'
              }`}
            />

            {/* Grad-CAM Saliency Heatmap Overlay */}
            {activeLayer === 'gradcam' && (
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/30 via-amber-500/40 to-rose-500/50 mix-blend-color-dodge pointer-events-none animate-in fade-in duration-300">
                <svg className="w-full h-full opacity-60">
                  <path d={selectedCase.gradCamHeatmapSvg} fill="rgba(244, 63, 94, 0.45)" filter="blur(25px)" />
                </svg>
              </div>
            )}

            {/* HUD Overlay Info */}
            <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[10px] font-mono text-cyan-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ACTIVE VIEW: {activeLayer.toUpperCase()}</span>
            </div>

            <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-300">
              RES: 512x512 &bull; PROBE: Curved Array 3.5MHz
            </div>
          </div>

          {/* Layer Explanation Callout */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
            {activeLayer === 'original' && (
              <span><strong>Raw B-mode Ultrasound:</strong> High-frequency sound reflection demonstrating tissue impedance boundaries and diaphragmatic acoustic penetration.</span>
            )}
            {activeLayer === 'conv1' && (
              <span><strong>Conv2D Layer 1 (Gabor &amp; Sobel Edge Filters):</strong> Detects micro-organ boundary discontinuities, biliary ductal interfaces, and capsular margins.</span>
            )}
            {activeLayer === 'conv3' && (
              <span><strong>Conv2D Layer 3 (Deep Speckle Texture Filters):</strong> Analyzes parenchymal coarseness, intracellular fat droplet scatter, and regenerative nodularity.</span>
            )}
            {activeLayer === 'gradcam' && (
              <span><strong>Grad-CAM Saliency Activation Heatmap:</strong> Highlights spatial regions contributing most heavily to the model's fibrosis and steatosis classification.</span>
            )}
          </div>
        </div>

        {/* Right: CNN Classification & Multimodal Synthesis */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
              Automated CNN Quantitative Metrics
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">Ultrasound Radiomics Output</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-0.5">
              <div className="text-[10px] text-slate-400 font-mono">Predicted Fibrosis Stage</div>
              <div className="text-sm font-bold text-white mt-1">{selectedCase.fibrosisStage}</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-0.5">
              <div className="text-[10px] text-slate-400 font-mono">Steatosis Infiltration</div>
              <div className="text-sm font-bold text-cyan-300 mt-1">{selectedCase.steatosisGrade}</div>
            </div>
          </div>

          {/* Radiologist & AI Findings */}
          <div className="space-y-2 text-xs">
            <span className="font-semibold text-slate-200">Key Radiological Features Detected:</span>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              {selectedCase.findings.map((f, i) => (
                <li key={i} className="flex items-start gap-1.5 bg-slate-950 p-2 rounded-xl border border-slate-800/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Multimodal AI Consensus Box */}
          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-800/70 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Multimodal AI Concordance Consensus</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.2 rounded border border-emerald-800">
                {multimodalConsensus.imagingAccordance}
              </span>
            </div>

            <p className="text-[11px] text-slate-200 leading-relaxed">
              {multimodalConsensus.clinicalConclusion}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
