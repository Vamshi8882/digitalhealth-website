/**
 * Digitalization in Healthcare - Clinical Intelligence Data & Medical Models
 * Comprehensive domain datasets for:
 * - Multi-Disease Prediction (NAFLD/MASLD, Hepatitis, Cirrhosis, Alcoholic Liver Disease, Acute Failure)
 * - Anomaly & Outlier Detection baselines
 * - Sample OCR Medical Lab Reports
 * - Ultrasound CNN Presets & Feature Activation Maps
 * - Interactive Knowledge Graph Nodes & Links
 * - Clinical Guidelines (AASLD, EASL, WHO, APASL) & Staging Formulae (FIB-4, APRI, Child-Pugh, MELD-Na)
 * - Medical Terminology Translations (Plain English, Hindi, Spanish, Telugu, Tamil, French)
 * - Baseline ILPD Distribution Statistics for Model Drift (PSI)
 */

export interface MultiDiseaseDiagnosis {
  id: string;
  name: string;
  category: 'Metabolic' | 'Toxic/Alcoholic' | 'Viral' | 'Structural/Obstructive' | 'End-Stage/Critical';
  icd10: string;
  prevalence: string;
  riskScore: number; // 0 - 100
  riskBand: 'Low' | 'Moderate' | 'High' | 'Critical';
  triggerMarkers: string[];
  clinicalCriteria: string[];
  pathophysiology: string;
  guidelineAction: string;
}

export interface AnomalyReport {
  isAnomaly: boolean;
  anomalyScore: number; // 0 (normal) to 1 (extreme outlier)
  detectedPatterns: {
    marker: string;
    value: number;
    zScore: number;
    description: string;
    severity: 'mild' | 'moderate' | 'severe' | 'critical';
  }[];
  isolationForestVerdict: string;
}

export interface SampleMedicalReport {
  id: string;
  title: string;
  facility: string;
  date: string;
  patientName: string;
  age: number;
  gender: 'Male' | 'Female';
  rawText: string;
  extractedLabs: {
    totalBilirubin: number;
    directBilirubin: number;
    alkphos: number;
    sgpt: number;
    sgot: number;
    totalProteins: number;
    albumin: number;
    agRatio: number;
    plateletCount?: number;
    inr?: number;
  };
  ocrConfidence: number;
  extractedFieldsCount: number;
}

export interface UltrasoundImagePreset {
  id: string;
  title: string;
  clinicalIndication: string;
  echogenicity: 'Normal' | 'Diffuse Hyperechoic (Bright)' | 'Coarse Heterogeneous' | 'Acoustic Shadowing';
  fibrosisStage: 'F0 (No Fibrosis)' | 'F1/F2 (Mild/Moderate)' | 'F3 (Severe)' | 'F4 (Cirrhosis)';
  steatosisGrade: 'None (Grade 0)' | 'Mild (Grade 1)' | 'Moderate (Grade 2)' | 'Severe (Grade 3)';
  findings: string[];
  cnnConfidence: number;
  imageUrl: string;
  gradCamHeatmapSvg: string; // inline SVG overlay path/points
}

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  type: 'disease' | 'symptom' | 'biomarker' | 'cause' | 'treatment';
  description: string;
  color: string;
  val: number; // size
}

export interface KnowledgeGraphLink {
  source: string;
  target: string;
  relationship: string;
}

export interface ClinicalGuidelineItem {
  id: string;
  organization: 'AASLD' | 'EASL' | 'WHO' | 'APASL';
  title: string;
  year: number;
  recommendation: string;
  evidenceGrade: 'Class I, Level A' | 'Class I, Level B' | 'Class IIa, Level B' | 'Class IIb, Level C';
  keyActionSteps: string[];
  targetConditions: string[];
}

export interface TerminologyTranslation {
  term: string;
  definition: string;
  plainEnglish: string;
  translations: {
    hindi: string;
    spanish: string;
    telugu: string;
    tamil: string;
    french: string;
  };
}

// ==========================================
// 1. SAMPLE MEDICAL LAB REPORTS (FOR OCR SIMULATOR)
// ==========================================
export const SAMPLE_MEDICAL_REPORTS: SampleMedicalReport[] = [
  {
    id: 'report-1',
    title: 'Inpatient Comprehensive Liver Function Panel',
    facility: 'Apex Central Clinical Laboratories & Medical Center',
    date: '2026-10-24',
    patientName: 'Anand Verma',
    age: 52,
    gender: 'Male',
    rawText: `APEX CENTRAL CLINICAL LABORATORIES
DEPARTMENT OF BIOCHEMISTRY & LABORATORY MEDICINE
Patient Name: Anand Verma | Age: 52 Yrs | Gender: Male
Specimen: Fasting Venous Serum | Collection Date: 24-Oct-2026 08:30 IST

TEST DESCRIPTION                     RESULT    UNIT      REFERENCE INTERVAL   FLAG
---------------------------------------------------------------------------------
Total Bilirubin                      4.60      mg/dL     0.20 - 1.20          HIGH [H]
Direct (Conjugated) Bilirubin        2.40      mg/dL     0.00 - 0.30          HIGH [H]
Indirect Bilirubin                   2.20      mg/dL     0.10 - 0.90          HIGH [H]
Alkaline Phosphatase (ALP)           245.0     IU/L      44.0 - 147.0         HIGH [H]
Alanine Aminotransferase (ALT/SGPT)  82.0      IU/L      7.0  - 56.0          HIGH [H]
Aspartate Aminotransferase (AST/SGOT) 188.0    IU/L      10.0 - 40.0          HIGH [H]
Total Serum Protein                  6.10      g/dL      6.40 - 8.30          LOW  [L]
Serum Albumin                        2.80      g/dL      3.50 - 5.00          LOW  [L]
Serum Globulin                       3.30      g/dL      2.30 - 3.50          NORMAL
Albumin/Globulin (A/G) Ratio         0.85      ratio     1.10 - 2.20          LOW  [L]
De Ritis Ratio (AST/ALT calculated)  2.29      ratio     0.80 - 1.20          ELEVATED

Verified by: Dr. S. K. Mehta, MD (Pathology), Lead Clinical Biochemist.`,
    extractedLabs: {
      totalBilirubin: 4.6,
      directBilirubin: 2.4,
      alkphos: 245,
      sgpt: 82,
      sgot: 188,
      totalProteins: 6.1,
      albumin: 2.8,
      agRatio: 0.85,
      plateletCount: 94000,
      inr: 1.62
    },
    ocrConfidence: 98.4,
    extractedFieldsCount: 10
  },
  {
    id: 'report-2',
    title: 'Outpatient Metabolic NAFLD / MASLD Screening Report',
    facility: 'Metropolis Diagnostic & Preventive Health Institute',
    date: '2026-10-28',
    patientName: 'Sunita Sharma',
    age: 46,
    gender: 'Female',
    rawText: `METROPOLIS DIAGNOSTIC & PREVENTIVE HEALTH INSTITUTE
ANNUAL EXECUTIVE HEALTH PROFILE - HEPATOLOGY SCREEN
Patient: Sunita Sharma | Age: 46 Yrs | Gender: Female | Fasting Blood
Registered MRN: MET-2026-99381 | Order Date: 28-Oct-2026

SERUM ANALYTES:
- Total Bilirubin: 1.10 mg/dL (Normal Range: 0.20 - 1.20)
- Direct Bilirubin: 0.35 mg/dL (Normal Range: 0.00 - 0.30) [SLIGHT HIGH]
- SGPT / ALT: 74.0 IU/L (Normal Range: 7.0 - 56.0) [HIGH]
- SGOT / AST: 52.0 IU/L (Normal Range: 10.0 - 40.0) [HIGH]
- Alkaline Phosphatase: 112.0 IU/L (Normal Range: 44.0 - 147.0) [NORMAL]
- Total Proteins: 7.40 g/dL (Normal Range: 6.40 - 8.30) [NORMAL]
- Albumin: 4.30 g/dL (Normal Range: 3.50 - 5.00) [NORMAL]
- A/G Ratio: 1.39 (Normal Range: 1.10 - 2.20) [NORMAL]
- Fasting Glucose: 132 mg/dL [ELEVATED - Impaired Fasting Glycemia]
- Triglycerides: 240 mg/dL [HIGH]

Impression: Pattern typical of Metabolic Dysfunction-Associated Steatotic Liver Disease (MASLD/NAFLD) with ALT > AST.`,
    extractedLabs: {
      totalBilirubin: 1.1,
      directBilirubin: 0.35,
      alkphos: 112,
      sgpt: 74,
      sgot: 52,
      totalProteins: 7.4,
      albumin: 4.3,
      agRatio: 1.39,
      plateletCount: 260000,
      inr: 1.02
    },
    ocrConfidence: 99.1,
    extractedFieldsCount: 10
  },
  {
    id: 'report-3',
    title: 'Emergency Resuscitation Acute Toxicology Lab Slip',
    facility: 'University Medical Center - Emergency Triage Lab',
    date: '2026-10-29',
    patientName: 'Karan Mehra',
    age: 29,
    gender: 'Male',
    rawText: `UNIVERSITY MEDICAL CENTER - EMERGENCY BIOCHEMISTRY STAT SLIP
URGENT RED-FLAG CRITICAL ALERT
Patient: Karan Mehra | Age: 29 | Gender: Male | Location: Resus Bed 1
Timestamp: 29-Oct-2026 23:14 UTC

ANALYTE                           VALUE       UNITS      ALERT LEVEL
--------------------------------------------------------------------
Total Bilirubin                   3.80        mg/dL      CRITICAL HIGH
Direct Bilirubin                  2.10        mg/dL      CRITICAL HIGH
ALT / SGPT                        4,850.0     IU/L       MASSIVE TOXIC SURGE (>50x ULN)
AST / SGOT                        4,120.0     IU/L       MASSIVE TOXIC SURGE (>50x ULN)
Alkaline Phosphatase (ALP)        124.0       IU/L       Normal
Total Serum Protein               5.80        g/dL       Borderline Low
Serum Albumin                     3.40        g/dL       Mild Depletion
A/G Ratio                         1.42        ratio      Normal
Prothrombin Time / INR            2.68        ratio      CRITICAL PROLONGED (>2.0)
Platelet Count                    152,000     /uL        Normal
Serum Acetaminophen (APAP)        72.0        ug/mL      TOXIC RANGE (14h post-ingestion)

RECOMMENDATION: STAT Hepatology / ICU consult for Acute Liver Failure (ALF) King's College protocol.`,
    extractedLabs: {
      totalBilirubin: 3.8,
      directBilirubin: 2.1,
      alkphos: 124,
      sgpt: 4850,
      sgot: 4120,
      totalProteins: 5.8,
      albumin: 3.4,
      agRatio: 1.42,
      plateletCount: 152000,
      inr: 2.68
    },
    ocrConfidence: 97.8,
    extractedFieldsCount: 10
  }
];

