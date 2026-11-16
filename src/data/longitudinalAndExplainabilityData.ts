/**
 * Digitalization in Healthcare - Longitudinal, Explainability, Prevention, and Clinical Decision Data
 *
 * Comprehensive medical educational dataset powering:
 * 1. Longitudinal Patient Case Learning (multi-year biomarker trends, stage transitions, clinical notes)
 * 2. ML Prediction Interpretation & Explainable AI (SHAP-inspired feature attributions, counterfactual presets)
 * 3. Prevention & Precaution Guidance (dietary protocols, exercise benchmarks, hepatotoxic drug safety)
 * 4. Interactive Clinical Decision Simulation (multi-step diagnostic & therapeutic decision pathways)
 * 5. Competency Assessment & Personalized Learning Recommendations
 */

export interface LongitudinalVisit {
  visitId: string;
  month: number; // 0, 6, 12, 24, 36, etc.
  dateLabel: string;
  clinicalNote: string;
  stage: string; // e.g., 'Simple Steatosis (NAFLD)', 'Active MASH (NASH)', 'F2 Significant Fibrosis', 'F4 Cirrhosis'
  stageSeverity: 'normal' | 'mild' | 'moderate' | 'advanced' | 'decompensated';
  labs: {
    totalBilirubin: number; // mg/dL
    directBilirubin: number;
    ast: number; // IU/L
    alt: number; // IU/L
    alkphos: number; // IU/L
    totalProteins: number; // g/dL
    albumin: number; // g/dL
    platelets: number; // x10^3/uL
    inr: number;
    bmi: number;
    fib4: number;
  };
  event?: string;
  imagingSummary?: string;
  checkpointQuestion?: {
    question: string;
    options: string[];
    correctIndex: number;
    rationale: string;
  };
}

export interface LongitudinalCohort {
  id: string;
  patientName: string;
  age: number;
  gender: 'Male' | 'Female';
  etiology: string;
  initialPresentation: string;
  description: string;
  summaryPearl: string;
  visits: LongitudinalVisit[];
}

