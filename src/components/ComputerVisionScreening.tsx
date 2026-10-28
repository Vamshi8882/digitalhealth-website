import React, { useState, useRef, useEffect } from 'react';
import { Upload, Eye, Sliders, AlertTriangle, ShieldCheck, RefreshCw, Info } from 'lucide-react';

interface ColorThresholds {
  minHue: number; // 15 to 45 (Yellow range in 0-360)
  maxHue: number;
  minSaturation: number; // 20 to 100%
  minValue: number; // 30 to 100%
  minLabB: number; // 10 to 60 (Positive b* = yellow chrominance)
}

export const ComputerVisionScreening: React.FC = () => {
  const [selectedImageSrc, setSelectedImageSrc] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [maskStats, setMaskStats] = useState<{
    totalPixels: number;
    yellowPixels: number;
    yellowPercentage: number;
    meanLabB: number;
    scleralIcterusRisk: 'Low' | 'Moderate' | 'High Suspicion';
  } | null>(null);

  // Tunable deterministic thresholds for HSV and LAB
  const [thresholds, setThresholds] = useState<ColorThresholds>({
    minHue: 20,
    maxHue: 48,
    minSaturation: 22,
    minValue: 35,
    minLabB: 16
  });

  const [overlayMode, setOverlayMode] = useState<'contour' | 'mask' | 'heatmap'>('contour');

  const canvasOriginalRef = useRef<HTMLCanvasElement>(null);
  const canvasProcessedRef = useRef<HTMLCanvasElement>(null);

  // Clinical preset synthetic/curated eye photos for immediate classroom demonstration
  const sampleEyes = [
    {
      id: 'severe_icterus',
      label: 'Severe Scleral Icterus (Bilirubin ~12.5 mg/dL)',
      type: 'severe',
      description: 'Marked diffuse yellow discoloration of bulbar conjunctiva and sclera.',
      expected: 'High Suspicion'
    },
    {
      id: 'mild_icterus',
      label: 'Mild Scleral Icterus (Bilirubin ~3.2 mg/dL)',
      type: 'mild',
      description: 'Subtle peripheral conjunctival yellowing, often missed in ambient incandescent light.',
      expected: 'Moderate'
    },
    {
      id: 'healthy_sclera',
      label: 'Normal Healthy Sclera (Bilirubin ~0.6 mg/dL)',
      type: 'healthy',
      description: 'Pearly white sclera with normal micro-vascularity and no chrominance shift.',
      expected: 'Low'
    }
  ];

  // Draw procedural clinical eye on canvas if user chooses a preset
  const drawPresetEye = (type: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 280;
    const ctx = canvas.getContext('2d')!;

    // Eyelid skin background
    ctx.fillStyle = '#d4a373';
    ctx.fillRect(0, 0, 400, 280);

    // Eye fissure contour
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(50, 140);
    ctx.bezierCurveTo(120, 50, 280, 50, 350, 140);
    ctx.bezierCurveTo(280, 230, 120, 230, 50, 140);
    ctx.closePath();
    ctx.clip();

    // Sclera base tone
    let scleraBase = '#f8fafc'; // pearly white
    if (type === 'severe') scleraBase = '#eab308'; // prominent bile yellow #eab308
    if (type === 'mild') scleraBase = '#fef08a'; // subtle yellow tint #fef08a

    const scleraGrad = ctx.createRadialGradient(200, 140, 20, 200, 140, 160);
    if (type === 'severe') {
      scleraGrad.addColorStop(0, '#fef08a');
      scleraGrad.addColorStop(0.6, '#eab308');
      scleraGrad.addColorStop(1, '#ca8a04');
    } else if (type === 'mild') {
      scleraGrad.addColorStop(0, '#f8fafc');
      scleraGrad.addColorStop(0.5, '#fef08a');
      scleraGrad.addColorStop(1, '#fde047');
    } else {
      scleraGrad.addColorStop(0, '#ffffff');
      scleraGrad.addColorStop(0.8, '#f1f5f9');
      scleraGrad.addColorStop(1, '#cbd5e1');
    }
    ctx.fillStyle = scleraGrad;
    ctx.fillRect(50, 50, 300, 180);

    // Iris & Pupil (centered)
    ctx.beginPath();
    ctx.arc(200, 140, 50, 0, Math.PI * 2);
    ctx.fillStyle = '#451a03'; // deep hazel/brown iris
    ctx.fill();

    ctx.beginPath();
    ctx.arc(200, 140, 22, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a'; // black pupil
    ctx.fill();

    // Corneal specular reflection
    ctx.beginPath();
    ctx.arc(188, 128, 7, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fill();

    // Fine scleral conjunctival vessels
    ctx.strokeStyle = type === 'severe' ? 'rgba(180, 83, 9, 0.35)' : 'rgba(239, 68, 68, 0.25)';
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 7; i++) {
      ctx.beginPath();
      ctx.moveTo(70 + i * 15, 130 + (i % 3) * 10);
      ctx.lineTo(120 + i * 10, 135 + (i % 2) * 8);
      ctx.stroke();
    }

    ctx.restore();

    // Eyelid crease and lashes
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(48, 140);
    ctx.bezierCurveTo(120, 48, 280, 48, 352, 140);
    ctx.stroke();

    const dataUrl = canvas.toDataURL('image/png');
    setSelectedImageSrc(dataUrl);
  };

  // Convert RGB to HSV
  function rgbToHsv(r: number, g: number, b: number) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    const v = max;
    const d = max - min;
    const s = max === 0 ? 0 : d / max;

    if (max !== min) {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return { h: h * 360, s: s * 100, v: v * 100 };
  }

  // Convert RGB to CIE LAB (specifically b* yellow-blue opponent channel)
  function rgbToLabB(r: number, g: number, b: number): number {
    // Linearize RGB
    let rL = r / 255;
    let gL = g / 255;
    let bL = b / 255;
    rL = rL > 0.04045 ? Math.pow((rL + 0.055) / 1.055, 2.4) : rL / 12.92;
    gL = gL > 0.04045 ? Math.pow((gL + 0.055) / 1.055, 2.4) : gL / 12.92;
    bL = bL > 0.04045 ? Math.pow((bL + 0.055) / 1.055, 2.4) : bL / 12.92;

    // Convert to XYZ with D65 illuminant
    const y = (rL * 0.2126729 + gL * 0.7151522 + bL * 0.072175) / 1.0;
    const z = (rL * 0.0193339 + gL * 0.119192 + bL * 0.9503041) / 1.08883;

    const fy = y > 0.008856 ? Math.cbrt(y) : 7.787 * y + 16 / 116;
    const fz = z > 0.008856 ? Math.cbrt(z) : 7.787 * z + 16 / 116;

    // CIE LAB b* channel (+b* = Yellow, -b* = Blue)
    return 200 * (fy - fz);
  }

  // Process image with deterministic HSV + LAB segmentation
  const processImage = () => {
    if (!selectedImageSrc) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const origCanvas = canvasOriginalRef.current;
      const procCanvas = canvasProcessedRef.current;
      if (!origCanvas || !procCanvas) return;

      const w = 400;
      const h = 280;
      origCanvas.width = w;
      origCanvas.height = h;
      procCanvas.width = w;
      procCanvas.height = h;

      const oCtx = origCanvas.getContext('2d')!;
      const pCtx = procCanvas.getContext('2d')!;

      oCtx.drawImage(img, 0, 0, w, h);
      pCtx.drawImage(img, 0, 0, w, h);

      const imgData = oCtx.getImageData(0, 0, w, h);
      const procData = pCtx.createImageData(w, h);
      const data = imgData.data;
      const pData = procData.data;

      let yellowCount = 0;
      let totalValidPixels = 0;
      let sumLabB = 0;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const hsv = rgbToHsv(r, g, b);
        const labB = rgbToLabB(r, g, b);

        // Exclude dark pupil, iris, eyelashes (V < 25)
        const isNotDarkBackground = hsv.v > 20;

        if (isNotDarkBackground) {
          totalValidPixels++;
          sumLabB += labB;

          // Deterministic dual-color space threshold
          const isYellowHue = hsv.h >= thresholds.minHue && hsv.h <= thresholds.maxHue;
          const isYellowSat = hsv.s >= thresholds.minSaturation;
          const isYellowVal = hsv.v >= thresholds.minValue;
          const isLabYellow = labB >= thresholds.minLabB;

          const isIcterusPositive = isYellowHue && isYellowSat && isYellowVal && isLabYellow;

          if (isIcterusPositive) {
            yellowCount++;
            if (overlayMode === 'mask') {
              // High-contrast binary mask
              pData[i] = 250;     // R
              pData[i + 1] = 204; // G
              pData[i + 2] = 21;  // B (Bright yellow mask)
              pData[i + 3] = 255;
            } else if (overlayMode === 'heatmap') {
              // Heatmap intensity based on labB yellow saturation
              const intensity = Math.min(255, Math.max(80, Math.round(labB * 4.5)));
              pData[i] = intensity;
              pData[i + 1] = 50;
              pData[i + 2] = 20;
              pData[i + 3] = 220;
            } else {
              // Contour overlay: keep original pixel with glowing cyan boundary
              pData[i] = Math.min(255, r + 40);
              pData[i + 1] = Math.min(255, g + 80);
              pData[i + 2] = Math.min(255, b + 160); // Cyan overlay
              pData[i + 3] = 240;
            }
          } else {
            // Keep original pixel dimmed slightly
            pData[i] = Math.round(r * 0.7);
            pData[i + 1] = Math.round(g * 0.7);
            pData[i + 2] = Math.round(b * 0.7);
            pData[i + 3] = 255;
          }
        } else {
          // Dark pixel
          pData[i] = r;
          pData[i + 1] = g;
          pData[i + 2] = b;
          pData[i + 3] = 255;
        }
      }

      pCtx.putImageData(procData, 0, 0);

      const yellowPercentage = Number(((yellowCount / Math.max(1, totalValidPixels)) * 100).toFixed(1));
      const meanLabB = Number((sumLabB / Math.max(1, totalValidPixels)).toFixed(1));

      let scleralIcterusRisk: 'Low' | 'Moderate' | 'High Suspicion' = 'Low';
      if (yellowPercentage > 24 || meanLabB > 22) {
        scleralIcterusRisk = 'High Suspicion';
      } else if (yellowPercentage > 8 || meanLabB > 14) {
        scleralIcterusRisk = 'Moderate';
      }

      setMaskStats({
        totalPixels: totalValidPixels,
        yellowPixels: yellowCount,
        yellowPercentage,
        meanLabB,
        scleralIcterusRisk
      });

      setIsProcessing(false);
    };
    img.src = selectedImageSrc;
  };

  useEffect(() => {
    if (!selectedImageSrc) {
      drawPresetEye('severe');
    } else {
      processImage();
    }
  }, [selectedImageSrc, thresholds, overlayMode]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 6 * 1024 * 1024) {
        alert('File size exceeds the 6 MB security limit.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSelectedImageSrc(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Prominent Educational Notice */}
      <div className="bg-amber-950/40 border border-amber-600/50 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200 leading-relaxed">
          <span className="font-bold text-amber-100">EDUCATIONAL SYSTEM ONLY: NOT A MEDICAL DIAGNOSTIC DEVICE.</span> Scleral photography is subject to ambient color temperature, camera auto-white balance drift, flash reflections, and individual melanin variations. Never use computer vision as a solitary surrogate for serum laboratory bilirubin testing.
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-cyan-400" />
            Computer Vision Scleral Icterus (Jaundice) Screener
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Deterministic dual-color space segmentation (HSV &amp; CIE LAB) isolating hyperbilirubinemic yellow-chrominance spectrum on bulbar conjunctiva and sclera.
          </p>
        </div>

        {/* Upload Button */}
        <label className="cursor-pointer bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shrink-0">
          <Upload className="w-4 h-4" />
          <span>Upload Patient Photo (Max 6MB)</span>
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {/* Preset Reference Cases for Instant Classroom Demonstration */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800">
        <span className="text-xs text-slate-400 font-medium">Curated Teaching Presets:</span>
        {sampleEyes.map(sample => (
          <button
            key={sample.id}
            onClick={() => drawPresetEye(sample.type)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            {sample.label}
          </button>
        ))}
      </div>

      {/* Side-by-Side Dual Canvas: Original vs OpenCV HSV/LAB Segmentation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Original Canvas */}
        <div className="flex flex-col items-center bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between w-full">
            <span>Input Scleral Camera Image</span>
            <span className="text-slate-500 font-mono text-[11px]">400x280 RGB</span>
          </div>
          <div className="w-full flex justify-center overflow-hidden rounded-lg bg-slate-900 border border-slate-800">
            <canvas ref={canvasOriginalRef} className="max-w-full h-auto" />
          </div>
        </div>

        {/* OpenCV HSV/LAB Processed Canvas */}
        <div className="flex flex-col items-center bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="text-xs font-semibold text-cyan-300 mb-2 flex items-center justify-between w-full">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Isolated Yellow-Chrominance Overlay
            </span>
            <div className="flex items-center gap-1">
              {(['contour', 'mask', 'heatmap'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setOverlayMode(mode)}
                  className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded ${
                    overlayMode === mode ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full flex justify-center overflow-hidden rounded-lg bg-slate-900 border border-slate-800 relative">
            <canvas ref={canvasProcessedRef} className="max-w-full h-auto" />
            {isProcessing && (
              <div className="absolute inset-0 bg-slate-950/75 flex items-center justify-center text-xs text-cyan-300">
                <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Segmenting pixels...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quantitative Biomarker Metric Telemetry */}
      {maskStats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Icteric Pixel Surface Ratio</div>
            <div className="text-xl font-bold text-white mt-1 font-mono">
              {maskStats.yellowPercentage}% <span className="text-xs font-normal text-slate-400">({maskStats.yellowPixels.toLocaleString()} px)</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full ${maskStats.yellowPercentage > 20 ? 'bg-amber-500' : 'bg-cyan-500'}`}
                style={{ width: `${Math.min(100, maskStats.yellowPercentage * 2.5)}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Mean CIE LAB b* (Yellow Channel)</div>
            <div className="text-xl font-bold text-cyan-400 mt-1 font-mono">
              +{maskStats.meanLabB} <span className="text-xs font-normal text-slate-400">(Norm &lt; +10)</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Higher positive b* correlates with tissue bilirubin deposition.
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Diagnostic Heuristic Output</div>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${
                  maskStats.scleralIcterusRisk === 'High Suspicion'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : maskStats.scleralIcterusRisk === 'Moderate'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {maskStats.scleralIcterusRisk}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1.5 leading-snug">
              {maskStats.scleralIcterusRisk === 'High Suspicion' && 'Strongly indicates visible scleral jaundice (typical serum bilirubin &gt; 2.5-3.0 mg/dL).'}
              {maskStats.scleralIcterusRisk === 'Moderate' && 'Borderline chrominance shift; requires confirmatory enzymatic serum assay.'}
              {maskStats.scleralIcterusRisk === 'Low' && 'Pixel chrominance consistent with normal un-icteric scleral baseline.'}
            </div>
          </div>
        </div>
      )}

      {/* Explainable Parameter Tuning (No Black-Box) */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            Transparent Computer Vision Heuristic Parameters (HSV &amp; LAB)
          </span>
          <span className="text-[11px] text-slate-400">Zero hidden neural weights — pure optical mathematics</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Hue Range (Yellow)</span>
              <span className="font-mono">{thresholds.minHue}° - {thresholds.maxHue}°</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              value={thresholds.maxHue}
              onChange={e => setThresholds({ ...thresholds, maxHue: parseInt(e.target.value, 10) })}
              className="w-full accent-cyan-500 h-1 bg-slate-800 rounded cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Min Saturation</span>
              <span className="font-mono">{thresholds.minSaturation}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              value={thresholds.minSaturation}
              onChange={e => setThresholds({ ...thresholds, minSaturation: parseInt(e.target.value, 10) })}
              className="w-full accent-cyan-500 h-1 bg-slate-800 rounded cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Min Brightness (V)</span>
              <span className="font-mono">{thresholds.minValue}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              value={thresholds.minValue}
              onChange={e => setThresholds({ ...thresholds, minValue: parseInt(e.target.value, 10) })}
              className="w-full accent-cyan-500 h-1 bg-slate-800 rounded cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Min LAB b*</span>
              <span className="font-mono">+{thresholds.minLabB}</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              value={thresholds.minLabB}
              onChange={e => setThresholds({ ...thresholds, minLabB: parseInt(e.target.value, 10) })}
              className="w-full accent-cyan-500 h-1 bg-slate-800 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