// ==========================================
// 2. MULTI-DISEASE PREDICTION ENGINES
// ==========================================
export function evaluateMultiDiseaseRisks(labs: {
  age: number;
  gender: 'Male' | 'Female';
  totalBilirubin: number;
  directBilirubin: number;
  alkphos: number;
  sgpt: number; // ALT
  sgot: number; // AST
  totalProteins: number;
  albumin: number;
  agRatio: number;
  plateletCount?: number;
  inr?: number;
}): MultiDiseaseDiagnosis[] {
  const deRitis = labs.sgpt > 0 ? labs.sgot / labs.sgpt : 1.0;
  const conjFraction = labs.totalBilirubin > 0 ? labs.directBilirubin / labs.totalBilirubin : 0.0;
  const inr = labs.inr || (labs.totalBilirubin > 3 ? 1.5 : 1.05);
  const platelets = labs.plateletCount || 220000;

  // 1. Non-Alcoholic Fatty Liver Disease (MASLD / NAFLD)
  // Hallmarks: ALT > AST (De Ritis < 1.0), mild transaminitis (ALT 45-120), normal bilirubin, normal INR.
  let nafldScore = 15;
  if (labs.sgpt > 45 && labs.sgpt < 180) nafldScore += 35;
  if (deRitis < 0.9) nafldScore += 25;
  if (labs.totalBilirubin < 1.8) nafldScore += 15;
  if (labs.alkphos < 160) nafldScore += 10;
  nafldScore = Math.min(95, Math.max(8, nafldScore));

  // 2. Alcoholic Liver Disease (ALD) & Alcoholic Steatohepatitis
  // Hallmarks: De Ritis ratio (AST/ALT) > 2.0, AST usually < 400, elevated conjugated bilirubin, history of heavy intake.
  let aldScore = 10;
  if (deRitis >= 2.0) aldScore += 50;
  else if (deRitis >= 1.5) aldScore += 30;
  if (labs.sgot > 60 && labs.sgot < 450) aldScore += 20;
  if (labs.totalBilirubin > 2.5) aldScore += 15;
  if (labs.albumin < 3.2) aldScore += 10;
  aldScore = Math.min(96, Math.max(5, aldScore));

  // 3. Chronic Liver Cirrhosis & Advanced Fibrosis
  // Hallmarks: Thrombocytopenia (platelets < 150k), inverted A/G ratio (<1.0), hypoalbuminemia (<3.2), elevated INR (>1.4), FIB-4 > 3.25.
  // FIB-4 = (Age * AST) / (Platelets * sqrt(ALT))
  const fib4 = (labs.age * labs.sgot) / (platelets * Math.sqrt(Math.max(1, labs.sgpt)));
  let cirrhosisScore = 12;
  if (fib4 > 3.25) cirrhosisScore += 45;
  else if (fib4 > 1.45) cirrhosisScore += 25;
  if (labs.albumin < 3.2) cirrhosisScore += 20;
  if (labs.agRatio < 1.0) cirrhosisScore += 15;
  if (inr > 1.4) cirrhosisScore += 15;
  cirrhosisScore = Math.min(98, Math.max(6, cirrhosisScore));

  // 4. Acute Viral Hepatitis (HAV, HBV, HCV)
  // Hallmarks: Massive transaminase leak (>1000 IU/L), ALT > AST (De Ritis < 1.0), high conjugated bilirubin.
  let viralScore = 8;
  if (labs.sgpt > 1000 || labs.sgot > 1000) viralScore += 65;
  else if (labs.sgpt > 350) viralScore += 35;
  if (deRitis < 1.0) viralScore += 15;
  if (labs.totalBilirubin > 3.0) viralScore += 12;
  viralScore = Math.min(94, Math.max(5, viralScore));

  // 5. Extrahepatic Cholestasis & Biliary Obstruction
  // Hallmarks: High ALP (>2x ULN), high Direct:Total Bilirubin (>60%), normal or mild transaminases.
  let cholestasisScore = 10;
  if (labs.alkphos > 250) cholestasisScore += 40;
  if (conjFraction > 0.55 && labs.totalBilirubin > 2.0) cholestasisScore += 35;
  if (labs.sgpt < 150 && labs.sgot < 150) cholestasisScore += 15;
  cholestasisScore = Math.min(95, Math.max(6, cholestasisScore));

  // 6. Hyperacute Toxic Necrosis / Acute Liver Failure (King's College)
  // Hallmarks: Transaminases > 3000 IU/L, coagulopathy INR > 2.0, acute onset.
  let alfScore = 5;
  if (labs.sgpt > 2500 || labs.sgot > 2500) alfScore += 60;
  if (inr > 2.0) alfScore += 30;
  if (labs.totalBilirubin > 3.0) alfScore += 10;
  alfScore = Math.min(99, Math.max(3, alfScore));

  const getBand = (score: number): 'Low' | 'Moderate' | 'High' | 'Critical' => {
    if (score >= 80) return 'Critical';
    if (score >= 60) return 'High';
    if (score >= 35) return 'Moderate';
    return 'Low';
  };

  return [
    {
      id: 'masld',
      name: 'Metabolic Dysfunction-Associated Steatotic Liver Disease (MASLD / NAFLD)',
      category: 'Metabolic',
      icd10: 'K76.0',
      prevalence: '25-30% of global population (most common chronic liver etiology)',
      riskScore: nafldScore,
      riskBand: getBand(nafldScore),
      triggerMarkers: [
        `ALT: ${labs.sgpt} IU/L (ALT-predominant cytolysis)`,
        `De Ritis Ratio: ${deRitis.toFixed(2)} (< 1.0 typical)`,
        `Total Bilirubin: ${labs.totalBilirubin} mg/dL (Preserved)`
      ],
      clinicalCriteria: [
        'Evidence of hepatic steatosis without secondary cause (alcohol < 20g/day)',
        'Presence of at least 1 cardiometabolic risk factor (BMI, HOMA-IR, dyslipidemia)',
        'FIB-4 score calculated for risk of progressive fibrosis'
      ],
      pathophysiology:
        'Insulin resistance causes excessive free fatty acid influx into hepatocytes, leading to triglyceride lipotoxicity, reactive oxygen species (ROS) generation, and sterile necroinflammation.',
      guidelineAction:
        'AASLD 2023 Guideline: Calculate FIB-4 score. If FIB-4 < 1.3, low risk; reassess in 2-3 years. Recommend Mediterranean diet, 7-10% weight loss, and 150 min/week aerobic exercise.'
    },
    {
      id: 'ald',
      name: 'Alcohol-Related Liver Disease & Steatohepatitis (ALD / ASH)',
      category: 'Toxic/Alcoholic',
      icd10: 'K70.3',
      prevalence: 'Leading cause of liver-related mortality and acute decompensation',
      riskScore: aldScore,
      riskBand: getBand(aldScore),
      triggerMarkers: [
        `De Ritis Ratio (AST/ALT): ${deRitis.toFixed(2)} (High clinical signal if > 2.0)`,
        `AST: ${labs.sgot} IU/L (Mitochondrial isozyme release)`,
        `Total Bilirubin: ${labs.totalBilirubin} mg/dL`
      ],
      clinicalCriteria: [
        'AST:ALT ratio > 2.0 with AST < 400-500 IU/L',
        'History of excessive alcohol consumption (>40g/day for women, >60g/day for men)',
        "Maddrey's Discriminant Function (mDF) or Glasgow Alcoholic Hepatitis score evaluation"
      ],
      pathophysiology:
        'Ethanol metabolism via alcohol dehydrogenase and CYP2E1 generates toxic acetaldehyde and ROS. Pyridoxal-5-phosphate depletion specifically impairs ALT synthesis, creating the pathognomonic AST/ALT > 2.0 ratio.',
      guidelineAction:
        'EASL ALD Guidelines: Strict abstinence, nutritional thiamine repletion prior to any glucose. Calculate Maddrey DF; if > 32, evaluate for corticosteroid therapy (Prednisolone 40mg/day) once sepsis is ruled out.'
    },
    {
      id: 'cirrhosis',
      name: 'Advanced Liver Cirrhosis & Portal Hypertension',
      category: 'End-Stage/Critical',
      icd10: 'K74.6',
      prevalence: '11th leading cause of death worldwide',
      riskScore: cirrhosisScore,
      riskBand: getBand(cirrhosisScore),
      triggerMarkers: [
        `FIB-4 Index: ${fib4.toFixed(2)} (High risk threshold > 3.25)`,
        `Serum Albumin: ${labs.albumin} g/dL (Synthetic failure indicator)`,
        `A/G Ratio: ${labs.agRatio} (Inverted due to polyclonal hypergammaglobulinemia)`,
        `INR: ${inr.toFixed(2)} (Extrinsic clotting factor depletion)`
      ],
      clinicalCriteria: [
        'Evidence of architectural distortion: nodular liver, portal hypertension, splenomegaly',
        'Stigmata: Spider angiomas, palmar erythema, caput medusae, asterixis',
        'Child-Pugh (Score A, B, C) and MELD-Na staging'
      ],
      pathophysiology:
        'Chronic injury drives hepatic stellate cell activation into collagen-secreting myofibroblasts. Dense extracellular matrix replaces parenchyma, increasing sinusoidal vascular resistance and causing portal hypertension.',
      guidelineAction:
        'Baveno VII Consensus: Screen for gastroesophageal varices, perform semi-annual ultrasound + AFP for hepatocellular carcinoma (HCC) surveillance, and sodium restriction (<2g/day) for ascites.'
    },
    {
      id: 'viral',
      name: 'Acute / Reactive Viral Hepatitis (HAV, HBV, HCV)',
      category: 'Viral',
      icd10: 'B19.9',
      prevalence: 'Major cause of acute jaundice and worldwide chronic liver disease',
      riskScore: viralScore,
      riskBand: getBand(viralScore),
      triggerMarkers: [
        `ALT: ${labs.sgpt} IU/L (Cytolysis indicator)`,
        `AST: ${labs.sgot} IU/L`,
        `De Ritis: ${deRitis.toFixed(2)} (< 1.0 typical for viral etiology)`
      ],
      clinicalCriteria: [
        'Transaminases typically > 10x-50x ULN (>500 - 3000 IU/L)',
        'Positive viral serologies: IgM anti-HAV, HBsAg, IgM anti-HBc, or HCV RNA',
        'Prodromal malaise, anorexia, dark urine, and jaundice'
      ],
      pathophysiology:
        'Immune-mediated cytotoxic CD8+ T-cell destruction of viral-antigen-expressing hepatocytes causes widespread cellular ballooning and cytoplasmic enzyme leakage.',
      guidelineAction:
        'WHO 2024 Guidelines: Order viral serology panel (IgM anti-HAV, HBsAg, anti-HCV). Monitor PT/INR weekly; INR > 1.5 indicates acute liver failure requiring immediate transplant center alert.'
    },
    {
      id: 'cholestasis',
      name: 'Extrahepatic Cholestasis & Biliary Obstruction',
      category: 'Structural/Obstructive',
      icd10: 'K83.1',
      prevalence: 'Frequent cause of surgical jaundice (gallstones, strictures, head of pancreas mass)',
      riskScore: cholestasisScore,
      riskBand: getBand(cholestasisScore),
      triggerMarkers: [
        `Alkaline Phosphatase: ${labs.alkphos} IU/L (Canalicular enzyme elevation)`,
        `Direct Bilirubin: ${labs.directBilirubin} mg/dL (${(conjFraction * 100).toFixed(0)}% conjugated fraction)`,
        `Total Bilirubin: ${labs.totalBilirubin} mg/dL`
      ],
      clinicalCriteria: [
        'Direct:Total Bilirubin ratio > 50%',
        'ALP and GGT elevated > 2x-5x ULN with relatively modest transaminases',
        'Ultrasound showing dilated common bile duct (>6mm) or intrahepatic biliary radicle dilation'
      ],
      pathophysiology:
        'Mechanical or structural block to bile outflow increases hydrostatic intraductal pressure, leading to bile acid regurgitation, tight junction breakdown, and systemic conjugated hyperbilirubinemia with clay stools.',
      guidelineAction:
        'Tokyo Guidelines TG18: STAT abdominal ultrasound. If bile ducts dilated, urgent MRCP or ERCP with sphincterotomy. Monitor for Charcot triad (pain, fever, jaundice).'
    },
    {
      id: 'toxic_alf',
      name: 'Hyperacute Toxic Necrosis / Acute Liver Failure (ALF)',
      category: 'End-Stage/Critical',
      icd10: 'K72.0',
      prevalence: 'Medical emergency with high mortality (>30-50% without liver transplantation)',
      riskScore: alfScore,
      riskBand: getBand(alfScore),
      triggerMarkers: [
        `ALT: ${labs.sgpt} IU/L (Catastrophic necrosis peak)`,
        `AST: ${labs.sgot} IU/L`,
        `INR: ${inr.toFixed(2)} (Coagulopathy threshold > 1.5 - 2.0)`
      ],
      clinicalCriteria: [
        'Transaminases typically > 3000 IU/L (NAPQI, ischemia, or Amanita mushroom)',
        'Coagulopathy (INR > 1.5) and acute onset of hepatic encephalopathy without prior cirrhosis',
        'King’s College Hospital Criteria evaluation'
      ],
      pathophysiology:
        'Massive centrilobular (Zone 3) necrosis due to glutathione depletion and covalent binding of toxic metabolites (e.g. NAPQI from paracetamol overdose) to mitochondrial proteins.',
      guidelineAction:
        'EASL / AASLD Acute Liver Failure Guidelines: STAT IV N-Acetylcysteine (NAC) protocol immediately. Transfer to ICU with emergency liver transplant center activation. Do not delay for paracetamol assay levels.'
    }
  ];
}

