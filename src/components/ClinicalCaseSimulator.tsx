/**
 * Digitalization in Healthcare - High-Fidelity Clinical Case Simulator
 * Interactive medical student roleplay environment: diagnose patient cases
 * based on laboratory panels, clinical history, ultrasound findings, and De Ritis ratios to earn XP.
 */

import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Eye,
  FileCheck,
  FileText,
  Filter,
  Flame,
  FlaskConical,
  HeartPulse,
  HelpCircle,
  Layers,
  Microscope,
  RotateCcw,
  Search,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  Target,
  Thermometer,
  Trophy,
  User,
  Users,
  X,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { TopPerformersSidebar } from './TopPerformersSidebar';

export type DifficultyTier = 'Beginner' | 'Intermediate' | 'Advanced';

export interface DifficultyTierInfo {
  tier: DifficultyTier;
  title: string;
  clinicalRank: 'Junior Resident' | 'Senior Registrar' | 'Chief Fellow';
  subtitle: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  accentBg: string;
  accentText: string;
  maxXP: number;
  xpBreakdown: {
    phenotype: number;
    diagnosis: number;
    orders: number;
    perfectBonus: number;
  };
  complexityLevel: 1 | 2 | 3;
  complexityLabel: string;
  scenarioComplexity: string;
  diagnosticTraps: string[];
  keyCompetencies: string[];
}

export const DIFFICULTY_TIERS: Record<DifficultyTier, DifficultyTierInfo> = {
  Beginner: {
    tier: 'Beginner',
    title: 'Beginner',
    clinicalRank: 'Junior Resident',
    subtitle: 'Classic single-etiology presentations with textbook enzymatic patterns & preserved synthetic capacity.',
    badgeBg: 'bg-emerald-950/70',
    badgeBorder: 'border-emerald-700/60',
    badgeText: 'text-emerald-300',
    accentBg: 'bg-emerald-500',
    accentText: 'text-emerald-400',
    maxXP: 200,
    xpBreakdown: {
      phenotype: 45,
      diagnosis: 95,
      orders: 40,
      perfectBonus: 20
    },
    complexityLevel: 1,
    complexityLabel: 'Level 1: Foundational Hepatology',
    scenarioComplexity: 'Classic, isolated hepatic presentations (acute alcoholic hepatitis, mechanical choledocholithiasis, acute viral hepatitis A) with standard De Ritis ratios and no multiorgan decompensation.',
    diagnosticTraps: [
      'De Ritis ratio misinterpretation (AST > ALT vs ALT > AST)',
      'Confusing extrahepatic biliary dilation with intrahepatic microscopic cholestasis'
    ],
    keyCompetencies: [
      'AST:ALT De Ritis ratio calculation',
      'Direct vs. Indirect Bilirubin conjugation fraction',
      'First-line imaging evaluation on bedside ultrasound'
    ]
  },
  Intermediate: {
    tier: 'Intermediate',
    title: 'Intermediate',
    clinicalRank: 'Senior Registrar',
    subtitle: 'Diagnostic dilemmas, drug-induced hepatotoxicities, R-ratio calculations, and autoimmune cholestasis.',
    badgeBg: 'bg-amber-950/70',
    badgeBorder: 'border-amber-700/60',
    badgeText: 'text-amber-300',
    accentBg: 'bg-amber-500',
    accentText: 'text-amber-400',
    maxXP: 350,
    xpBreakdown: {
      phenotype: 80,
      diagnosis: 160,
      orders: 70,
      perfectBonus: 40
    },
    complexityLevel: 2,
    complexityLabel: 'Level 2: Complex Dilemmas & Toxicities',
    scenarioComplexity: 'Massive cytolysis exceeding 5,000 IU/L (APAP overdose), drug-induced liver injury (DILI) requiring R-ratio calculation and RUCAM latency scoring, and AMA-positive autoimmune micro-duct destruction (PBC).',
    diagnosticTraps: [
      'Delaying N-acetylcysteine while waiting for APAP blood levels',
      'Ordering inappropriate ERCP or steroids for non-dilated intrahepatic autoimmune cholestasis'
    ],
    keyCompetencies: [
      'Roussel Uclaf (RUCAM) latency & causality scoring',
      'Rumack-Matthew APAP nomogram & early NAC administration',
      'Autoantibody serology (AMA, ANA, IgM) correlation'
    ]
  },
  Advanced: {
    tier: 'Advanced',
    title: 'Advanced',
    clinicalRank: 'Chief Fellow',
    subtitle: 'Life-threatening multiorgan crises, decompensated cirrhosis, spontaneous bacterial peritonitis & metabolic emergencies.',
    badgeBg: 'bg-purple-950/70',
    badgeBorder: 'border-purple-700/60',
    badgeText: 'text-purple-300',
    accentBg: 'bg-purple-500',
    accentText: 'text-purple-400',
    maxXP: 500,
    xpBreakdown: {
      phenotype: 110,
      diagnosis: 230,
      orders: 100,
      perfectBonus: 60
    },
    complexityLevel: 3,
    complexityLabel: 'Level 3: Critical ICU Hepatorenal Decompensation',
    scenarioComplexity: 'Decompensated cirrhosis complicated by spontaneous bacterial peritonitis (SBP), tense ascites, hepatorenal syndrome risk, and fulminant Wilsonian hepatic crisis with Coombs-negative intravascular hemolysis and paradoxical low alkaline phosphatase.',
    diagnosticTraps: [
      'Administering aggressive diuretics or NSAIDs in SBP precipitating fatal hepatorenal syndrome',
      'Overlooking Coombs-negative hemolytic anemia and low ALP:bilirubin ratio (<4.0) in young acute liver failure'
    ],
    keyCompetencies: [
      'Emergency diagnostic paracentesis (PMN ≥ 250/mm³ threshold)',
      'Targeted 1.5g/kg IV albumin protocol for hepatorenal syndrome prevention',
      'Nazer Wilson prognostic index & emergency liver transplant triage'
    ]
  }
};

