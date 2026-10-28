import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Layers, Eye, EyeOff, RotateCw, ZoomIn, ZoomOut, AlertCircle, Sparkles } from 'lucide-react';

interface ThreeLiverViewerProps {
  onSelectAnatomyPart?: (partName: string) => void;
}

export const ThreeLiverViewer: React.FC<ThreeLiverViewerProps> = ({ onSelectAnatomyPart }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isZenMode, setIsZenMode] = useState(false);
  const [jaundiceSeverity, setJaundiceSeverity] = useState(0); // 0 (Healthy) to 100 (Severe Icterus)
  const [explodedView, setExplodedView] = useState(0); // 0 to 100%
  const [activeSegment, setActiveSegment] = useState<string>('Right Lobe (Segments V, VI, VII, VIII)');
  const [showMicroLobule, setShowMicroLobule] = useState(false);

  // References to dynamic 3D elements
  const rightLobeRef = useRef<THREE.Mesh | null>(null);
  const leftLobeRef = useRef<THREE.Mesh | null>(null);
  const gallbladderRef = useRef<THREE.Mesh | null>(null);
  const portalVeinRef = useRef<THREE.Group | null>(null);
  const hepaticArteryRef = useRef<THREE.Group | null>(null);
  const bileDuctRef = useRef<THREE.Group | null>(null);
  const lobuleGroupRef = useRef<THREE.Group | null>(null);
  const liverGroupRef = useRef<THREE.Group | null>(null);

  // Material references for color transition
  const liverMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const bileMatRef = useRef<THREE.MeshStandardMaterial | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Slate 900
    scene.fog = new THREE.FogExp2(0x0f172a, 0.035);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.8, 7.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    container.appendChild(renderer.domElement);

    // Room Environment for PBR reflection
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio 3-point Lighting
    const keyLight = new THREE.DirectionalLight(0xfff3e0, 2.6); // Warm key
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.shadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight(0x90caf9, 0x1e293b, 1.4); // Cool sky/warm floor fill
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    rimLight.position.set(-5, 4, -4);
    scene.add(rimLight);

    // Radial contact shadow plane beneath the liver
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(7.5, 7.5);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.65
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.55;
    scene.add(shadowMesh);

    // Procedural Liver Hepatic Texture (subtle capsular mottling)
    const capCanvas = document.createElement('canvas');
    capCanvas.width = 512;
    capCanvas.height = 512;
    const cCtx = capCanvas.getContext('2d');
    if (cCtx) {
      cCtx.fillStyle = '#8b2e27';
      cCtx.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 400; i++) {
        cCtx.fillStyle = Math.random() > 0.5 ? 'rgba(120, 30, 25, 0.15)' : 'rgba(165, 55, 45, 0.15)';
        cCtx.beginPath();
        cCtx.arc(Math.random() * 512, Math.random() * 512, 4 + Math.random() * 12, 0, Math.PI * 2);
        cCtx.fill();
      }
    }
    const capTexture = new THREE.CanvasTexture(capCanvas);
    capTexture.colorSpace = THREE.SRGBColorSpace;
    capTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // Composite 3-12 Part Procedural Liver Group
    const liverMasterGroup = new THREE.Group();
    liverGroupRef.current = liverMasterGroup;
    scene.add(liverMasterGroup);

    // Main hepatic tissue material
    const liverMaterial = new THREE.MeshStandardMaterial({
      color: 0x8f2d24, // Healthy deep red-brown hepatocyte tone
      map: capTexture,
      roughness: 0.38,
      metalness: 0.08,
      bumpMap: capTexture,
      bumpScale: 0.02
    });
    liverMatRef.current = liverMaterial;

    // 1. Right Hepatic Lobe (Primary silhouette - larger bulk, segments 5, 6, 7, 8)
    const rightLobeGeo = new THREE.SphereGeometry(1.65, 36, 28);
    rightLobeGeo.scale(1.4, 0.88, 1.05);
    // Deform vertices organically for hepatic wedge shape
    const posAttr = rightLobeGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const z = posAttr.getZ(i);
      // organic taper toward right inferior margin
      const taper = 1.0 - (x > 0 ? (x / 2.5) * 0.25 : 0);
      posAttr.setY(i, y * taper);
    }
    rightLobeGeo.computeVertexNormals();

    const rightLobeMesh = new THREE.Mesh(rightLobeGeo, liverMaterial);
    rightLobeMesh.position.set(0.65, 0.1, 0);
    rightLobeMesh.castShadow = !isSoftwareGl;
    rightLobeMesh.receiveShadow = !isSoftwareGl;
    liverMasterGroup.add(rightLobeMesh);
    rightLobeRef.current = rightLobeMesh;

    // 2. Left Hepatic Lobe (Flattened, thinner wedge - segments 2, 3, 4)
    const leftLobeGeo = new THREE.SphereGeometry(1.2, 32, 24);
    leftLobeGeo.scale(1.15, 0.65, 0.75);
    const leftPos = leftLobeGeo.attributes.position;
    for (let i = 0; i < leftPos.count; i++) {
      const x = leftPos.getX(i);
      const y = leftPos.getY(i);
      if (x < 0) {
        leftPos.setY(i, y * 0.7); // lateral wedge taper
      }
    }
    leftLobeGeo.computeVertexNormals();

    const leftLobeMesh = new THREE.Mesh(leftLobeGeo, liverMaterial);
    leftLobeMesh.position.set(-1.45, -0.05, 0.15);
    leftLobeMesh.rotation.z = 0.15;
    leftLobeMesh.castShadow = !isSoftwareGl;
    liverMasterGroup.add(leftLobeMesh);
    leftLobeRef.current = leftLobeMesh;

    // 3. Falciform & Coronary Ligament (Pearly structural divider)
    const ligamentCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.2, 1.1, 0.8),
      new THREE.Vector3(-0.25, 0.3, 1.1),
      new THREE.Vector3(-0.3, -0.7, 0.85)
    ]);
    const ligamentGeo = new THREE.TubeGeometry(ligamentCurve, 20, 0.065, 8, false);
    const ligamentMat = new THREE.MeshStandardMaterial({
      color: 0xeeece5,
      roughness: 0.55,
      metalness: 0.05
    });
    const ligamentMesh = new THREE.Mesh(ligamentGeo, ligamentMat);
    liverMasterGroup.add(ligamentMesh);

    // 4. Gallbladder (Pear-shaped visceral sac on visceral surface)
    const gbGeo = new THREE.SphereGeometry(0.48, 24, 20);
    gbGeo.scale(0.85, 1.45, 0.75);
    const gbMat = new THREE.MeshStandardMaterial({
      color: 0x3d7042, // Rich biliary emerald green
      roughness: 0.28,
      metalness: 0.15
    });
    bileMatRef.current = gbMat;
    const gbMesh = new THREE.Mesh(gbGeo, gbMat);
    gbMesh.position.set(0.35, -0.85, 0.45);
    gbMesh.rotation.set(0.3, 0.15, -0.4);
    gbMesh.castShadow = !isSoftwareGl;
    liverMasterGroup.add(gbMesh);
    gallbladderRef.current = gbMesh;

    // 5. Vascular Tree: Hepatic Portal Vein (Deep Indigo-Blue)
    const portalGroup = new THREE.Group();
    const pvMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb, // Rich venous blue
      roughness: 0.25,
      metalness: 0.45
    });
    const pvTrunk = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.0, -1.5, -0.2),
      new THREE.Vector3(0.0, -0.6, -0.1),
      new THREE.Vector3(0.1, -0.2, 0.0)
    ]);
    const pvTrunkMesh = new THREE.Mesh(new THREE.TubeGeometry(pvTrunk, 16, 0.16, 12, false), pvMat);
    portalGroup.add(pvTrunkMesh);

    // Right and Left portal branch
    const pvRight = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.1, -0.2, 0.0),
      new THREE.Vector3(0.8, -0.1, -0.15),
      new THREE.Vector3(1.3, 0.2, -0.1)
    ]);
    portalGroup.add(new THREE.Mesh(new THREE.TubeGeometry(pvRight, 12, 0.11, 8, false), pvMat));

    const pvLeft = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.1, -0.2, 0.0),
      new THREE.Vector3(-0.7, -0.15, 0.05),
      new THREE.Vector3(-1.2, 0.1, 0.1)
    ]);
    portalGroup.add(new THREE.Mesh(new THREE.TubeGeometry(pvLeft, 12, 0.09, 8, false), pvMat));
    liverMasterGroup.add(portalGroup);
    portalVeinRef.current = portalGroup;

    // 6. Proper Hepatic Artery (Oxygenated Crimson Red)
    const arteryGroup = new THREE.Group();
    const haMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626, // Bright arterial red
      roughness: 0.3,
      metalness: 0.35
    });
    const haTrunk = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.25, -1.45, -0.05),
      new THREE.Vector3(-0.15, -0.65, 0.05),
      new THREE.Vector3(0.0, -0.3, 0.15)
    ]);
    arteryGroup.add(new THREE.Mesh(new THREE.TubeGeometry(haTrunk, 16, 0.09, 8, false), haMat));

    const haRight = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.0, -0.3, 0.15),
      new THREE.Vector3(0.7, -0.1, 0.1),
      new THREE.Vector3(1.1, 0.15, 0.05)
    ]);
    arteryGroup.add(new THREE.Mesh(new THREE.TubeGeometry(haRight, 12, 0.065, 8, false), haMat));
    liverMasterGroup.add(arteryGroup);
    hepaticArteryRef.current = arteryGroup;

    // 7. Common Bile Duct & Cystic Duct (Emerald Biliary System)
    const bileGroup = new THREE.Group();
    const cbdMat = new THREE.MeshStandardMaterial({
      color: 0x16a34a, // Vibrant biliary green
      roughness: 0.3,
      metalness: 0.2
    });
    const cbdCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.25, -0.55, 0.35),
      new THREE.Vector3(0.2, -1.0, 0.15),
      new THREE.Vector3(0.15, -1.5, 0.0)
    ]);
    bileGroup.add(new THREE.Mesh(new THREE.TubeGeometry(cbdCurve, 16, 0.08, 8, false), cbdMat));

    const cysticDuct = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.35, -0.65, 0.45),
      new THREE.Vector3(0.25, -0.55, 0.35)
    ]);
    bileGroup.add(new THREE.Mesh(new THREE.TubeGeometry(cysticDuct, 8, 0.06, 6, false), cbdMat));
    liverMasterGroup.add(bileGroup);
    bileDuctRef.current = bileGroup;

    // 8. Inferior Vena Cava (Posterior large vessel)
    const ivcMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      roughness: 0.35,
      metalness: 0.2
    });
    const ivcGeo = new THREE.CylinderGeometry(0.28, 0.28, 3.4, 24);
    const ivcMesh = new THREE.Mesh(ivcGeo, ivcMat);
    ivcMesh.position.set(0.0, 0.2, -1.1);
    ivcMesh.rotation.z = 0.08;
    liverMasterGroup.add(ivcMesh);

    // 9. Micro-Architecture: Classical Hepatic Lobule (Hexagonal Prism)
    const lobuleGroup = new THREE.Group();
    lobuleGroup.position.set(2.2, 1.4, 0.6);
    lobuleGroup.scale.set(0.001, 0.001, 0.001); // starts hidden
    lobuleGroupRef.current = lobuleGroup;
    scene.add(lobuleGroup);

    // Hexagonal cylinder
    const hexGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.7, 6);
    const hexMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      wireframe: true,
      roughness: 0.4
    });
    const hexMesh = new THREE.Mesh(hexGeo, hexMat);
    lobuleGroup.add(hexMesh);

    // Central Vein in middle of lobule
    const cvGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.8, 12);
    const cvMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6 });
    const cvMesh = new THREE.Mesh(cvGeo, cvMat);
    lobuleGroup.add(cvMesh);

    // 6 Portal Triads at the 6 vertices
    for (let k = 0; k < 6; k++) {
      const angle = (k * Math.PI) / 3;
      const x = Math.cos(angle) * 0.85;
      const z = Math.sin(angle) * 0.85;

      const triadGroup = new THREE.Group();
      triadGroup.position.set(x, 0, z);

      const tPv = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.75, 8), pvMat);
      tPv.position.x = -0.04;
      const tHa = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.75, 8), haMat);
      tHa.position.x = 0.04;
      const tBd = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.75, 8), cbdMat);
      tBd.position.z = 0.05;

      triadGroup.add(tPv, tHa, tBd);
      lobuleGroup.add(triadGroup);
    }

    // Animation & Smooth Damping Variables
    let reqId = 0;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationX = 0.15;
    let targetRotationY = -0.3;
    let currentRotationX = 0.15;
    let currentRotationY = -0.3;
    let targetZoom = 7.5;
    let currentZoom = 7.5;

    // Mouse & Touch Controls
    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.008;
      targetRotationX = Math.max(-1.0, Math.min(1.0, targetRotationX));
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetZoom += e.deltaY * 0.004;
      targetZoom = Math.max(4.0, Math.min(12.0, targetZoom));
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // Render loop with high-precision time tracking
    let lastTime = performance.now();
    let totalElapsedTime = 0;

    const renderTick = (currentTime: number = performance.now()) => {
      const delta = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;
      totalElapsedTime += delta;

      // Smooth damping
      currentRotationX = THREE.MathUtils.damp(currentRotationX, targetRotationX, 8, delta);
      currentRotationY = THREE.MathUtils.damp(currentRotationY, targetRotationY, 8, delta);
      currentZoom = THREE.MathUtils.damp(currentZoom, targetZoom, 6, delta);

      camera.position.z = currentZoom;
      liverMasterGroup.rotation.x = currentRotationX;
      liverMasterGroup.rotation.y = currentRotationY;

      // Gentle floating anatomical respiration
      liverMasterGroup.position.y = Math.sin(totalElapsedTime * 0.8) * 0.06;

      renderer.render(scene, camera);
      reqId = requestAnimationFrame(renderTick);
    };

    renderTick();

    // Resize observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    return () => {
      cancelAnimationFrame(reqId);
      ro.disconnect();
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Effect to update Jaundice / Bilirubin Accumulation in real-time
  useEffect(() => {
    if (!liverMatRef.current) return;
    // Healthy tone: #8f2d24 (RGB 143, 45, 36)
    // Severe Icteric tone: #80681b (Bile stained brownish-olive yellow)
    const factor = jaundiceSeverity / 100;
    const r = THREE.MathUtils.lerp(0.56, 0.50, factor);
    const g = THREE.MathUtils.lerp(0.18, 0.41, factor);
    const b = THREE.MathUtils.lerp(0.14, 0.11, factor);
    liverMatRef.current.color.setRGB(r, g, b);

    if (bileMatRef.current) {
      // Engorged gallbladder in cholestasis
      const gbFactor = Math.min(1.0, factor * 1.4);
      bileMatRef.current.color.setRGB(
        THREE.MathUtils.lerp(0.24, 0.15, gbFactor),
        THREE.MathUtils.lerp(0.44, 0.55, gbFactor),
        THREE.MathUtils.lerp(0.26, 0.12, gbFactor)
      );
    }
  }, [jaundiceSeverity]);

  // Effect to update Exploded Anatomical Separation
  useEffect(() => {
    const f = explodedView / 100;
    if (rightLobeRef.current) {
      rightLobeRef.current.position.x = 0.65 + f * 0.9;
    }
    if (leftLobeRef.current) {
      leftLobeRef.current.position.x = -1.45 - f * 0.9;
    }
    if (gallbladderRef.current) {
      gallbladderRef.current.position.y = -0.85 - f * 0.8;
      gallbladderRef.current.position.z = 0.45 + f * 0.6;
    }
    if (portalVeinRef.current) {
      portalVeinRef.current.position.y = -f * 0.6;
    }
    if (hepaticArteryRef.current) {
      hepaticArteryRef.current.position.z = f * 0.6;
    }
    if (bileDuctRef.current) {
      bileDuctRef.current.position.x = -f * 0.5;
    }
  }, [explodedView]);

  // Toggle Lobule Micro-Architecture scale
  useEffect(() => {
    if (!lobuleGroupRef.current) return;
    const targetScale = showMicroLobule ? 1.0 : 0.001;
    lobuleGroupRef.current.scale.set(targetScale, targetScale, targetScale);
  }, [showMicroLobule]);

  const selectPart = (name: string) => {
    setActiveSegment(name);
    if (onSelectAnatomyPart) onSelectAnatomyPart(name);
  };

  return (
    <div className="relative w-full h-[540px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
      {/* Top Floating Badge & Specs (Unobtrusive) */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3 bg-slate-900/85 border border-slate-700/60 px-4 py-2 rounded-xl backdrop-blur-none text-xs text-slate-200 pointer-events-auto">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
        <div>
          <span className="font-semibold text-white tracking-wide">3D Hepatic Spatial Anatomy & Icterus Engine</span>
          <span className="text-slate-400 ml-2">Couinaud Segments & Vascular Triad</span>
        </div>
      </div>

      {/* Top Right Quick Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() => setShowMicroLobule(!showMicroLobule)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
            showMicroLobule
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
          }`}
          title="Toggle Microscopic Hepatic Lobule Model"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {showMicroLobule ? 'Hide Micro Lobule' : 'Inspect Micro Lobule'}
        </button>

        <button
          onClick={() => setIsZenMode(!isZenMode)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          title="Collapse/Expand HUD Controls"
        >
          {isZenMode ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          {isZenMode ? 'Show Controls' : 'Zen View'}
        </button>
      </div>

      {/* 3D Canvas Mount (100% Unobstructed Center) */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Anatomical Segment Info Pill */}
      {!isZenMode && (
        <div className="absolute bottom-28 left-6 z-10 max-w-sm bg-slate-900/90 border border-slate-700 p-3 rounded-xl shadow-lg pointer-events-auto">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">Selected Segment</div>
          <div className="text-sm font-bold text-white mt-0.5">{activeSegment}</div>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {activeSegment.includes('Right') && 'Constitutes ~65% of liver volume. Drained by right hepatic vein. Highly susceptible to ischemic injury and fatty accumulation.'}
            {activeSegment.includes('Left') && 'Thinner lateral segment. Borders the stomach and spleen. Contains segments II, III, and IV divided by the falciform ligament.'}
            {activeSegment.includes('Gallbladder') && 'Stores and concentrates hepatic bile (up to 10-fold). Secretes bile into the duodenum via cholecystokinin stimulation.'}
            {activeSegment.includes('Portal') && 'Supplies 75% of blood flow and nutrients from gastrointestinal tract to the liver at low pressure (~7-10 mmHg).'}
            {activeSegment.includes('Artery') && 'Supplies remaining 25% highly-oxygenated blood to hepatic parenchymal arterioles.'}
            {activeSegment.includes('Bile') && 'Drains conjugated bilirubin and bile salts from intrahepatic canaliculi into the ampulla of Vater.'}
          </p>
        </div>
      )}

      {/* Unified Bottom Control Dock (Follows Ergonomic Directive: No Mid-Screen Occlusion) */}
      {!isZenMode && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-4xl bg-slate-900/95 border border-slate-700/80 rounded-2xl p-3 shadow-2xl backdrop-blur-none pointer-events-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Anatomical Quick Selection Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'Right Lobe', label: 'Right Lobe' },
              { id: 'Left Lobe', label: 'Left Lobe' },
              { id: 'Gallbladder', label: 'Gallbladder' },
              { id: 'Portal Vein', label: 'Portal Vein' },
              { id: 'Hepatic Artery', label: 'Hepatic Artery' },
              { id: 'Bile Duct', label: 'Bile Duct' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => selectPart(item.label)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                  activeSegment.includes(item.label)
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-semibold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Real-time Physiological Sliders */}
          <div className="flex items-center gap-6 w-full md:w-auto">
            {/* Jaundice / Bilirubin Accumulation Simulation */}
            <div className="flex flex-col gap-1 min-w-[170px]">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-amber-400 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Jaundice / Icterus
                </span>
                <span className="text-slate-300 font-mono">
                  {jaundiceSeverity === 0 ? 'Normal (0.8 mg/dL)' : `${(0.8 + (jaundiceSeverity / 100) * 14.2).toFixed(1)} mg/dL`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={jaundiceSeverity}
                onChange={e => setJaundiceSeverity(parseInt(e.target.value, 10))}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Exploded View Slider */}
            <div className="flex flex-col gap-1 min-w-[140px]">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-cyan-400 font-medium flex items-center gap-1">
                  <Layers className="w-3 h-3" /> Exploded View
                </span>
                <span className="text-slate-300 font-mono">{explodedView}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={explodedView}
                onChange={e => setExplodedView(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