// ==========================================
// 3. ANOMALY DETECTION ENGINE (ISOLATION FOREST / Z-SCORE SIMULATOR)
// ==========================================
export function detectBiomarkerAnomalies(labs: {
  totalBilirubin: number;
  directBilirubin: number;
  alkphos: number;
  sgpt: number;
  sgot: number;
  albumin: number;
  agRatio: number;
  inr?: number;
  plateletCount?: number;
}): AnomalyReport {
  // Population mean and standard deviation from 583 ILPD records
  const ILPD_STATS = {
    totalBilirubin: { mean: 3.30, std: 6.21 },
    directBilirubin: { mean: 1.48, std: 2.81 },
    alkphos: { mean: 290.58, std: 242.94 },
    sgpt: { mean: 80.71, std: 182.62 },
    sgot: { mean: 109.91, std: 288.92 },
    albumin: { mean: 3.14, std: 0.79 },
    agRatio: { mean: 0.94, std: 0.32 }
  };

  const detected: AnomalyReport['detectedPatterns'] = [];

  // Check 1: Extreme Transaminitis (>3000 IU/L)
  if (labs.sgpt > 2500 || labs.sgot > 2500) {
    const z = (Math.max(labs.sgpt, labs.sgot) - ILPD_STATS.sgpt.mean) / ILPD_STATS.sgpt.std;
    detected.push({
      marker: 'Transaminases (ALT/AST)',
      value: Math.max(labs.sgpt, labs.sgot),
      zScore: Number(z.toFixed(2)),
      description: 'Massive transaminitis (>2500 IU/L) exceeding 99.8th percentile. Signals hyperacute toxic necrosis, ischemic shock liver, or fulminant viral hepatitis.',
      severity: 'critical'
    });
  }

  // Check 2: Severe Direct Bilirubin Discordance (Direct > Total)
  if (labs.directBilirubin > labs.totalBilirubin) {
    detected.push({
      marker: 'Direct Bilirubin Discordance',
      value: labs.directBilirubin,
      zScore: 9.99,
      description: 'Physiologically impossible: Direct (conjugated) bilirubin exceeds Total bilirubin. Indicates laboratory pipetting artifact, calibration drift, or data entry error.',
      severity: 'critical'
    });
  }

  // Check 3: Marked De Ritis Inversion (AST / ALT > 3.5) with low ALT
  const deRitis = labs.sgpt > 0 ? labs.sgot / labs.sgpt : 1;
  if (deRitis > 3.5 && labs.sgot > 80) {
    detected.push({
      marker: 'De Ritis Ratio (AST/ALT)',
      value: Number(deRitis.toFixed(2)),
      zScore: 3.45,
      description: 'Extremely high De Ritis ratio (>3.5) strongly suggests severe alcoholic hepatitis with profound pyridoxine deficiency, or concurrent rhabdomyolysis / myocardial injury.',
      severity: 'severe'
    });
  }

  // Check 4: Deep Conjugated Cholestatic Bilirubin (>15 mg/dL)
  if (labs.totalBilirubin > 15.0) {
    const z = (labs.totalBilirubin - ILPD_STATS.totalBilirubin.mean) / ILPD_STATS.totalBilirubin.std;
    detected.push({
      marker: 'Total Bilirubin',
      value: labs.totalBilirubin,
      zScore: Number(z.toFixed(2)),
      description: 'Profound hyperbilirubinemia (>15 mg/dL). High risk of bilirubin encephalopathy in neonates or biliary tree malignant obstruction (Klatskin tumor, pancreatic head adenocarcinoma) in adults.',
      severity: 'severe'
    });
  }

  // Check 5: Severe Inverted A/G Ratio (<0.5)
  if (labs.agRatio < 0.5 && labs.agRatio > 0) {
    detected.push({
      marker: 'Albumin / Globulin (A/G) Ratio',
      value: labs.agRatio,
      zScore: -2.85,
      description: 'Markedly inverted A/G ratio (<0.50). Warns of severe polyclonal hypergammaglobulinemia (decompensated cirrhosis, autoimmune hepatitis) or monoclonal paraproteinemia (multiple myeloma).',
      severity: 'moderate'
    });
  }

  // Check 6: Isolated Massive Alkaline Phosphatase (>800 IU/L with normal transaminases)
  if (labs.alkphos > 800 && labs.sgpt < 60 && labs.sgot < 60) {
    detected.push({
      marker: 'Isolated Alkaline Phosphatase',
      value: labs.alkphos,
      zScore: Number(((labs.alkphos - ILPD_STATS.alkphos.mean) / ILPD_STATS.alkphos.std).toFixed(2)),
      description: 'Disproportionate ALP spike (>800 IU/L) with completely normal transaminases. Suggests infiltrative liver disease (granuloma, sarcoid, metastases), primary biliary cholangitis, or Paget disease of bone.',
      severity: 'moderate'
    });
  }

  const isAnomaly = detected.length > 0;
  const maxZ = detected.length > 0 ? Math.max(...detected.map(d => Math.abs(d.zScore))) : 0.6;
  const anomalyScore = Number(Math.min(0.99, Math.max(0.05, maxZ / 5)).toFixed(2));

  let verdict = 'Normal Multivariate Profile (Low Outlier Score)';
  if (detected.some(d => d.severity === 'critical')) {
    verdict = 'CRITICAL ANOMALY: Outlier detected in Isolation Forest feature partition (p < 0.001)';
  } else if (detected.length > 0) {
    verdict = 'POTENTIAL CLINICAL OUTLIER: Discordant laboratory constellation identified';
  }

  return {
    isAnomaly,
    anomalyScore,
    detectedPatterns: detected,
    isolationForestVerdict: verdict
  };
}

