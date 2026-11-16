/**
 * Digitalization in Healthcare - Hospital Patient Case Registry Data
 * Real-world anonymized patient dossiers from premier medical centers for clinical case study
 */

export interface HospitalPatientCase {
  id: string;
  patientRef: string; // e.g. "AIIMS-HEP-2026-081"
  hospitalName: string;
  department: string;
  location: string;
  admissionDate: string;
  age: number;
  gender: 'Male' | 'Female';
  occupation: string;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  pastMedicalHistory: string[];
  vitals: {
    bp: string;
    hr: number;
    rr: number;
    temp: string;
    spo2: number;
  };
  physicalExamination: string[];
  labs: {
    totalBilirubin: number; // mg/dL (Normal: 0.2-1.2)
    directBilirubin: number; // mg/dL (Normal: 0.0-0.3)
    sgptAlt: number; // U/L (Normal: 7-56)
    sgotAst: number; // U/L (Normal: 10-40)
    alkalinePhosphatase: number; // U/L (Normal: 44-147)
    totalProtein: number; // g/dL (Normal: 6.0-8.3)
    albumin: number; // g/dL (Normal: 3.5-5.0)
    agRatio: number; // Ratio (Normal: 1.2-2.2)
    platelets: number; // x10^3/µL (Normal: 150-450)
    inr: number; // (Normal: 0.8-1.1)
    creatinine: number; // mg/dL (Normal: 0.7-1.3)
    sodium: number; // mEq/L (Normal: 135-145)
  };
  ultrasoundImaging: string;
  biopsyHistology?: string;
  deRitisRatio: number;
  fib4Score: number;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Critical';
  differentialDiagnoses: string[];
  definitiveDiagnosis: string;
  clinicalManagement: string[];
  clinicalPearls: string[];
  isCustomCase?: boolean;
  createdBy?: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export const SEED_HOSPITAL_CASES: HospitalPatientCase[] = [
  {
    id: 'hosp-case-1',
    patientRef: 'AIIMS-HEP-2026-081',
    hospitalName: 'All India Institute of Medical Sciences (AIIMS)',
    department: 'Department of Gastroenterology & Hepatology',
    location: 'New Delhi, India',
    admissionDate: '2026-03-12',
    age: 56,
    gender: 'Male',
    occupation: 'Transport Contractor',
    chiefComplaint: 'Progressive abdominal distension for 3 weeks and altered sleep-wake cycle with confusion for 48 hours.',
    historyOfPresentIllness: 'A 56-year-old male with a 15-year history of alcohol intake (~70g/day) presented with worsening bilateral pedel edema and gross abdominal swelling. Over the past 2 days, his family noted daytime somnolence, nocturnal restlessness, and slurred speech. Denies hematemesis or melena.',
    pastMedicalHistory: ['Type 2 Diabetes Mellitus (8 years)', 'Essential Hypertension', 'No prior endoscopy'],
    vitals: {
      bp: '108/64 mmHg',
      hr: 88,
      rr: 19,
      temp: '98.8 °F',
      spo2: 97
    },
    physicalExamination: [
      'Icteric sclerae, palmar erythema, and 4 spider nevi on anterior chest wall.',
      'Flapping tremor (asterixis) elicited on wrist dorsiflexion - Grade II Hepatic Encephalopathy.',
      'Abdomen: Tense ascites with shifting dullness and fluid thrill; splenomegaly palpable 3 cm below left costal margin.',
      'Bilateral pitting pedal edema up to mid-calf.'
    ],
    labs: {
      totalBilirubin: 4.8,
      directBilirubin: 2.9,
      sgptAlt: 58,
      sgotAst: 142,
      alkalinePhosphatase: 198,
      totalProtein: 5.8,
      albumin: 2.3,
      agRatio: 0.66,
      platelets: 78,
      inr: 1.72,
      creatinine: 1.15,
      sodium: 131
    },
    ultrasoundImaging: 'Liver shows shrunken, nodular parenchymal contour with coarse echotexture. Dilated portal vein measuring 14.8 mm with hepatopetal flow. Splenomegaly (15.4 cm). Gross free ascites without internal echoes or loculations.',
    biopsyHistology: 'Percutaneous biopsy avoided due to INR 1.72 and ascites. Previous external biopsy: Micronodular cirrhosis with dense collagen bands encircling regenerative parenchymal nodules and ballooning degeneration.',
    deRitisRatio: 2.45,
    fib4Score: 8.42,
    severity: 'Critical',
    differentialDiagnoses: [
      'Decompensated Alcoholic Cirrhosis with Portal Hypertension & Grade II Hepatic Encephalopathy',
      'Acute-on-Chronic Liver Failure (ACLF)',
      'Subdural hematoma secondary to mechanical fall'
    ],
    definitiveDiagnosis: 'Decompensated Alcoholic Cirrhosis (Child-Pugh Class C, Score 11; MELD-Na 22) with Grade II Hepatic Encephalopathy and Portal Hypertension Ascites.',
    clinicalManagement: [
      'Lactulose syrup 30 mL orally q6h, titrated to achieve 2 to 3 soft bowel movements per day.',
      'Rifaximin 550 mg orally twice daily as adjuvant neurotoxin reduction.',
      'Diagnostic paracentesis performed: Ascitic PMN count 120 cells/mm³ (rules out spontaneous bacterial peritonitis); SAAG 1.7 g/dL confirms portal hypertension.',
      'Initiation of Spironolactone 100 mg + Furosemide 40 mg daily once encephalopathy and acute kidney injury are stabilized.',
      'Thiamine 100 mg IV daily and strict alcohol cessation counseling.'
    ],
    clinicalPearls: [
      'De Ritis ratio AST/ALT of 2.45 is classic for alcoholic liver disease due to mitochondrial injury and vitamin B6 deficiency reducing ALT synthesis.',
      'Serum Albumin is severely depressed (2.3 g/dL) while total protein is 5.8 g/dL, resulting in an inverted A/G ratio (0.66) characteristic of advanced synthetic failure.',
      'Thrombocytopenia (78,000/µL) reflects hypersplenism secondary to portal venous congestion and diminished hepatic thrombopoietin production.'
    ],
    quiz: {
      question: 'Which of the following interventions is the absolute FIRST-LINE medical step for this patient’s confusion and flapping tremor?',
      options: [
        'Immediate bolus of IV mannitol 20%',
        'Oral/nasogastric lactulose titrated to 2-3 soft stools/day',
        'High-dose sedation with midazolam for nocturnal agitation',
        'Immediate emergency TIPS (Transjugular Intrahepatic Portosystemic Shunt)'
      ],
      correctIndex: 1,
      explanation: 'Lactulose is non-absorbable disaccharide that acidifies colonic contents (converting NH3 to non-absorbable NH4+) and promotes peristalsis. Sedatives like midazolam are strictly contraindicated in hepatic encephalopathy as they exacerbate coma.'
    }
  },
  {
    id: 'hosp-case-2',
    patientRef: 'CMC-HEP-2026-114',
    hospitalName: 'Christian Medical College (CMC)',
    department: 'Department of Hepatobiliary Sciences',
    location: 'Vellore, Tamil Nadu, India',
    admissionDate: '2026-03-04',
    age: 38,
    gender: 'Female',
    occupation: 'High School Teacher',
    chiefComplaint: 'Profound fatigue, generalized pruritus, and dark brown urine for 10 days.',
    historyOfPresentIllness: 'A 38-year-old female with pulmonary tuberculosis diagnosed 5 weeks ago was started on daily fixed-dose combination ATT (Isoniazid, Rifampicin, Pyrazinamide, Ethambutol). She noted anorexia and nausea starting in week 3, followed by yellowing of the eyes and intractable pruritus.',
    pastMedicalHistory: ['Pulmonary TB on Category 1 ATT (Day 35)', 'No history of alcohol, herbal decoctions, or acetaminophen overdose'],
    vitals: {
      bp: '116/72 mmHg',
      hr: 76,
      rr: 16,
      temp: '98.4 °F',
      spo2: 99
    },
    physicalExamination: [
      'Deep icteric discoloration of sclera and sublingual mucosa.',
      'Excoriation scratch marks over both upper and lower extremities.',
      'Abdomen: Soft, non-distended; tender hepatomegaly 2 cm below right costal margin with span of 14 cm. Spleen not palpable.',
      'Neurological: Alert, oriented x 3; no asterixis or signs of encephalopathy.'
    ],
    labs: {
      totalBilirubin: 11.2,
      directBilirubin: 8.1,
      sgptAlt: 740,
      sgotAst: 620,
      alkalinePhosphatase: 285,
      totalProtein: 6.9,
      albumin: 3.8,
      agRatio: 1.23,
      platelets: 240,
      inr: 1.18,
      creatinine: 0.82,
      sodium: 139
    },
    ultrasoundImaging: 'Hepatomegaly with preserved smooth liver contours. Normal parenchymal echogenicity. Gallbladder normal without cholelithiasis or wall thickening. Common bile duct 4.2 mm without ductal dilatation.',
    biopsyHistology: 'Not indicated given clear temporal drug-injury relationship. Serological viral hepatitis panel (Anti-HAV IgM, HBsAg, Anti-HCV, Anti-HEV IgM) all non-reactive.',
    deRitisRatio: 0.84,
    fib4Score: 1.62,
    severity: 'Severe',
    differentialDiagnoses: [
      'Drug-Induced Liver Injury (DILI) secondary to Anti-Tubercular Therapy (Pyrazinamide / Isoniazid)',
      'Acute Viral Hepatitis E or B flare',
      'Autoimmune Hepatitis (AIH)'
    ],
    definitiveDiagnosis: 'Acute Idiosyncratic Drug-Induced Liver Injury (DILI) secondary to Anti-Tubercular Therapy (R-value = 8.4: marked hepatocellular pattern).',
    clinicalManagement: [
      'IMMEDIATE discontinuation of all hepatotoxic anti-tubercular agents (Isoniazid, Rifampicin, Pyrazinamide).',
      'Temporary continuation of non-hepatotoxic background regimen: Ethambutol + Levofloxacin + Streptomycin/Amikacin.',
      'Daily monitoring of LFTs, INR, and encephalopathy screening in step-down ward.',
      'N-Acetylcysteine (NAC) IV protocol initiated for non-acetaminophen drug-induced liver injury.',
      'Re-challenge protocol planned only after total bilirubin drops < 2.0 mg/dL and transaminases < 2x ULN.'
    ],
    clinicalPearls: [
      'In contrast to chronic cirrhosis, the serum albumin (3.8 g/dL) is entirely normal because the biological half-life of albumin is ~20 days, and this is an acute hepatocellular necrosis event.',
      'The R-value: (ALT / 56) / (ALP / 147) = (740/56) / (285/147) = 13.2 / 1.94 = 6.8 (>5 defines classic Hepatocellular injury).',
      'Pyrazinamide is the most hepatotoxic agent per gram among first-line ATT, followed by Isoniazid and Rifampicin.'
    ],
    quiz: {
      question: 'What is the immediate and most critical therapeutic action when an ATT patient develops ALT > 5x Upper Limit of Normal with jaundice?',
      options: [
        'Add oral Ursodeoxycholic acid (UDCA) and continue all TB drugs',
        'Immediately discontinue all hepatotoxic anti-tubercular medications',
        'Perform an urgent surgical cholecystectomy',
        'Administer high-dose intravenous corticosteroid pulse therapy'
      ],
      correctIndex: 1,
      explanation: 'Under WHO and national TB guidelines, whenever transaminases exceed 5x ULN (or 3x ULN with symptoms/jaundice), all potentially hepatotoxic drugs (Isoniazid, Rifampicin, Pyrazinamide) must be stopped immediately to avoid catastrophic fulminant hepatic failure.'
    }
  },
  {
    id: 'hosp-case-3',
    patientRef: 'APOLLO-HEP-2026-302',
    hospitalName: 'Apollo Hospitals Health City',
    department: 'Center for Liver Disease & Transplantation',
    location: 'Hyderabad, Telangana, India',
    admissionDate: '2026-02-18',
    age: 48,
    gender: 'Male',
    occupation: 'Software Enterprise Director',
    chiefComplaint: 'Incidental finding of elevated transaminases during executive health screening; mild chronic fatigue.',
    historyOfPresentIllness: 'A 48-year-old male was referred following an annual corporate checkup that revealed ALT 94 U/L and AST 68 U/L. Patient reports no abdominal pain, jaundice, or fever. He works 12-hour desk shifts, consumes high-fructose beverages, and exercises rarely.',
    pastMedicalHistory: ['Dyslipidemia (Hypertriglyceridemia)', 'Pre-diabetes (HbA1c 6.3%)', 'BMI 31.4 kg/m² (Obesity Class I)'],
    vitals: {
      bp: '136/88 mmHg',
      hr: 74,
      rr: 14,
      temp: '98.6 °F',
      spo2: 99
    },
    physicalExamination: [
      'Acanthosis nigricans observed on posterior neck and axillary folds, indicating insulin resistance.',
      'No peripheral stigmata of chronic liver disease (no spider angiomas, palmar erythema, or gynecomastia).',
      'Abdominal exam: Increased central adiposity (waist circumference 104 cm); smooth, non-tender liver edge palpable 1.5 cm below costal margin. No splenomegaly or ascites.'
    ],
    labs: {
      totalBilirubin: 0.9,
      directBilirubin: 0.25,
      sgptAlt: 94,
      sgotAst: 68,
      alkalinePhosphatase: 112,
      totalProtein: 7.2,
      albumin: 4.4,
      agRatio: 1.57,
      platelets: 182,
      inr: 0.98,
      creatinine: 0.91,
      sodium: 141
    },
    ultrasoundImaging: 'Diffuse increase in hepatic echogenicity with posterior beam attenuation and loss of intrahepatic vessel wall clarity (Grade II Hepatic Steatosis). Normal gallbladder and biliary tree.',
    biopsyHistology: 'Vibration-Controlled Transient Elastography (FibroScan) performed: Liver Stiffness Measurement (LSM) = 11.2 kPa (indicative of F3 Advanced Bridging Fibrosis); Controlled Attenuation Parameter (CAP) = 342 dB/m (indicative of S3 Severe Steatosis).',
    deRitisRatio: 0.72,
    fib4Score: 2.89,
    severity: 'Moderate',
    differentialDiagnoses: [
      'Metabolic Dysfunction-Associated Steatohepatitis (MASH) with Advanced Fibrosis (Stage F3)',
      'Early Wilson Disease',
      'Chronic Hepatitis B (e-antigen negative)'
    ],
    definitiveDiagnosis: 'Metabolic Dysfunction-Associated Steatohepatitis (MASH / MASLD) with Stage F3 Advanced Bridging Fibrosis and High-Risk FIB-4 score (2.89).',
    clinicalManagement: [
      'Structured lifestyle intervention targeting 10% total body weight reduction over 6 to 9 months.',
      'Prescription of Mediterranean diet (elimination of ultra-processed carbohydrates and high-fructose corn syrup).',
      'Initiation of GLP-1 receptor agonist (Semaglutide 0.5 mg SC weekly) for glycemic control and weight management.',
      'Evaluation for recently approved liver-targeted THR-β agonist (Resmetirom) therapy.',
      'Upper GI endoscopy surveillance screening for esophageal varices given LSM > 10 kPa.'
    ],
    clinicalPearls: [
      'FIB-4 score = (Age 48 × AST 68) / (Platelets 182 × √ALT 9.69) = 3264 / 1763 = 1.85 to 2.89, placing patient firmly in high-risk category for advanced fibrosis.',
      'Steatohepatitis is clinically silent in >80% of individuals until sudden decompensation; screening diabetic and obese patients via FIB-4 is mandatory under AASLD 2024 guidance.',
      'Mild transaminitis (ALT < 100 U/L) is deceptive—severe histologic bridging fibrosis can progress silently despite modest laboratory deviations.'
    ],
    quiz: {
      question: 'What percentage of total body weight loss is clinically shown to induce histological resolution of steatohepatitis and potential fibrosis regression in MASH?',
      options: [
        'At least 1-2%',
        'At least 3-4%',
        'At least 7-10%',
        'Weight loss has no effect on liver histology'
      ],
      correctIndex: 2,
      explanation: 'Extensive randomized trials (such as Vilar-Gomez et al., Gastroenterology) demonstrate that weight loss of ≥ 7% leads to MASH resolution in >65% of patients, and weight loss of ≥ 10% achieves fibrosis regression in >45% of cases.'
    }
  },
  {
    id: 'hosp-case-4',
    patientRef: 'JHM-HEP-2026-990',
    hospitalName: 'Johns Hopkins Medicine',
    department: 'Division of Gastroenterology & Hepatology',
    location: 'Baltimore, MD, USA',
    admissionDate: '2026-01-29',
    age: 29,
    gender: 'Female',
    occupation: 'Postdoctoral Fellow',
    chiefComplaint: 'Severe lethargy, symmetric wrist and finger joint pains, and amenorrhea for 4 months.',
    historyOfPresentIllness: 'A 29-year-old previously healthy woman presented with progressive crippling fatigue. She noticed symmetrical polyarthralgia affecting MCP and PIP joints without morning stiffness > 30 minutes. Denies alcohol, illicit drug use, herbal supplements, or travel abroad.',
    pastMedicalHistory: ['Hashimoto Thyroiditis (on Levothyroxine 75 mcg daily)', 'Family history of celiac disease in sibling'],
    vitals: {
      bp: '110/70 mmHg',
      hr: 72,
      rr: 15,
      temp: '98.2 °F',
      spo2: 100
    },
    physicalExamination: [
      'Mild subicteric sclerae.',
      'No synovitis or joint deformities on musculoskeletal examination.',
      'Abdomen: Liver palpable 1 cm below costal margin, smooth and non-tender. Spleen tip palpable on deep inspiration.',
      'No ascites, asterixis, or spider angiomas.'
    ],
    labs: {
      totalBilirubin: 2.8,
      directBilirubin: 1.9,
      sgptAlt: 460,
      sgotAst: 510,
      alkalinePhosphatase: 165,
      totalProtein: 8.6,
      albumin: 3.5,
      agRatio: 0.68,
      platelets: 165,
      inr: 1.22,
      creatinine: 0.75,
      sodium: 140
    },
    ultrasoundImaging: 'Homogeneous hepatic parenchyma without focal mass lesions. Mild splenomegaly (13.6 cm). Normal gallbladder and patent portal venous system.',
    biopsyHistology: 'Transjugular Liver Biopsy: Prominent lymphoplasmacytic interface hepatitis (piecemeal necrosis) with rosette formation of hepatocytes and moderate periportal fibrosis (Ishak score 3/6).',
    deRitisRatio: 1.11,
    fib4Score: 2.45,
    severity: 'Moderate',
    differentialDiagnoses: [
      'Autoimmune Hepatitis (AIH Type 1)',
      'Systemic Lupus Erythematosus (SLE) with hepatic involvement',
      'Wilson Disease'
    ],
    definitiveDiagnosis: 'Definite Autoimmune Hepatitis (Type 1) with Revised IAIHG Score 17 (Pre-treatment). High serum IgG (23.4 g/L), ANA 1:320 (homogeneous), and Anti-Smooth Muscle Antibody (ASMA) positive at 1:160.',
    clinicalManagement: [
      'Initiation of Prednisone 30 mg daily with planned weekly taper.',
      'Addition of Azathioprine 50 mg daily following confirmation of normal Thiopurine Methyltransferase (TPMT) enzymatic activity.',
      'Calcium 1000 mg + Vitamin D3 2000 IU daily for glucocorticoid bone protection.',
      'Bi-weekly monitoring of liver transaminases and serum IgG until complete biochemical remission is attained.'
    ],
    clinicalPearls: [
      'Notice the markedly elevated Total Protein (8.6 g/dL) with normal Albumin (3.5 g/dL) yielding an inverted A/G ratio (0.68). This is due to massive hypergammaglobulinemia (polyclonal IgG production by infiltrating plasma cells).',
      'The presence of other autoimmune endocrinopathies (Hashimoto thyroiditis) is a major diagnostic clue favoring Autoimmune Hepatitis.',
      'Biochemical remission in AIH requires complete normalization of both transaminases AND serum IgG.'
    ],
    quiz: {
      question: 'Which test MUST be verified prior to initiating Azathioprine therapy in Autoimmune Hepatitis to avoid life-threatening myelosuppression?',
      options: [
        'Serum Ceruloplasmin levels',
        'Thiopurine S-methyltransferase (TPMT) activity or genotype',
        'Serum alpha-fetoprotein (AFP)',
        'HLA-B27 typing'
      ],
      correctIndex: 1,
      explanation: 'TPMT metabolizes 6-mercaptopurine into inactive metabolites. Patients with congenital TPMT deficiency accumulate toxic 6-thioguanine nucleotides, causing catastrophic bone marrow suppression and aplastic pancytopenia if azathioprine is administered.'
    }
  }
];

const HOSPITAL_CASES_STORAGE_KEY = 'dhp_hospital_cases_v2';
const SOLVED_CASES_STORAGE_KEY = 'dhp_solved_cases_records_v1';

export function getStoredHospitalCases(): HospitalPatientCase[] {
  try {
    const raw = localStorage.getItem(HOSPITAL_CASES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading hospital cases:', e);
  }
  return SEED_HOSPITAL_CASES;
}

export function saveStoredHospitalCases(cases: HospitalPatientCase[]): void {
  try {
    localStorage.setItem(HOSPITAL_CASES_STORAGE_KEY, JSON.stringify(cases));
  } catch (e) {
    console.error('Error saving hospital cases:', e);
  }
}

export function getSolvedHospitalCaseIds(): string[] {
  try {
    const raw = localStorage.getItem(SOLVED_CASES_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading solved cases:', e);
  }
  return ['hosp-case-1'];
}

export function markHospitalCaseSolvedInStorage(caseId: string): string[] {
  const current = getSolvedHospitalCaseIds();
  if (!current.includes(caseId)) {
    const updated = [...current, caseId];
    try {
      localStorage.setItem(SOLVED_CASES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving solved case:', e);
    }
    return updated;
  }
  return current;
}