export const LONGITUDINAL_COHORTS: LongitudinalCohort[] = [
  {
    id: 'cohort-masld-progression',
    patientName: 'Arun Varma (Age 52)',
    age: 52,
    gender: 'Male',
    etiology: 'Metabolic Dysfunction-Associated Steatotic Liver Disease (MASLD)',
    initialPresentation: 'Incidental elevated transaminases during routine health checkup with metabolic syndrome (BMI 31.8, HbA1c 7.4%).',
    description: 'Tracks a 5-year progression from asymptomatic hepatic steatosis to active MASH, progressive bridge fibrosis, and early compensated cirrhosis due to unmanaged metabolic risk factors.',
    summaryPearl: 'Notice how transaminases (ALT/AST) often PEAK during the active inflammatory MASH phase (Month 24) and then PARADOXICALLY DECREASE as hepatocytes become replaced by fibrous scar tissue in cirrhosis (Month 60). Meanwhile, platelet count steadily declines due to portal congestion.',
    visits: [
      {
        visitId: 'v-0',
        month: 0,
        dateLabel: 'Month 0 (Baseline)',
        stage: 'Stage 1: Simple Steatosis (MASLD)',
        stageSeverity: 'mild',
        clinicalNote: 'Patient asymptomatic. Mild fatigue attributed to desk work. Ultrasound reveals diffuse bright liver with increased acoustic attenuation consistent with Grade 1 steatosis.',
        labs: {
          totalBilirubin: 0.9,
          directBilirubin: 0.2,
          ast: 42,
          alt: 68,
          alkphos: 110,
          totalProteins: 7.2,
          albumin: 4.4,
          platelets: 265,
          inr: 1.02,
          bmi: 31.8,
          fib4: 1.15
        },
        event: 'Initial consultation: Advised 7% weight loss and lifestyle modifications.',
        imagingSummary: 'Ultrasound: Increased parenchymal echogenicity, normal portal vein velocity (24 cm/s).',
        checkpointQuestion: {
          question: 'At Month 0, the AST is 42 IU/L and ALT is 68 IU/L (De Ritis ratio = 0.62). What does an AST/ALT ratio < 1.0 typically indicate in this metabolic context?',
          options: [
            'Alcohol-induced mitochondrial damage',
            'Characteristic pattern of MASLD / viral hepatitis without advanced fibrosis',
            'Extrahepatic obstructive jaundice',
            'Severe Wilson disease'
          ],
          correctIndex: 1,
          rationale: 'In non-cirrhotic viral hepatitis and MASLD, ALT typically exceeds AST (De Ritis < 1.0) because ALT is primarily cytosolic with a longer half-life (47 hours vs 17 hours for AST).'
        }
      },
      {
        visitId: 'v-12',
        month: 12,
        dateLabel: 'Month 12',
        stage: 'Stage 2: Steatohepatitis (Active MASH)',
        stageSeverity: 'moderate',
        clinicalNote: 'Patient regained 3 kg due to workplace stress. Fasting glucose worsened (158 mg/dL). Complains of persistent right upper quadrant fullness and lethargy.',
        labs: {
          totalBilirubin: 1.2,
          directBilirubin: 0.4,
          ast: 78,
          alt: 124,
          alkphos: 135,
          totalProteins: 7.0,
          albumin: 4.1,
          platelets: 230,
          inr: 1.05,
          bmi: 32.6,
          fib4: 1.62
        },
        event: 'FibroScan CAP score: 322 dB/m (Grade 3 steatosis), Liver Stiffness: 7.8 kPa (F1-F2 borderline).',
        imagingSummary: 'Ultrasound: Coarse echotexture, smooth liver margins, no biliary dilatation.',
        checkpointQuestion: {
          question: 'The FIB-4 index increased from 1.15 to 1.62. How does the AASLD guideline interpret a FIB-4 between 1.30 and 2.67?',
          options: [
            'Low risk of advanced fibrosis; discharge to routine primary care',
            'Indeterminate risk; requires secondary non-invasive testing (e.g. VCTE FibroScan or ELF test)',
            'Definitive cirrhosis; immediate referral for liver transplant evaluation',
            'Active acute liver failure requiring ICU admission'
          ],
          correctIndex: 1,
          rationale: 'A FIB-4 between 1.30 and 2.67 is in the indeterminate window, warranting reflex secondary evaluation like vibration-controlled transient elastography (VCTE) or Enhanced Liver Fibrosis (ELF).'
        }
      },
      {
        visitId: 'v-24',
        month: 24,
        dateLabel: 'Month 24',
        stage: 'Stage 3: Advanced Bridging Fibrosis (F3)',
        stageSeverity: 'advanced',
        clinicalNote: 'Patient presents with mild bilateral ankle edema towards the evening. Noticeable palmar erythema. Spleen palpable 1 cm below costal margin on deep inspiration.',
        labs: {
          totalBilirubin: 1.6,
          directBilirubin: 0.6,
          ast: 94,
          alt: 98,
          alkphos: 165,
          totalProteins: 6.7,
          albumin: 3.6,
          platelets: 168,
          inr: 1.18,
          bmi: 33.1,
          fib4: 2.78
        },
        event: 'Transient Elastography Stiffness: 11.4 kPa. AST/ALT ratio approaches 1.0.',
        imagingSummary: 'Ultrasound: Spleen enlarged to 12.8 cm (splenomegaly). Mild surface nodularity starting to appear.',
        checkpointQuestion: {
          question: 'Why did the patient platelet count drop from 265,000 to 168,000 /uL?',
          options: [
            'Bone marrow suppression from vitamin deficiency',
            'Portal hypertension causing congestive splenomegaly and splenic platelet pooling/sequestration',
            'Acute autoimmune destruction of platelets',
            'Severe dehydration falsely lowering counts'
          ],
          correctIndex: 1,
          rationale: 'As fibrosis advances into the bridging stage, portal vascular resistance increases, leading to congestive splenomegaly. The enlarged spleen pools and sequesters up to 90% of circulating platelets.'
        }
      },
      {
        visitId: 'v-48',
        month: 48,
        dateLabel: 'Month 48',
        stage: 'Stage 4: Compensated Cirrhosis (F4)',
        stageSeverity: 'advanced',
        clinicalNote: 'Patient has lost muscle mass in quadriceps and temporalis (sarcopenia) despite high abdominal girth. Spider angiomas visible on upper chest.',
        labs: {
          totalBilirubin: 2.4,
          directBilirubin: 1.1,
          ast: 65,
          alt: 48,
          alkphos: 198,
          totalProteins: 6.2,
          albumin: 3.1,
          platelets: 112,
          inr: 1.35,
          bmi: 30.5,
          fib4: 3.92
        },
        event: 'De Ritis inversion! AST (65) now exceeds ALT (48). FIB-4 > 3.25 confirms high risk of cirrhosis.',
        imagingSummary: 'Ultrasound: Nodular liver surface, hypertrophied caudate lobe, blunt inferior margin, spleen 14.2 cm.',
        checkpointQuestion: {
          question: 'Notice that AST and ALT are now lower than at Month 24, yet the disease has progressed to cirrhosis. What causes this paradox?',
          options: [
            'Spontaneous healing of liver tissue',
            'Transaminase "burn-out" due to progressive loss of functional hepatocytes and reduced parenchymal mass',
            'Lab measurement error',
            'Complete resolution of necroinflammation'
          ],
          correctIndex: 1,
          rationale: 'In end-stage fibrosis and cirrhosis, transaminase levels frequently decline or "burn out" because there is diminished remaining viable hepatic parenchyma to release enzymes during injury.'
        }
      },
      {
        visitId: 'v-60',
        month: 60,
        dateLabel: 'Month 60',
        stage: 'Stage 5: Decompensating Cirrhosis with Ascites',
        stageSeverity: 'decompensated',
        clinicalNote: 'Admitted with sudden abdominal distension and shifting dullness. Paracentesis demonstrates clear straw-colored fluid with SAAG 1.6 g/dL (portal hypertension).',
        labs: {
          totalBilirubin: 3.8,
          directBilirubin: 2.1,
          ast: 58,
          alt: 36,
          alkphos: 220,
          totalProteins: 5.6,
          albumin: 2.5,
          platelets: 82,
          inr: 1.58,
          bmi: 29.8,
          fib4: 5.21
        },
        event: 'Clinical decompensation (ascites). Child-Pugh Class B (Score 8). Placed on liver transplant evaluation protocol.',
        imagingSummary: 'Doppler Ultrasound: Moderate-volume ascites, recanalized paraumbilical vein, attenuated hepatic veins.',
        checkpointQuestion: {
          question: 'The serum-ascites albumin gradient (SAAG) is calculated as Serum Albumin (2.5) - Ascitic Fluid Albumin (0.9) = 1.6 g/dL. What does a SAAG >= 1.1 g/dL establish?',
          options: [
            'Peritoneal carcinomatosis',
            'Portal hypertension etiology (hydrostatic pressure gradient)',
            'Tuberculous peritonitis',
            'Nephrotic syndrome ascites'
          ],
          correctIndex: 1,
          rationale: 'A SAAG >= 1.1 g/dL establishes portal hypertension with >97% diagnostic accuracy, reflecting the hydrostatic transudation of fluid driven by elevated sinusoidal pressure.'
        }
      }
    ]
  },
  {
    id: 'cohort-masld-remission',
    patientName: 'Sunita Mehra (Age 44)',
    age: 44,
    gender: 'Female',
    etiology: 'MASLD with Successful Lifestyle & Incretin Remission',
    initialPresentation: 'Elevated ALT (92 IU/L) and ultrasound-proven steatosis following gestational diabetes history.',
    description: 'Demonstrates the therapeutic power of structured 10% weight loss, Mediterranean dietary adaptation, and GLP-1 receptor agonist therapy over 24 months, showing complete normalization of transaminases and regression of hepatic stiffness.',
    summaryPearl: 'Non-cirrhotic steatohepatitis is clinically reversible! When a patient achieves >10% sustained total body weight reduction, up to 90% show MASH resolution and up to 45% demonstrate true histologic regression of fibrosis.',
    visits: [
      {
        visitId: 'vr-0',
        month: 0,
        dateLabel: 'Month 0 (Baseline)',
        stage: 'Active Steatohepatitis (MASH)',
        stageSeverity: 'moderate',
        clinicalNote: 'BMI 34.2 kg/m2. Central adiposity, mild hepatomegaly. Fasting insulin elevated (HOMA-IR 4.8).',
        labs: {
          totalBilirubin: 1.1,
          directBilirubin: 0.3,
          ast: 54,
          alt: 92,
          alkphos: 128,
          totalProteins: 7.3,
          albumin: 4.3,
          platelets: 285,
          inr: 1.01,
          bmi: 34.2,
          fib4: 1.08
        },
        event: 'Enrolled in Multidisciplinary Metabolic Liver Clinic. Target: 10% weight reduction via Mediterranean diet + 150 min weekly exercise.',
        imagingSummary: 'Ultrasound: Diffuse Grade 2 fatty infiltration. VCTE stiffness: 8.4 kPa (F2).'
      },
      {
        visitId: 'vr-6',
        month: 6,
        dateLabel: 'Month 6',
        stage: 'Early Improvement',
        stageSeverity: 'mild',
        clinicalNote: 'Patient lost 6 kg (6.2% body weight). Reports enhanced stamina and resolution of daytime fatigue. GLP-1 RA initiated.',
        labs: {
          totalBilirubin: 0.8,
          directBilirubin: 0.2,
          ast: 34,
          alt: 48,
          alkphos: 102,
          totalProteins: 7.2,
          albumin: 4.4,
          platelets: 270,
          inr: 0.99,
          bmi: 32.1,
          fib4: 0.84
        },
        event: 'ALT decreased by 48% within 6 months of dietary fructose elimination.'
      },
      {
        visitId: 'vr-18',
        month: 18,
        dateLabel: 'Month 18',
        stage: 'MASH Remission & Normalization',
        stageSeverity: 'normal',
        clinicalNote: 'Cumulative weight loss: 12.4 kg (12.8% of baseline). BMI normalized to 24.8 kg/m2. Normal physical exam.',
        labs: {
          totalBilirubin: 0.7,
          directBilirubin: 0.15,
          ast: 22,
          alt: 24,
          alkphos: 88,
          totalProteins: 7.4,
          albumin: 4.6,
          platelets: 295,
          inr: 0.98,
          bmi: 24.8,
          fib4: 0.62
        },
        event: 'Repeat VCTE stiffness: 4.8 kPa (F0 - Normal). CAP score dropped from 315 to 198 dB/m (Steatosis resolved).',
        imagingSummary: 'Ultrasound: Completely normal hepatic parenchymal architecture and vascular margins.'
      }
    ]
  },
  {
    id: 'cohort-alcohol-relapse',
    patientName: 'Devendra S. (Age 47)',
    age: 47,
    gender: 'Male',
    etiology: 'Alcohol-Related Liver Disease (ALD): Abstinence vs Relapse',
    initialPresentation: 'Jaundice, anorexia, and tender hepatomegaly following a 6-week drinking escalation.',
    description: 'Demonstrates acute alcoholic hepatitis dynamics, rapid response to complete abstinence with nutritional therapy, followed by acute biochemical relapse upon drinking resumption at Month 18.',
    summaryPearl: 'Observe the extreme AST elevation relative to ALT during active alcohol consumption (De Ritis ratio > 2.0-2.5) caused by pyridoxal-5-phosphate depletion, which rapidly normalizes during sustained sobriety.',
    visits: [
      {
        visitId: 'va-0',
        month: 0,
        dateLabel: 'Month 0 (Acute Presentation)',
        stage: 'Acute Alcoholic Steatohepatitis',
        stageSeverity: 'advanced',
        clinicalNote: 'Patient consuming 12-14 units whisky/day. Deep icterus, palmar erythema, tender liver. Maddrey DF = 28 (moderate-severe).',
        labs: {
          totalBilirubin: 9.8,
          directBilirubin: 6.2,
          ast: 248,
          alt: 88,
          alkphos: 172,
          totalProteins: 6.1,
          albumin: 2.8,
          platelets: 142,
          inr: 1.48,
          bmi: 26.2,
          fib4: 3.42
        },
        event: 'Hospital admission: Thiamine, high-protein nutrition, complete alcohol cessation protocol.',
        checkpointQuestion: {
          question: 'Why is AST (248) disproportionately higher than ALT (88) with a De Ritis ratio of 2.82 in alcohol-induced injury?',
          options: [
            'Alcohol damages only the biliary epithelium',
            'Alcohol induces mitochondrial AST release while hepatic deficiency of Vitamin B6 (pyridoxal 5-phosphate) impairs ALT synthesis',
            'ALT is selectively filtered and eliminated by the kidneys in alcoholics',
            'AST is stimulated by gastric alcohol dehydrogenase'
          ],
          correctIndex: 1,
          rationale: 'Alcohol causes direct mitochondrial membrane injury, releasing mitochondrial AST. Additionally, chronic alcoholics suffer from severe Vitamin B6 deficiency, a necessary coenzyme for ALT synthesis, causing ALT to be suppressed.'
        }
      },
      {
        visitId: 'va-6',
        month: 6,
        dateLabel: 'Month 6 (Strict Abstinence)',
        stage: 'Biochemical Recovery',
        stageSeverity: 'mild',
        clinicalNote: '6 months of verified sobriety with group support. Jaundice resolved. Appetite recovered, 4 kg lean weight gained.',
        labs: {
          totalBilirubin: 1.4,
          directBilirubin: 0.4,
          ast: 38,
          alt: 32,
          alkphos: 104,
          totalProteins: 7.1,
          albumin: 3.8,
          platelets: 198,
          inr: 1.08,
          bmi: 27.1,
          fib4: 1.58
        },
        event: 'Profound normalization of transaminases and synthetic coagulopathy (INR 1.08) purely through abstinence and nutrition.'
      },
      {
        visitId: 'va-18',
        month: 18,
        dateLabel: 'Month 18 (Alcohol Relapse)',
        stage: 'Acute Recurrent Alcoholic Hepatitis',
        stageSeverity: 'decompensated',
        clinicalNote: 'Relapsed 8 weeks prior following marital bereavement. Jaundice returned. Scleral icterus, dark urine, and asterixis on exam.',
        labs: {
          totalBilirubin: 14.2,
          directBilirubin: 9.4,
          ast: 310,
          alt: 96,
          alkphos: 215,
          totalProteins: 5.8,
          albumin: 2.6,
          platelets: 98,
          inr: 1.72,
          bmi: 24.9,
          fib4: 4.88
        },
        event: 'Severe relapse! Maddrey DF = 38.6 (>32 warrants corticosteroid evaluation under Lille model).'
      }
    ]
  }
];