export interface PatientCase {
  id: string;
  patientName: string;
  age: number;
  gender: 'Male' | 'Female';
  occupation: string;
  bedNumber: string;
  admissionDate: string;
  difficulty: DifficultyTier;
  clinicalRank: 'Junior Resident' | 'Senior Registrar' | 'Chief Fellow';
  xpReward: number;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  pastMedicalSocialHistory: string;
  vitalSigns: {
    bloodPressure: string;
    heartRate: number;
    respiratoryRate: number;
    temperature: number; // Celsius
    oxygenSaturation: number; // %
    gcsAlertness: string;
  };
  physicalExamination: {
    general: string;
    scleraAndSkin: string;
    abdomen: string;
    neurological: string;
    peripheralStigmata: string[];
  };
  laboratoryPanel: {
    totalBilirubin: number; // mg/dL
    directBilirubin: number; // mg/dL
    ast: number; // IU/L
    alt: number; // IU/L
    alp: number; // IU/L
    totalProtein: number; // g/dL
    albumin: number; // g/dL
    inr: number;
    plateletCount: number; // /uL
    wbcCount?: number; // /uL
    creatinine?: number; // mg/dL
    specialMarker?: {
      name: string;
      value: string;
      clinicalSignificance: string;
    };
  };
  ultrasoundAndImaging: {
    modality: string;
    liverArchitecture: string;
    biliaryTree: string;
    gallbladder: string;
    vasculatureAndSpleen: string;
    freeFluidAscites: string;
    radiologyImpression: string;
  };
  phenotypeOptions: {
    id: string;
    label: string;
    description: string;
    isCorrect: boolean;
  }[];
  differentialOptions: {
    id: string;
    diagnosis: string;
    pathophysiology: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  managementOrders: {
    id: string;
    order: string;
    clinicalRationale: string;
    isCorrect: boolean;
  }[];
  attendingDebrief: {
    pathophysiologicalSummary: string;
    deRitisSignificance: string;
    conjugationSignificance: string;
    clinicalPearl: string;
    guidelineCitation: string;
  };
}

export const CLINICAL_CASES: PatientCase[] = [
  {
    id: 'case-1-alcoholic-hepatitis',
    patientName: 'Rajesh K.',
    age: 49,
    gender: 'Male',
    occupation: 'Corporate Logistics Director',
    bedNumber: 'Hep-Ward 4B',
    admissionDate: '2 hours ago (Emergency Transfer)',
    difficulty: 'Beginner',
    clinicalRank: 'Junior Resident',
    xpReward: 200,
    chiefComplaint: 'Worsening jaundice, deep fatigue, abdominal fullness, and mild confusion over 10 days.',
    historyOfPresentIllness:
      '49-year-old male with a 15-year history of heavy ethanol intake (estimated 120-150g/day, escalated over past 4 months due to corporate stress). Two weeks prior to admission, he developed progressive nausea, loss of appetite, dark urine, and yellowness of sclera. Family noted subtle nocturnal disorientation and tremors over the last 48 hours. Denies illicit IV drugs, recent travel, or high-risk food ingestion.',
    pastMedicalSocialHistory:
      'Mild hypertension (irregularly compliant on amlodipine). Alcohol: 8-10 units of whisky daily. Non-smoker. No prior known hepatitis.',
    vitalSigns: {
      bloodPressure: '108/68 mmHg',
      heartRate: 104,
      respiratoryRate: 20,
      temperature: 38.2,
      oxygenSaturation: 97,
      gcsAlertness: '14/15 (Mildly sluggish, oriented to name and city)'
    },
    physicalExamination: {
      general: 'Ill-appearing, deeply icteric middle-aged male with low-grade pyrexia.',
      scleraAndSkin: 'Marked scleral icterus (yellow eyes), palmar erythema on bilateral thenar eminences, 5 spider angiomas across anterior clavicular chest.',
      abdomen: 'Moderately distended, tender smooth hepatomegaly extending 4 cm below the right costal margin (liver span 15.5 cm). Shifting dullness positive for trace ascites. No splenomegaly.',
      neurological: 'Bilateral low-frequency flapping tremor (asterixis Grade 1) upon sustained wrist dorsiflexion. Plantar reflexes flexor.',
      peripheralStigmata: ['Scleral Icterus', 'Spider Angiomas', 'Palmar Erythema', 'Asterixis', 'Tender Hepatomegaly']
    },
    laboratoryPanel: {
      totalBilirubin: 14.8,
      directBilirubin: 9.2,
      ast: 278,
      alt: 112,
      alp: 182,
      totalProtein: 6.0,
      albumin: 2.7,
      inr: 1.88,
      plateletCount: 118000,
      wbcCount: 14600,
      creatinine: 1.1,
      specialMarker: {
        name: "Maddrey's Discriminant Function (mDF)",
        value: '4.6 x (1.88 x 12 - 12) + 14.8 = 47.7',
        clinicalSignificance: 'mDF > 32 signifies severe acute alcoholic hepatitis with high 30-day mortality (>35%).'
      }
    },
    ultrasoundAndImaging: {
      modality: 'Bedside Abdominal Ultrasound',
      liverArchitecture: 'Markedly enlarged (16 cm), diffuse coarsened echotexture consistent with steatohepatitis. No focal nodular lesions.',
      biliaryTree: 'Normal caliber Common Bile Duct (CBD 4.5 mm). No intrahepatic biliary radicle dilation.',
      gallbladder: 'Mild diffuse gallbladder wall oedema (secondary to hypoalbuminemia/venous congestion). No cholelithiasis.',
      vasculatureAndSpleen: 'Portal vein patent with hepatopetal flow. Spleen upper limit of normal (11.5 cm).',
      freeFluidAscites: 'Trace free anechoic fluid identified in the pelvic rectovesical pouch and Morrison pouch.',
      radiologyImpression: 'Severe acute hepatomegaly with fatty infiltration, no biliary obstruction, trace ascites.'
    },
    phenotypeOptions: [
      {
        id: 'p-1',
        label: 'Acute Hepatocellular with Impaired Synthetic Function (De Ritis > 2.0)',
        description: 'Transaminases moderately elevated (<400 IU/L) with AST:ALT ratio > 2.0, profound conjugated hyperbilirubinemia, and coagulopathy (INR > 1.5).',
        isCorrect: true
      },
      {
        id: 'p-2',
        label: 'Pure Extrahepatic Cholestatic Syndrome',
        description: 'ALP > 5x upper limit of normal with biliary duct dilation and minimal transaminase rise.',
        isCorrect: false
      },
      {
        id: 'p-3',
        label: 'Hyperacute Cytolytic Hepatitis (Transaminases > 2000 IU/L)',
        description: 'Massive transaminase release with ALT predominant, indicative of viral or toxic necrosis.',
        isCorrect: false
      }
    ],
    differentialOptions: [
      {
        id: 'd-1',
        diagnosis: 'Severe Acute Alcoholic Hepatitis (AAH) with Early Decompensation',
        pathophysiology: 'Ethanol-induced oxidative stress, cytokine release (TNF-alpha, IL-8), and pyridoxal-5-phosphate deficiency suppressing ALT synthesis.',
        isCorrect: true,
        explanation: 'Pathognomonic AST:ALT ratio > 2.0 with AST < 400 IU/L, leukocytosis, fever, tender hepatomegaly, and Maddrey DF > 32.'
      },
      {
        id: 'd-2',
        diagnosis: 'Acute Viral Hepatitis A Superinfection',
        pathophysiology: 'Enterically transmitted picornavirus causing acute diffuse hepatocyte cytolysis.',
        isCorrect: false,
        explanation: 'Viral hepatitis typically presents with ALT > AST (De Ritis < 1.0) and transaminases in the thousands, not under 300.'
      },
      {
        id: 'd-3',
        diagnosis: 'Choledocholithiasis with Acute Cholangitis',
        pathophysiology: 'Gallstone impaction in the common bile duct causing biliary stasis and secondary bacterial infection.',
        isCorrect: false,
        explanation: 'Ultrasound confirms a normal CBD (4.5 mm) with no gallstones, and transaminases display the specific AST > ALT alcohol signature.'
      },
      {
        id: 'd-4',
        diagnosis: 'Budd-Chiari Syndrome (Hepatic Vein Thrombosis)',
        pathophysiology: 'Thrombotic occlusion of hepatic venous outflow causing acute congestive liver failure.',
        isCorrect: false,
        explanation: 'Doppler ultrasound confirms patent portal and hepatic venous flow with hepatopetal direction.'
      }
    ],
    managementOrders: [
      {
        id: 'm-1',
        order: 'Initiate IV Thiamine (Pabrinex) + IV fluids, screen for active infection (blood/urine/ascitic tap), and calculate Lille Score post-corticosteroid therapy (Prednisolone 40mg/day if sepsis excluded).',
        clinicalRationale: 'Prevent Wernicke encephalopathy immediately with thiamine prior to glucose. Sepsis must be ruled out before immunosuppression in high Maddrey score (>32).',
        isCorrect: true
      },
      {
        id: 'm-2',
        order: 'Urgent Endoscopic Retrograde Cholangiopancreatography (ERCP) with sphincterotomy.',
        clinicalRationale: 'Indicated for choledocholithiasis, which is ruled out by the non-dilated CBD.',
        isCorrect: false
      },
      {
        id: 'm-3',
        order: 'High-dose IV Paracetamol for antipyresis and prompt discharge on oral multivitamins.',
        clinicalRationale: 'Paracetamol is contraindicated in acute alcohol hepatitis due to depleted glutathione reserves and CYP2E1 induction.',
        isCorrect: false
      }
    ],
    attendingDebrief: {
      pathophysiologicalSummary:
        'This patient exemplifies classic Severe Acute Alcoholic Hepatitis (AAH). In alcohol-induced injury, mitochondrial damage releases AST, while hepatic pyridoxal-5-phosphate (vitamin B6) depletion impairs ALT enzymatic synthesis, generating the classic De Ritis Ratio (AST/ALT) > 2.0. Transaminases rarely exceed 300-500 IU/L despite profound jaundice.',
      deRitisSignificance: 'AST (278) / ALT (112) = 2.48 (> 2.0). A ratio > 2.0 is over 90% specific for alcoholic liver disease in this clinical context.',
      conjugationSignificance: 'Direct Bilirubin is 9.2 out of 14.8 (62%), confirming high conjugated intrahepatic canalicular cholestasis.',
      clinicalPearl: 'Never give IV dextrose to an alcoholic patient before IV Thiamine! Glucose drives thiamine consumption and precipitates irreversible Wernicke-Korsakoff syndrome.',
      guidelineCitation: 'AASLD Guidelines for the Management of Alcoholic Liver Disease (Maddrey DF threshold 32).'
    }
  },
  {
    id: 'case-2-biliary-obstruction',
    patientName: 'Sunita P.',
    age: 44,
    gender: 'Female',
    occupation: 'Primary School Educator',
    bedNumber: 'Surg-Bed 12',
    admissionDate: '6 hours ago',
    difficulty: 'Beginner',
    clinicalRank: 'Junior Resident',
    xpReward: 200,
    chiefComplaint: 'Sudden severe epigastric & right upper quadrant colic radiating to the shoulder blade, clay-colored stools, and tea-colored urine.',
    historyOfPresentIllness:
      '44-year-old mother of three presenting with 3 days of episodic severe right upper quadrant cramping following a rich, oily family dinner. Yesterday, her family noticed scleral yellowing and tea-colored urine. She also reports pale, light-clay stools and mild generalized itching. No history of alcohol abuse, blood transfusions, or hepatotoxic medications.',
    pastMedicalSocialHistory:
      'History of intermittent postprandial dyspepsia. BMI 31.2 kg/m². Non-smoker, non-drinker.',
    vitalSigns: {
      bloodPressure: '138/86 mmHg',
      heartRate: 86,
      respiratoryRate: 18,
      temperature: 37.4,
      oxygenSaturation: 99,
      gcsAlertness: '15/15 (Fully oriented)'
    },
    physicalExamination: {
      general: 'Comfortable at rest, obvious scleral icterus, no encephalopathy.',
      scleraAndSkin: 'Deep yellow sclera, no spider naevi, no palmar erythema.',
      abdomen: 'Sharp inspiratory halt on deep palpation of the right subcostal margin (Positive Murphy Sign). Mild involuntary guarding in the right hypochondrium. No hepatosplenomegaly.',
      neurological: 'Neurologically intact, no tremor, no asterixis.',
      peripheralStigmata: ['Scleral Icterus', 'Positive Murphy Sign', 'Clay-Colored Stools', 'Dark Urine']
    },
    laboratoryPanel: {
      totalBilirubin: 7.2,
      directBilirubin: 5.6,
      ast: 78,
      alt: 92,
      alp: 495,
      totalProtein: 7.1,
      albumin: 4.1,
      inr: 1.04,
      plateletCount: 284000,
      wbcCount: 11200,
      specialMarker: {
        name: 'Serum Gamma-Glutamyl Transferase (GGT)',
        value: '385 IU/L (Ref: 9 - 48)',
        clinicalSignificance: 'Co-elevation with ALP confirms hepatobiliary origin (excludes bone etiology).'
      }
    },
    ultrasoundAndImaging: {
      modality: 'Targeted Hepatobiliary Ultrasound',
      liverArchitecture: 'Normal parenchymal size and echogenicity without fatty infiltration or fibrosis.',
      biliaryTree: 'Common Bile Duct (CBD) dilated to 11.2 mm (Normal < 6 mm). Intrahepatic biliary radicle dilation (double-barrel sign) seen.',
      gallbladder: 'Distended with multiple mobile acoustic-shadowing calculi (largest 12 mm). Mild gallbladder wall thickening (3.8 mm).',
      vasculatureAndSpleen: 'Normal splenic dimensions (9.8 cm), patent portal vein.',
      freeFluidAscites: 'No free fluid or ascites.',
      radiologyImpression: 'Choledocholithiasis: Distal CBD dilation with obstructing intraductal calculus; acute cholelithiasis.'
    },
    phenotypeOptions: [
      {
        id: 'p-1',
        label: 'Extrahepatic Cholestatic Obstruction (Conjugated Bilirubin & ALP Predominant)',
        description: 'ALP > 3x ULN, Direct:Total Bilirubin ratio > 75%, normal liver synthetic function (Albumin & INR normal).',
        isCorrect: true
      },
      {
        id: 'p-2',
        label: 'Acute Necroinflammatory Viral Hepatitis',
        description: 'Massive transaminase leak (ALT/AST > 1000) with minimal ALP increase.',
        isCorrect: false
      },
      {
        id: 'p-3',
        label: 'Decompensated Chronic Cirrhosis with Portal Hypertension',
        description: 'Thrombocytopenia, splenomegaly, hypoalbuminemia, and coagulopathy.',
        isCorrect: false
      }
    ],
    differentialOptions: [
      {
        id: 'd-1',
        diagnosis: 'Choledocholithiasis with Biliary Outflow Obstruction',
        pathophysiology: 'Mechanical gallstone migration into the common bile duct halting bile transit into the duodenum.',
        isCorrect: true,
        explanation: 'Conjugated hyperbilirubinemia, marked ALP/GGT elevation, dilated 11.2 mm CBD, and clear ultrasound demonstration of intraductal calculus.'
      },
      {
        id: 'd-2',
        diagnosis: 'Primary Biliary Cholangitis (PBC)',
        pathophysiology: 'Autoimmune granulomatous destruction of interlobular micro-bile ducts.',
        isCorrect: false,
        explanation: 'PBC is intrahepatic with normal large bile ducts; here ultrasound proves extrahepatic CBD stone and macroscopic ductal dilation.'
      },
      {
        id: 'd-3',
        diagnosis: 'Hemolytic Spherocytosis',
        pathophysiology: 'Excessive RBC breakdown generating unconjugated bilirubin beyond hepatic glucuronidation capacity.',
        isCorrect: false,
        explanation: 'Hemolysis produces unconjugated (indirect) bilirubin, normal stool color, and normal ALP/CBD.'
      }
    ],
    managementOrders: [
      {
        id: 'm-1',
        order: 'Keep NPO (nil per os), initiate IV crystalloids + IV broad-spectrum antibiotics (ceftriaxone), and arrange urgent Gastroenterology consultation for Endoscopic Retrograde Cholangiopancreatography (ERCP) with biliary sphincterotomy followed by elective laparoscopic cholecystectomy.',
        clinicalRationale: 'Decompresses the obstructed biliary tree immediately to prevent ascending life-threatening suppurative cholangitis.',
        isCorrect: true
      },
      {
        id: 'm-2',
        order: 'Start high-dose oral Prednisolone 60mg daily and monitor liver enzymes.',
        clinicalRationale: 'Steroids have zero role in mechanical biliary obstruction and risk severe septic cholangitis.',
        isCorrect: false
      },
      {
        id: 'm-3',
        order: 'Discharge with antacids and recommend a low-fat diet without endoscopic intervention.',
        clinicalRationale: 'Dangerous: An untreated obstructing CBD stone carries high mortality from acute cholangitis and gallstone pancreatitis.',
        isCorrect: false
      }
    ],
    attendingDebrief: {
      pathophysiologicalSummary:
        'When a gallstone blocks the common bile duct, hepatocytes successfully conjugate bilirubin with glucuronic acid, but the bile cannot enter the duodenum. Bilirubin diglucuronide regurgitates back into systemic capillaries, generating dark urine (water-soluble conjugated bilirubin) and acholic/clay stools (absence of stercobilin).',
      deRitisSignificance: 'AST (78) / ALT (92) = 0.84 (< 1.0). Transaminases are only mildly elevated due to retrograde intraductal pressure.',
      conjugationSignificance: 'Direct Bilirubin is 5.6 of 7.2 (78%). Conjugated fraction > 50% is the hallmark of post-hepatic extrahepatic biliary obstruction.',
      clinicalPearl: 'The classical Charcot triad for ascending cholangitis is Jaundice + RUQ Pain + Fever. If hypotension and altered mental status are added, it becomes Reynolds Pentad, a surgical emergency!',
      guidelineCitation: 'Tokyo Guidelines (TG18) for the Management of Acute Cholangitis and Biliary Stones.'
    }
  },
  {
    id: 'case-3-viral-hepatitis',
    patientName: 'Aarav M.',
    age: 22,
    gender: 'Male',
    occupation: 'Engineering College Student',
    bedNumber: 'Infect-Rm 3',
    admissionDate: 'Yesterday Evening',
    difficulty: 'Beginner',
    clinicalRank: 'Junior Resident',
    xpReward: 200,
    chiefComplaint: 'Profound malaise, loss of appetite, dark urine, and bright yellow eyes 4 weeks after eating street food.',
    historyOfPresentIllness:
      '22-year-old student presented with a 10-day history of extreme exhaustion, anorexia (even the smell of food makes him nauseous), low-grade fever, and diffuse myalgias. He noticed his urine became dark amber 4 days ago, followed by bright yellowing of the sclera. Recalls traveling with college friends to an interstate food festival 4 weeks ago where he consumed street snacks and raw iced fruit drinks. Denies alcohol, medications, tattoos, or unprotected sexual intercourse.',
    pastMedicalSocialHistory:
      'No past medical illnesses. Fully immunized with childhood vaccines, but no documented Hepatitis A adult vaccination. Non-smoker, denies alcohol.',
    vitalSigns: {
      bloodPressure: '116/74 mmHg',
      heartRate: 72,
      respiratoryRate: 16,
      temperature: 37.6,
      oxygenSaturation: 98,
      gcsAlertness: '15/15'
    },
    physicalExamination: {
      general: 'Lethargic young male, sitting quietly in bed, marked scleral icterus.',
      scleraAndSkin: 'Bright yellow scleral icterus, warm dry skin, no spider angiomas or palmar erythema.',
      abdomen: 'Soft, tender smooth liver edge palpable 2 cm below right costal margin. Spleen not palpable. No ascites.',
      neurological: 'Alert and oriented x 3, normal cognition, no asterixis.',
      peripheralStigmata: ['Scleral Icterus', 'Tender Smooth Hepatomegaly', 'Anorexia and Aversion to Food']
    },
    laboratoryPanel: {
      totalBilirubin: 8.6,
      directBilirubin: 5.4,
      ast: 1840,
      alt: 2420,
      alp: 175,
      totalProtein: 7.2,
      albumin: 4.2,
      inr: 1.12,
      plateletCount: 225000,
      wbcCount: 7800,
      specialMarker: {
        name: 'Serum IgM anti-HAV',
        value: 'REACTIVE (Positive)',
        clinicalSignificance: 'Confirms acute Hepatitis A viral infection (picornavirus).'
      }
    },
    ultrasoundAndImaging: {
      modality: 'Abdominal Doppler Ultrasound',
      liverArchitecture: 'Diffusely enlarged with periportal cuffing ("starry sky" appearance typical of acute hepatitis). No cirrhosis or steatosis.',
      biliaryTree: 'CBD normal (3.8 mm), no intrahepatic biliary dilation.',
      gallbladder: 'Collapsed gallbladder with mild reactive wall edema, no stones.',
      vasculatureAndSpleen: 'Normal portal flow velocity, normal spleen (10.2 cm).',
      freeFluidAscites: 'No ascites detected.',
      radiologyImpression: 'Acute diffuse hepatitis; no biliary obstruction.'
    },
    phenotypeOptions: [
      {
        id: 'p-1',
        label: 'Acute Massive Cytolytic Hepatitis (ALT/AST > 1000 IU/L, De Ritis < 1.0)',
        description: 'Enormous transaminase release due to diffuse hepatocyte membrane disruption with ALT predominant over AST.',
        isCorrect: true
      },
      {
        id: 'p-2',
        label: 'Obstructive Extrahepatic Cholestasis',
        description: 'Biliary tree dilation with ALP > 500 IU/L.',
        isCorrect: false
      },
      {
        id: 'p-3',
        label: 'Decompensated Alcoholic Steatohepatitis',
        description: 'AST > ALT by 2:1 with transaminases strictly < 400 IU/L.',
        isCorrect: false
      }
    ],
    differentialOptions: [
      {
        id: 'd-1',
        diagnosis: 'Acute Viral Hepatitis A Infection',
        pathophysiology: 'Fecal-oral transmission of Hepatitis A virus provoking immune-mediated destruction of infected hepatocytes.',
        isCorrect: true,
        explanation: 'Enormous transaminase surge (ALT 2420 > AST 1840), incubation period of ~4 weeks post street food, and reactive IgM anti-HAV.'
      },
      {
        id: 'd-2',
        diagnosis: 'Acute Alcoholic Hepatitis',
        pathophysiology: 'Ethanol-induced oxidative stress.',
        isCorrect: false,
        explanation: 'Alcoholic hepatitis transaminases almost never exceed 400-500 IU/L, and AST is always higher than ALT.'
      },
      {
        id: 'd-3',
        diagnosis: 'Gilbert Syndrome',
        pathophysiology: 'Reduced UGT1A1 enzyme activity causing benign unconjugated hyperbilirubinemia.',
        isCorrect: false,
        explanation: 'Gilbert syndrome causes mild unconjugated bilirubin elevation (<4 mg/dL) with completely normal transaminases (ALT/AST < 40).'
      }
    ],
    managementOrders: [
      {
        id: 'm-1',
        order: 'Conservative supportive management: oral hydration, antiemetics as needed, strict avoidance of hepatotoxic medications (e.g. alcohol, paracetamol >2g), close outpatient follow-up with serial weekly INR and LFT monitoring to rule out rare fulminant liver failure.',
        clinicalRationale: 'Hepatitis A is self-limiting in >99% of immunocompetent young adults; antiviral drugs are not indicated.',
        isCorrect: true
      },
      {
        id: 'm-2',
        order: 'Start high-dose IV Ribavirin and Sofosbuvir immediately.',
        clinicalRationale: 'Direct-acting antivirals are indicated for chronic Hepatitis C, not acute self-limiting Hepatitis A.',
        isCorrect: false
      },
      {
        id: 'm-3',
        order: 'Urgent transfer to the surgical suite for exploratory laparotomy.',
        clinicalRationale: 'Inappropriate and life-threatening: acute viral hepatitis is a medical condition, not a surgical emergency.',
        isCorrect: false
      }
    ],
    attendingDebrief: {
      pathophysiologicalSummary:
        'Hepatitis A virus is a non-enveloped RNA picornavirus transmitted via the fecal-oral route. The incubation period is typically 28 days. The massive elevation of transaminases (ALT > 2000 IU/L) reflects cell-mediated cytotoxic T-cell destruction of viral-antigen presenting hepatocytes.',
      deRitisSignificance: 'AST (1840) / ALT (2420) = 0.76 (< 1.0). In acute viral injury, ALT is predominant because it is localized purely in the cytoplasm and cleared more slowly than AST.',
      conjugationSignificance: 'Conjugated bilirubin is 5.4/8.6 (63%), demonstrating secondary canalicular micro-cholestasis from hepatocyte swelling.',
      clinicalPearl: 'The single most important prognostic marker in acute viral hepatitis is NOT the transaminase level, but the Prothrombin Time / INR! An INR > 1.5 indicates acute liver failure requiring immediate transplant evaluation.',
      guidelineCitation: 'WHO Guidelines on the Prevention and Control of Viral Hepatitis A.'
    }
  },
  {
    id: 'case-4-toxic-acetaminophen',
    patientName: 'Priya S.',
    age: 26,
    gender: 'Female',
    occupation: 'UX Designer',
    bedNumber: 'ICU Bed 2',
    admissionDate: '1 hour ago (Urgent Red Alert)',
    difficulty: 'Intermediate',
    clinicalRank: 'Senior Registrar',
    xpReward: 350,
    chiefComplaint: 'Ingestion of 24 tablets of 500mg paracetamol (12 grams) ~16 hours ago; severe nausea, right flank pain, and drowsiness.',
    historyOfPresentIllness:
      '26-year-old female brought to the Emergency Department by her flatmate after confessing to consuming approximately 24 tablets of paracetamol 500 mg (total 12 g) 16 hours prior following severe emotional heartbreak. Initial symptoms were mild nausea, but over the last 6 hours she developed persistent retching, severe RUQ pain, and marked somnolence. No prior psychiatric history or previous overdose attempts.',
    pastMedicalSocialHistory:
      'No chronic medical problems. Occasional alcohol on weekends. Denies other co-ingestants, salicylates, or NSAIDs.',
    vitalSigns: {
      bloodPressure: '96/60 mmHg',
      heartRate: 112,
      respiratoryRate: 22,
      temperature: 36.4,
      oxygenSaturation: 96,
      gcsAlertness: '13/15 (Lethargic, oriented only to self, responds to verbal stimuli)'
    },
    physicalExamination: {
      general: 'Diaphoretic, obtunded young female, retching periodically into a kidney dish.',
      scleraAndSkin: 'Subtle scleral icteric tint, pale cool extremities.',
      abdomen: 'Exquisite tenderness and voluntary guarding across the right upper quadrant and epigastrium. Liver edge tender, not clearly enlarged.',
      neurological: 'Drowsy, Grade 1-2 hepatic encephalopathy, slow sluggish response to questioning, intermittent asterixis elicited.',
      peripheralStigmata: ['Early Scleral Icterus', 'Diaphoresis', 'RUQ Guarding', 'Encephalopathic Lethargy']
    },
    laboratoryPanel: {
      totalBilirubin: 3.4,
      directBilirubin: 2.1,
      ast: 5400,
      alt: 6200,
      alp: 118,
      totalProtein: 6.2,
      albumin: 3.6,
      inr: 2.55,
      plateletCount: 168000,
      wbcCount: 12400,
      creatinine: 2.1,
      specialMarker: {
        name: 'Serum Paracetamol (APAP) Level & Arterial Lactate',
        value: 'APAP: 68 mcg/mL at 16h; Lactate: 4.2 mmol/L',
        clinicalSignificance: 'High risk on Rumack-Matthew Nomogram; hyperlactatemia + coagulopathy satisfies King\'s College Acute Liver Failure alert.'
      }
    },
    ultrasoundAndImaging: {
      modality: 'Emergency Bedside Ultrasound',
      liverArchitecture: 'Normal hepatic contours, no chronic architectural distortion or cirrhosis.',
      biliaryTree: 'Biliary tree unremarkable, CBD 3.2 mm.',
      gallbladder: 'Normal gallbladder without gallstones or wall thickening.',
      vasculatureAndSpleen: 'Normal splenic dimensions, patent hepatic veins and portal vein.',
      freeFluidAscites: 'No ascites.',
      radiologyImpression: 'Normal ultrasound appearance; features consistent with hyperacute parenchymal toxic insult.'
    },
    phenotypeOptions: [
      {
        id: 'p-1',
        label: 'Hyperacute Toxic Hepatocellular Necrosis with Acute Coagulopathy (INR > 2.0)',
        description: 'Extreme transaminases (>5000 IU/L), sudden loss of hepatic synthetic capacity, elevated creatinine, and acute encephalopathy.',
        isCorrect: true
      },
      {
        id: 'p-2',
        label: 'Chronic Primary Sclerosing Cholangitis',
        description: 'Slow progressive fibrous obliterative cholangiopathy in young individuals.',
        isCorrect: false
      },
      {
        id: 'p-3',
        label: 'Isolated Unconjugated Hemolytic Jaundice',
        description: 'Elevated indirect bilirubin with completely normal transaminases and normal coagulation.',
        isCorrect: false
      }
    ],
    differentialOptions: [
      {
        id: 'd-1',
        diagnosis: 'Acute Acetaminophen (Paracetamol) Hepatotoxicity with Early Acute Liver Failure (ALF)',
        pathophysiology: 'Saturation of glucuronidation/sulfation pathways leading to CYP2E1 generation of toxic NAPQI, which depletes glutathione and causes centrilobular (Zone 3) necrosis.',
        isCorrect: true,
        explanation: 'Extreme transaminase rise (>5,000 IU/L), history of 12g ingestion, elevated acetaminophen level, prolonged INR (2.55), and renal dysfunction.'
      },
      {
        id: 'd-2',
        diagnosis: 'Acute Cholecystitis',
        pathophysiology: 'Cystic duct obstruction provoking gallbladder wall inflammation.',
        isCorrect: false,
        explanation: 'Cholecystitis never causes transaminases in the thousands or an INR of 2.55.'
      },
      {
        id: 'd-3',
        diagnosis: 'Alcoholic Cirrhosis Decompensation',
        pathophysiology: 'Long-standing ethanol fibrosis with portal hypertension.',
        isCorrect: false,
        explanation: 'Ultrasound shows normal liver architecture with no cirrhosis, and transaminases are >5000 (alcohol is <400).'
      }
    ],
    managementOrders: [
      {
        id: 'm-1',
        order: 'Immediately initiate IV N-Acetylcysteine (NAC) protocol (150 mg/kg over 1h, then 50 mg/kg over 4h, then 100 mg/kg over 16h); admit directly to Intensive Care Unit (ICU); maintain IV dextrose to prevent hypoglycemia; immediately notify Regional Liver Transplant Center (King\'s College Criteria: INR > 2.0, Creatinine > 2.0, Lactate > 3.0).',
        clinicalRationale: 'NAC replenishes hepatocellular glutathione stores and detoxifies NAPQI. Delays beyond 8-10 hours require prolonged NAC infusion until transaminases and INR normalize.',
        isCorrect: true
      },
      {
        id: 'm-2',
        order: 'Administer oral activated charcoal and discharge after 4 hours of observation.',
        clinicalRationale: 'Activated charcoal is only effective within 1-2 hours of ingestion; 16 hours post-ingestion requires aggressive IV NAC and ICU management.',
        isCorrect: false
      },
      {
        id: 'm-3',
        order: 'Start high-dose NSAIDs (Ibuprofen) for RUQ pain relief and oral antibiotics.',
        clinicalRationale: 'NSAIDs will worsen renal failure and provoke catastrophic gastrointestinal hemorrhage in a patient with an INR of 2.55.',
        isCorrect: false
      }
    ],
    attendingDebrief: {
      pathophysiologicalSummary:
        'Paracetamol is normally metabolized by glucuronidation and sulfation. In overdose, these pathways saturate, shunting drug to Cytochrome P450 (CYP2E1), producing N-acetyl-p-benzoquinone imine (NAPQI). When glutathione stores drop below 30%, NAPQI binds to mitochondrial proteins, causing catastrophic Zone 3 necrosis.',
      deRitisSignificance: 'AST (5400) / ALT (6200) = 0.87. Extreme transaminase elevations (>3000 IU/L) are almost exclusively caused by 3 entities: Acetaminophen toxicity, Ischemic hepatitis ("shock liver"), or Acute viral hepatitis.',
      conjugationSignificance: 'Bilirubin elevation is mild initially because necrosis is hyperacute; synthetic failure (INR 2.55) precedes severe hyperbilirubinemia.',
      clinicalPearl: 'Never wait for paracetamol blood assay results before starting N-acetylcysteine if history suggests toxic ingestion! Every hour of delay increases mortality.',
      guidelineCitation: 'EASL Clinical Practice Guidelines: Management of Acute (Fulminant) Liver Failure.'
    }
  },
  {
    id: 'case-5-autoimmune-cholestasis',
    patientName: 'Meera V.',
    age: 52,
    gender: 'Female',
    occupation: 'Chartered Financial Auditor',
    bedNumber: 'Clinic 2B',
    admissionDate: 'Outpatient Referral',
    difficulty: 'Intermediate',
    clinicalRank: 'Senior Registrar',
    xpReward: 350,
    chiefComplaint: 'Debilitating whole-body itching (worse at night) and chronic unremitting exhaustion for 8 months.',
    historyOfPresentIllness:
      '52-year-old female referred by dermatology after topical creams and antihistamines failed to relieve an 8-month history of intense generalized pruritus, predominantly over the palms, soles, and trunk. She also reports dry eyes and dry mouth (sicca symptoms) and progressive fatigue that impacts her working hours. Denies fever, weight loss, abdominal pain, alcohol consumption, or new medications.',
    pastMedicalSocialHistory:
      'Hashimoto thyroiditis (stable on levothyroxine 75 mcg daily). Non-smoker, non-drinker. Family history of rheumatoid arthritis.',
    vitalSigns: {
      bloodPressure: '124/76 mmHg',
      heartRate: 68,
      respiratoryRate: 15,
      temperature: 36.7,
      oxygenSaturation: 99,
      gcsAlertness: '15/15'
    },
    physicalExamination: {
      general: 'Pleasant, well-appearing female, actively scratching forearms.',
      scleraAndSkin: 'Multiple linear excoriations over bilateral upper and lower extremities. Bilateral soft yellowish plaques at medial canthi of eyelids (Xanthelasma). Sclera minimally tinted.',
      abdomen: 'Non-tender, mild firm non-tender hepatomegaly (liver span 14 cm). Spleen not palpable. No ascites.',
      neurological: 'Normal neurological exam, no asterixis.',
      peripheralStigmata: ['Xanthelasma', 'Excoriation Scratch Marks', 'Sicca Syndrome', 'Mild Firm Hepatomegaly']
    },
    laboratoryPanel: {
      totalBilirubin: 1.8,
      directBilirubin: 0.9,
      ast: 54,
      alt: 48,
      alp: 580,
      totalProtein: 7.8,
      albumin: 4.0,
      inr: 1.02,
      plateletCount: 260000,
      wbcCount: 6500,
      specialMarker: {
        name: 'Antimitochondrial Antibodies (AMA) & Serum IgM',
        value: 'AMA Titre 1:320 (Positive); Serum IgM 420 mg/dL (High)',
        clinicalSignificance: 'AMA positivity (>1:40) with ALP > 1.5x ULN is >95% sensitive and specific for Primary Biliary Cholangitis.'
      }
    },
    ultrasoundAndImaging: {
      modality: 'High-Resolution Abdominal Ultrasound',
      liverArchitecture: 'Normal parenchymal echotexture, smooth liver capsule, no focal lesions.',
      biliaryTree: 'Common bile duct caliber normal (4.1 mm). No intrahepatic biliary dilation.',
      gallbladder: 'Acalculous gallbladder, normal wall thickness.',
      vasculatureAndSpleen: 'Normal portal venous flow, spleen normal (9.5 cm).',
      freeFluidAscites: 'No ascites.',
      radiologyImpression: 'Normal macroscopic biliary anatomy. Absence of extrahepatic obstruction supports intrahepatic microscopic cholestasis.'
    },
    phenotypeOptions: [
      {
        id: 'p-1',
        label: 'Chronic Intrahepatic Cholestatic Syndrome (Isolated Massive ALP with Normal Ducts)',
        description: 'ALP > 3.5x ULN, normal extrahepatic bile ducts on ultrasound, preserved synthetic liver function, and positive AMA.',
        isCorrect: true
      },
      {
        id: 'p-2',
        label: 'Acute Hepatocellular Viral Necrosis',
        description: 'Transaminases > 1000 with ALT predominant.',
        isCorrect: false
      },
      {
        id: 'p-3',
        label: 'Alcoholic Hepatitis Decompensation',
        description: 'AST:ALT > 2.0 with acute jaundice and Maddrey score > 32.',
        isCorrect: false
      }
    ],
    differentialOptions: [
      {
        id: 'd-1',
        diagnosis: 'Primary Biliary Cholangitis (PBC)',
        pathophysiology: 'Autoimmune T-cell mediated chronic non-suppurative destructive cholangitis of small intrahepatic interlobular bile ducts.',
        isCorrect: true,
        explanation: 'Middle-aged female, chronic pruritus, xanthelasma, isolated ALP elevation (580), high IgM, positive AMA (1:320), and normal ultrasound ducts.'
      },
      {
        id: 'd-2',
        diagnosis: 'Choledocholithiasis',
        pathophysiology: 'Gallstone obstructing common bile duct.',
        isCorrect: false,
        explanation: 'Ultrasound confirms completely normal common bile duct (4.1 mm) without gallstones.'
      },
      {
        id: 'd-3',
        diagnosis: 'Nonalcoholic Fatty Liver Disease (NAFLD)',
        pathophysiology: 'Insulin resistance and hepatic steatosis.',
        isCorrect: false,
        explanation: 'NAFLD causes mild transaminase elevation (ALT > AST) with fatty echogenicity on ultrasound, not an isolated massive ALP of 580 with AMA positivity.'
      }
    ],
    managementOrders: [
      {
        id: 'm-1',
        order: 'Initiate Ursodeoxycholic Acid (UDCA) 13-15 mg/kg/day orally; prescribe Cholestyramine for pruritus relief (spaced 4 hours away from UDCA); screen for osteoporosis with DEXA scan; order lipid profile and fat-soluble vitamin levels (A, D, E, K).',
        clinicalRationale: 'UDCA replaces toxic hydrophobic bile acids, stimulates hepatobiliary secretion, delays histological progression, and improves transplant-free survival.',
        isCorrect: true
      },
      {
        id: 'm-2',
        order: 'Schedule emergency biliary stenting via ERCP.',
        clinicalRationale: 'ERCP has no therapeutic role in PBC because the disease affects microscopic intrahepatic ducts that cannot be stented.',
        isCorrect: false
      },
      {
        id: 'm-3',
        order: 'Start high-dose immunosuppression with Azathioprine and Prednisolone as first-line therapy.',
        clinicalRationale: 'Corticosteroids accelerate osteoporosis in middle-aged women and are ineffective as first-line therapy in PBC (unlike Autoimmune Hepatitis).',
        isCorrect: false
      }
    ],
    attendingDebrief: {
      pathophysiologicalSummary:
        'Primary Biliary Cholangitis (formerly Primary Biliary Cirrhosis) is an organ-specific autoimmune liver disease characterized by progressive destruction of small interlobular bile ducts by CD4+ and CD8+ lymphocytes. Over 90% of patients are women aged 35-65. The classic antibody target is the E2 subunit of the pyruvate dehydrogenase complex (PDC-E2) detected by the AMA test.',
      deRitisSignificance: 'AST (54) / ALT (48) = 1.12. Hepatocellular enzymes are near-normal because parenchymal hepatocytes are spared early in the disease.',
      conjugationSignificance: 'Bilirubin is only 1.8 mg/dL; progressive elevation of serum bilirubin is the strongest indicator of late-stage histological progression in PBC.',
      clinicalPearl: 'The diagnosis of PBC can be confirmed without a liver biopsy if the patient has: 1) ALP > 1.5x ULN, and 2) Positive AMA titre (>1:40).',
      guidelineCitation: 'EASL Clinical Practice Guidelines: The Diagnosis and Management of Patients with Primary Biliary Cholangitis.'
    }
  },
  {
    id: 'case-6-dili-augmentin',
    patientName: 'David R.',
    age: 56,
    gender: 'Male',
    occupation: 'Senior Structural Architect',
    bedNumber: 'Ward 2C',
    admissionDate: 'Today 08:30 (Referred by Pulmonologist)',
    difficulty: 'Intermediate',
    clinicalRank: 'Senior Registrar',
    xpReward: 350,
    chiefComplaint: 'Generalized relentless pruritus, jaundice, and tea-colored urine 3 weeks after completing an antibiotic course for severe bronchitis.',
    historyOfPresentIllness:
      '56-year-old male presents with a 6-day history of progressively darkening urine, yellowing of eyes, and unremitting whole-body itching that awakens him at night. Denies fever, right upper quadrant abdominal pain, weight loss, or alcohol misuse. Three weeks prior, he was prescribed a 10-day course of Amoxicillin-Clavulanate (Augmentin 875/125 mg BID) for acute bacterial exacerbation of chronic bronchitis, which he completed without immediate gastrointestinal issues. Denies herbal supplements, over-the-counter NSAIDs, statins, or recent travel. No prior known hepatobiliary disease.',
    pastMedicalSocialHistory:
      'Mild COPD on salmeterol inhaler. Former smoker (quit 8 years ago). Social alcohol (<2 units/month). No prior drug allergies documented.',
    vitalSigns: {
      bloodPressure: '128/78 mmHg',
      heartRate: 74,
      respiratoryRate: 16,
      temperature: 36.8,
      oxygenSaturation: 99,
      gcsAlertness: '15/15 (Alert and fully oriented)'
    },
    physicalExamination: {
      general: 'Comfortable, ambulatory middle-aged male with visible scleral jaundice and prominent linear excoriations on arms and chest.',
      scleraAndSkin: 'Deep scleral icterus, cutaneous scratch excoriations, no cutaneous spider nevi, no palmar erythema.',
      abdomen: 'Soft, completely non-tender, normal liver span (12.5 cm), no splenomegaly, no shifting dullness or ascites.',
      neurological: 'Alert and oriented x 3, normal cranial nerves, asterixis absent.',
      peripheralStigmata: ['Scleral Icterus', 'Cutaneous Scratch Excoriations', 'Peripheral Eosinophilia (9%)']
    },
    laboratoryPanel: {
      totalBilirubin: 8.4,
      directBilirubin: 6.2,
      ast: 142,
      alt: 310,
      alp: 440,
      totalProtein: 6.8,
      albumin: 3.9,
      inr: 1.08,
      plateletCount: 245000,
      wbcCount: 9800,
      specialMarker: {
        name: 'DILI R-ratio & Peripheral Eosinophils',
        value: 'R-ratio = (ALT/ULN)/(ALP/ULN) = (310/35)/(440/120) = 8.86 / 3.67 = 2.41 (Mixed Pattern); Absolute Eosinophils: 880/uL (9%)',
        clinicalSignificance: 'R-ratio between 2.0 and 5.0 indicates a Mixed Hepatocellular-Cholestatic pattern; latency of 2-4 weeks post-Augmentin is characteristic of immunoallergic DILI (RUCAM score: 8, Highly Probable).'
      }
    },
    ultrasoundAndImaging: {
      modality: 'Comprehensive Upper Abdominal Ultrasound',
      liverArchitecture: 'Normal parenchymal size and homogenous echotexture without focal mass lesions or surface nodularity.',
      biliaryTree: 'Common Bile Duct caliber 4.2 mm (Normal < 6 mm). No intrahepatic biliary radicle dilation.',
      gallbladder: 'Thin-walled gallbladder without calculi, pericholecystic fluid, or acoustic shadowing.',
      vasculatureAndSpleen: 'Normal spleen size (10.4 cm). Patent portal vein with normal anterograde velocity (24 cm/s).',
      freeFluidAscites: 'No peritoneal free fluid or ascites.',
      radiologyImpression: 'Normal macroscopic biliary anatomy without ductal dilation or choledocholithiasis; findings compatible with drug-induced cholestatic/mixed hepatitis.'
    },
    phenotypeOptions: [
      {
        id: 'p-1',
        label: 'Mixed Hepatocellular-Cholestatic Injury (R-ratio 2.0 - 5.0) with Latent Hypersensitivity',
        description: 'Co-elevation of transaminases and ALP with R-ratio = 2.41, marked conjugated hyperbilirubinemia, and peripheral eosinophilia following delayed antibiotic exposure.',
        isCorrect: true
      },
      {
        id: 'p-2',
        label: 'Pure Extrahepatic Mechanical Stone Obstruction',
        description: 'Biliary tree dilation with high-grade common bile duct enlargement (>10 mm) and acoustic-shadowing stone.',
        isCorrect: false
      },
      {
        id: 'p-3',
        label: 'Decompensated End-Stage Cirrhosis',
        description: 'Severe thrombocytopenia, shrunken nodular liver, ascites, and gross coagulopathy (INR > 2.0).',
        isCorrect: false
      }
    ],
    differentialOptions: [
      {
        id: 'd-1',
        diagnosis: 'Amoxicillin-Clavulanate (Augmentin) Induced Liver Injury (DILI) with Mixed Cholestatic Pattern',
        pathophysiology: 'Immunoallergic hypersensitivity reaction against clavulanic acid-protein adducts, typically presenting with a latency of 1 to 4 weeks after treatment completion.',
        isCorrect: true,
        explanation: 'Augmentin is the leading cause of idiosyncratic DILI worldwide. Latency of 3 weeks post-treatment, mixed R-ratio (2.41), peripheral eosinophilia (9%), and RUCAM score 8 (Highly Probable).'
      },
      {
        id: 'd-2',
        diagnosis: 'Acute Alcoholic Steatohepatitis',
        pathophysiology: 'Ethanol-mediated mitochondrial swelling with AST:ALT > 2.0.',
        isCorrect: false,
        explanation: 'Patient only drinks socially (<2 units/month), ALT (310) is significantly higher than AST (142), and De Ritis ratio is 0.46, ruling out alcoholic hepatitis.'
      },
      {
        id: 'd-3',
        diagnosis: 'Gilbert Syndrome',
        pathophysiology: 'Benign constitutional decrease in UGT1A1 glucuronyltransferase.',
        isCorrect: false,
        explanation: 'Gilbert syndrome produces isolated mild unconjugated hyperbilirubinemia with completely normal transaminases, normal ALP, and normal urine color.'
      }
    ],
    managementOrders: [
      {
        id: 'm-1',
        order: 'Immediate cessation and permanent medical record allergy documentation of Amoxicillin-Clavulanate (Augmentin); supportive pruritus relief with oral Cholestyramine (4g daily spaced 2 hours apart); serial weekly LFT monitoring until complete biochemical resolution.',
        clinicalRationale: 'Augmentin DILI has a favorable prognosis once the offending agent is identified and documented to prevent fatal rechallenge. Rechallenge can cause severe vanishing bile duct syndrome.',
        isCorrect: true
      },
      {
        id: 'm-2',
        order: 'Perform emergency ERCP with sphincterotomy and biliary stent placement.',
        clinicalRationale: 'ERCP is invasive and contraindicated without biliary duct dilation or intraductal calculi; ultrasound showed normal CBD (4.2 mm).',
        isCorrect: false
      },
      {
        id: 'm-3',
        order: 'Prescribe high-dose systemic Paracetamol (4g daily) for malaise and re-start oral Augmentin.',
        clinicalRationale: 'Catastrophic error: Re-exposure to the causal antibiotic can induce fatal hepatic necrosis, and paracetamol stresses depleted glutathione stores.',
        isCorrect: false
      }
    ],
    attendingDebrief: {
      pathophysiologicalSummary:
        'Amoxicillin-clavulanate is the most frequent cause of idiosyncratic Drug-Induced Liver Injury (DILI) in clinical practice. The clavulanic acid component serves as a hapten triggering HLA class II (DRB1*15:01)-restricted T-cell mediated canalicular cholestasis. A crucial clinical pearl is its delayed onset: symptoms frequently emerge 1 to 6 weeks AFTER the antibiotic course has been successfully completed.',
      deRitisSignificance: 'AST (142) / ALT (310) = 0.46 (< 1.0). Typical for acute toxic/drug insult where cytosolic ALT release exceeds mitochondrial AST release.',
      conjugationSignificance: 'Direct Bilirubin is 6.2 out of 8.4 (74%), reflecting canalicular transport pump inhibition (BSEP/MRP2) from immunoallergic injury.',
      clinicalPearl: 'The R-ratio formula = (ALT / ULN) ÷ (ALP / ULN). R ≥ 5.0 is Hepatocellular, R 2.0 - 5.0 is Mixed, and R ≤ 2.0 is Cholestatic. Calculating the R-ratio is mandated by EASL and ACG guidelines for categorizing DILI!',
      guidelineCitation: 'ACG Clinical Guideline: Diagnosis and Management of Idiosyncratic Drug-Induced Liver Injury (DILI).'
    }
  },
  {
    id: 'case-7-decompensated-cirrhosis',
    patientName: 'Vikram T.',
    age: 58,
    gender: 'Male',
    occupation: 'Retired Government Clerk',
    bedNumber: 'Hep-StepDown 1',
    admissionDate: 'Yesterday 22:00',
    difficulty: 'Advanced',
    clinicalRank: 'Chief Fellow',
    xpReward: 500,
    chiefComplaint: 'Tense abdominal swelling, pedal oedema, low-grade fever, and marked confusion with day-night sleep reversal.',
    historyOfPresentIllness:
      '58-year-old male with a history of chronic Hepatitis C infection (diagnosed 12 years ago, untreated due to socioeconomic constraints). Family brought him to emergency services after he developed progressive abdominal distension over 3 weeks, and over the past 48 hours became increasingly disoriented, irritable, mistaking day for night, and unable to button his shirt. Complained of diffuse dull abdominal ache and chills this morning.',
    pastMedicalSocialHistory:
      'Chronic untreated Hepatitis C. No alcohol history. Takes no prescription medications. Remote blood transfusion following road traffic accident 25 years ago.',
    vitalSigns: {
      bloodPressure: '98/62 mmHg',
      heartRate: 98,
      respiratoryRate: 21,
      temperature: 38.4,
      oxygenSaturation: 96,
      gcsAlertness: '12/15 (Somnolent, confused, disoriented to time and day)'
    },
    physicalExamination: {
      general: 'Chronically ill, emaciated with temporal and pectoralis muscle wasting, obvious icterus.',
      scleraAndSkin: 'Deep yellow sclera, prominent spider nevi on chest, caput medusae (dilated subcutaneous veins radiating from umbilicus).',
      abdomen: 'Protuberant, tense ascites with fluid wave and shifting dullness. Generalized mild tenderness on palpation with subtle rebound tenderness. Splenomegaly palpable 3 cm below left costal margin.',
      neurological: 'Marked flapping tremor (Asterixis Grade 2-3). Hyperreflexia, sustained clonus absent.',
      peripheralStigmata: ['Caput Medusae', 'Spider Nevi', 'Tense Ascites', 'Splenomegaly', 'Asterixis', 'Muscle Wasting']
    },
    laboratoryPanel: {
      totalBilirubin: 6.8,
      directBilirubin: 4.2,
      ast: 104,
      alt: 66,
      alp: 210,
      totalProtein: 5.4,
      albumin: 2.1,
      inr: 2.22,
      plateletCount: 54000,
      wbcCount: 13800,
      creatinine: 1.6,
      specialMarker: {
        name: 'Ascitic Fluid Paracentesis PMN Count',
        value: 'PMN 520 cells/mm³ (Diagnostic threshold >= 250/mm³)',
        clinicalSignificance: 'Confirms Spontaneous Bacterial Peritonitis (SBP); high mortality requiring immediate empiric IV cephalosporins + IV albumin.'
      }
    },
    ultrasoundAndImaging: {
      modality: 'Abdominal Ultrasound with Portal Doppler',
      liverArchitecture: 'Small, shrunken, nodular liver with surface irregularities and blunted edge (nodular cirrhosis).',
      biliaryTree: 'Normal CBD (4.0 mm), no ductal dilation.',
      gallbladder: 'Thickened edematous gallbladder wall (secondary to low oncotic pressure and portal hypertension).',
      vasculatureAndSpleen: 'Marked splenomegaly (15.8 cm). Portal vein dilated to 14.8 mm with sluggish hepatopetal velocity (12 cm/s). Splenorenal collateral vessels visualized.',
      freeFluidAscites: 'Large volume gross anechoic free fluid filling all 4 quadrants and pelvis.',
      radiologyImpression: 'End-stage liver cirrhosis with severe portal hypertension, splenomegaly, and massive ascites.'
    },
    phenotypeOptions: [
      {
        id: 'p-1',
        label: 'Decompensated Cirrhosis with Portal Hypertension, Hypoalbuminemia, and Coagulopathy',
        description: 'Shrunken nodular liver, profound thrombocytopenia (<100k) from hypersplenism, INR > 2.0, Albumin < 2.5 g/dL, and gross ascites.',
        isCorrect: true
      },
      {
        id: 'p-2',
        label: 'Acute Isolated Obstructive Jaundice',
        description: 'Normal platelets, normal spleen, dilated common bile duct, and acute gallstone colic.',
        isCorrect: false
      },
      {
        id: 'p-3',
        label: 'Benign Unconjugated Hyperbilirubinemia',
        description: 'Normal liver parenchyma, normal INR, normal platelets, absence of ascites.',
        isCorrect: false
      }
    ],
    differentialOptions: [
      {
        id: 'd-1',
        diagnosis: 'Decompensated Cirrhosis secondary to Chronic HCV complicated by Spontaneous Bacterial Peritonitis (SBP) and Hepatic Encephalopathy',
        pathophysiology: 'Fibrotic architectural disruption causing sinusoidal portal hypertension, bacterial translocation across gut barrier into ascitic fluid, and portosystemic shunting of ammonia.',
        isCorrect: true,
        explanation: 'Ascitic fluid PMN > 250 cells/mm³ diagnostic of SBP; fever, tense ascites, splenomegaly, severe thrombocytopenia (54k), INR 2.22, and Grade 2-3 encephalopathy.'
      },
      {
        id: 'd-2',
        diagnosis: 'Acute Viral Hepatitis A',
        pathophysiology: 'Acute viral cytolysis.',
        isCorrect: false,
        explanation: 'Viral Hepatitis A does not produce shrunken nodular liver cirrhosis, caput medusae, splenomegaly, or hypersplenic thrombocytopenia.'
      },
      {
        id: 'd-3',
        diagnosis: 'Biliary Colic',
        pathophysiology: 'Temporary gallstone impaction.',
        isCorrect: false,
        explanation: 'Fails to explain the massive ascites, SBP, coagulopathy, and encephalopathy.'
      }
    ],
    managementOrders: [
      {
        id: 'm-1',
        order: '1) Initiate IV Cefotaxime 2g Q8H (or Ceftriaxone) immediately; 2) Administer IV Albumin (1.5 g/kg within 6 hours, followed by 1.0 g/kg on Day 3 to prevent hepatorenal syndrome); 3) Start Lactulose oral/enema (titrated to 2-3 soft bowel movements daily) for encephalopathy; 4) Hold all diuretics (spironolactone/furosemide) and sedatives.',
        clinicalRationale: 'SBP has a 20-40% mortality without immediate bactericidal therapy. IV Albumin reduces hepatorenal syndrome incidence from 30% to 10% and significantly improves survival.',
        isCorrect: true
      },
      {
        id: 'm-2',
        order: 'Start high-dose IV Furosemide 80mg and Spironolactone 200mg to aggressively dry out ascites, and prescribe oral Diazepam for agitation.',
        clinicalRationale: 'Catastrophic error: Diuretics in SBP precipitate fatal acute kidney injury (Hepatorenal Syndrome), and benzodiazepines will induce coma in hepatic encephalopathy.',
        isCorrect: false
      },
      {
        id: 'm-3',
        order: 'Perform emergency total splenectomy to correct the platelet count of 54,000.',
        clinicalRationale: 'Thrombocytopenia is secondary to portal congestion and hypersplenism; splenectomy in decompensated cirrhosis with an INR of 2.22 carries catastrophic perioperative mortality.',
        isCorrect: false
      }
    ],
    attendingDebrief: {
      pathophysiologicalSummary:
        'Chronic Hepatitis C produces ongoing immune-mediated inflammation over decades, resulting in diffuse bridging fibrosis and regenerative nodules. The resulting portal hypertension leads to splanchnic arterial vasodilation, neurohumoral activation, renal sodium retention, and massive ascites. Impaired gut motility and mucosal barrier breakdown allow Gram-negative bacteria (E. coli, Klebsiella) to translocate into ascitic fluid, triggering SBP.',
      deRitisSignificance: 'AST (104) / ALT (66) = 1.57. In chronic viral hepatitis, ALT is initially higher; an AST/ALT ratio flipping above 1.0 strongly correlates with progression to established cirrhosis!',
      conjugationSignificance: 'Direct Bilirubin is 4.2 out of 6.8 (62%), reflecting end-stage failure of both canalicular excretion and hepatocellular clearance.',
      clinicalPearl: 'Every cirrhotic patient admitted with ascites MUST undergo a diagnostic paracentesis within 2 hours, even without fever or abdominal pain! Over 30% of SBP cases are asymptomatic or present only with worsening encephalopathy.',
      guidelineCitation: 'EASL Clinical Practice Guidelines for the Management of Patients with Decompensated Cirrhosis & SBP.'
    }
  },
  {
    id: 'case-8-fulminant-wilson',
    patientName: 'Ananya D.',
    age: 19,
    gender: 'Female',
    occupation: 'First-Year Biotechnology Undergraduate',
    bedNumber: 'Hep-ICU Bed 4',
    admissionDate: '4 hours ago (Emergency Red Code)',
    difficulty: 'Advanced',
    clinicalRank: 'Chief Fellow',
    xpReward: 500,
    chiefComplaint: 'Rapidly progressive jaundice, extreme weakness, tea-colored urine, and new subtle tremor with emotional lability in a 19-year-old student.',
    historyOfPresentIllness:
      '19-year-old female university student transferred from a regional clinic with a 6-day history of rapidly deepening jaundice, dark Coca-Cola colored urine, marked conjunctival pallor, and severe fatigue. Her roommate noted subtle mood swings, micrographia (progressively smaller handwriting during lecture notes), and difficulty with fine motor coordination over the preceding 2 months. Denies alcohol, illicit substances, acetaminophen or over-the-counter herbal products, and has no personal or family history of viral hepatitis.',
    pastMedicalSocialHistory:
      'No previous chronic illnesses. Non-smoker, non-drinker. Consanguinity noted in parents (second cousins). No prior history of psychiatric illness or blood transfusions.',
    vitalSigns: {
      bloodPressure: '102/64 mmHg',
      heartRate: 108,
      respiratoryRate: 20,
      temperature: 37.2,
      oxygenSaturation: 97,
      gcsAlertness: '13/15 (Somnolent, dysarthric, oriented to person and month, sluggish processing)'
    },
    physicalExamination: {
      general: 'Critically ill, deeply jaundiced young female with conspicuous conjunctival pallor and low-frequency postural tremor.',
      scleraAndSkin: 'Profound golden-bronze scleral icterus, intense subungual pallor, trace petechiae over bilateral shins. Slit-lamp biomicroscopy confirms bilateral golden-brown annular copper deposition in the Descemet membrane at the limbus (Pathognomonic Kayser-Fleischer Rings).',
      abdomen: 'Moderately distended, soft, liver span reduced (shrunken, 7.5 cm). Splenomegaly palpable 3 cm below the left costal margin. Flank shifting dullness positive for moderate ascites.',
      neurological: 'Bilateral rhythmic "wing-beating" postural tremor elicited upon sustained arm abduction; Grade 2 hepatic encephalopathy; dysarthric speech; increased muscle tone in bilateral upper limbs.',
      peripheralStigmata: ['Kayser-Fleischer (KF) Rings', 'Severe Scleral Icterus & Pallor', 'Wing-Beating Tremor', 'Splenomegaly with Ascites', 'Grade 2 Encephalopathy']
    },
    laboratoryPanel: {
      totalBilirubin: 28.4,
      directBilirubin: 17.2,
      ast: 320,
      alt: 140,
      alp: 38,
      totalProtein: 5.6,
      albumin: 2.3,
      inr: 2.85,
      plateletCount: 88000,
      wbcCount: 11400,
      creatinine: 1.8,
      specialMarker: {
        name: 'ALP / Total Bilirubin Ratio & Intravascular Hemolysis',
        value: 'ALP / TBil Ratio = 38 / 28.4 = 1.34 (Pathognomonic < 4.0); Coombs Test: NEGATIVE; Hemoglobin: 6.8 g/dL (Reticulocytes: 8.5%); Serum Ceruloplasmin: 4.8 mg/dL (Normal 20 - 40)',
        clinicalSignificance: 'Triad of Acute Liver Failure, Coombs-Negative Intravascular Hemolysis, and ALP/Total Bilirubin ratio < 4.0 is >98% specific for Fulminant Wilsonian Hepatic Crisis (Revised King\'s Wilson Score: 12, indicating >95% mortality without emergency liver transplantation).'
      }
    },
    ultrasoundAndImaging: {
      modality: 'Emergency Abdominal Doppler Ultrasound',
      liverArchitecture: 'Markedly shrunken, inhomogeneous liver with micronodular surface irregularities. No discrete focal hepatic neoplasms.',
      biliaryTree: 'Common Bile Duct 3.8 mm. No intra- or extra-hepatic ductal dilatation.',
      gallbladder: 'Mild diffuse wall thickening secondary to hypoalbuminemia, no cholelithiasis.',
      vasculatureAndSpleen: 'Marked congestive splenomegaly (14.6 cm). Portal vein patent with low-velocity flow (13 cm/s). Splenorenal collateral channels noted.',
      freeFluidAscites: 'Moderate volume anechoic free fluid in Morrison\'s pouch and pelvis.',
      radiologyImpression: 'Shrunken cirrhotic liver with severe portal hypertension, splenomegaly, and ascites. Complete absence of biliary obstruction.'
    },
    phenotypeOptions: [
      {
        id: 'p-1',
        label: 'Fulminant Hepatic Failure with Coombs-Negative Intravascular Hemolysis & Paradoxical Low ALP (ALP/TBil < 4.0)',
        description: 'Profound hyperbilirubinemia with disproportionately low or normal ALP, AST:ALT ratio > 2.0 in a non-alcoholic teenager, severe coagulopathy (INR > 2.0), and Coombs-negative hemolytic anemia.',
        isCorrect: true
      },
      {
        id: 'p-2',
        label: 'Isolated Extrahepatic Gallstone Cholestasis',
        description: 'Common bile duct dilation (>10 mm) with elevated alkaline phosphatase > 500 IU/L and normal hemoglobin.',
        isCorrect: false
      },
      {
        id: 'p-3',
        label: 'Benign Unconjugated Gilbert Hyperbilirubinemia',
        description: 'Total bilirubin < 4 mg/dL with completely normal synthetic function (INR < 1.1) and absence of Kayser-Fleischer rings.',
        isCorrect: false
      }
    ],
    differentialOptions: [
      {
        id: 'd-1',
        diagnosis: 'Fulminant Wilson\'s Disease (Hepatolenticular Degeneration) with Acute Liver Failure & Hemolytic Crisis',
        pathophysiology: 'Autosomal recessive ATP7B mutation causing toxic copper accumulation in hepatocytes, followed by massive copper spillover into bloodstream provoking Coombs-negative intravascular hemolysis, brain basal ganglia deposition, and renal tubular damage.',
        isCorrect: true,
        explanation: 'Pathognomonic ALP/TBil ratio of 1.34 (< 4.0), AST > ALT (2.28) in a non-drinker, Kayser-Fleischer rings, Coombs-negative hemolytic anemia (Hb 6.8), low ceruloplasmin (4.8), and Revised Wilson Prognostic Score of 12.'
      },
      {
        id: 'd-2',
        diagnosis: 'Acute Viral Hepatitis E Infection',
        pathophysiology: 'Enterically transmitted HEV viral cytolysis.',
        isCorrect: false,
        explanation: 'Viral hepatitis E produces transaminases in the thousands with ALT predominant (ALT > AST) and normal ALP/TBil ratio, without Kayser-Fleischer rings or Coombs-negative hemolysis.'
      },
      {
        id: 'd-3',
        diagnosis: 'Autoimmune Hepatitis Type 1',
        pathophysiology: 'Anti-smooth muscle antibody-mediated plasma cell infiltration.',
        isCorrect: false,
        explanation: 'AIH typically exhibits hypergammaglobulinemia (IgG > 2000), marked ALT/AST elevations, and does not cause Kayser-Fleischer rings or low ALP/TBil < 4.0.'
      }
    ],
    managementOrders: [
      {
        id: 'm-1',
        order: 'Immediate ICU admission and emergency listing for Status 1 Urgent Liver Transplantation; initiate Therapeutic Plasma Exchange (TPE) / Plasmapheresis to clear toxic unbound circulating copper and retard hemolysis; support renal perfusion with albumin; withhold D-Penicillamine monotherapy in acute decompensation.',
        clinicalRationale: 'Fulminant Wilson Disease with a Nazer/King\'s score ≥ 11 has a near 100% mortality without emergency liver transplantation. Plasmapheresis rapidly removes circulating free copper to protect kidneys from hemoglobinuric nephrosis.',
        isCorrect: true
      },
      {
        id: 'm-2',
        order: 'Discharge on oral D-Penicillamine 500 mg daily and schedule routine outpatient follow-up in 3 months.',
        clinicalRationale: 'Fatal malpractice: Chelator monotherapy in fulminant Wilson failure takes weeks to months to work and paradoxically worsens neurological status, leading to 100% mortality.',
        isCorrect: false
      },
      {
        id: 'm-3',
        order: 'Perform urgent ERCP for common bile duct exploration and sphincterotomy.',
        clinicalRationale: 'Contraindicated: CBD is normal (3.8 mm), ALP is abnormally low (38), and ERCP in an uncorrected coagulopathy (INR 2.85) will induce fatal hemorrhage.',
        isCorrect: false
      }
    ],
    attendingDebrief: {
      pathophysiologicalSummary:
        'Wilson disease is caused by homozygous or compound heterozygous mutations in ATP7B, an intracellular copper-transporting P-type ATPase. When copper capacity in hepatic metallothionein is overwhelmed, massive sudden copper release into circulation causes severe oxidative lysis of erythrocyte membranes (Coombs-negative hemolytic anemia). Zinc is competitively displaced from the alkaline phosphatase metalloenzyme by copper, producing a uniquely suppressed or normal serum ALP despite massive hyperbilirubinemia.',
      deRitisSignificance: 'AST (320) / ALT (140) = 2.29 (> 2.0). An AST/ALT ratio > 2.0 in a non-alcoholic young patient with acute liver failure is strongly suggestive of Wilson disease.',
      conjugationSignificance: 'Total Bilirubin is 28.4 mg/dL with Direct 17.2 mg/dL. The dramatic hyperbilirubinemia is a hybrid result of massive intravascular erythrocyte destruction (unconjugated) combined with acute hepatocellular-canalicular failure (conjugated).',
      clinicalPearl: 'The diagnostic combination of: 1) ALP / Total Bilirubin ratio < 4.0, and 2) AST / ALT ratio > 2.2 in a patient with acute liver failure has a diagnostic sensitivity and specificity of 100% for Wilsonian fulminant hepatitis!',
      guidelineCitation: 'AASLD Practice Guidelines: Diagnosis and Treatment of Wilson Disease (Revised King\'s College Wilson Prognostic Index).'
    }
  }
];

interface ClinicalCaseSimulatorProps {
  onNavigateToPredictor?: () => void;
  onNavigateToArcade?: () => void;
  onNavigateToCommunity?: () => void;
  initialCaseId?: string;
  initialTab?: 'chart' | 'labs' | 'imaging' | 'diagnosis' | 'debrief';
}

export const ClinicalCaseSimulator: React.FC<ClinicalCaseSimulatorProps> = ({
  onNavigateToPredictor,
  onNavigateToArcade,
  onNavigateToCommunity,
  initialCaseId,
  initialTab
}) => {
  const { awardXP, unlockBadge, xp, streakDays } = useProgress();
  const { currentUser } = useAuth();

  // State
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    initialCaseId && CLINICAL_CASES.some(c => c.id === initialCaseId)
      ? initialCaseId
      : CLINICAL_CASES[0].id
  );
  const [activeTab, setActiveTab] = useState<'chart' | 'labs' | 'imaging' | 'diagnosis' | 'debrief'>(
    initialTab || 'chart'
  );
  const [unitMode, setUnitMode] = useState<'standard' | 'si'>('standard');
  const [filterDifficulty, setFilterDifficulty] = useState<DifficultyTier | 'all'>('all');

