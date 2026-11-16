/**
 * Digitalization in Healthcare - Interactive Medical Knowledge Graph
 * Visualizes the complex network connecting Liver Diseases, Symptoms, Biomarkers,
 * Etiologies/Causes, and Therapeutic Interventions with path-tracing and node inspection.
 */

import React, { useState, useMemo } from 'react';
import {
  Share2,
  Filter,
  Search,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
  RotateCcw,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import {
  KNOWLEDGE_GRAPH_NODES,
  KNOWLEDGE_GRAPH_LINKS,
  KnowledgeGraphNode,
  KnowledgeGraphLink
} from '../../data/clinicalIntelligenceData';
import { useProgress } from '../../context/ProgressContext';

export const KnowledgeGraphExplorer: React.FC = () => {
  const { awardXP } = useProgress();
  const [selectedNodeId, setSelectedNodeId] = useState<string>('d_cirrhosis');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected node object
  const activeNode = useMemo(() => {
    return KNOWLEDGE_GRAPH_NODES.find((n) => n.id === selectedNodeId) || KNOWLEDGE_GRAPH_NODES[0];
  }, [selectedNodeId]);

  // Connected links for selected node
  const connectedLinks = useMemo(() => {
    return KNOWLEDGE_GRAPH_LINKS.filter(
      (l) => l.source === selectedNodeId || l.target === selectedNodeId
    );
  }, [selectedNodeId]);

  // Connected neighbor node IDs
  const connectedNodeIds = useMemo(() => {
    const ids = new Set<string>([selectedNodeId]);
    connectedLinks.forEach((l) => {
      ids.add(l.source);
      ids.add(l.target);
    });
    return ids;
  }, [selectedNodeId, connectedLinks]);

  // SVG Layout math: Arrange nodes in a circular or categorized constellation
  const svgWidth = 720;
  const svgHeight = 480;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;

  // Filtered nodes
  const displayNodes = useMemo(() => {
    return KNOWLEDGE_GRAPH_NODES.filter((node) => {
      const matchesType = filterType === 'all' || node.type === filterType;
      const matchesSearch =
        searchTerm === '' ||
        node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [filterType, searchTerm]);

  // Node position map
  const nodePositions = useMemo(() => {
    const posMap: Record<string, { x: number; y: number }> = {};
    const total = KNOWLEDGE_GRAPH_NODES.length;

    KNOWLEDGE_GRAPH_NODES.forEach((node, idx) => {
      // Group geometrically by type for clinical layout
      let radius = 175;
      let angleOffset = 0;

      if (node.type === 'disease') {
        radius = 80;
        angleOffset = 0;
      } else if (node.type === 'cause') {
        radius = 185;
        angleOffset = -Math.PI / 2;
      } else if (node.type === 'biomarker') {
        radius = 180;
        angleOffset = Math.PI / 3;
      } else if (node.type === 'symptom') {
        radius = 190;
        angleOffset = Math.PI * 0.9;
      } else if (node.type === 'treatment') {
        radius = 210;
        angleOffset = Math.PI * 1.5;
      }

      const angle = (idx / total) * Math.PI * 2 + angleOffset;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      posMap[node.id] = { x, y };
    });

    return posMap;
  }, [centerX, centerY]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800 font-bold flex items-center gap-1">
                <Share2 className="w-3.5 h-3.5" />
                Relational Medical Knowledge Graph
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded font-mono font-semibold">
                30+ Nodes &bull; Bidirectional Path Tracing
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>Hepatology Clinical Knowledge Graph</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Explore how clinical etiologies, cellular biomarkers, pathophysiological liver diseases, physical stigmata, and targeted pharmacological therapies intersect in an interactive semantic network.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search node or symptom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-48"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              {[
                { id: 'all', label: 'All' },
                { id: 'disease', label: 'Diseases' },
                { id: 'biomarker', label: 'Biomarkers' },
                { id: 'symptom', label: 'Symptoms' },
                { id: 'cause', label: 'Causes' },
                { id: 'treatment', label: 'Treatments' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterType(f.id)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                    filterType === f.id
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Graph Visualization & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Graph SVG Display */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex flex-col items-center justify-center relative overflow-hidden select-none">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto max-h-[500px] overflow-visible"
          >
            <defs>
              <linearGradient id="edgeActive" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Render Links */}
            {KNOWLEDGE_GRAPH_LINKS.map((link, idx) => {
              const p1 = nodePositions[link.source];
              const p2 = nodePositions[link.target];
              if (!p1 || !p2) return null;

              const isHighlighted =
                connectedNodeIds.has(link.source) && connectedNodeIds.has(link.target);

              return (
                <g key={idx}>
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={isHighlighted ? 'url(#edgeActive)' : '#334155'}
                    strokeWidth={isHighlighted ? 2.5 : 1}
                    strokeDasharray={isHighlighted ? 'none' : '2 3'}
                    opacity={isHighlighted ? 0.9 : 0.3}
                  />
                </g>
              );
            })}

            {/* Render Nodes */}
            {KNOWLEDGE_GRAPH_NODES.map((node) => {
              const pos = nodePositions[node.id];
              if (!pos) return null;

              const isSelected = selectedNodeId === node.id;
              const isConnected = connectedNodeIds.has(node.id);
              const isFilteredIn = displayNodes.some((dn) => dn.id === node.id);

              return (
                <g
                  key={node.id}
                  onClick={() => {
                    setSelectedNodeId(node.id);
                    awardXP(5);
                  }}
                  className="cursor-pointer transition-all duration-200"
                  opacity={isFilteredIn ? (isConnected ? 1 : 0.5) : 0.15}
                >
                  {/* Outer Pulsing Glow if Selected */}
                  {isSelected && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={node.val + 6}
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      className="animate-pulse"
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isSelected ? node.val + 2 : node.val}
                    fill={node.color}
                    stroke={isSelected ? '#ffffff' : '#0f172a'}
                    strokeWidth={2}
                  />

                  {/* Node Label */}
                  <text
                    x={pos.x}
                    y={pos.y + node.val + 11}
                    textAnchor="middle"
                    fill={isSelected ? '#38bdf8' : '#e2e8f0'}
                    fontSize={isSelected ? 10 : 8}
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    fontFamily="sans-serif"
                    className="pointer-events-none drop-shadow"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Graph Legend */}
          <div className="w-full flex flex-wrap items-center justify-center gap-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" /> Diseases
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" /> Biomarkers
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#fde047]" /> Symptoms
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#fdba74]" /> Etiologies / Causes
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4ade80]" /> Treatments
            </span>
          </div>
        </div>

        {/* Right: Selected Node Inspection Desk */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
              Inspected Knowledge Node
            </span>
            <h3 className="text-base font-bold text-white mt-0.5 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: activeNode.color }} />
              <span>{activeNode.label}</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400 uppercase mt-0.5 block">
              Type: {activeNode.type}
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <span className="font-semibold text-slate-200">Clinical Semantic Definition:</span>
            <p className="text-[11px] leading-relaxed text-slate-300 bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
              {activeNode.description}
            </p>
          </div>

          {/* Connected Pathways */}
          <div className="space-y-2 text-xs">
            <span className="font-semibold text-slate-200">
              Directly Connected Relational Links ({connectedLinks.length}):
            </span>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {connectedLinks.map((link, idx) => {
                const isOrigin = link.source === activeNode.id;
                const otherNodeId = isOrigin ? link.target : link.source;
                const otherNode = KNOWLEDGE_GRAPH_NODES.find((n) => n.id === otherNodeId);
                if (!otherNode) return null;

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedNodeId(otherNode.id)}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-colors cursor-pointer flex items-center justify-between text-[11px]"
                  >
                    <div>
                      <span className="font-bold text-white">{otherNode.label}</span>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {isOrigin ? `${link.relationship} \u2192` : `\u2190 ${link.relationship}`}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