// ==========================================
// ML PREDICTION INTERPRETATION & XAI DATA
// ==========================================

export interface FeatureAttribution {
  featureName: string;
  featureCode: string;
  patientValue: number | string;
  normalReference: string;
  shapWeight: number; // Positive pushes risk HIGHER, Negative pushes risk LOWER
  direction: 'increases_risk' | 'decreases_risk' | 'neutral';
  clinicalMechanism: string;
  relativeImportancePct: number;
}

export interface ExplainabilityAnalysis {
  baseProbability: number; // e.g. 0.28 (population average in ILPD)
  predictedRisk: number; // 0 - 100%
  riskCategory: 'Low' | 'Moderate' | 'High' | 'Critical';
  topDrivers: FeatureAttribution[];
  clinicalInterpretation: string;
  deRitisAnalysis: {
    ratio: number;
    hallmark: string;
    clinicalPearl: string;
  };
  conjugationAnalysis: {
    directFraction: number; // direct / total
    type: 'Conjugated (Direct)' | 'Unconjugated (Indirect)' | 'Balanced';
    clinicalPearl: string;
  };
  paradoxAlert?: string;
}

export function computeExplainability(labs: {
  age: number;
  gender: string;
  totalBilirubin: number;
  directBilirubin: number;
  alkphos: number;
  sgpt: number; // ALT
  sgot: number; // AST
  totalProteins: number;
  albumin: number;
  agRatio: number;
}): ExplainabilityAnalysis {
  const deRitis = labs.sgot / Math.max(1, labs.sgpt);
  const directRatio = labs.totalBilirubin > 0 ? labs.directBilirubin / labs.totalBilirubin : 0;

  const attributions: FeatureAttribution[] = [];

  // AST / SGOT attribution
  const astDelta = labs.sgot - 35;
  const astShap = Math.min(25, Math.max(-15, (astDelta / 40) * 8));
  attributions.push({
    featureName: 'AST / SGOT',
    featureCode: 'sgot',
    patientValue: `${labs.sgot} IU/L`,
    normalReference: '10 - 40 IU/L',
    shapWeight: Number(astShap.toFixed(1)),
    direction: astShap > 1.5 ? 'increases_risk' : astShap < -1.5 ? 'decreases_risk' : 'neutral',
    clinicalMechanism: 'Released upon hepatocellular and mitochondrial necrosis. Strong contributor in acute necrosis and toxic injury.',
    relativeImportancePct: Math.min(30, Math.round(Math.abs(astShap) * 1.8))
  });

  // ALT / SGPT attribution
  const altDelta = labs.sgpt - 35;
  const altShap = Math.min(25, Math.max(-15, (altDelta / 40) * 8.5));
  attributions.push({
    featureName: 'ALT / SGPT',
    featureCode: 'sgpt',
    patientValue: `${labs.sgpt} IU/L`,
    normalReference: '7 - 45 IU/L',
    shapWeight: Number(altShap.toFixed(1)),
    direction: altShap > 1.5 ? 'increases_risk' : altShap < -1.5 ? 'decreases_risk' : 'neutral',
    clinicalMechanism: 'High liver specificity (cytosolic). Primary marker for hepatocellular inflammation in MASLD and viral hepatitis.',
    relativeImportancePct: Math.min(30, Math.round(Math.abs(altShap) * 1.9))
  });

  // Total Bilirubin attribution
  const biliDelta = labs.totalBilirubin - 1.0;
  const biliShap = Math.min(30, Math.max(-10, biliDelta * 7.5));
  attributions.push({
    featureName: 'Total Bilirubin',
    featureCode: 'totalBilirubin',
    patientValue: `${labs.totalBilirubin} mg/dL`,
    normalReference: '0.2 - 1.2 mg/dL',
    shapWeight: Number(biliShap.toFixed(1)),
    direction: biliShap > 1.5 ? 'increases_risk' : biliShap < -1.5 ? 'decreases_risk' : 'neutral',
    clinicalMechanism: 'End product of heme catabolism. Reflects biliary clearance and hepatic excretory capacity.',
    relativeImportancePct: Math.min(35, Math.round(Math.abs(biliShap) * 2.0))
  });

  // Albumin attribution
  const albDelta = 4.0 - labs.albumin;
  const albShap = Math.min(25, Math.max(-15, albDelta * 12));
  attributions.push({
    featureName: 'Serum Albumin',
    featureCode: 'albumin',
    patientValue: `${labs.albumin} g/dL`,
    normalReference: '3.5 - 5.0 g/dL',
    shapWeight: Number(albShap.toFixed(1)),
    direction: albShap > 1.5 ? 'increases_risk' : albShap < -1.5 ? 'decreases_risk' : 'neutral',
    clinicalMechanism: 'Synthesized exclusively by hepatocytes. Half-life ~20 days. Hallmark of chronic synthetic hepatic failure.',
    relativeImportancePct: Math.min(28, Math.round(Math.abs(albShap) * 1.7))
  });

  // Alkaline Phosphatase attribution
  const alkDelta = labs.alkphos - 120;
  const alkShap = Math.min(20, Math.max(-10, (alkDelta / 80) * 5));
  attributions.push({
    featureName: 'Alkaline Phosphatase',
    featureCode: 'alkphos',
    patientValue: `${labs.alkphos} IU/L`,
    normalReference: '44 - 147 IU/L',
    shapWeight: Number(alkShap.toFixed(1)),
    direction: alkShap > 1.5 ? 'increases_risk' : alkShap < -1.5 ? 'decreases_risk' : 'neutral',
    clinicalMechanism: 'Concentrated in microvilli of biliary canaliculi. Inducible enzyme signaling cholestasis or space-occupying infiltrations.',
    relativeImportancePct: Math.min(20, Math.round(Math.abs(alkShap) * 1.5))
  });

  // De Ritis synergistic interaction
  let deRitisShap = 0;
  if (deRitis > 2.0 && labs.sgot > 80) {
    deRitisShap = 12.0;
  } else if (deRitis < 0.7 && labs.sgpt > 60) {
    deRitisShap = 6.0;
  }
  attributions.push({
    featureName: 'De Ritis Interaction (AST:ALT)',
    featureCode: 'deritis_ratio',
    patientValue: `${deRitis.toFixed(2)}x`,
    normalReference: '0.8 - 1.15',
    shapWeight: deRitisShap,
    direction: deRitisShap > 2 ? 'increases_risk' : 'neutral',
    clinicalMechanism: deRitis > 2.0
      ? 'De Ritis > 2.0 strongly signals alcoholic injury or cirrhotic mitochondrial disruption.'
      : 'De Ritis < 0.8 is typical of acute viral or metabolic steatohepatitis.',
    relativeImportancePct: deRitisShap > 0 ? 18 : 6
  });

  // Sum total SHAP contributions + baseline (28%)
  const rawSum = 28 + attributions.reduce((acc, curr) => acc + curr.shapWeight, 0);
  const finalRisk = Math.min(99, Math.max(1, Math.round(rawSum)));

  const sortedDrivers = [...attributions].sort((a, b) => Math.abs(b.shapWeight) - Math.abs(a.shapWeight));

  let riskCategory: 'Low' | 'Moderate' | 'High' | 'Critical' = 'Low';
  if (finalRisk >= 75) riskCategory = 'Critical';
  else if (finalRisk >= 50) riskCategory = 'High';
  else if (finalRisk >= 30) riskCategory = 'Moderate';

  let deRitisHallmark = 'Normal or Balanced (0.8 - 1.2)';
  if (deRitis > 2.0) deRitisHallmark = 'Severe Elevation (>2.0): Alcoholic Hepatitis or Advanced Cirrhosis hallmark';
  else if (deRitis > 1.2) deRitisHallmark = 'Mild Elevation (>1.2): Suggests progressive fibrosis or acute toxic injury';
  else if (deRitis < 0.8) deRitisHallmark = 'Inverted (<0.8): Characteristic of MASLD / viral hepatitis';

  let directType: 'Conjugated (Direct)' | 'Unconjugated (Indirect)' | 'Balanced' = 'Balanced';
  if (directRatio > 0.5) directType = 'Conjugated (Direct)';
  else if (directRatio < 0.3) directType = 'Unconjugated (Indirect)';

  let paradoxAlert: string | undefined;
  if (labs.albumin < 3.0 && labs.sgot < 50 && labs.sgpt < 50) {
    paradoxAlert = 'WARNING: Transaminase "Burn-Out" detected. While AST and ALT appear deceptively normal (<50 IU/L), severe hypoalbuminemia indicates end-stage chronic cirrhosis with parenchymal loss.';
  }

  return {
    baseProbability: 0.28,
    predictedRisk: finalRisk,
    riskCategory,
    topDrivers: sortedDrivers,
    clinicalInterpretation: `The model projects a ${finalRisk}% probability of active liver disease (Classification: ${riskCategory}). The primary upward driver is ${sortedDrivers[0].featureName} contributing +${sortedDrivers[0].shapWeight}% to the decision boundary.`,
    deRitisAnalysis: {
      ratio: Number(deRitis.toFixed(2)),
      hallmark: deRitisHallmark,
      clinicalPearl: 'The De Ritis ratio (AST/ALT) differentiates cytosolic (ALT) vs mitochondrial (AST) cellular injury mechanisms.'
    },
    conjugationAnalysis: {
      directFraction: Number((directRatio * 100).toFixed(1)),
      type: directType,
      clinicalPearl: directType === 'Conjugated (Direct)'
        ? 'Direct fraction > 50% confirms post-microsomal impairment: biliary obstruction, cholestasis, or severe parenchymal excretory failure.'
        : 'Indirect fraction > 70% suggests pre-hepatic hemolysis or Gilbert syndrome (impaired glucuronyl transferase).'
    },
    paradoxAlert
  };
}