  // Synchronize when initialCaseId or initialTab props change (e.g. from Global Search)
  React.useEffect(() => {
    if (initialCaseId && CLINICAL_CASES.some(c => c.id === initialCaseId)) {
      setSelectedCaseId(initialCaseId);
    }
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialCaseId, initialTab]);

  // Decision selections per case
  const [selectedPhenotype, setSelectedPhenotype] = useState<Record<string, string>>({});
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<Record<string, string>>({});
  const [selectedOrder, setSelectedOrder] = useState<Record<string, string>>({});
  const [caseNotes, setCaseNotes] = useState<Record<string, string>>({});

  // Submission & evaluation state
  const [submittedCases, setSubmittedCases] = useState<Record<string, {
    score: number;
    xpEarned: number;
    phenotypeCorrect: boolean;
    diagnosisCorrect: boolean;
    orderCorrect: boolean;
    submittedAt: string;
  }>>({});

  const activeCase = useMemo(() => {
    return CLINICAL_CASES.find(c => c.id === selectedCaseId) || CLINICAL_CASES[0];
  }, [selectedCaseId]);

  const activeTierConfig = useMemo(() => {
    return DIFFICULTY_TIERS[activeCase.difficulty];
  }, [activeCase.difficulty]);

  const isCaseSubmitted = !!submittedCases[activeCase.id];
  const submissionResult = submittedCases[activeCase.id];