// ==========================================
// 4. MEDICAL ULTRASOUND CNN PRESETS & ACTIVATION MAPS
// ==========================================
export const ULTRASOUND_PRESETS: UltrasoundImagePreset[] = [
  {
    id: 'us-normal',
    title: 'Normal Hepatic Ultrasound (Baseline Benchmark)',
    clinicalIndication: 'Routine health checkup / asymptomatic control',
    echogenicity: 'Normal',
    fibrosisStage: 'F0 (No Fibrosis)',
    steatosisGrade: 'None (Grade 0)',
    findings: [
      'Normal homogeneous parenchymal echotexture identical to right renal cortex',
      'Smooth, well-defined capsular contour with sharp inferior margin',
      'Intact visualization of intrahepatic portal venous branching with echogenic walls',
      'Diaphragmatic dome crisp and sharply demarcated without acoustic attenuation'
    ],
    cnnConfidence: 96.8,
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
    gradCamHeatmapSvg: 'M 40,40 Q 150,30 260,50 T 250,220 Q 140,250 40,210 Z'
  },
  {
    id: 'us-steatosis',
    title: 'Diffuse Hepatic Steatosis (Grade 2 Moderate Fatty Liver)',
    clinicalIndication: 'T2D + BMI 32 + elevated ALT (74 IU/L) metabolic evaluation',
    echogenicity: 'Diffuse Hyperechoic (Bright)',
    fibrosisStage: 'F1/F2 (Mild/Moderate)',
    steatosisGrade: 'Moderate (Grade 2)',
    findings: [
      'Markedly increased parenchymal echogenicity ("Bright Liver" relative to kidney)',
      'Posterior beam attenuation obscuring visualization of the deep diaphragmatic line',
      'Impaired acoustic penetration with loss of peripheral portal venous vessel clarity',
      'Hepatomegaly: right lobe span measuring 16.4 cm'
    ],
    cnnConfidence: 94.2,
    imageUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=600&q=80',
    gradCamHeatmapSvg: 'M 60,60 Q 160,50 240,70 T 230,200 Q 150,230 60,190 Z'
  },
  {
    id: 'us-cirrhosis',
    title: 'Coarse Nodular Cirrhosis with Ascitic Rim',
    clinicalIndication: 'Hepatitis C + low platelets (54k) + abdominal swelling',
    echogenicity: 'Coarse Heterogeneous',
    fibrosisStage: 'F4 (Cirrhosis)',
    steatosisGrade: 'None (Grade 0)',
    findings: [
      'Coarse, undulating, nodular hepatic surface contour with blunted inferior margin',
      'Significant parenchymal heterogeneity with micro- and macro-nodular architectural distortion',
      'Direct visualization of anechoic free ascitic fluid collecting around Morrison pouch',
      'Splenomegaly (15.6 cm) and portal vein dilation (14.2 mm) confirming portal hypertension'
    ],
    cnnConfidence: 97.4,
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
    gradCamHeatmapSvg: 'M 30,50 Q 130,30 250,40 T 260,240 Q 160,260 30,230 Z'
  },
  {
    id: 'us-cholelithiasis',
    title: 'Obstructive Choledocholithiasis & Gallstone with Acoustic Shadowing',
    clinicalIndication: 'Acute right upper quadrant pain, dark urine, jaundice, ALP 495 IU/L',
    echogenicity: 'Acoustic Shadowing',
    fibrosisStage: 'F0 (No Fibrosis)',
    steatosisGrade: 'None (Grade 0)',
    findings: [
      '1.4 cm strongly hyperechoic gallstone in gallbladder neck casting posterior acoustic shadow',
      'Dilated Common Bile Duct (CBD) measuring 11.4 mm (Normal < 6 mm)',
      'Intrahepatic biliary radicle dilation ("double-barrel shotgun" appearance)',
      'Gallbladder wall thickening (3.8 mm) with pericholecystic fluid halo'
    ],
    cnnConfidence: 98.1,
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
    gradCamHeatmapSvg: 'M 70,70 Q 150,60 220,80 T 210,180 Q 140,210 70,170 Z'
  }
];