// ==========================================
// PREVENTION & PRECAUTION GUIDANCE DATASET
// ==========================================

export interface DietaryProtocol {
  category: string;
  recommendation: string;
  rationale: string;
  evidenceGrade: string; // 'Grade A (High)', 'Grade B', etc.
  practicalTip: string;
}

export const DIETARY_PROTOCOLS: DietaryProtocol[] = [
  {
    category: 'Mediterranean Dietary Pattern',
    recommendation: 'Adopt a Mediterranean diet rich in extra virgin olive oil, nuts, vegetables, legumes, and omega-3 fatty acids.',
    rationale: 'Demonstrated in randomized trials (PREDIMED) to reduce hepatic steatosis, lower insulin resistance (HOMA-IR), and improve cardiovascular morbidity in MASLD patients.',
    evidenceGrade: 'Grade A (Strong Evidence)',
    practicalTip: 'Replace saturated animal fats and butter with 2 tablespoons of cold-pressed extra virgin olive oil daily.'
  },
  {
    category: 'Fructose & Sugar-Sweetened Beverages',
    recommendation: 'Strictly avoid high-fructose corn syrup (HFCS), sweetened soda, energy drinks, and packaged fruit concentrates.',
    rationale: 'Hepatic fructokinase metabolizes fructose without negative ATP feedback, driving rapid de novo lipogenesis (DNL), hepatic endoplasmic reticulum stress, and uric acid generation.',
    evidenceGrade: 'Grade A (Strong Evidence)',
    practicalTip: 'Consume whole fresh fruits with intact fiber rather than strained fruit juices or processed sweetened drinks.'
  },
  {
    category: 'Coffee & Polyphenols',
    recommendation: 'Encourage consumption of 2 to 3 cups of filtered, unsweetened coffee daily.',
    rationale: 'Chlorogenic acid, cafestol, and caffeine induce hepatic autophagy, stimulate beta-oxidation, and downregulate profibrotic cytokines (TGF-beta), significantly lowering cirrhosis and HCC risk.',
    evidenceGrade: 'Grade B (Consistent Observational Evidence)',
    practicalTip: 'Drink filtered black coffee or coffee with low-fat milk; avoid sugary syrups and whipped creams.'
  },
  {
    category: 'Sodium Restriction in Cirrhosis',
    recommendation: 'Limit dietary sodium to < 2000 mg/day (approx. 5 grams of table salt) for patients with ascites or portal hypertension.',
    rationale: 'Splanchnic arterial vasodilation drives secondary hyperaldosteronism and severe renal sodium retention. Excess sodium intake exacerbates fluid accumulation in the peritoneal cavity.',
    evidenceGrade: 'Grade A (AASLD/EASL Standard of Care)',
    practicalTip: 'Use fresh lemon juice, herbs, and spices rather than salt shakers or commercial sauces.'
  }
];