  // Filtered cases list based on difficulty selector
  const filteredCases = useMemo(() => {
    if (filterDifficulty === 'all') return CLINICAL_CASES;
    return CLINICAL_CASES.filter(c => c.difficulty === filterDifficulty);
  }, [filterDifficulty]);

  // Handler for setting difficulty level
  const handleSelectDifficulty = (tier: DifficultyTier | 'all') => {
    setFilterDifficulty(tier);
    if (tier !== 'all') {
      const firstInTier = CLINICAL_CASES.find(c => c.difficulty === tier);
      if (firstInTier && activeCase.difficulty !== tier) {
        setSelectedCaseId(firstInTier.id);
        if (submittedCases[firstInTier.id]) {
          setActiveTab('debrief');
        } else {
          setActiveTab('chart');
        }
      }
    }
  };

  // Aggregate user simulation metrics for leaderboard and stats
  const userTotalSimXp = useMemo(() => {
    return Object.values(submittedCases).reduce((acc, c) => acc + c.xpEarned, 0);
  }, [submittedCases]);

  const userAvgAccuracy = useMemo(() => {
    const cases = Object.values(submittedCases);
    if (cases.length === 0) return 0;
    const totalScore = cases.reduce((acc, c) => acc + c.score, 0);
    return Math.round(totalScore / cases.length);
  }, [submittedCases]);