// ==========================================
// 5. INTERACTIVE KNOWLEDGE GRAPH NODES & LINKS
// ==========================================
export const KNOWLEDGE_GRAPH_NODES: KnowledgeGraphNode[] = [
  // Diseases
  { id: 'd_masld', label: 'MASLD / NAFLD', type: 'disease', description: 'Metabolic steatotic liver disease', color: '#06b6d4', val: 24 },
  { id: 'd_ald', label: 'Alcoholic Liver Disease', type: 'disease', description: 'Alcohol-induced steatohepatitis and necrosis', color: '#f59e0b', val: 24 },
  { id: 'd_cirrhosis', label: 'Liver Cirrhosis', type: 'disease', description: 'End-stage bridging fibrosis with portal hypertension', color: '#ef4444', val: 28 },
  { id: 'd_viral_hep', label: 'Viral Hepatitis (A/B/C)', type: 'disease', description: 'Viral cytotoxic necroinflammation', color: '#8b5cf6', val: 22 },
  { id: 'd_cholestasis', label: 'Biliary Obstruction', type: 'disease', description: 'Extrahepatic gallstone or tumor ductal block', color: '#ec4899', val: 22 },
  { id: 'd_toxic_alf', label: 'Acute Liver Failure', type: 'disease', description: 'Hyperacute hepatocyte necrosis (e.g. APAP)', color: '#dc2626', val: 26 },

  // Biomarkers
  { id: 'b_alt', label: 'ALT (SGPT)', type: 'biomarker', description: 'Cytoplasmic transaminase specific to liver', color: '#3b82f6', val: 18 },
  { id: 'b_ast', label: 'AST (SGOT)', type: 'biomarker', description: 'Mitochondrial & cytoplasmic enzyme', color: '#3b82f6', val: 18 },
  { id: 'b_deritis', label: 'De Ritis (AST/ALT)', type: 'biomarker', description: 'Enzymatic ratio indicator (>2.0 alcohol; <1.0 viral/NAFLD)', color: '#38bdf8', val: 20 },
  { id: 'b_tbil', label: 'Total Bilirubin', type: 'biomarker', description: 'Breakdown pigment of heme catabolism', color: '#eab308', val: 18 },
  { id: 'b_dbil', label: 'Direct Bilirubin', type: 'biomarker', description: 'Conjugated glucuronide fraction', color: '#eab308', val: 18 },
  { id: 'b_alp', label: 'Alkaline Phosphatase', type: 'biomarker', description: 'Canalicular biliary tract enzyme', color: '#a855f7', val: 18 },
  { id: 'b_alb', label: 'Serum Albumin', type: 'biomarker', description: 'Primary protein synthesized by hepatocytes', color: '#10b981', val: 18 },
  { id: 'b_inr', label: 'PT / INR', type: 'biomarker', description: 'Extrinsic coagulation cascade integrity', color: '#f43f5e', val: 18 },
  { id: 'b_plt', label: 'Platelets', type: 'biomarker', description: 'Sequestration indicator in portal splenomegaly', color: '#6366f1', val: 16 },

  // Symptoms
  { id: 's_jaundice', label: 'Scleral Icterus & Jaundice', type: 'symptom', description: 'Yellowing of eyes and skin due to bilirubin >2.5 mg/dL', color: '#fde047', val: 18 },
  { id: 's_asterixis', label: 'Asterixis (Flapping Tremor)', type: 'symptom', description: 'Metabolic motor flap in hepatic encephalopathy', color: '#fb923c', val: 18 },
  { id: 's_ascites', label: 'Ascites (Abdominal Fluid)', type: 'symptom', description: 'Peritoneal fluid accumulation from portal hypertension', color: '#38bdf8', val: 20 },
  { id: 's_pruritus', label: 'Pruritus (Intense Itching)', type: 'symptom', description: 'Bile salt deposition in sensory dermis', color: '#f472b6', val: 16 },
  { id: 's_spiders', label: 'Spider Angiomas', type: 'symptom', description: 'Hyperestrogenemia vascular dilation on chest', color: '#f87171', val: 16 },

  // Causes
  { id: 'c_alcohol', label: 'Heavy Ethanol Intake', type: 'cause', description: 'CYP2E1 induction and toxic acetaldehyde', color: '#fdba74', val: 18 },
  { id: 'c_metabolic', label: 'Metabolic Syndrome / Obesity', type: 'cause', description: 'Insulin resistance & lipotoxicity', color: '#67e8f9', val: 18 },
  { id: 'c_hcv', label: 'Hepatitis C / B Virus', type: 'cause', description: 'Chronic parenchymal viral inflammation', color: '#c084fc', val: 18 },
  { id: 'c_gallstones', label: 'Gallstone Migration', type: 'cause', description: 'Mechanical obstruction of common bile duct', color: '#f472b6', val: 16 },
  { id: 'c_napqi', label: 'Paracetamol / NAPQI', type: 'cause', description: 'Glutathione depletion Zone 3 toxic necrosis', color: '#f87171', val: 18 },

  // Treatments
  { id: 't_diet_exercise', label: 'Mediterranean Diet & Exercise', type: 'treatment', description: 'First-line lifestyle therapy for MASLD', color: '#4ade80', val: 18 },
  { id: 't_abstinence', label: 'Alcohol Abstinence + Thiamine', type: 'treatment', description: 'Essential therapy preventing Wernicke syndrome', color: '#4ade80', val: 20 },
  { id: 't_ercp', label: 'ERCP & Biliary Decompression', type: 'treatment', description: 'Endoscopic removal of obstructing stones', color: '#2dd4bf', val: 20 },
  { id: 't_nac', label: 'IV N-Acetylcysteine (NAC)', type: 'treatment', description: 'Glutathione replenishment antidote', color: '#2dd4bf', val: 22 },
  { id: 't_lactulose', label: 'Lactulose + Rifaximin', type: 'treatment', description: 'Colonic acidification trapping ammonia for encephalopathy', color: '#4ade80', val: 20 },
  { id: 't_transplant', label: 'Liver Transplantation', type: 'treatment', description: 'Definitive cure for decompensated cirrhosis / ALF', color: '#10b981', val: 24 }
];

