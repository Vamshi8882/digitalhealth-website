/**
 * Digitalization in Healthcare - Medical Blogs & Intellectual Discussion Data
 * Forum & Clinical Knowledge Exchange between Medical Students, Faculty, and Specialists
 */

export interface BlogComment {
  id: string;
  authorName: string;
  authorRole: string;
  authorType: 'student' | 'faculty';
  authorInstitution: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  upvotes: number;
  isFacultyEndorsed?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  category: 'Clinical Doubts & Questions' | 'Case Discussions' | 'Hepatology Research' | 'Faculty Insights' | 'Medical Education';
  authorName: string;
  authorRole: string;
  authorType: 'student' | 'faculty';
  authorInstitution: string;
  authorAvatar: string;
  summary: string;
  content: string;
  tags: string[];
  createdAt: string;
  readTime: string;
  upvotes: number;
  views: number;
  isCertified: boolean; // Medical Board / Senior Faculty Certified
  isFeatured?: boolean;
  comments: BlogComment[];
}

export const SEED_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'De Ritis Ratio Inversion: When AST exceeds ALT and Why it Signals Advanced Fibrosis',
    category: 'Faculty Insights',
    authorName: 'Prof. Dr. Ananya Sharma',
    authorRole: 'Consultant Gastroenterologist & Professor',
    authorType: 'faculty',
    authorInstitution: 'Christian Medical College (CMC) Vellore',
    authorAvatar: 'https://images.unsplash.com/photo-1594824813583-0546cbba17f0?w=240&auto=format&fit=crop&q=80',
    summary: 'A physiological breakdown of why aspartate aminotransferase clearance decelerates in sinusoidal capillarization and why AST:ALT > 2.0 indicates alcoholic hepatitis or established cirrhosis.',
    content: `In clinical hepatology, one of the most frequently misunderstood laboratory findings is the AST/ALT ratio, famously described by Fernando De Ritis in 1957.

### Why AST / ALT > 1.0 Matters
In acute viral hepatitis or uncomplicated metabolic-associated steatohepatitis (MASH), ALT is typically equal to or higher than AST because ALT is concentrated primarily in the hepatocyte cytoplasm. However, AST is divided between the cytoplasm (20%) and mitochondria (80%).

When hepatic architecture undergoes progressive fibrogenesis and sinusoidal capillarization:
1. **Mitochondrial Injury**: Chronic oxidative stress or alcohol-mediated toxicity preferentially damages the inner mitochondrial membrane, liberating mitochondrial AST (mAST).
2. **Decreased Sinusoidal Clearance**: Sinusoidal endothelial cells normally extract AST from circulation via scavenger receptor mechanisms. With sinusoidal capillarization and endothelial loss, circulating AST clearance decelerates dramatically.
3. **Pyridoxal-5'-Phosphate Depletion**: In alcoholic liver disease, nutritional vitamin B6 deficiency diminishes ALT synthesis more aggressively than AST synthesis.

### Clinical Pearls for Medical Students:
- **AST:ALT > 2.0**: Strong clinical indicator of Alcoholic Hepatitis (present in >70% of biopsy-proven cases).
- **AST:ALT > 1.0 with Thrombocytopenia**: In chronic viral hepatitis B/C or NAFLD, an inverted ratio accompanied by a platelet count < 150,000/µL indicates a high probability of bridging fibrosis (F3) or cirrhosis (F4).
- Always calculate the FIB-4 index: \`(Age × AST) / (Platelet count × √ALT)\`. If FIB-4 > 2.67, immediate elastography or referral is warranted.`,
    tags: ['De Ritis Ratio', 'Biomarkers', 'Cirrhosis', 'Hepatology', 'Clinical Pearls'],
    createdAt: '2026-03-24T10:15:00Z',
    readTime: '5 min read',
    upvotes: 84,
    views: 1420,
    isCertified: true,
    isFeatured: true,
    comments: [
      {
        id: 'c-1',
        authorName: 'Dr. Vamshi Yadav',
        authorRole: 'Internal Medicine Resident',
        authorType: 'faculty',
        authorInstitution: 'AIIMS New Delhi',
        authorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=240&auto=format&fit=crop&q=80',
        content: 'Excellent clinical summary, Professor Sharma. In our triage unit at AIIMS, combining the De Ritis inversion with bedside ultrasound splenomegaly allows us to reliably distinguish acute viral flares from acute-on-chronic decompensation.',
        createdAt: '2026-03-24T11:45:00Z',
        upvotes: 19,
        isFacultyEndorsed: true
      },
      {
        id: 'c-2',
        authorName: 'Rohan Deshmukh',
        authorRole: 'Medical Student (MBBS)',
        authorType: 'student',
        authorInstitution: 'KEM Hospital Mumbai',
        authorAvatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=240&auto=format&fit=crop&q=80',
        content: 'Thank you maam! Could you clarify if non-hepatic causes like rhabdomyolysis or strenuous weightlifting can artificially elevate AST without altering liver prognosis?',
        createdAt: '2026-03-24T14:20:00Z',
        upvotes: 11
      }
    ]
  },
  {
    id: 'post-2',
    title: 'Clinical Doubt: Differentiating Drug-Induced Liver Injury (DILI) from Autoimmune Hepatitis (AIH)',
    category: 'Clinical Doubts & Questions',
    authorName: 'Dr. Priya Nambiar',
    authorRole: 'Medical Student (MBBS)',
    authorType: 'student',
    authorInstitution: 'Madras Medical College',
    authorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=240&auto=format&fit=crop&q=80',
    summary: 'A 42-year-old female presents with acute jaundice 3 weeks after starting amoxicillin-clavulanate. Her ANA is weakly positive (1:80). How do faculty members distinguish genuine AIH from DILI-induced autoimmune features?',
    content: `Dear Professors and Senior Residents,

We recently admitted a 42-year-old female presenting with deep jaundice, fatigue, and right upper quadrant discomfort. She was prescribed Amoxicillin-Clavulanate for acute sinusitis 3 weeks prior.

**Laboratory Workup:**
- Total Bilirubin: 9.8 mg/dL (Direct: 6.9 mg/dL)
- ALT: 410 U/L | AST: 345 U/L (R-value ~ 4.2: Mixed hepatocellular-cholestatic)
- Alkaline Phosphatase: 310 U/L
- ANA: Positive at 1:80 (speckled pattern)
- IgG: 18.5 g/L (mildly elevated)
- Anti-Smooth Muscle Antibody (ASMA): Negative

Our diagnostic dilemma: Is this classic **Drug-Induced Liver Injury (DILI)** with secondary immune activation, or could this be an unmasked **Autoimmune Hepatitis (AIH)**? What scoring system should we prioritize before considering steroid initiation?`,
    tags: ['DILI', 'Autoimmune Hepatitis', 'Drug Toxicity', 'Clinical Doubt', 'Case Discussion'],
    createdAt: '2026-03-26T08:00:00Z',
    readTime: '4 min read',
    upvotes: 56,
    views: 980,
    isCertified: false,
    isFeatured: false,
    comments: [
      {
        id: 'c-3',
        authorName: 'Prof. Dr. Ananya Sharma',
        authorRole: 'Consultant Gastroenterologist',
        authorType: 'faculty',
        authorInstitution: 'CMC Vellore',
        authorAvatar: 'https://images.unsplash.com/photo-1594824813583-0546cbba17f0?w=240&auto=format&fit=crop&q=80',
        content: 'Great clinical question, Dr. Priya. Amoxicillin-clavulanate is the #1 culprit for idiosyncratic DILI worldwide. Often, it incites drug-induced autoimmune-like hepatitis (DI-ALH). The critical distinction is that DILI resolves spontaneously over 8-12 weeks following drug discontinuation, whereas true AIH relapses when immunosuppression is tapered. Calculate the RUCAM (Roussel Uclaf Causality Assessment Method) score first. Hold steroids unless bilirubin exceeds 15 mg/dL or INR rises > 1.5.',
        createdAt: '2026-03-26T09:30:00Z',
        upvotes: 38,
        isFacultyEndorsed: true
      }
    ]
  },
  {
    id: 'post-3',
    title: 'Hospital Case Experience: Managing Acute Variceal Hemorrhage in Decompensated Cirrhosis',
    category: 'Case Discussions',
    authorName: 'Dr. Vamshi Yadav',
    authorRole: 'Internal Medicine Resident',
    authorType: 'faculty',
    authorInstitution: 'AIIMS New Delhi',
    authorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=240&auto=format&fit=crop&q=80',
    summary: 'A step-by-step review of the first 6 hours of resuscitation in upper gastrointestinal bleeding: restrictive transfusion triggers, vasoactive infusion timing, and prophylactic ceftriaxone.',
    content: `Acute variceal hemorrhage remains one of the most fatal medical emergencies in hepatology, with a 6-week mortality historically approaching 20%.

During our night shift at AIIMS Emergency Ward, a 54-year-old male with known NASH cirrhosis presented with 800 mL hematemesis and hypotension (BP 82/50 mmHg, HR 122 bpm).

### Emergency Protocol Implemented:
1. **Airway Protection & Two Large-Bore Cannulae (16G)**: High risk of aspiration during encephalopathy or active hematemesis.
2. **Restrictive Transfusion Strategy**: Target hemoglobin 7-8 g/dL! Over-transfusion increases portal venous pressure and causes re-bleeding (Villanueva et al., NEJM).
3. **Early Vasoactive Drug Initiation**: Terlipressin 2 mg IV bolus given immediately before endoscopy, followed by 1-2 mg q4h.
4. **Prophylactic Ceftriaxone 1g IV**: Reduces bacteremia, spontaneous bacterial peritonitis (SBP), and rebleeding rate.
5. **Endoscopic Band Ligation (EVL)** within 12 hours: Successfully banded 3 columns of bleeding grade-III esophageal varices.

The patient was stabilized without emergency TIPS intervention and discharged on carvedilol and lactulose after 5 days.`,
    tags: ['Variceal Bleeding', 'Cirrhosis', 'Emergency Hepatology', 'Resuscitation', 'AIIMS Cases'],
    createdAt: '2026-03-22T16:40:00Z',
    readTime: '6 min read',
    upvotes: 92,
    views: 1890,
    isCertified: true,
    isFeatured: true,
    comments: []
  },
  {
    id: 'post-4',
    title: 'Metabolic Dysfunction-Associated Steatohepatitis (MASH): Nomenclature Shift & Novel Therapeutics',
    category: 'Hepatology Research',
    authorName: 'Dr. Alok Verma',
    authorRole: 'Clinical Data Scientist & Researcher',
    authorType: 'faculty',
    authorInstitution: 'Indian Institute of Science & Apollo Health',
    authorAvatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=240&auto=format&fit=crop&q=80',
    summary: 'Why NAFLD was renamed to MASLD/MASH by AASLD and EASL, and how THR-beta agonists like Resmetirom are changing medical management.',
    content: `In 2023, the international hepatology consensus shifted nomenclature from Non-Alcoholic Fatty Liver Disease (NAFLD) to Metabolic Dysfunction-Associated Steatotic Liver Disease (MASLD).

### Why the Change?
1. **Elimination of Stigmatizing Terminology**: Removing 'fatty' and 'non-alcoholic'.
2. **Affirmative Metabolic Criteria**: Requires hepatic steatosis plus at least one of five cardiometabolic risk factors (BMI ≥ 25, fasting glucose ≥ 100 mg/dL, hypertension, elevated triglycerides, or low HDL).
3. **FDA Approval of Resmetirom**: The first liver-directed thyroid hormone receptor-β (THR-β) agonist demonstrating significant MASH resolution without worsening fibrosis.

Our machine learning models on the ILPD cohort show that lipid panels coupled with serum transaminases provide an 89.2% AUC for identifying patients eligible for second-line non-invasive assessment.`,
    tags: ['MASLD', 'MASH', 'Resmetirom', 'Pharmacology', 'Research Update'],
    createdAt: '2026-03-20T12:00:00Z',
    readTime: '5 min read',
    upvotes: 68,
    views: 1150,
    isCertified: true,
    isFeatured: false,
    comments: []
  }
];

const BLOGS_STORAGE_KEY = 'dhp_medical_blogs_v2';

export function getStoredBlogs(): BlogPost[] {
  try {
    const raw = localStorage.getItem(BLOGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading stored blogs:', e);
  }
  return SEED_BLOG_POSTS;
}

export function saveStoredBlogs(blogs: BlogPost[]): void {
  try {
    localStorage.setItem(BLOGS_STORAGE_KEY, JSON.stringify(blogs));
  } catch (e) {
    console.error('Error saving blogs:', e);
  }
}