  // Biochemical Calculations
  const deRitisRatio = (activeCase.laboratoryPanel.ast / activeCase.laboratoryPanel.alt).toFixed(2);
  const conjugationRatio = (
    (activeCase.laboratoryPanel.directBilirubin / activeCase.laboratoryPanel.totalBilirubin) *
    100
  ).toFixed(1);

  // Submit diagnosis & evaluate with difficulty-scaled XP rewards
  const handleSubmitDiagnosis = () => {
    const chosenPhenotypeId = selectedPhenotype[activeCase.id];
    const chosenDiagnosisId = selectedDiagnosis[activeCase.id];
    const chosenOrderId = selectedOrder[activeCase.id];

    if (!chosenPhenotypeId || !chosenDiagnosisId || !chosenOrderId) {
      alert('Please complete all 3 clinical decisions (Phenotype, Diagnosis, and Management Order) before submitting.');
      return;
    }

    const phenotypeObj = activeCase.phenotypeOptions.find(p => p.id === chosenPhenotypeId);
    const diagnosisObj = activeCase.differentialOptions.find(d => d.id === chosenDiagnosisId);
    const orderObj = activeCase.managementOrders.find(m => m.id === chosenOrderId);

    const phenotypeCorrect = !!phenotypeObj?.isCorrect;
    const diagnosisCorrect = !!diagnosisObj?.isCorrect;
    const orderCorrect = !!orderObj?.isCorrect;

    const tierConfig = DIFFICULTY_TIERS[activeCase.difficulty];
    let score = 0;
    let earnedXp = 0;

    if (phenotypeCorrect) {
      score += 25;
      earnedXp += tierConfig.xpBreakdown.phenotype;
    }
    if (diagnosisCorrect) {
      score += 50;
      earnedXp += tierConfig.xpBreakdown.diagnosis;
    }
    if (orderCorrect) {
      score += 25;
      earnedXp += tierConfig.xpBreakdown.orders;
    }

    // Bonus for perfect run based on tier
    if (phenotypeCorrect && diagnosisCorrect && orderCorrect) {
      earnedXp += tierConfig.xpBreakdown.perfectBonus;
    }

    // Award XP to global gamification state
    awardXP(earnedXp, 'b5'); // unlocks or credits badge

    // Save submission
    setSubmittedCases(prev => ({
      ...prev,
      [activeCase.id]: {
        score,
        xpEarned: earnedXp,
        phenotypeCorrect,
        diagnosisCorrect,
        orderCorrect,
        submittedAt: new Date().toLocaleTimeString()
      }
    }));

    // Trigger celebration
    if (score >= 75) {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    }

    // Switch to debrief tab
    setActiveTab('debrief');
  };