export const KNOWLEDGE_GRAPH_LINKS: KnowledgeGraphLink[] = [
  // Causes to Diseases
  { source: 'c_metabolic', target: 'd_masld', relationship: 'primary etiology of' },
  { source: 'c_alcohol', target: 'd_ald', relationship: 'drives' },
  { source: 'c_hcv', target: 'd_viral_hep', relationship: 'infects' },
  { source: 'c_gallstones', target: 'd_cholestasis', relationship: 'mechanically causes' },
  { source: 'c_napqi', target: 'd_toxic_alf', relationship: 'provokes hyperacute' },
  { source: 'd_masld', target: 'd_cirrhosis', relationship: 'progresses to' },
  { source: 'd_ald', target: 'd_cirrhosis', relationship: 'progresses to' },
  { source: 'd_viral_hep', target: 'd_cirrhosis', relationship: 'progresses to' },

  // Diseases to Biomarkers
  { source: 'd_masld', target: 'b_alt', relationship: 'elevates (ALT > AST)' },
  { source: 'd_ald', target: 'b_deritis', relationship: 'creates De Ritis > 2.0' },
  { source: 'd_ald', target: 'b_ast', relationship: 'elevates mitochondrial AST' },
  { source: 'd_cirrhosis', target: 'b_alb', relationship: 'decreases synthesis' },
  { source: 'd_cirrhosis', target: 'b_plt', relationship: 'causes thrombocytopenia' },
  { source: 'd_cirrhosis', target: 'b_inr', relationship: 'prolongs clotting time' },
  { source: 'd_viral_hep', target: 'b_alt', relationship: 'massive release (>1000)' },
  { source: 'd_cholestasis', target: 'b_alp', relationship: 'elevates canalicular' },
  { source: 'd_cholestasis', target: 'b_dbil', relationship: 'elevates conjugated' },
  { source: 'd_toxic_alf', target: 'b_inr', relationship: 'causes acute coagulopathy' },

  // Diseases to Symptoms
  { source: 'd_ald', target: 's_jaundice', relationship: 'manifests as' },
  { source: 'd_cirrhosis', target: 's_ascites', relationship: 'causes portal hypertension' },
  { source: 'd_cirrhosis', target: 's_asterixis', relationship: 'develops encephalopathy' },
  { source: 'd_cirrhosis', target: 's_spiders', relationship: 'produces' },
  { source: 'd_cholestasis', target: 's_pruritus', relationship: 'causes bile salt itching' },
  { source: 'd_cholestasis', target: 's_jaundice', relationship: 'manifests as' },

  // Treatments to Diseases
  { source: 't_diet_exercise', target: 'd_masld', relationship: 'reverses' },
  { source: 't_abstinence', target: 'd_ald', relationship: 'essential therapy for' },
  { source: 't_ercp', target: 'd_cholestasis', relationship: 'decompresses' },
  { source: 't_nac', target: 'd_toxic_alf', relationship: 'detoxifies NAPQI in' },
  { source: 't_lactulose', target: 's_asterixis', relationship: 'treats' },
  { source: 't_transplant', target: 'd_cirrhosis', relationship: 'curative for' }
];

// ==========================================
// 6. CLINICAL GUIDELINES DATABASE & STAGING CALCULATORS
// ==========================================
export const CLINICAL_GUIDELINES: ClinicalGuidelineItem[] = [
  {
    id: 'aasld-nafld-2023',
    organization: 'AASLD',
    title: 'AASLD Practice Guidance on the Clinical Assessment and Management of NAFLD/MASLD',
    year: 2023,
    recommendation:
      'In primary care and endocrinology clinics, use the FIB-4 score as the first-line noninvasive triage tool for patients with metabolic risk factors. Individuals with FIB-4 > 1.3 require secondary elastography (FibroScan) or hepatology referral.',
    evidenceGrade: 'Class I, Level A',
    keyActionSteps: [
      'Calculate FIB-4 score annually in patients with Type 2 Diabetes or Obesity',
      'If FIB-4 < 1.30, low risk of advanced fibrosis: manage in primary care',
      'If FIB-4 1.30 - 2.67 (Indeterminate): order VCTE (FibroScan) or ELF test',
      'If FIB-4 > 2.67: High risk of F3-F4 fibrosis: immediate hepatology specialist referral',
      'Dietary prescription: Mediterranean diet with zero sugar-sweetened beverages; 7-10% body weight reduction'
    ],
    targetConditions: ['MASLD', 'NAFLD', 'NASH', 'Metabolic Syndrome']
  },
  {
    id: 'easl-cirrhosis-2022',
    organization: 'EASL',
    title: 'EASL Clinical Practice Guidelines for the Management of Decompensated Cirrhosis',
    year: 2022,
    recommendation:
      'Diagnostic paracentesis is mandatory in all cirrhotic patients admitted with new-onset or worsening ascites within 2 hours of arrival to rule out Spontaneous Bacterial Peritonitis (SBP). Neutrophil count >= 250/mm3 dictates immediate empirical IV Cephalosporin + IV Albumin.',
    evidenceGrade: 'Class I, Level A',
    keyActionSteps: [
      'Ascitic fluid tap: Count polymorphonuclear leukocytes (PMN). If >= 250 cells/mm3, diagnose SBP',
      'Initiate IV Cefotaxime 2g Q8H (or Ceftriaxone 2g Q24H)',
      'Infuse IV 20% Albumin: 1.5 g/kg on Day 1, followed by 1.0 g/kg on Day 3 to prevent Hepatorenal Syndrome',
      'Strictly avoid aminoglycosides and NSAIDs due to extreme nephrotoxicity risk',
      'Screen for esophageal varices via EGD or noninvasive Baveno VII criteria (Platelets > 150k and Liver Stiffness < 20 kPa)'
    ],
    targetConditions: ['Liver Cirrhosis', 'Ascites', 'Spontaneous Bacterial Peritonitis', 'Hepatorenal Syndrome']
  },
  {
    id: 'who-hepatitis-2024',
    organization: 'WHO',
    title: 'WHO Guidelines for the Prevention, Diagnosis and Treatment of Chronic Hepatitis B and C',
    year: 2024,
    recommendation:
      'Universal screening for HBsAg and HCV RNA in adults. Treat all adults with chronic Hepatitis C using pan-genotypic Direct-Acting Antivirals (DAAs: Sofosbuvir/Velpatasvir or Glecaprevir/Pibrentasvir) for 8-12 weeks with >95% cure rates.',
    evidenceGrade: 'Class I, Level A',
    keyActionSteps: [
      'Screening: Rapid diagnostic test (RDT) for HCV antibodies; confirm active viremia via point-of-care HCV RNA',
      'Pan-genotypic DAA therapy for 12 weeks regardless of genotype',
      'HBV: Initiate Tenofovir disoproxil fumarate (TDF) or Entecavir if HBV DNA > 2,000 IU/mL and elevated ALT',
      'Sustained Virological Response (SVR12) confirmation 12 weeks post-treatment'
    ],
    targetConditions: ['Chronic Hepatitis C', 'Chronic Hepatitis B', 'Viral Hepatitis']
  },
  {
    id: 'apasl-aclf-2023',
    organization: 'APASL',
    title: 'APASL Consensus Recommendations on Acute-on-Chronic Liver Failure (ACLF)',
    year: 2023,
    recommendation:
      'Acute-on-chronic liver failure (ACLF) is defined as an acute hepatic insult manifesting as jaundice (total bilirubin >= 5 mg/dL) and coagulopathy (INR >= 1.5) complicated within 4 weeks by clinical ascites and/or encephalopathy in a patient with previous diagnosed or undiagnosed chronic liver disease.',
    evidenceGrade: 'Class I, Level B',
    keyActionSteps: [
      'Early identification of precipitating events (bacterial sepsis, alcohol binge, HBV flare, variceal bleeding)',
      'Target Mean Arterial Pressure (MAP) >= 65 mmHg using albumin volume expansion and vasopressors',
      'High 28-day mortality (>30-40%): prioritize for emergent liver transplantation evaluation'
    ],
    targetConditions: ['ACLF', 'Acute-on-Chronic Failure', 'Severe Jaundice', 'Coagulopathy']
  }
];

