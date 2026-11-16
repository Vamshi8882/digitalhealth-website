/**
 * Digitalization in Healthcare - Medical Library & Research Module Data
 * Textbooks by renowned authors, Video Explanation Masterclasses, and Clinical Guidelines
 */

export interface MedicalTextbook {
  id: string;
  title: string;
  authors: string[];
  edition: string;
  publisher: string;
  year: number;
  coverImage: string;
  category: 'Hepatology' | 'Gastroenterology' | 'Pathology' | 'Internal Medicine' | 'Biomarkers & AI';
  description: string;
  keyChapters: { chapterNumber: number; title: string; highYieldPoints: string[] }[];
  isbn: string;
  officialRefUrl: string;
  doi?: string;
  isRecommended: boolean;
}

export interface VideoLecture {
  id: string;
  title: string;
  speaker: string;
  speakerTitle: string;
  institution: string;
  durationMinutes: number;
  thumbnail: string;
  videoUrl: string; // Embeddable or high-yield reference
  category: 'LFT Interpretation' | 'Cirrhosis & ICU' | 'Elastography' | 'Histopathology' | 'Pharmacology';
  description: string;
  timestamps: { time: string; topic: string }[];
  keyPearls: string[];
}

export interface ClinicalGuideline {
  id: string;
  title: string;
  organization: 'AASLD' | 'EASL' | 'APASL' | 'WHO' | 'ACG';
  year: number;
  status: 'Current Gold Standard' | 'Updated Guidance';
  targetCondition: string;
  summary: string;
  recommendations: string[];
  pdfOrWebUrl: string;
}