export interface LifestyleBenchmark {
  intervention: string;
  target: string;
  clinicalImpact: string;
  metabolicMechanism: string;
}

export const LIFESTYLE_BENCHMARKS: LifestyleBenchmark[] = [
  {
    intervention: '3% - 5% Body Weight Reduction',
    target: 'Modest weight reduction over 3 to 6 months',
    clinicalImpact: 'Significantly reduces hepatic steatosis (liver fat content) on MRI-PDFF and ultrasound.',
    metabolicMechanism: 'Decreases peripheral free fatty acid flux from visceral adipose stores into the portal vein.'
  },
  {
    intervention: '7% - 10% Body Weight Reduction',
    target: 'Substantial structured weight loss target',
    clinicalImpact: 'Results in histologic MASH resolution and substantial reduction in lobular necroinflammation in >65% of patients.',
    metabolicMechanism: 'Halts hepatic ballooning, reduces oxidative stress, and dampens macrophage (Kupffer cell) activation.'
  },
  {
    intervention: '>10% Body Weight Reduction',
    target: 'High-intensity lifestyle or pharmacological/bariatric target',
    clinicalImpact: 'Promotes true regression and remodeling of hepatic fibrosis (scar tissue) in up to 45% of patients.',
    metabolicMechanism: 'Permits hepatic stellate cells to revert from active collagen-secreting myofibroblasts to quiescent phenotypes.'
  },
  {
    intervention: 'Exercise: Aerobic + Resistance',
    target: '150-300 min/week moderate aerobic + 2-3 sessions resistance',
    clinicalImpact: 'Reduces liver fat independent of weight loss; counters sarcopenia in chronic liver disease.',
    metabolicMechanism: 'Enhances skeletal muscle GLUT-4 translocation, burns visceral adiposity, and preserves muscle mass.'
  }
];

export interface HepatotoxicSafetyRule {
  medicationOrAgent: string;
  maxDoseNormal: string;
  maxDoseCirrhosis: string;
  dangerLevel: 'Safe with limits' | 'Caution/Monitor' | 'Strictly Contraindicated';
  clinicalGuidance: string;
}

export const HEPATOTOXIC_RULES: HepatotoxicSafetyRule[] = [
  {
    medicationOrAgent: 'Acetaminophen (Paracetamol)',
    maxDoseNormal: '4,000 mg / 24 hours',
    maxDoseCirrhosis: '2,000 mg / 24 hours (divided doses)',
    dangerLevel: 'Safe with limits',
    clinicalGuidance: 'Acetaminophen is the safest analgesic in cirrhosis when limited to <= 2 g/day! Avoid NSAIDs completely due to acute kidney injury (hepatorenal syndrome) and variceal bleeding risks.'
  },
  {
    medicationOrAgent: 'NSAIDs (Ibuprofen, Naproxen, Diclofenac)',
    maxDoseNormal: 'Standard OTC doses',
    maxDoseCirrhosis: '0 mg (Completely Avoid)',
    dangerLevel: 'Strictly Contraindicated',
    clinicalGuidance: 'NSAIDs inhibit renal prostaglandins in cirrhotic patients whose kidneys rely on prostaglandin-mediated vasodilation, precipitating acute renal failure, refractory ascites, and peptic ulcer bleeding.'
  },
  {
    medicationOrAgent: 'Statins (Atorvastatin, Rosuvastatin)',
    maxDoseNormal: 'Standard cardiovascular doses',
    maxDoseCirrhosis: 'Safe in compensated (Child-Pugh A); caution in decompensated',
    dangerLevel: 'Safe with limits',
    clinicalGuidance: 'MYTH BUSTER: Statins are SAFE and beneficial in MASLD! They reduce cardiovascular mortality, decrease portal pressure, and lower HCC incidence. Withhold only in acute liver failure.'
  },
  {
    medicationOrAgent: 'Herbal Supplements (Green Tea Extract, Kava)',
    maxDoseNormal: 'Variable',
    maxDoseCirrhosis: 'Completely Avoid',
    dangerLevel: 'Strictly Contraindicated',
    clinicalGuidance: 'Herbal and Dietary Supplements (HDS) cause up to 20% of drug-induced liver injuries (DILI). Concentrated epigallocatechin gallate (EGCG) in green tea extracts has caused acute liver failure.'
  }
];

export interface ClinicalWarningSign {
  id: string;
  signName: string;
  anatomicalLocation: string;
  pathophysiologicalCause: string;
  urgency: 'Routine Outpatient' | 'Urgent 48h' | 'EMERGENCY STAT';
  clinicalAction: string;
}