  // Reset current case to re-try
  const handleResetCase = () => {
    setSelectedPhenotype(prev => ({ ...prev, [activeCase.id]: '' }));
    setSelectedDiagnosis(prev => ({ ...prev, [activeCase.id]: '' }));
    setSelectedOrder(prev => ({ ...prev, [activeCase.id]: '' }));
    setSubmittedCases(prev => {
      const next = { ...prev };
      delete next[activeCase.id];
      return next;
    });
    setActiveTab('chart');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Simulation Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800 font-bold flex items-center gap-1">
                <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
                Inpatient Hepatology Clinical Simulation Ward
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded font-mono font-semibold">
                Roleplay Mode Active
              </span>
              <span className="text-[10px] text-amber-400 bg-amber-950/70 border border-amber-800 px-2 py-0.5 rounded font-mono font-semibold flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                +{activeCase.xpReward} Max XP / Case ({activeCase.difficulty} Tier &bull; {activeCase.clinicalRank})
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>Clinical Case Simulator</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Step into the role of Attending Hepatologist. Review patient admission charts, analyze raw serum laboratory markers, evaluate De Ritis enzyme ratios, inspect ultrasound findings, and formulate verified diagnostic and therapeutic orders across graded difficulty tiers.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-4 bg-slate-950/70 border border-slate-800 p-4 rounded-2xl shrink-0">
            <div className="text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Cases Solved</div>
              <div className="text-xl font-black font-mono text-cyan-400">
                {Object.keys(submittedCases).length} / {CLINICAL_CASES.length}
              </div>
            </div>
            <div className="h-8 w-[1px] bg-slate-800" />
            <div className="text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Total Simulation XP</div>
              <div className="text-xl font-black font-mono text-emerald-400">
                +{userTotalSimXp} XP
              </div>
            </div>
            {userAvgAccuracy > 0 && (
              <>
                <div className="h-8 w-[1px] bg-slate-800 hidden sm:block" />
                <div className="text-center hidden sm:block">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Avg Accuracy</div>
                  <div className="text-xl font-black font-mono text-cyan-300">
                    {userAvgAccuracy}%
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2-Column Responsive Workspace: Simulator Clinical Core & Top Performers Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Census + EMR Investigation Desk (8 cols) */}
        <div className="xl:col-span-8 space-y-6">
          {/* Case Selector Carousel / Ward Census with Difficulty Level Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
            {/* Difficulty Level Selector Setup Header */}
            <div className="space-y-3 border-b border-slate-800/80 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Simulation Scenario Difficulty Level</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-normal">
                        Tiered Clinical Reasoning
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Higher difficulty tiers present complex multiorgan complications and grant larger XP rewards.
                    </p>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 flex items-center gap-1.5 self-start sm:self-auto">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Showing <strong className="text-white">{filteredCases.length}</strong> of {CLINICAL_CASES.length} Cases</span>
                </div>
              </div>

              {/* Interactive Difficulty Level Selector Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {/* Option 1: All Tiers */}
                <button
                  type="button"
                  onClick={() => handleSelectDifficulty('all')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                    filterDifficulty === 'all'
                      ? 'bg-slate-950 border-cyan-500 ring-1 ring-cyan-500 shadow-md shadow-cyan-950/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold ${filterDifficulty === 'all' ? 'text-cyan-300' : 'text-slate-300'}`}>
                      All Difficulties
                    </span>
                    <span className="text-[9px] font-mono font-bold bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                      {CLINICAL_CASES.length} Cases
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">
                    Full residency ward census
                  </div>
                  <div className="text-[10px] font-mono font-semibold text-cyan-400 mt-2">
                    +200 to +500 XP
                  </div>
                </button>

                {/* Option 2: Beginner */}
                <button
                  type="button"
                  onClick={() => handleSelectDifficulty('Beginner')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                    filterDifficulty === 'Beginner'
                      ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500 shadow-md shadow-emerald-950/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold flex items-center gap-1 ${filterDifficulty === 'Beginner' ? 'text-emerald-300' : 'text-slate-300'}`}>
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Beginner
                    </span>
                    <span className="text-[9px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.5 rounded">
                      +200 XP
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">
                    Junior Resident &bull; Single etiology
                  </div>
                  <div className="text-[10px] font-mono font-semibold text-emerald-400 mt-2">
                    Level 1 Complexity
                  </div>
                </button>

                {/* Option 3: Intermediate */}
                <button
                  type="button"
                  onClick={() => handleSelectDifficulty('Intermediate')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                    filterDifficulty === 'Intermediate'
                      ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500 shadow-md shadow-amber-950/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold flex items-center gap-1 ${filterDifficulty === 'Intermediate' ? 'text-amber-300' : 'text-slate-300'}`}>
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      Intermediate
                    </span>
                    <span className="text-[9px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800 px-1.5 py-0.5 rounded">
                      +350 XP
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">
                    Senior Registrar &bull; Toxic & DILI
                  </div>
                  <div className="text-[10px] font-mono font-semibold text-amber-400 mt-2">
                    Level 2 (1.75x XP)
                  </div>
                </button>

                {/* Option 4: Advanced */}
                <button
                  type="button"
                  onClick={() => handleSelectDifficulty('Advanced')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                    filterDifficulty === 'Advanced'
                      ? 'bg-purple-950/40 border-purple-500 ring-1 ring-purple-500 shadow-md shadow-purple-950/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold flex items-center gap-1 ${filterDifficulty === 'Advanced' ? 'text-purple-300' : 'text-slate-300'}`}>
                      <span className="w-2 h-2 rounded-full bg-purple-400" />
                      Advanced
                    </span>
                    <span className="text-[9px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800 px-1.5 py-0.5 rounded">
                      +500 XP
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">
                    Chief Fellow &bull; ICU & SBP Crisis
                  </div>
                  <div className="text-[10px] font-mono font-semibold text-purple-400 mt-2">
                    Level 3 (2.5x XP)
                  </div>
                </button>
              </div>

              {/* Active Difficulty Tier Briefing Card */}
              {(() => {
                const displayTier: DifficultyTier = filterDifficulty === 'all' ? activeCase.difficulty : filterDifficulty;
                const info = DIFFICULTY_TIERS[displayTier];
                return (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-3 text-xs mt-2 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900 pb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${info.badgeBg} ${info.badgeBorder} ${info.badgeText}`}>
                          {info.title} Tier &bull; {info.clinicalRank}
                        </span>
                        <span className="text-slate-400 text-[11px] hidden sm:inline">
                          {info.complexityLabel}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                          <span>Complexity:</span>
                          <span className="font-bold text-amber-400">
                            {displayTier === 'Beginner' ? '●○○ (Foundational)' : displayTier === 'Intermediate' ? '●●○ (High Dilemma)' : '●●● (Critical ICU)'}
                          </span>
                        </div>
                        <div className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${info.badgeBg} ${info.badgeText} border ${info.badgeBorder} flex items-center gap-1`}>
                          <Sparkles className="w-3 h-3" />
                          <span>Max Earnable: +{info.maxXP} XP</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {info.scenarioComplexity}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[10px]">
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                        <div className="font-bold text-cyan-300 flex items-center gap-1 font-mono uppercase">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                          XP Reward Distribution:
                        </div>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-slate-300 font-mono">
                          <span>Pattern Recognition:</span>
                          <span className="text-white font-bold">+{info.xpBreakdown.phenotype} XP</span>
                          <span>Definitive Diagnosis:</span>
                          <span className="text-white font-bold">+{info.xpBreakdown.diagnosis} XP</span>
                          <span>Emergency Orders:</span>
                          <span className="text-white font-bold">+{info.xpBreakdown.orders} XP</span>
                          <span>Flawless Protocol Bonus:</span>
                          <span className="text-emerald-400 font-bold">+{info.xpBreakdown.perfectBonus} XP</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                        <div className="font-bold text-rose-300 flex items-center gap-1 font-mono uppercase">
                          <AlertTriangle className="w-3 h-3 text-rose-400" />
                          Diagnostic Traps To Avoid:
                        </div>
                        <ul className="space-y-0.5 text-slate-300 text-[10px] list-disc list-inside">
                          {info.diagnosticTraps.map((trap, idx) => (
                            <li key={idx} className="truncate">{trap}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Ward Census Case Cards Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-white px-1">
                <span className="flex items-center gap-1.5">
                  <ClipboardList className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Patient Roster</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Click any patient to inspect admission chart &amp; begin workup
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                {filteredCases.map(c => {
                  const isSelected = c.id === activeCase.id;
                  const isSolved = !!submittedCases[c.id];
                  const result = submittedCases[c.id];
                  const tierInfo = DIFFICULTY_TIERS[c.difficulty];

                  return (
                    <div
                      key={c.id}
                      onClick={() => {
                        setSelectedCaseId(c.id);
                        if (submittedCases[c.id]) {
                          setActiveTab('debrief');
                        } else {
                          setActiveTab('chart');
                        }
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative group text-left ${
                        isSelected
                          ? 'bg-slate-950 border-cyan-500 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-sm font-bold text-white">
                            {c.gender === 'Male' ? '👨' : '👩'}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                              {c.patientName} ({c.age}y {c.gender === 'Male' ? 'M' : 'F'})
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">{c.bedNumber}</div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span
                            className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${tierInfo.badgeBg} ${tierInfo.badgeBorder} ${tierInfo.badgeText}`}
                          >
                            {c.difficulty}
                          </span>
                          <span className="text-[9px] font-mono font-bold text-amber-400">
                            +{c.xpReward} XP
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {c.chiefComplaint}
                      </p>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-900 text-[10px]">
                        <span className="font-mono text-slate-500">
                          AST {c.laboratoryPanel.ast} &bull; ALT {c.laboratoryPanel.alt}
                        </span>

                        {isSolved ? (
                          <span className="flex items-center gap-1 text-emerald-400 font-bold font-mono">
                            <CheckCircle2 className="w-3 h-3" /> Solved ({result.score}%)
                          </span>
                        ) : (
                          <span className="text-cyan-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                            <span>Examine</span>
                            <span>&rarr;</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

      {/* Main Patient EMR File & Investigation Desk */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        {/* Patient Header Identification Bar */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-2xl shrink-0">
              {activeCase.gender === 'Male' ? '👨‍⚕️' : '👩‍⚕️'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  Patient File: {activeCase.patientName}
                </h2>
                <span className="text-[10px] font-mono text-slate-400">
                  {activeCase.age} Yrs &bull; {activeCase.gender} &bull; {activeCase.occupation}
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {activeCase.bedNumber}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${activeTierConfig.badgeBg} ${activeTierConfig.badgeBorder} ${activeTierConfig.badgeText}`}>
                  {activeCase.difficulty} Tier ({activeCase.clinicalRank})
                </span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 border border-amber-800 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-400" />
                  +{activeCase.xpReward} Max XP
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Admitted: {activeCase.admissionDate} &bull; Attending Fellow: {currentUser?.fullName || 'Dr. Medical Student'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {isCaseSubmitted ? (
              <button
                onClick={handleResetCase}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-examine Case</span>
              </button>
            ) : null}

            <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-right">
              <div className="text-[9px] uppercase font-bold text-slate-500">De Ritis Ratio (AST/ALT)</div>
              <div className="text-xs font-mono font-bold text-cyan-400">
                {deRitisRatio} {parseFloat(deRitisRatio) > 2.0 ? '(Alcoholic Pattern)' : '(Viral/Cholestatic)'}
              </div>
            </div>
          </div>
        </div>

        {/* EMR Workspace Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('chart')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'chart'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950/40'
                : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Admission Chart &amp; History</span>
          </button>

          <button
            onClick={() => setActiveTab('labs')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'labs'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950/40'
                : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Serum Laboratory Panel</span>
          </button>

          <button
            onClick={() => setActiveTab('imaging')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'imaging'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950/40'
                : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ultrasound &amp; Imaging</span>
          </button>

          <button
            onClick={() => setActiveTab('diagnosis')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'diagnosis'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950/40'
                : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Formulate Diagnosis &amp; Orders</span>
            {!isCaseSubmitted && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>

          {isCaseSubmitted && (
            <button
              onClick={() => setActiveTab('debrief')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'debrief'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-950/40'
                  : 'bg-slate-800/60 text-emerald-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Attending Debrief &amp; Score ({submissionResult?.score}%)</span>
            </button>
          )}
        </div>

        {/* TAB 1: ADMISSION CHART & CLINICAL HISTORY */}
        {activeTab === 'chart' && (
          <div className="space-y-6">
            {/* Live Vital Signs Monitor */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-500 font-mono">Blood Pressure</div>
                <div className="text-base font-bold text-white font-mono mt-0.5">
                  {activeCase.vitalSigns.bloodPressure}
                </div>
                <div className="text-[9px] text-slate-400">Arterial BP</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                  <HeartPulse className="w-3 h-3 text-rose-400" /> Heart Rate
                </div>
                <div className="text-base font-bold text-rose-300 font-mono mt-0.5">
                  {activeCase.vitalSigns.heartRate} bpm
                </div>
                <div className="text-[9px] text-slate-400">
                  {activeCase.vitalSigns.heartRate > 100 ? 'Sinus Tachycardia' : 'Normal Rhythm'}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-amber-400" /> Temperature
                </div>
                <div className="text-base font-bold text-amber-300 font-mono mt-0.5">
                  {activeCase.vitalSigns.temperature} &deg;C
                </div>
                <div className="text-[9px] text-slate-400">
                  {activeCase.vitalSigns.temperature >= 38.0 ? 'Pyrexic (Fever)' : 'Normothermic'}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-500 font-mono">Respiratory Rate</div>
                <div className="text-base font-bold text-white font-mono mt-0.5">
                  {activeCase.vitalSigns.respiratoryRate} /min
                </div>
                <div className="text-[9px] text-slate-400">Spontaneous</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-500 font-mono">Oxygen Saturation</div>
                <div className="text-base font-bold text-cyan-300 font-mono mt-0.5">
                  {activeCase.vitalSigns.oxygenSaturation}%
                </div>
                <div className="text-[9px] text-slate-400">Room Air (FiO2 21%)</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-500 font-mono">Alertness / GCS</div>
                <div className="text-xs font-bold text-white font-mono mt-1 truncate">
                  {activeCase.vitalSigns.gcsAlertness.split('(')[0]}
                </div>
                <div className="text-[9px] text-slate-400 truncate">
                  {activeCase.vitalSigns.gcsAlertness.split('(')[1]?.replace(')', '') || 'Encephalopathy'}
                </div>
              </div>
            </div>

            {/* History of Present Illness */}
            <div className="p-5 rounded-3xl bg-slate-950/70 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 text-cyan-400" />
                <span>History of Present Illness (HPI)</span>
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {activeCase.historyOfPresentIllness}
              </p>
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Past Medical, Social &amp; Dietary History: </span>
                {activeCase.pastMedicalSocialHistory}
              </div>
            </div>

            {/* Physical Examination Findings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl bg-slate-950/70 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-cyan-400" />
                  <span>Physical Examination (Ward Round Notes)</span>
                </h4>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold">General Appearance: </span>
                    <span className="text-slate-200">{activeCase.physicalExamination.general}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">Sclera &amp; Cutaneous: </span>
                    <span className="text-slate-200">{activeCase.physicalExamination.scleraAndSkin}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">Abdomen &amp; Liver Span: </span>
                    <span className="text-slate-200">{activeCase.physicalExamination.abdomen}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">Neurological / Asterixis: </span>
                    <span className="text-slate-200">{activeCase.physicalExamination.neurological}</span>
                  </div>
                </div>
              </div>

              {/* Stigmata Checklist */}
              <div className="p-5 rounded-3xl bg-slate-950/70 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>Bedside Clinical Stigmata Identified</span>
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {activeCase.physicalExamination.peripheralStigmata.map(stig => (
                    <span
                      key={stig}
                      className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3 h-3 text-cyan-400" />
                      <span>{stig}</span>
                    </span>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
                  <span>Proceed to the </span>
                  <button
                    onClick={() => setActiveTab('labs')}
                    className="text-cyan-400 font-bold hover:underline"
                  >
                    Serum Laboratory Panel &rarr;
                  </button>
                  <span> to interpret biochemical markers and enzyme ratios.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SERUM LABORATORY PANEL */}
        {activeTab === 'labs' && (
          <div className="space-y-6">
            {/* Unit Toggle and Ratios Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  🧪
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Certified Serum Biochemistry Report</div>
                  <div className="text-[11px] text-slate-400">
                    Validated against ILPD reference standards &bull; Dual unit display
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Units:</span>
                <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setUnitMode('standard')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                      unitMode === 'standard' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Conventional (mg/dL)
                  </button>
                  <button
                    onClick={() => setUnitMode('si')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                      unitMode === 'si' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    SI Units (&mu;mol/L)
                  </button>
                </div>
              </div>
            </div>

            {/* Calculated Biomarker Ratios Banner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                    Calculated De Ritis Ratio (AST / ALT)
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300">
                    AST: {activeCase.laboratoryPanel.ast} &bull; ALT: {activeCase.laboratoryPanel.alt}
                  </span>
                </div>
                <div className="text-2xl font-black font-mono text-white flex items-center gap-2">
                  <span>{deRitisRatio}</span>
                  <span className="text-xs font-normal text-cyan-300">
                    {parseFloat(deRitisRatio) > 2.0
                      ? '⚠️ AST > 2x ALT (Strong Alcoholic/Mitochondrial Injury Signal)'
                      : parseFloat(deRitisRatio) < 1.0
                      ? 'ℹ️ ALT > AST (Viral/NAFLD Acute Cytolysis Signal)'
                      : 'ℹ️ Equivocal / Cirrhotic Transition (~1.0 - 1.5)'}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">
                    Bilirubin Conjugation Fraction (DBIL / TBIL)
                  </span>
                  <span className="text-[10px] font-mono text-indigo-300">
                    Direct: {activeCase.laboratoryPanel.directBilirubin} / Total: {activeCase.laboratoryPanel.totalBilirubin}
                  </span>
                </div>
                <div className="text-2xl font-black font-mono text-white flex items-center gap-2">
                  <span>{conjugationRatio}%</span>
                  <span className="text-xs font-normal text-indigo-300">
                    {parseFloat(conjugationRatio) > 50
                      ? '⚠️ Conjugated (>50% Direct): Hepatic Canalicular or Post-Hepatic Obstruction'
                      : 'ℹ️ Unconjugated Predominant: Hemolysis or Glucuronidation Defect (Gilbert)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Laboratory Table */}
            <div className="rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono text-[10px] uppercase">
                  <tr>
                    <th className="py-3 px-4">Serum Analyte</th>
                    <th className="py-3 px-4">Patient Value</th>
                    <th className="py-3 px-4">Standard Reference Range</th>
                    <th className="py-3 px-4">Status Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900 font-sans">
                  {[
                    {
                      name: 'Total Bilirubin (TBIL)',
                      val: unitMode === 'standard' ? `${activeCase.laboratoryPanel.totalBilirubin} mg/dL` : `${(activeCase.laboratoryPanel.totalBilirubin * 17.1).toFixed(1)} µmol/L`,
                      ref: unitMode === 'standard' ? '0.2 - 1.2 mg/dL' : '3.4 - 20.5 µmol/L',
                      high: activeCase.laboratoryPanel.totalBilirubin > 1.2,
                      critical: activeCase.laboratoryPanel.totalBilirubin > 10.0
                    },
                    {
                      name: 'Direct Bilirubin (DBIL)',
                      val: unitMode === 'standard' ? `${activeCase.laboratoryPanel.directBilirubin} mg/dL` : `${(activeCase.laboratoryPanel.directBilirubin * 17.1).toFixed(1)} µmol/L`,
                      ref: unitMode === 'standard' ? '0.0 - 0.3 mg/dL' : '0.0 - 5.1 µmol/L',
                      high: activeCase.laboratoryPanel.directBilirubin > 0.3,
                      critical: activeCase.laboratoryPanel.directBilirubin > 5.0
                    },
                    {
                      name: 'Aspartate Aminotransferase (AST/SGOT)',
                      val: `${activeCase.laboratoryPanel.ast} IU/L`,
                      ref: '10 - 40 IU/L',
                      high: activeCase.laboratoryPanel.ast > 40,
                      critical: activeCase.laboratoryPanel.ast > 1000
                    },
                    {
                      name: 'Alanine Aminotransferase (ALT/SGPT)',
                      val: `${activeCase.laboratoryPanel.alt} IU/L`,
                      ref: '7 - 56 IU/L',
                      high: activeCase.laboratoryPanel.alt > 56,
                      critical: activeCase.laboratoryPanel.alt > 1000
                    },
                    {
                      name: 'Alkaline Phosphatase (ALP)',
                      val: `${activeCase.laboratoryPanel.alp} IU/L`,
                      ref: '44 - 147 IU/L',
                      high: activeCase.laboratoryPanel.alp > 147,
                      critical: activeCase.laboratoryPanel.alp > 400
                    },
                    {
                      name: 'Serum Albumin (ALB)',
                      val: `${activeCase.laboratoryPanel.albumin} g/dL`,
                      ref: '3.5 - 5.0 g/dL',
                      high: false,
                      low: activeCase.laboratoryPanel.albumin < 3.5,
                      critical: activeCase.laboratoryPanel.albumin < 2.5
                    },
                    {
                      name: 'Prothrombin Time / INR',
                      val: `${activeCase.laboratoryPanel.inr}`,
                      ref: '0.8 - 1.2',
                      high: activeCase.laboratoryPanel.inr > 1.2,
                      critical: activeCase.laboratoryPanel.inr > 2.0
                    },
                    {
                      name: 'Platelet Count',
                      val: `${activeCase.laboratoryPanel.plateletCount.toLocaleString()} /µL`,
                      ref: '150,000 - 450,000 /µL',
                      high: false,
                      low: activeCase.laboratoryPanel.plateletCount < 150000,
                      critical: activeCase.laboratoryPanel.plateletCount < 75000
                    }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-2.5 px-4 font-semibold text-slate-200">{row.name}</td>
                      <td className="py-2.5 px-4 font-mono font-bold text-white">{row.val}</td>
                      <td className="py-2.5 px-4 text-slate-400 font-mono text-[11px]">{row.ref}</td>
                      <td className="py-2.5 px-4 font-mono text-[10px] font-bold">
                        {row.critical ? (
                          <span className="text-rose-400 bg-rose-950/70 border border-rose-800 px-2 py-0.5 rounded">
                            CRITICAL {row.low ? 'LOW' : 'HIGH'}
                          </span>
                        ) : row.high ? (
                          <span className="text-amber-400 bg-amber-950/70 border border-amber-800 px-2 py-0.5 rounded">
                            ELEVATED
                          </span>
                        ) : row.low ? (
                          <span className="text-amber-300 bg-amber-950/50 border border-amber-800/80 px-2 py-0.5 rounded">
                            SUB-NORMAL
                          </span>
                        ) : (
                          <span className="text-emerald-400 bg-emerald-950/50 border border-emerald-900 px-2 py-0.5 rounded">
                            WITHIN RANGE
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Special Marker Callout */}
            {activeCase.laboratoryPanel.specialMarker && (
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/80 space-y-1.5">
                <div className="text-[10px] font-mono text-amber-400 font-bold uppercase flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Special Pathology Diagnostic Score: {activeCase.laboratoryPanel.specialMarker.name}</span>
                </div>
                <div className="text-sm font-bold text-white font-mono">
                  {activeCase.laboratoryPanel.specialMarker.value}
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  {activeCase.laboratoryPanel.specialMarker.clinicalSignificance}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ULTRASOUND & IMAGING */}
        {activeTab === 'imaging' && (
          <div className="space-y-6">
            <div className="p-5 rounded-3xl bg-slate-950/70 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-white font-bold text-xs">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <span>Department of Diagnostic Radiology &bull; {activeCase.ultrasoundAndImaging.modality}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">Official Formal Read</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-semibold">Hepatic Parenchyma &amp; Architecture:</div>
                  <div className="text-slate-200">{activeCase.ultrasoundAndImaging.liverArchitecture}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-semibold">Biliary Tree &amp; Common Bile Duct (CBD):</div>
                  <div className="text-slate-200">{activeCase.ultrasoundAndImaging.biliaryTree}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-semibold">Gallbladder &amp; Cholelithiasis:</div>
                  <div className="text-slate-200">{activeCase.ultrasoundAndImaging.gallbladder}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-semibold">Portal Vasculature &amp; Splenic Size:</div>
                  <div className="text-slate-200">{activeCase.ultrasoundAndImaging.vasculatureAndSpleen}</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-800/80 space-y-1">
                <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                  Radiologist Diagnostic Impression:
                </div>
                <div className="text-xs text-white font-semibold">
                  {activeCase.ultrasoundAndImaging.radiologyImpression}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FORMULATE DIAGNOSIS & MANAGEMENT ORDERS */}
        {activeTab === 'diagnosis' && (
          <div className="space-y-6">
            {isCaseSubmitted ? (
              <div className="p-5 rounded-3xl bg-emerald-950/40 border border-emerald-800 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h3 className="text-base font-bold text-white">Diagnosis Already Submitted</h3>
                <p className="text-xs text-slate-300">
                  You earned <span className="text-emerald-400 font-bold">+{submissionResult.xpEarned} XP</span> on this case.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('debrief')}
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                  >
                    View Attending Debrief &rarr;
                  </button>
                  <button
                    onClick={handleResetCase}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Re-attempt Case
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Decision 1: Phenotype Pattern */}
                <div className="p-5 rounded-3xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                      Decision Step 1 of 3 &bull; +{activeTierConfig.xpBreakdown.phenotype} XP ({activeCase.difficulty} Tier)
                    </span>
                    <span className="text-xs font-bold text-white">Biochemical Injury Pattern</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    Identify the dominant biochemical phenotype based on transaminases, ALP, and bilirubin:
                  </h4>

                  <div className="space-y-2 pt-1">
                    {activeCase.phenotypeOptions.map(p => {
                      const isSelected = selectedPhenotype[activeCase.id] === p.id;
                      return (
                        <div
                          key={p.id}
                          onClick={() => setSelectedPhenotype(prev => ({ ...prev, [activeCase.id]: p.id }))}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left ${
                            isSelected
                              ? 'bg-cyan-950/50 border-cyan-500 shadow-md ring-1 ring-cyan-500'
                              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-slate-600'}`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                            </div>
                            <span className="text-xs font-bold text-white">{p.label}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 pl-6">{p.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Decision 2: Primary Differential Diagnosis */}
                <div className="p-5 rounded-3xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                      Decision Step 2 of 3 &bull; +{activeTierConfig.xpBreakdown.diagnosis} XP ({activeCase.difficulty} Tier)
                    </span>
                    <span className="text-xs font-bold text-white">Primary Etiological Diagnosis</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    Select the most accurate clinical diagnosis supported by patient history, lab assays, and imaging:
                  </h4>

                  <div className="space-y-2 pt-1">
                    {activeCase.differentialOptions.map(d => {
                      const isSelected = selectedDiagnosis[activeCase.id] === d.id;
                      return (
                        <div
                          key={d.id}
                          onClick={() => setSelectedDiagnosis(prev => ({ ...prev, [activeCase.id]: d.id }))}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left ${
                            isSelected
                              ? 'bg-cyan-950/50 border-cyan-500 shadow-md ring-1 ring-cyan-500'
                              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-slate-600'}`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                            </div>
                            <span className="text-xs font-bold text-white">{d.diagnosis}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 pl-6">{d.pathophysiology}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Decision 3: Life-Saving Management Order */}
                <div className="p-5 rounded-3xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                      Decision Step 3 of 3 &bull; +{activeTierConfig.xpBreakdown.orders} XP (Flawless Bonus: +{activeTierConfig.xpBreakdown.perfectBonus} XP)
                    </span>
                    <span className="text-xs font-bold text-white">Immediate Management Order</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    Select the prioritized emergency order to execute immediately:
                  </h4>

                  <div className="space-y-2 pt-1">
                    {activeCase.managementOrders.map(m => {
                      const isSelected = selectedOrder[activeCase.id] === m.id;
                      return (
                        <div
                          key={m.id}
                          onClick={() => setSelectedOrder(prev => ({ ...prev, [activeCase.id]: m.id }))}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left ${
                            isSelected
                              ? 'bg-cyan-950/50 border-cyan-500 shadow-md ring-1 ring-cyan-500'
                              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-slate-600'}`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                            </div>
                            <span className="text-xs font-bold text-white">{m.order}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 pl-6">{m.clinicalRationale}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Final Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div className="text-[11px] text-slate-400">
                    All decisions are graded against AASLD and EASL clinical practice guidelines.
                  </div>

                  <button
                    onClick={handleSubmitDiagnosis}
                    className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 transition-all cursor-pointer"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Submit Orders &amp; Earn Clinical XP &rarr;</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: ATTENDING DEBRIEF & CLINICAL SCORE */}
        {activeTab === 'debrief' && (
          <div className="space-y-6">
            {/* Scorecard Header */}
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                    Official Senior Attending Case Evaluation
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    Case Evaluation: {activeCase.patientName}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Diagnostic Score</div>
                    <div className="text-2xl font-black font-mono text-cyan-400">
                      {submissionResult?.score || 100}%
                    </div>
                  </div>
                  <div className="bg-emerald-950/70 border border-emerald-800 px-3 py-1.5 rounded-xl text-center">
                    <div className="text-[9px] uppercase font-bold text-emerald-400">Earned XP</div>
                    <div className="text-base font-black font-mono text-emerald-300">
                      +{submissionResult?.xpEarned || activeCase.xpReward} XP
                    </div>
                    <div className="text-[8px] font-mono text-slate-400">
                      {activeCase.difficulty} Tier ({activeCase.clinicalRank})
                    </div>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">1. Pattern Recognition</div>
                  <div className="font-bold text-white text-xs mt-1 flex items-center gap-1.5">
                    {submissionResult?.phenotypeCorrect ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+{activeTierConfig.xpBreakdown.phenotype} XP)
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Review Needed
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">2. Primary Diagnosis</div>
                  <div className="font-bold text-white text-xs mt-1 flex items-center gap-1.5">
                    {submissionResult?.diagnosisCorrect ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Accurate (+{activeTierConfig.xpBreakdown.diagnosis} XP)
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Incorrect Diagnosis
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">3. Life-Saving Management</div>
                  <div className="font-bold text-white text-xs mt-1 flex items-center gap-1.5">
                    {submissionResult?.orderCorrect ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Protocol Passed (+{activeTierConfig.xpBreakdown.orders} XP)
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Suboptimal Order
                      </span>
                    )}
                  </div>
                </div>

                {submissionResult?.phenotypeCorrect && submissionResult?.diagnosisCorrect && submissionResult?.orderCorrect && (
                  <div className="md:col-span-3 p-3 rounded-2xl bg-amber-950/40 border border-amber-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-300 font-bold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Flawless Case Protocol Executed ({activeCase.difficulty} Tier Mastery)
                    </span>
                    <span className="text-amber-400 font-black text-sm">
                      +{activeTierConfig.xpBreakdown.perfectBonus} Bonus XP
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Pathophysiology & Teaching Notes */}
            <div className="p-6 rounded-3xl bg-slate-950/70 border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Senior Attending Physician Pathophysiology Transcript</span>
              </h4>

              <p className="text-xs text-slate-200 leading-relaxed">
                {activeCase.attendingDebrief.pathophysiologicalSummary}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-cyan-300">De Ritis Ratio Clinical Rationale:</div>
                  <div className="text-slate-300 text-[11px] leading-relaxed">
                    {activeCase.attendingDebrief.deRitisSignificance}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-indigo-300">Bilirubin Conjugation Interpretation:</div>
                  <div className="text-slate-300 text-[11px] leading-relaxed">
                    {activeCase.attendingDebrief.conjugationSignificance}
                  </div>
                </div>
              </div>

              {/* Clinical Pearl Box */}
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800 space-y-1">
                <div className="text-[10px] font-mono text-amber-400 font-bold uppercase flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>High-Yield Clinical Pearl</span>
                </div>
                <div className="text-xs text-amber-200 font-medium">
                  {activeCase.attendingDebrief.clinicalPearl}
                </div>
              </div>

              <div className="text-[10px] text-slate-500 font-mono">
                Guideline Authority: {activeCase.attendingDebrief.guidelineCitation}
              </div>
            </div>

            {/* Next Steps CTA */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={handleResetCase}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Case &amp; Practice Again</span>
              </button>

              <div className="flex items-center gap-2">
                {onNavigateToPredictor && (
                  <button
                    onClick={onNavigateToPredictor}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700"
                  >
                    <span>Run ML Risk Predictor &rarr;</span>
                  </button>
                )}
                {onNavigateToArcade && (
                  <button
                    onClick={onNavigateToArcade}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold"
                  >
                    <span>Play Clinical Arcade &rarr;</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Right Column: Top Performers Sidebar (4 cols on xl) */}
    <div className="xl:col-span-4 space-y-6 xl:sticky xl:top-6">
      <TopPerformersSidebar
        submittedCasesCount={Object.keys(submittedCases).length}
        totalCasesCount={CLINICAL_CASES.length}
        userSimScore={userTotalSimXp}
        userAccuracyRate={userAvgAccuracy}
        onNavigateToCommunity={onNavigateToCommunity}
        onSelectCase={(caseId) => {
          setSelectedCaseId(caseId);
          if (submittedCases[caseId]) {
            setActiveTab('debrief');
          } else {
            setActiveTab('chart');
          }
        }}
      />
    </div>
  </div>
</div>
);
};