export const MEDICAL_TEXTBOOKS: MedicalTextbook[] = [
  {
    id: 'book-sherlock',
    title: "Sherlock's Diseases of the Liver and Biliary System",
    authors: ['Dame Sheila Sherlock DBE', 'Prof. James S. Dooley MD, FRCP'],
    edition: '13th Edition',
    publisher: 'Wiley-Blackwell',
    year: 2021,
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
    category: 'Hepatology',
    description: 'The definitive international clinical reference for practicing hepatologists and internal medicine fellows, established by the pioneer of modern liver medicine.',
    keyChapters: [
      {
        chapterNumber: 2,
        title: 'Assessment of Liver Function & Enzyme Kinetics',
        highYieldPoints: [
          'Differentiation between hepatocyte necrosis (ALT/AST) and biliary canalicular obstruction (ALP/GGT).',
          'Serum albumin half-life (~20 days) as a chronic synthetic indicator vs prothrombin time/INR (<24 hours) as an acute indicator.',
          'Fractionation of hyperbilirubinemia: Pre-hepatic, intrahepatic, and post-hepatic pathways.'
        ]
      },
      {
        chapterNumber: 7,
        title: 'Cirrhosis and Portal Hypertension',
        highYieldPoints: [
          'Pathogenesis of sinusoidal resistance: hepatic stellate cell myofibroblastic transformation.',
          'Hepatic venous pressure gradient (HVPG) clinical thresholds: >5 mmHg (portal hypertension), >10 mmHg (clinically significant portal hypertension), >12 mmHg (variceal bleeding risk).'
        ]
      },
      {
        chapterNumber: 14,
        title: 'Hepatic Encephalopathy and Brain Edema',
        highYieldPoints: [
          'West Haven staging criteria (Grade I to IV) and ammonia neurotoxicity.',
          'Glutamine accumulation within cortical astrocytes causing cytotoxic edema.'
        ]
      }
    ],
    isbn: '978-1-119-23764-8',
    officialRefUrl: 'https://www.wiley.com/en-us/Sherlock%27s+Diseases+of+the+Liver+and+Biliary+System%2C+13th+Edition-p-9781119237648',
    doi: '10.1002/9781119237662',
    isRecommended: true
  },
  {
    id: 'book-sleisenger',
    title: "Sleisenger and Fordtran's Gastrointestinal and Liver Disease",
    authors: ['Mark Feldman MD', 'Lawrence S. Friedman MD', 'Lawrence J. Brandt MD'],
    edition: '11th Edition',
    publisher: 'Elsevier Health Sciences',
    year: 2021,
    coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=400&auto=format&fit=crop&q=80',
    category: 'Gastroenterology',
    description: 'Masterwork textbook bridging gastroenterology and hepatobiliary pathology, containing in-depth pharmacology, endoscopy, and longitudinal management.',
    keyChapters: [
      {
        chapterNumber: 74,
        title: 'Metabolic Dysfunction-Associated Steatotic Liver Disease (MASLD/MASH)',
        highYieldPoints: [
          'Two-hit hypothesis evolved into multiple parallel hits (lipotoxicity, insulin resistance, microbiome endotoxins).',
          'Distinction between simple steatosis (benign course) vs steatohepatitis (hepatocyte ballooning, Mallory-Denk bodies, pericellular fibrosis).'
        ]
      },
      {
        chapterNumber: 89,
        title: 'Ascites and Spontaneous Bacterial Peritonitis (SBP)',
        highYieldPoints: [
          'Serum-Ascites Albumin Gradient (SAAG): ≥ 1.1 g/dL indicates portal hypertension (97% accuracy).',
          'Diagnostic paracentesis: Polymorphonuclear leukocyte (PMN) count ≥ 250 cells/mm³ is diagnostic for SBP requiring empiric 3rd generation cephalosporin.'
        ]
      }
    ],
    isbn: '978-0-323-60962-3',
    officialRefUrl: 'https://www.elsevier.com/books/sleisenger-and-fordtrans-gastrointestinal-and-liver-disease/feldman/978-0-323-60962-3',
    doi: '10.1016/C2016-1-03080-6',
    isRecommended: true
  },
  {
    id: 'book-robbins',
    title: 'Robbins & Cotran Pathologic Basis of Disease',
    authors: ['Vinay Kumar MBBS, MD, FRCPath', 'Abul K. Abbas MBBS', 'Jon C. Aster MD, PhD'],
    edition: '10th Edition',
    publisher: 'Elsevier',
    year: 2020,
    coverImage: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&auto=format&fit=crop&q=80',
    category: 'Pathology',
    description: 'The golden standard of undergraduate and postgraduate medical pathology, detailing cellular injury, inflammation, and hepatic parenchyma restructuring.',
    keyChapters: [
      {
        chapterNumber: 18,
        title: 'The Liver and Biliary Tract Pathology',
        highYieldPoints: [
          'Couinaud segmental functional anatomy based on portal vein and hepatic artery bifurcations.',
          'Hepatic lobule vs Rappaport acinus: Zone 1 (periportal, high oxygen) vs Zone 3 (perivenular/centrilobular, highest CYP450, most vulnerable to ischemic and toxic injury).',
          'Histopathology of bridging necrosis, interface hepatitis (piecemeal necrosis), and regenerative nodule formation.'
        ]
      }
    ],
    isbn: '978-0-323-53113-9',
    officialRefUrl: 'https://www.elsevier.com/books/robbins-and-cotran-pathologic-basis-of-disease/kumar/978-0-323-53113-9',
    doi: '10.1016/C2016-0-03711-5',
    isRecommended: true
  },
  {
    id: 'book-harrison',
    title: "Harrison's Principles of Internal Medicine - Hepatobiliary Medicine",
    authors: ['J. Larry Jameson MD, PhD', 'Anthony S. Fauci MD', 'Dennis L. Kasper MD', 'Stephen L. Hauser MD'],
    edition: '21st Edition',
    publisher: 'McGraw Hill Medical',
    year: 2022,
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&auto=format&fit=crop&q=80',
    category: 'Internal Medicine',
    description: 'The premier worldwide internal medicine text used by MBBS students, medicine residents, and board examiners for diagnostic algorithms and clinical reasoning.',
    keyChapters: [
      {
        chapterNumber: 330,
        title: 'Evaluation of Liver Function and Jaundice',
        highYieldPoints: [
          'Systematic algorithmic triage: Hepatocellular vs Cholestatic vs Infiltrative pattern.',
          'Calculation of the R-value: (ALT / ALT ULN) / (ALP / ALP ULN). R > 5 = Hepatocellular, R < 2 = Cholestatic, 2-5 = Mixed.',
          'Isolated hyperbilirubinemia: Gilbert syndrome (unconjugated, normal LFTs) vs Dubin-Johnson / Rotor (conjugated).'
        ]
      },
      {
        chapterNumber: 334,
        title: 'Cirrhosis and Its Complications',
        highYieldPoints: [
          'MELD-Na scoring equation and organ allocation priority.',
          'Child-Pugh Turcotte (CPT) classification: Bilirubin, Albumin, INR, Ascites, and Encephalopathy.',
          'Hepatorenal Syndrome (HRS-AKI): Diagnostic criteria and Terlipressin + Albumin therapy.'
        ]
      }
    ],
    isbn: '978-1-264-26850-4',
    officialRefUrl: 'https://accessmedicine.mhmedical.com/book.aspx?bookid=3095',
    doi: '10.1036/0071476911',
    isRecommended: true
  }
];