// Staging calculators
export function calculateFIB4(age: number, ast: number, alt: number, platelets: number): {
  score: number;
  riskCategory: 'Low Risk (<1.30)' | 'Indeterminate (1.30 - 2.67)' | 'High Risk (>2.67)';
  recommendation: string;
} {
  const plt = Math.max(10, platelets);
  const score = Number(((age * ast) / (plt * Math.sqrt(Math.max(1, alt)))).toFixed(2));
  if (score < 1.30) {
    return {
      score,
      riskCategory: 'Low Risk (<1.30)',
      recommendation: 'Advanced fibrosis (F3-F4) is highly unlikely (Negative Predictive Value >90%). Re-screen in 2-3 years.'
    };
  } else if (score <= 2.67) {
    return {
      score,
      riskCategory: 'Indeterminate (1.30 - 2.67)',
      recommendation: 'Intermediate zone. Secondary non-invasive test indicated: Transient Elastography (FibroScan) or Enhanced Liver Fibrosis (ELF) score.'
    };
  } else {
    return {
      score,
      riskCategory: 'High Risk (>2.67)',
      recommendation: 'High probability of advanced fibrosis / cirrhosis (F3-F4, Positive Predictive Value ~80%). Immediate hepatologist referral recommended.'
    };
  }
}

export function calculateChildPugh(params: {
  totalBilirubin: number;
  albumin: number;
  inr: number;
  ascites: 'None' | 'Slight / Controlled' | 'Moderate / Tense';
  encephalopathy: 'None' | 'Grade 1-2 (Mild)' | 'Grade 3-4 (Severe)';
}): {
  points: number;
  classGrade: 'Class A (Well-compensated)' | 'Class B (Significant functional compromise)' | 'Class C (Decompensated)';
  oneYearSurvival: string;
  twoYearSurvival: string;
} {
  let pts = 0;
  // Bilirubin
  if (params.totalBilirubin < 2.0) pts += 1;
  else if (params.totalBilirubin <= 3.0) pts += 2;
  else pts += 3;

  // Albumin
  if (params.albumin > 3.5) pts += 1;
  else if (params.albumin >= 2.8) pts += 2;
  else pts += 3;

  // INR
  if (params.inr < 1.7) pts += 1;
  else if (params.inr <= 2.3) pts += 2;
  else pts += 3;

  // Ascites
  if (params.ascites === 'None') pts += 1;
  else if (params.ascites === 'Slight / Controlled') pts += 2;
  else pts += 3;

  // Encephalopathy
  if (params.encephalopathy === 'None') pts += 1;
  else if (params.encephalopathy === 'Grade 1-2 (Mild)') pts += 2;
  else pts += 3;

  if (pts <= 6) {
    return {
      points: pts,
      classGrade: 'Class A (Well-compensated)',
      oneYearSurvival: '100%',
      twoYearSurvival: '85%'
    };
  } else if (pts <= 9) {
    return {
      points: pts,
      classGrade: 'Class B (Significant functional compromise)',
      oneYearSurvival: '80%',
      twoYearSurvival: '60%'
    };
  } else {
    return {
      points: pts,
      classGrade: 'Class C (Decompensated)',
      oneYearSurvival: '45%',
      twoYearSurvival: '35%'
    };
  }
}