export const CLINICAL_WARNING_SIGNS: ClinicalWarningSign[] = [
  {
    id: 'sign-asterixis',
    signName: 'Asterixis ("Flapping Tremor")',
    anatomicalLocation: 'Dorsiflexed wrists with outstretched arms',
    pathophysiologicalCause: 'Hepatic encephalopathy caused by hyperammonemia crossing blood-brain barrier and causing astrocyte swelling.',
    urgency: 'EMERGENCY STAT',
    clinicalAction: 'Immediate admission, check airway/GCS, start Lactulose (titrated to 2-3 soft bowel movements/day) and Rifaximin 550 mg BID.'
  },
  {
    id: 'sign-icterus',
    signName: 'Scleral Icterus & Jaundice',
    anatomicalLocation: 'Sclera of eyes, sublingual mucosa, skin',
    pathophysiologicalCause: 'Serum total bilirubin exceeds 2.5 - 3.0 mg/dL due to biliary obstruction, acute hepatitis, or advanced cirrhosis.',
    urgency: 'Urgent 48h',
    clinicalAction: 'Urgent liver function tests, abdominal ultrasound to rule out biliary obstruction (choledocholithiasis/mass).'
  },
  {
    id: 'sign-hematemesis',
    signName: 'Hematemesis or Melena',
    anatomicalLocation: 'Gastrointestinal tract (vomiting blood / black tarry stools)',
    pathophysiologicalCause: 'Ruptured esophageal or gastric varices secondary to portal hypertension (hepatic venous pressure gradient > 10-12 mmHg).',
    urgency: 'EMERGENCY STAT',
    clinicalAction: 'STAT ICU resuscitation, IV Octreotide bolus + infusion, IV Ceftriaxone prophylaxis, emergent endoscopic variceal ligation (EVL) within 12 hours.'
  },
  {
    id: 'sign-ascites',
    signName: 'Rapid Abdominal Distension (Ascites)',
    anatomicalLocation: 'Peritoneal cavity',
    pathophysiologicalCause: 'Splanchnic arterial vasodilation, sinusoidal hypertension, and hypoalbuminemia causing fluid transudation.',
    urgency: 'Urgent 48h',
    clinicalAction: 'Diagnostic paracentesis to rule out Spontaneous Bacterial Peritonitis (SBP: PMN count > 250/uL), sodium restriction, Spironolactone + Furosemide.'
  }
];

// ==========================================
// CLINICAL DECISION SIMULATION SCENARIOS
// ==========================================

export interface DecisionStep {
  stepNumber: number;
  stepTitle: string;
  prompt: string;
  options: {
    id: string;
    action: string;
    isOptimal: boolean;
    attendingFeedback: string;
    xpPoints: number;
  }[];
}

export interface DecisionSimulationScenario {
  id: string;
  title: string;
  patientVignette: string;
  initialLabs: {
    ast: number;
    alt: number;
    totalBilirubin: number;
    albumin: number;
    inr: number;
    platelets: number;
  };
  steps: DecisionStep[];
}