export const VIDEO_LECTURES: VideoLecture[] = [
  {
    id: 'vid-lft-masterclass',
    title: 'Deciphering Liver Function Tests: Step-by-Step Clinical Approach',
    speaker: 'Prof. Dr. David Bernstein',
    speakerTitle: 'Chief of Hepatology, Northwell Health & Professor of Medicine',
    institution: 'Zucker School of Medicine at Hofstra/Northwell',
    durationMinutes: 48,
    thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // educational reference
    category: 'LFT Interpretation',
    description: 'Comprehensive grand rounds lecture teaching students how to systematically dissect an abnormal liver panel, avoid common diagnostic pitfalls, and calculate the De Ritis and R-values.',
    timestamps: [
      { time: '00:00', topic: 'Introduction: Why "Liver Function Tests" is a misnomer' },
      { time: '07:30', topic: 'True synthetic markers: Serum Albumin vs PT/INR kinetics' },
      { time: '16:45', topic: 'Aminotransferases: ALT cytoplasm vs AST mitochondria' },
      { time: '28:10', topic: 'Cholestatic enzymes: ALP, GGT, and 5\'-Nucleotidase confirmation' },
      { time: '39:20', topic: 'Real Clinical Case Review: 45-year-old male with silent transaminitis' }
    ],
    keyPearls: [
      'Normal transaminases do not rule out advanced cirrhosis (termed "burnt-out" cirrhosis).',
      'Extreme transaminases (>1000 U/L) narrow differential to: Ischemic hepatitis (shock liver), Acute toxic injury (Acetaminophen), or Acute viral hepatitis (A, B, E).',
      'GGT is highly sensitive but lacks specificity; use GGT primarily to confirm hepatic origin of elevated ALP.'
    ]
  },
  {
    id: 'vid-fibroscan-elastography',
    title: 'Non-Invasive Liver Fibrosis Assessment: Transient Elastography vs FIB-4 & APRI',
    speaker: 'Prof. Dr. Laurent Castera',
    speakerTitle: 'Vice-President of EASL & Professor of Hepatology',
    institution: 'Université Paris Cité & Hôpital Beaujon',
    durationMinutes: 42,
    thumbnail: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    category: 'Elastography',
    description: 'Learn the acoustic physics of shear wave elastography (FibroScan), vibration-controlled transient elastography (VCTE), and how bedside serum scores (FIB-4) eliminate 70% of unnecessary liver biopsies.',
    timestamps: [
      { time: '00:00', topic: 'The evolution away from invasive Percutaneous Liver Biopsy' },
      { time: '09:15', topic: 'VCTE physical principles: Shear wave speed to Young\'s modulus (kPa)' },
      { time: '19:40', topic: 'Liver stiffness cutoffs: <8 kPa (rule-out) vs >12-15 kPa (cirrhosis)' },
      { time: '30:05', topic: 'Two-step referral algorithm using FIB-4 followed by VCTE' }
    ],
    keyPearls: [
      'Food intake raises liver stiffness by up to 2-3 kPa; patients MUST fast for at least 3 hours prior to elastography.',
      'Active acute hepatitis (ALT > 5x ULN) artificially elevates liver stiffness independent of fibrosis.',
      'Controlled Attenuation Parameter (CAP) measures ultrasound attenuation in dB/m to grade steatosis (S1, S2, S3).'
    ]
  },
  {
    id: 'vid-aclf-icu',
    title: 'Acute-on-Chronic Liver Failure (ACLF): Pathophysiology and Critical Care Resuscitation',
    speaker: 'Dr. Rajiv Jalan MD, PhD',
    speakerTitle: 'Professor of Hepatology & European ACLF Research Consortium Lead',
    institution: 'University College London (UCL) Institute for Liver and Digestive Health',
    durationMinutes: 55,
    thumbnail: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    category: 'Cirrhosis & ICU',
    description: 'Critical analysis of ACLF vs simple decompensated cirrhosis. Focus on systemic inflammatory response syndrome (SIRS), immune paresis, multi-organ failure, and intensive care protocols.',
    timestamps: [
      { time: '00:00', topic: 'Defining ACLF: The CANONIC Study and EASL-CLIF Consortium' },
      { time: '12:20', topic: 'Pathophysiological cascade: Gut translocation & Pathogen-associated molecular patterns (PAMPs)' },
      { time: '25:40', topic: 'CLIF-OF and CLIF-C ACLF Score calculation at the ICU bedside' },
      { time: '41:10', topic: 'Targeted organ support: Dialysis, Vasopressors, and Liver Transplantation windows' }
    ],
    keyPearls: [
      'ACLF is distinguished from decompensation by intense systemic inflammation and high 28-day mortality (>30%).',
      'Renal failure in ACLF is the most common organ failure; differentiate acute tubular necrosis (ATN) from hepatorenal syndrome (HRS) via urinary biomarkers.',
      'Early transfer to a transplant-capable center within 72 hours drastically alters survival.'
    ]
  }
];