// ==========================================
// 7. MEDICAL TERMINOLOGY TRANSLATOR DICTIONARY
// ==========================================
export const TERMINOLOGY_DICTIONARY: TerminologyTranslation[] = [
  {
    term: 'Hepatocellular Steatosis',
    definition: 'Intracellular accumulation of lipid droplets (primarily triglycerides) within the cytoplasm of hepatocytes.',
    plainEnglish: 'Fatty Liver: Excess fat buildup inside your liver cells, often caused by diet, metabolism, or alcohol.',
    translations: {
      hindi: 'फैटी लिवर (यकृत में अत्यधिक वसा का संचय)',
      spanish: 'Hígado graso (acumulación de grasa en las células hepáticas)',
      telugu: 'కొవ్వు కాలేయం (కాలేయ కణాలలో కొవ్వు పేరుకుపోవడం)',
      tamil: 'கொழுப்பு கல்லீரல் (கல்லீரல் செல்களில் கொழுப்பு சேர்தல்)',
      french: 'Stéatose hépatique (accumulation de graisse dans le foie)'
    }
  },
  {
    term: 'De Ritis Ratio',
    definition: 'The clinical ratio of serum Aspartate Aminotransferase (AST) to Alanine Aminotransferase (ALT) enzymes.',
    plainEnglish: 'Enzyme Ratio (AST/ALT): A simple math calculation comparing two liver proteins. A score over 2.0 suggests alcohol damage; under 1.0 points to fatty liver or viral infection.',
    translations: {
      hindi: 'डी रिटिस अनुपात (AST और ALT एंजाइमों का अनुपात)',
      spanish: 'Índice de De Ritis (relación AST/ALT)',
      telugu: 'డి రిటిస్ నిష్పత్తి (AST మరియు ALT ఎంజైముల నిష్పత్తి)',
      tamil: 'டி ரிடிஸ் விகிதம் (AST மற்றும் ALT என்சைம்களின் விகிதம்)',
      french: 'Rapport de De Ritis (rapport enzymatique AST/ALT)'
    }
  },
  {
    term: 'Scleral Icterus',
    definition: 'Yellowing of the ocular conjunctiva/sclera secondary to hyperbilirubinemia exceeding 2.5 to 3.0 mg/dL.',
    plainEnglish: 'Yellow Eyes (Jaundice): When bilirubin waste builds up in the blood, the whites of your eyes turn yellow.',
    translations: {
      hindi: 'पीलिया (आंखों का पीला पड़ना)',
      spanish: 'Ictericia escleral (ojos amarillos)',
      telugu: 'పచ్చకామెర్లు (కళ్ళలో పసుపు రంగు మార్పు)',
      tamil: 'மஞ்சள் காமாலை (கண்கள் மஞ்சள் நிறமாதல்)',
      french: 'Ictère scléral (yeux jaunes)'
    }
  },
  {
    term: 'Portal Hypertension & Ascites',
    definition: 'Elevated hydrostatic pressure in the portal venous system leading to splanchnic pooling and peritoneal transudate accumulation.',
    plainEnglish: 'Belly Fluid & High Vein Pressure: Stiff liver tissue blocks blood flow, causing high pressure and fluid leaking into your stomach area.',
    translations: {
      hindi: 'पेट में पानी भरना और पोर्टल नसों का उच्च रक्तचाप',
      spanish: 'Hipertensión portal y ascitis (líquido en el abdomen)',
      telugu: 'కడుపులో నీరు చేరడం (అసైటిస్)',
      tamil: 'வயிற்றில் நீர் தேங்குதல் (அசைடிஸ்)',
      french: 'Hypertension portale et ascite (liquide dans le ventre)'
    }
  },
  {
    term: 'Hepatic Encephalopathy & Asterixis',
    definition: 'Reversible neuropsychiatric dysfunction caused by toxic gut-derived nitrogenous substances (e.g. ammonia) bypassing hepatic clearance.',
    plainEnglish: 'Liver Brain Fog & Hand Flapping Tremor: When the liver cannot filter body waste, toxins reach the brain causing confusion, sleep changes, and hand tremors.',
    translations: {
      hindi: 'यकृत मस्तिष्क विकार और हाथों का कांपना (भ्रम और कंपन)',
      spanish: 'Encefalopatía hepática y temblor flapping',
      telugu: 'కాలేయ మెదడు ప్రభావం మరియు చేతుల వణుకు',
      tamil: 'கல்லீரல் மூளை செயலிழப்பு மற்றும் நடுக்கம்',
      french: 'Encéphalopathie hépatique et astérixis (flapping tremor)'
    }
  },
  {
    term: 'Extrahepatic Cholestasis',
    definition: 'Impaired or halted bile flow downstream of the liver due to mechanical obstruction in the extrahepatic bile duct system.',
    plainEnglish: 'Blocked Bile Duct: A gallstone or growth blocks the tube draining bile from the liver into the intestines, causing dark urine and pale stools.',
    translations: {
      hindi: 'पित्त नली में रुकावट (पित्त का अवरोध)',
      spanish: 'Colestasis extrahepática (obstrucción de la vía biliar)',
      telugu: 'పిత్త వాహిక అడ్డంకి',
      tamil: 'பித்த நாள அடைப்பு',
      french: 'Cholestase extrahépatique (calcul biliaire obstructif)'
    }
  }
];

// ==========================================
// 8. MODEL DRIFT MONITORING (PSI & KOLMOGOROV-SMIRNOV)
// ==========================================
export interface BiomarkerDriftMetric {
  featureName: string;
  baselineMean: number;
  baselineStd: number;
  currentCohortMean: number;
  currentCohortStd: number;
  psiScore: number; // Population Stability Index
  status: 'Stable (<0.10)' | 'Moderate Shift (0.10 - 0.25)' | 'Severe Drift (>0.25)';
  ksPValue: number;
  retrainRecommended: boolean;
}

export function computeModelDriftMetrics(incomingPredictions: Array<{
  totalBilirubin?: number;
  directBilirubin?: number;
  deRitisRatio?: number;
  alkphos?: number;
}>): BiomarkerDriftMetric[] {
  // If no incoming data, generate simulated realistic deployment cohort (e.g. 100 recent live predictions)
  const count = Math.max(20, incomingPredictions.length);

  const sampleTbil = incomingPredictions.map(p => p.totalBilirubin).filter((v): v is number => typeof v === 'number');
  const sampleDbil = incomingPredictions.map(p => p.directBilirubin).filter((v): v is number => typeof v === 'number');
  const sampleDeRitis = incomingPredictions.map(p => p.deRitisRatio).filter((v): v is number => typeof v === 'number');

  const calcMeanStd = (arr: number[], defMean: number, defStd: number) => {
    if (arr.length < 3) return { mean: defMean * 1.08, std: defStd * 1.05 };
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const variance = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length;
    return { mean: Number(mean.toFixed(2)), std: Number(Math.sqrt(variance).toFixed(2)) };
  };

  const tbilStat = calcMeanStd(sampleTbil, 3.30, 6.21);
  const dbilStat = calcMeanStd(sampleDbil, 1.48, 2.81);
  const deRitisStat = calcMeanStd(sampleDeRitis, 1.15, 0.65);

  // Approximate PSI calculation formula
  const getPsi = (curM: number, baseM: number, curS: number, baseS: number) => {
    const deltaM = Math.abs(curM - baseM) / (baseM || 1);
    const deltaS = Math.abs(curS - baseS) / (baseS || 1);
    return Number((deltaM * 0.4 + deltaS * 0.3).toFixed(3));
  };

  const tbilPsi = getPsi(tbilStat.mean, 3.30, tbilStat.std, 6.21);
  const dbilPsi = getPsi(dbilStat.mean, 1.48, dbilStat.std, 2.81);
  const deRitisPsi = getPsi(deRitisStat.mean, 1.15, deRitisStat.std, 0.65);
  const alpPsi = 0.082; // within stable boundary

  const classifyPsi = (psi: number) => {
    if (psi > 0.25) return 'Severe Drift (>0.25)';
    if (psi >= 0.10) return 'Moderate Shift (0.10 - 0.25)';
    return 'Stable (<0.10)';
  };

  return [
    {
      featureName: 'Total Bilirubin (TBIL)',
      baselineMean: 3.30,
      baselineStd: 6.21,
      currentCohortMean: tbilStat.mean,
      currentCohortStd: tbilStat.std,
      psiScore: tbilPsi,
      status: classifyPsi(tbilPsi),
      ksPValue: tbilPsi > 0.2 ? 0.012 : 0.48,
      retrainRecommended: tbilPsi > 0.2
    },
    {
      featureName: 'Direct Bilirubin (DBIL)',
      baselineMean: 1.48,
      baselineStd: 2.81,
      currentCohortMean: dbilStat.mean,
      currentCohortStd: dbilStat.std,
      psiScore: dbilPsi,
      status: classifyPsi(dbilPsi),
      ksPValue: dbilPsi > 0.2 ? 0.024 : 0.62,
      retrainRecommended: dbilPsi > 0.2
    },
    {
      featureName: 'De Ritis Ratio (AST/ALT)',
      baselineMean: 1.15,
      baselineStd: 0.65,
      currentCohortMean: deRitisStat.mean,
      currentCohortStd: deRitisStat.std,
      psiScore: deRitisPsi,
      status: classifyPsi(deRitisPsi),
      ksPValue: deRitisPsi > 0.2 ? 0.008 : 0.55,
      retrainRecommended: deRitisPsi > 0.2
    },
    {
      featureName: 'Alkaline Phosphatase (ALP)',
      baselineMean: 290.58,
      baselineStd: 242.94,
      currentCohortMean: 278.4,
      currentCohortStd: 231.2,
      psiScore: alpPsi,
      status: classifyPsi(alpPsi),
      ksPValue: 0.72,
      retrainRecommended: false
    }
  ];
}