export const DECISION_SIMULATION_SCENARIOS: DecisionSimulationScenario[] = [
  {
    id: 'sim-mash-decision',
    title: 'Managing Asymptomatic Transaminitis in Type 2 Diabetes',
    patientVignette: '54-year-old female with long-standing Type 2 Diabetes (HbA1c 8.2%) and hypertension. Routine labs show AST 62 IU/L, ALT 84 IU/L, Platelets 175,000 /uL, and Total Bilirubin 0.9 mg/dL. She feels completely well and asks why her liver enzymes are elevated.',
    initialLabs: {
      ast: 62,
      alt: 84,
      totalBilirubin: 0.9,
      albumin: 4.1,
      inr: 1.02,
      platelets: 175000
    },
    steps: [
      {
        stepNumber: 1,
        stepTitle: 'Step 1: First-Line Non-Invasive Risk Stratification',
        prompt: 'What is the most appropriate first-line clinical action according to the AASLD/ADA 2024 Practice Guidance for MASLD in high-risk diabetic patients?',
        options: [
          {
            id: 'opt-1a',
            action: 'Calculate FIB-4 score immediately using age, AST, ALT, and platelets',
            isOptimal: true,
            attendingFeedback: 'EXCELLENT! Guidelines mandate calculating FIB-4 as the primary triage tool in all patients with T2D, obesity, or elevated liver enzymes. Her FIB-4 is 2.14 (indeterminate risk), prompting secondary testing.',
            xpPoints: 50
          },
          {
            id: 'opt-1b',
            action: 'Reassure the patient and recheck routine LFTs in 12 months',
            isOptimal: false,
            attendingFeedback: 'SUBOPTIMAL: Up to 15% of patients with T2D have clinically silent advanced fibrosis. Delaying risk stratification by a year risks missing progressive bridging fibrosis.',
            xpPoints: 10
          },
          {
            id: 'opt-1c',
            action: 'Schedule an immediate percutaneous liver biopsy',
            isOptimal: false,
            attendingFeedback: 'INAPPROPRIATE: Liver biopsy is an invasive procedure with bleeding risk (0.5%) and should never be first-line without prior non-invasive risk stratification.',
            xpPoints: 10
          }
        ]
      },
      {
        stepNumber: 2,
        stepTitle: 'Step 2: Second-Tier Fibrosis Evaluation',
        prompt: 'The patient FIB-4 is 2.14, which falls in the indeterminate range (1.30 to 2.67). What is the recommended next diagnostic step?',
        options: [
          {
            id: 'opt-2a',
            action: 'Perform Vibration-Controlled Transient Elastography (FibroScan) or order an Enhanced Liver Fibrosis (ELF) test',
            isOptimal: true,
            attendingFeedback: 'CORRECT! An indeterminate FIB-4 requires reflex testing with VCTE or ELF. Her VCTE reveals liver stiffness of 10.2 kPa, establishing F3 advanced fibrosis requiring specialist hepatology referral.',
            xpPoints: 50
          },
          {
            id: 'opt-2b',
            action: 'Order a non-contrast abdominal CT scan',
            isOptimal: false,
            attendingFeedback: 'INCORRECT: Standard CT scans cannot reliably stage fibrosis or differentiate simple steatosis from bridging fibrosis, and exposes the patient to unnecessary ionizing radiation.',
            xpPoints: 10
          },
          {
            id: 'opt-2c',
            action: 'Start high-dose oral Vitamin E (800 IU/day) without further testing',
            isOptimal: false,
            attendingFeedback: 'INCORRECT: Vitamin E is not recommended in diabetic patients without prior biopsy due to lack of demonstrated benefit and potential prostate cancer / hemorrhagic stroke safety concerns.',
            xpPoints: 10
          }
        ]
      },
      {
        stepNumber: 3,
        stepTitle: 'Step 3: Pharmacotherapy & Cardiometabolic Management',
        prompt: 'With confirmed F3 advanced fibrosis from MASH and poorly controlled T2D, which therapeutic regimen is supported by the highest clinical trial evidence?',
        options: [
          {
            id: 'opt-3a',
            action: 'Initiate a GLP-1 Receptor Agonist (e.g. Semaglutide) alongside Resmetirom (THR-beta agonist) and intensified lifestyle modification',
            isOptimal: true,
            attendingFeedback: 'OUTSTANDING CLINICAL REASONING! Resmetirom is the first FDA-approved medication for MASH with moderate-to-advanced fibrosis (F2-F3), and GLP-1 RAs provide glycemic control, weight loss, and cardiovascular risk reduction.',
            xpPoints: 50
          },
          {
            id: 'opt-3b',
            action: 'Discontinue her statin immediately to protect the liver',
            isOptimal: false,
            attendingFeedback: 'CRITICAL ERROR! Cardiovascular disease is the leading cause of death in MASH patients. Statins are safe and protective; stopping them sharply increases cardiovascular mortality.',
            xpPoints: 0
          },
          {
            id: 'opt-3c',
            action: 'Prescribe milk thistle (Silymarin) extract twice daily',
            isOptimal: false,
            attendingFeedback: 'INCORRECT: Rigorous multicenter placebo-controlled trials have demonstrated that milk thistle is ineffective for reversing steatohepatitis or improving fibrosis.',
            xpPoints: 10
          }
        ]
      }
    ]
  },
  {
    id: 'sim-apap-decision',
    title: 'Acute Acetaminophen Toxicity & Emergency NAC Protocol',
    patientVignette: '23-year-old female is brought to the emergency department 6 hours after an intentional overdose of 24 tablets of 500mg Paracetamol (12.0 grams total). She is nauseated and vomited twice, but is fully alert (GCS 15). Baseline LFTs: AST 185 IU/L, ALT 140 IU/L, Total Bilirubin 1.1 mg/dL, INR 1.15, Creatinine 0.9 mg/dL.',
    initialLabs: {
      ast: 185,
      alt: 140,
      totalBilirubin: 1.1,
      albumin: 4.2,
      inr: 1.15,
      platelets: 240000
    },
    steps: [
      {
        stepNumber: 1,
        stepTitle: 'Step 1: Emergency Triage & Serum Paracetamol Timing',
        prompt: 'The patient ingested the tablets 6 hours ago. What is the immediate, essential diagnostic and triage step?',
        options: [
          {
            id: 'opt-apap-1a',
            action: 'Obtain immediate 6-hour serum acetaminophen level and plot on the Rumack-Matthew nomogram while calculating loading dose of N-Acetylcysteine (NAC)',
            isOptimal: true,
            attendingFeedback: 'PERFECT ACTION! Serum APAP levels drawn between 4 and 24 hours post-ingestion are plotted on the Rumack-Matthew nomogram. Because her ingestion is >10g and already at 6 hours, NAC must be initiated without waiting for lab delays.',
            xpPoints: 50
          },
          {
            id: 'opt-apap-1b',
            action: 'Administer oral syrup of ipecac to induce vomiting',
            isOptimal: false,
            attendingFeedback: 'DANGEROUS: Ipecac is obsolete and contraindicated due to aspiration risk and interference with oral antidotes.',
            xpPoints: 0
          },
          {
            id: 'opt-apap-1c',
            action: 'Wait 12 hours and repeat transaminases to see if liver enzymes rise further',
            isOptimal: false,
            attendingFeedback: 'CRITICAL ERROR: Delaying NAC beyond 8 hours post-ingestion dramatically increases the incidence of severe hepatotoxicity, acute liver failure, and death.',
            xpPoints: 0
          }
        ]
      },
      {
        stepNumber: 2,
        stepTitle: 'Step 2: Emergency Antidote Administration',
        prompt: 'The 6-hour paracetamol level returns at 190 µg/mL (well above the treatment line on the Rumack-Matthew nomogram). What is the definitive pharmacological management?',
        options: [
          {
            id: 'opt-apap-2a',
            action: 'Initiate IV N-Acetylcysteine (NAC) protocol (150 mg/kg loading over 1h, then 50 mg/kg over 4h, then 100 mg/kg over 16h) with continuous hemodynamic and INR monitoring',
            isOptimal: true,
            attendingFeedback: 'EXCELLENT! NAC replenishes depleted mitochondrial glutathione stores, directly conjugates NAPQI, acts as an antioxidant, and improves microcirculatory hemodynamics.',
            xpPoints: 50
          },
          {
            id: 'opt-apap-2b',
            action: 'Give IV loop diuretics (Furosemide) to flush the toxin through the kidneys',
            isOptimal: false,
            attendingFeedback: 'INCORRECT: APAP hepatotoxicity is driven by toxic metabolite NAPQI covalent binding in hepatocytes, not renal clearance. Diuretics cause volume depletion.',
            xpPoints: 10
          },
          {
            id: 'opt-apap-2c',
            action: 'Immediate hemodialysis as sole therapy',
            isOptimal: false,
            attendingFeedback: 'INAPPROPRIATE: Hemodialysis is only considered in catastrophic massive ingestions (>800 µg/mL) with coma; NAC remains the foundational life-saving antidote.',
            xpPoints: 10
          }
        ]
      },
      {
        stepNumber: 3,
        stepTitle: 'Step 3: Monitoring for King\'s College Acute Liver Failure Criteria',
        prompt: 'At 36 hours post-ingestion, patient ALT reaches 3,800 IU/L. Which clinical finding would satisfy the King\'s College Criteria for urgent liver transplant listing?',
        options: [
          {
            id: 'opt-apap-3a',
            action: 'Arterial blood pH < 7.30 after fluid resuscitation, OR the triad of INR > 6.5, Creatinine > 3.4 mg/dL, and Grade III/IV encephalopathy',
            isOptimal: true,
            attendingFeedback: 'MASTER-LEVEL CLINICAL CRITERIA! The King\'s College Hospital Criteria for paracetamol-induced ALF identify non-survivors (>80% mortality without transplantation), requiring immediate regional transplant center transfer.',
            xpPoints: 50
          },
          {
            id: 'opt-apap-3b',
            action: 'ALT > 2,000 IU/L alone regardless of pH or INR',
            isOptimal: false,
            attendingFeedback: 'INCORRECT: Peak transaminases alone do NOT correlate with mortality. Many patients with transaminases > 10,000 IU/L recover completely if synthetic function and arterial pH are preserved.',
            xpPoints: 10
          },
          {
            id: 'opt-apap-3c',
            action: 'Presence of mild nausea on day 3',
            isOptimal: false,
            attendingFeedback: 'INCORRECT: Nausea is common and non-specific.',
            xpPoints: 0
          }
        ]
      }
    ]
  },
  {
    id: 'sim-sbp-decision',
    title: 'Decompensated Cirrhosis & Suspected Spontaneous Bacterial Peritonitis',
    patientVignette: '61-year-old male with decompensated alcohol-related cirrhosis (Child-Pugh C) presents with fever (38.4°C), new abdominal tenderness, and worsened confusion over 18 hours. Labs: Total Bilirubin 4.9 mg/dL, INR 1.92, Platelets 78,000 /uL, Creatinine 1.8 mg/dL (baseline was 1.0 mg/dL).',
    initialLabs: {
      ast: 82,
      alt: 44,
      totalBilirubin: 4.9,
      albumin: 2.4,
      inr: 1.92,
      platelets: 78000
    },
    steps: [
      {
        stepNumber: 1,
        stepTitle: 'Step 1: Emergency Diagnostic Paracentesis',
        prompt: 'What is the mandatory first procedural step prior to administering antibiotics in a cirrhotic patient with suspected SBP?',
        options: [
          {
            id: 'opt-sbp-1a',
            action: 'Diagnostic paracentesis with fluid cell count and differential (PMN count) and bedside inoculation into blood culture bottles',
            isOptimal: true,
            attendingFeedback: 'ABSOLUTELY ESSENTIAL! Paracentesis must precede antibiotic therapy whenever possible. A polymorphonuclear (PMN) count >= 250 cells/mm³ is diagnostic of SBP. Bedside blood culture bottle inoculation increases microbiological yield from 40% to >80%.',
            xpPoints: 50
          },
          {
            id: 'opt-sbp-1b',
            action: 'Start oral Ciprofloxacin and re-evaluate the abdomen in 24 hours',
            isOptimal: false,
            attendingFeedback: 'DANGEROUS DELAY: SBP carries a 30% mortality if unaddressed. Delaying diagnostic paracentesis and using oral quinolones during hospital presentation with AKI is unsafe.',
            xpPoints: 0
          },
          {
            id: 'opt-sbp-1c',
            action: 'Perform a laparotomy for surgical abdomen exploration',
            isOptimal: false,
            attendingFeedback: 'CONTRAINDICATED: Exploratory surgery in decompensated cirrhosis carries prohibitive mortality (>80%) and should never be done for medical SBP.',
            xpPoints: 0
          }
        ]
      },
      {
        stepNumber: 2,
        stepTitle: 'Step 2: Dual Antimicrobial & Intravenous Albumin Therapy',
        prompt: 'Ascitic fluid PMN count returns at 640 cells/mm³ (confirmed SBP). Serum creatinine is elevated to 1.8 mg/dL (acute kidney injury). What is the standard-of-care medical regimen?',
        options: [
          {
            id: 'opt-sbp-2a',
            action: 'IV third-generation cephalosporin (Cefotaxime 2g q8h or Ceftriaxone 2g q24h) PLUS IV 20% Albumin (1.5 g/kg within 6h, followed by 1.0 g/kg on Day 3)',
            isOptimal: true,
            attendingFeedback: 'LANDMARK GUIDELINE REGIMEN (Sort et al., NEJM)! Combining IV third-generation cephalosporins with IV 20% Albumin reduces the incidence of hepatorenal syndrome from 30% to 10% and reduces mortality from 29% to 10%.',
            xpPoints: 50
          },
          {
            id: 'opt-sbp-2b',
            action: 'IV Aminoglycoside (Gentamicin) monotherapy',
            isOptimal: false,
            attendingFeedback: 'CONTRAINDICATED: Aminoglycosides are severely nephrotoxic in cirrhotic patients and precipitate irreversible acute tubular necrosis and hepatorenal syndrome.',
            xpPoints: 0
          },
          {
            id: 'opt-sbp-2c',
            action: 'Administer only oral Lactulose and withhold all antibiotics',
            isOptimal: false,
            attendingFeedback: 'FATAL ERROR: SBP is a bacterial infection of ascitic fluid requiring immediate bactericidal systemic antibiotics.',
            xpPoints: 0
          }
        ]
      },
      {
        stepNumber: 3,
        stepTitle: 'Step 3: Hemodynamics & Beta-Blocker Safety Management',
        prompt: 'The patient was previously on Carvedilol 12.5 mg daily for esophageal variceal prophylaxis. Blood pressure is now 88/54 mmHg with AKI. How should the beta-blocker be managed?',
        options: [
          {
            id: 'opt-sbp-3a',
            action: 'Withhold or discontinue Carvedilol immediately in the setting of severe hypotension, SBP, and acute kidney injury',
            isOptimal: true,
            attendingFeedback: 'EXPERT HEPATOLOGY REASONING ("Window Hypothesis")! In the setting of severe infection (SBP) and hypotension/AKI, non-selective beta-blockers compromise cardiac compensatory reserve and worsen renal hypoperfusion. They must be withheld until recovery.',
            xpPoints: 50
          },
          {
            id: 'opt-sbp-3b',
            action: 'Double the dose of Carvedilol to prevent variceal bleeding',
            isOptimal: false,
            attendingFeedback: 'CATASTROPHIC: Escalating beta-blockers in a hypotensive septic patient will precipitate cardiovascular collapse and cardiac arrest.',
            xpPoints: 0
          },
          {
            id: 'opt-sbp-3c',
            action: 'Add high-dose oral Ibuprofen for pain',
            isOptimal: false,
            attendingFeedback: 'FATAL: NSAIDs in cirrhosis are strictly contraindicated and will exacerbate renal failure.',
            xpPoints: 0
          }
        ]
      }
    ]
  }
];