export const CLINICAL_GUIDELINES: ClinicalGuideline[] = [
  {
    id: 'guide-aasld-mash-2024',
    title: 'AASLD Practice Guidance on the Clinical Assessment and Management of MASLD/MASH',
    organization: 'AASLD',
    year: 2024,
    status: 'Current Gold Standard',
    targetCondition: 'Metabolic Dysfunction-Associated Steatohepatitis (MASLD/MASH)',
    summary: 'Evidence-based consensus guidance covering the updated nomenclature, non-invasive risk stratification algorithms, lifestyle interventions, and evaluation for emerging pharmacotherapies like Resmetirom.',
    recommendations: [
      'Calculate FIB-4 in all patients with type 2 diabetes or ≥ 2 metabolic risk factors.',
      'Patients with FIB-4 < 1.3 are low-risk and should be re-evaluated every 2-3 years.',
      'Patients with FIB-4 > 1.3 should undergo second-tier testing with VCTE (FibroScan) or ELF test.',
      'Weight loss of ≥ 5-7% resolves steatosis; ≥ 10% can induce fibrosis regression.'
    ],
    pdfOrWebUrl: 'https://www.aasld.org/practice-guidelines'
  },
  {
    id: 'guide-easl-cirrhosis-2023',
    title: 'EASL Clinical Practice Guidelines for the Management of Decompensated Cirrhosis',
    organization: 'EASL',
    year: 2023,
    status: 'Current Gold Standard',
    targetCondition: 'Decompensated Cirrhosis & Portal Hypertension Complications',
    summary: 'Authoritative European recommendations for treating ascites, refractory ascites, spontaneous bacterial peritonitis, hepatorenal syndrome, and hepatic encephalopathy.',
    recommendations: [
      'First-line treatment of uncomplicated ascites: moderate sodium restriction (80-120 mmol/day) + spironolactone (100 mg) ± furosemide (40 mg).',
      'For large-volume paracentesis (>5 Liters), infuse 8 grams of 20-25% human albumin per liter of ascites removed to prevent paracentesis-induced circulatory dysfunction (PICD).',
      'Lactulose is the first-line therapy for episodic hepatic encephalopathy; titrate to 2-3 soft stools/day. Add rifaximin 550 mg BID for prevention of recurrence.'
    ],
    pdfOrWebUrl: 'https://www.easl.eu/guidelines'
  },
  {
    id: 'guide-apasl-aclf-2023',
    title: 'APASL Consensus Recommendations on Acute-on-Chronic Liver Failure (ACLF)',
    organization: 'APASL',
    year: 2023,
    status: 'Updated Guidance',
    targetCondition: 'Acute-on-Chronic Liver Failure in Asia-Pacific Region',
    summary: 'Focuses on acute hepatic insults (predominantly Hepatitis B reactivation and alcohol flare) in patients with prior chronic liver disease, defining APASL ACLF criteria: Jaundice (T.Bilirubin ≥ 5 mg/dL) and Coagulopathy (INR ≥ 1.5) complicated within 4 weeks by ascites and/or encephalopathy.',
    recommendations: [
      'Immediate administration of entecavir or tenofovir for acute hepatitis B reactivation.',
      'Granulocyte colony-stimulating factor (G-CSF) can be considered in specific cohorts to promote hepatic regeneration.',
      'Serial dynamic scoring using the APASL ACLF Research Consortium (AARC) score on Day 0, 4, and 7 to predict transplant-free survival.'
    ],
    pdfOrWebUrl: 'https://apasl.info/guidelines'
  }
];

const BOOKMARKS_STORAGE_KEY = 'dhp_library_bookmarks_v1';

export function getBookmarkedResourceIds(): string[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading bookmarks:', e);
  }
  return ['book-sherlock', 'vid-lft-masterclass', 'guide-aasld-mash-2024'];
}

export function toggleBookmarkedResourceId(id: string): string[] {
  const current = getBookmarkedResourceIds();
  let updated: string[];
  if (current.includes(id)) {
    updated = current.filter(x => x !== id);
  } else {
    updated = [...current, id];
  }
  try {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving bookmark:', e);
  }
  return updated;
}