// ==========================================
// COMPETENCY ASSESSMENT & PERSONALIZED RECOMMENDATIONS
// ==========================================

export interface ClinicalCompetency {
  id: string;
  name: string;
  scorePct: number; // 0 - 100
  status: 'Mastered' | 'Competent' | 'Review Needed';
  recommendedModuleId: number;
  recommendedModuleName: string;
  recommendedCaseId: string;
  explanation: string;
}

export const INITIAL_COMPETENCIES: ClinicalCompetency[] = [
  {
    id: 'comp-biomarkers',
    name: 'Biomarker Synthesis & De Ritis Interpretation',
    scorePct: 82,
    status: 'Mastered',
    recommendedModuleId: 1,
    recommendedModuleName: 'Biomarkers & Pathology',
    recommendedCaseId: 'cohort-masld-progression',
    explanation: 'Solid grasp of transaminase kinetics and mitochondrial AST release vs cytosolic ALT.'
  },
  {
    id: 'comp-cholestasis',
    name: 'Cholestatic vs Hepatocellular Differentiation',
    scorePct: 65,
    status: 'Review Needed',
    recommendedModuleId: 2,
    recommendedModuleName: 'Feature Engineering & Clinical Ratios',
    recommendedCaseId: 'cohort-alcohol-relapse',
    explanation: 'Struggles with calculating conjugation fraction and differentiating extrahepatic duct obstruction from intrahepatic canalicular injury.'
  },
  {
    id: 'comp-xai',
    name: 'Machine Learning Explainability & SHAP Interpretation',
    scorePct: 78,
    status: 'Competent',
    recommendedModuleId: 6,
    recommendedModuleName: 'Feature Importance & Explainable AI',
    recommendedCaseId: 'cohort-masld-progression',
    explanation: 'Understands feature attribution directionality, but needs practice identifying transaminase burn-out paradoxes.'
  },
  {
    id: 'comp-prevention',
    name: 'Lifestyle Medicine & Hepatotoxic Safety',
    scorePct: 58,
    status: 'Review Needed',
    recommendedModuleId: 8,
    recommendedModuleName: 'Clinical Case Studies',
    recommendedCaseId: 'cohort-masld-remission',
    explanation: 'Requires review on maximum acetaminophen ceilings in cirrhosis (2g/day) and the safety profile of statins in MASLD.'
  },
  {
    id: 'comp-decision',
    name: 'Clinical Decision Staging (FIB-4 & VCTE Triage)',
    scorePct: 88,
    status: 'Mastered',
    recommendedModuleId: 9,
    recommendedModuleName: 'Clinical Deployment & Decision Support',
    recommendedCaseId: 'sim-mash-decision',
    explanation: 'Excellent triage logic regarding high-risk vs indeterminate FIB-4 cutoffs.'
  }
];
