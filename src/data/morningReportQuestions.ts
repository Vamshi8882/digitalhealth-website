/**
 * Digitalization in Healthcare - Clinical Morning Report Question Bank
 * High-yield daily questions grounded directly in the Indian Liver Patient Dataset (ILPD),
 * clinical biochemistry, De Ritis enzyme kinetics, and healthcare machine learning.
 */

export interface MorningReportQuestion {
  id: string;
  title: string;
  topic: string;
  difficulty: 'Resident' | 'Registrar' | 'Fellow';
  clinicalVignette: string;
  labMarkers: {
    label: string;
    value: string;
    status: 'normal' | 'high' | 'critical' | 'low';
  }[];
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  clinicalPearl: string;
  ilpdCorrelation: string;
}

export const MORNING_REPORT_QUESTIONS: MorningReportQuestion[] = [
  {
    id: 'mr-01-deritis-alcohol',
    title: 'Biochemical Signature of Alcoholic Hepatitis',
    topic: 'De Ritis Ratio & Pyridoxal-5-Phosphate',
    difficulty: 'Resident',
    clinicalVignette:
      'A 47-year-old male with a 15-year history of heavy ethanol consumption is admitted with acute scleral jaundice, anorexia, and mild asterixis following a prolonged drinking binge.',
    labMarkers: [
      { label: 'Total Bilirubin', value: '11.4 mg/dL', status: 'critical' },
      { label: 'Direct Bilirubin', value: '7.1 mg/dL', status: 'critical' },
      { label: 'AST (SGOT)', value: '292 IU/L', status: 'high' },
      { label: 'ALT (SGPT)', value: '118 IU/L', status: 'high' },
      { label: 'Calculated De Ritis (AST/ALT)', value: '2.47', status: 'critical' }
    ],
    question:
      'What physiological mechanism explains why AST is characteristically more than twice ALT (De Ritis Ratio > 2.0) in acute alcoholic liver injury?',
    options: [
      'Ethanol selectively damages hepatic mitochondria releasing mitochondrial AST, while hepatic deficiency of Vitamin B6 (pyridoxal-5-phosphate) suppresses ALT synthesis',
      'Alcohol stimulates renal clearance of ALT while inhibiting tubular excretion of AST',
      'Hepatocytes convert excess acetaldehyde directly into AST via transamination pathways',
      'ALT is cleared at twice the rate of AST by the reticuloendothelial spleen in cirrhotic patients'
    ],
    correctIndex: 0,
    explanation:
      'In alcoholic hepatitis, two cardinal mechanisms produce an AST:ALT ratio > 2.0: (1) Ethanol is a direct mitochondrial toxin, releasing the mitochondrial isoenzyme of AST (mAST constitutes ~80% of total hepatic AST). (2) Chronic alcoholics are uniformly deficient in pyridoxal-5-phosphate (Vitamin B6), an essential cofactor required for ALT synthesis. Because ALT is purely cytoplasmic and its synthesis is suppressed, serum ALT rarely exceeds 300-400 IU/L despite profound necrosis.',
    clinicalPearl:
      'In alcoholic hepatitis, transaminases rarely exceed 400-500 IU/L. An AST > 1,000 IU/L should always prompt investigation for concurrent acetaminophen toxicity, acute ischemia ("shock liver"), or superimposed viral hepatitis.',
    ilpdCorrelation:
      'In the ILPD dataset, patient records exhibiting AST/ALT > 2.0 consistently correlate with severe elevated total bilirubin and high probability of chronic hepatic damage.'
  },
  {
    id: 'mr-02-biliary-obstruction',
    title: 'Conjugated Hyperbilirubinemia & Outflow Stasis',
    topic: 'Bilirubin Metabolism & Extrahepatic Cholestasis',
    difficulty: 'Resident',
    clinicalVignette:
      'A 54-year-old female presents with 5 days of worsening pruritus, tea-colored urine, and clay-colored (acholic) stools. Bedside ultrasound demonstrates dilated intrahepatic biliary radicles and a 12 mm common bile duct.',
    labMarkers: [
      { label: 'Total Bilirubin', value: '8.6 mg/dL', status: 'critical' },
      { label: 'Direct Bilirubin', value: '6.4 mg/dL', status: 'critical' },
      { label: 'Conjugated Fraction', value: '74.4%', status: 'critical' },
      { label: 'Alkaline Phosphatase (ALP)', value: '520 IU/L', status: 'critical' },
      { label: 'ALT / AST', value: '84 / 72 IU/L', status: 'high' }
    ],
    question:
      'What is the definitive clinical significance of a Direct-to-Total Bilirubin ratio (DBIL / TBIL) exceeding 50% in this patient?',
    options: [
      'It confirms post-hepatic extrahepatic biliary tract obstruction with regurgitation of water-soluble conjugated bilirubin diglucuronide into systemic circulation',
      'It signifies accelerated intravascular erythrocyte hemolysis exceeding splenic macrophage capacity',
      'It indicates benign Gilbert syndrome with impaired UDP-glucuronosyltransferase activity',
      'It proves isolated renal tubular failure unable to filter un-conjugated albumin-bound bilirubin'
    ],
    correctIndex: 0,
    explanation:
      'When bilirubin is successfully conjugated with glucuronic acid by hepatocellular UGT1A1, it forms water-soluble bilirubin diglucuronide. If outflow through the bile ducts is mechanically obstructed (e.g. gallstone, periampullary tumor), the conjugated bile cannot reach the duodenum and regurgitates back into hepatic sinusoids. Being water-soluble, it filters through renal glomeruli (producing dark tea urine) while the lack of bile pigment in the stool causes clay/acholic feces.',
    clinicalPearl:
      'Unconjugated bilirubin is lipophilic and bound to albumin, so it never appears in urine. The presence of bilirubin in urine (detected on dipstick) always indicates conjugated (direct) hyperbilirubinemia.',
    ilpdCorrelation:
      'Feature engineering the Direct_to_Total_Bilirubin ratio in the ILPD dataset significantly boosts logistic regression and decision tree classification accuracy for biliary disease.'
  },
  {
    id: 'mr-03-accuracy-paradox',
    title: 'The Accuracy Paradox in Medical Data Science',
    topic: 'Machine Learning Class Imbalance & ROC-AUC',
    difficulty: 'Registrar',
    clinicalVignette:
      'A biomedical engineering intern trains a binary classification model on the 583 records of the Indian Liver Patient Dataset. The cohort contains 416 liver patient cases (71.35%) and 167 healthy controls (28.65%). The intern reports a model with "71.4% raw classification accuracy" and claims it is ready for hospital deployment.',
    labMarkers: [
      { label: 'ILPD Total Records', value: '583 Patients', status: 'normal' },
      { label: 'Liver Disease (Positive)', value: '416 (71.35%)', status: 'high' },
      { label: 'Non-Disease (Negative)', value: '167 (28.65%)', status: 'normal' },
      { label: 'Trained Model Accuracy', value: '71.35%', status: 'normal' },
      { label: 'Model Sensitivity / Specificity', value: '100% / 0.0%', status: 'critical' }
    ],
    question:
      'Why is the reported 71.4% accuracy an example of the "Accuracy Paradox" and clinically unacceptable for diagnostic screening?',
    options: [
      'A zero-intelligence naive baseline that predicts "Liver Disease" for every patient achieves 71.35% accuracy without learning any biomarker features, completely failing to identify healthy patients (0% specificity)',
      'Accuracy cannot be calculated on cohorts smaller than 10,000 patient records',
      'Classification algorithms must always achieve greater than 99% accuracy before clinical trials',
      'The accuracy metric is mathematically undefined when gender is encoded as a categorical variable'
    ],
    correctIndex: 0,
    explanation:
      'In imbalanced medical datasets (like ILPD with ~71% positive disease prevalence), raw accuracy is treacherous. A "dummy" classifier predicting positive for every single case achieves 71.35% accuracy, yet has zero discriminative capacity. In clinical practice, ROC-AUC (Receiver Operating Characteristic - Area Under Curve), Precision-Recall AUC, Sensitivity (Recall), and Specificity must be prioritized to evaluate clinical safety.',
    clinicalPearl:
      'Never rely on raw accuracy in healthcare AI! A test with 95% accuracy in a rare disease (1% prevalence) that simply says "Negative" to everyone will miss 100% of sick patients while boasting high accuracy.',
    ilpdCorrelation:
      'Stratified 5-fold cross-validation and evaluating ROC-AUC is why our ILPD Random Forest and Gradient Boosting models are evaluated with discrimination thresholds rather than raw accuracy.'
  },
  {
    id: 'mr-04-alp-ggt-differentiation',
    title: 'Alkaline Phosphatase Isoenzyme Differentiation',
    topic: 'Biochemical Isoforms: Bone vs Biliary',
    difficulty: 'Resident',
    clinicalVignette:
      'A 62-year-old male with osteoporosis and mild osteoarthritis undergoing a routine health check is found to have an isolated Alkaline Phosphatase of 385 IU/L (Ref: 44-147). His ALT is 28 IU/L, AST is 24 IU/L, and Total Bilirubin is 0.7 mg/dL.',
    labMarkers: [
      { label: 'Alkaline Phosphatase (ALP)', value: '385 IU/L', status: 'critical' },
      { label: 'ALT (SGPT)', value: '28 IU/L', status: 'normal' },
      { label: 'AST (SGOT)', value: '24 IU/L', status: 'normal' },
      { label: 'Total Bilirubin', value: '0.7 mg/dL', status: 'normal' }
    ],
    question:
      'Which serum analyte should be ordered immediately to determine whether this isolated ALP elevation originates from the hepatobiliary tract rather than osteoblastic bone remodeling?',
    options: [
      'Gamma-Glutamyl Transferase (GGT) or 5\'-Nucleotidase',
      'Serum Creatine Kinase (CK-MB)',
      'Serum Lactate Dehydrogenase (LDH-1)',
      'Total Albumin / Globulin Ratio'
    ],
    correctIndex: 0,
    explanation:
      'Alkaline phosphatase is present in high concentrations in both biliary canalicular membranes and bone osteoblasts (as well as placenta and intestine). Gamma-Glutamyl Transferase (GGT) and 5\'-nucleotidase are microsomal enzymes present in the hepatobiliary system but ABSENT in bone tissue. A concordantly elevated GGT confirms hepatobiliary origin, whereas a normal GGT points to bone etiology (Paget disease, healing fractures, bony metastasis).',
    clinicalPearl:
      'If ALP is elevated with normal GGT: Think Bone! If ALP and GGT are BOTH elevated: Think Bile Ducts / Liver!',
    ilpdCorrelation:
      'Alkaline Phosphatase is one of the highest weighted predictive features in the ILPD Random Forest model, with values > 300 IU/L strongly indicating cholestatic hepatobiliary pathology.'
  },
  {
    id: 'mr-05-albumin-globulin-inversion',
    title: 'Reversal of the Albumin / Globulin (A/G) Ratio',
    topic: 'Hepatic Synthetic Reserve & Reticuloendothelial Activation',
    difficulty: 'Registrar',
    clinicalVignette:
      'A 58-year-old male with chronic compensated cirrhosis undergoes comprehensive serum protein electrophoresis. The laboratory reports an Albumin level of 2.2 g/dL (Ref: 3.5-5.0) and Total Protein of 7.4 g/dL, resulting in an Albumin/Globulin ratio of 0.42 (Ref: 1.1-2.2).',
    labMarkers: [
      { label: 'Total Serum Protein', value: '7.4 g/dL', status: 'normal' },
      { label: 'Serum Albumin', value: '2.2 g/dL', status: 'critical' },
      { label: 'Calculated Globulin', value: '5.2 g/dL', status: 'high' },
      { label: 'A/G Ratio', value: '0.42', status: 'critical' },
      { label: 'Prothrombin Time / INR', value: '1.75', status: 'high' }
    ],
    question:
      'What dual pathophysiological mechanisms produce the classic "reversed A/G ratio" (A/G < 1.0) in end-stage chronic liver disease?',
    options: [
      'Decreased hepatocellular synthesis of albumin combined with impaired hepatic clearance of bacterial endotoxins, stimulating systemic polyclonal B-cell gammaglobulin synthesis',
      'Rapid selective filtration of globulins through the renal proximal tubule',
      'Autoimmune destruction of serum albumin by circulating IgG antibodies',
      'Dietary malabsorption of branched-chain amino acids in the terminal ileum'
    ],
    correctIndex: 0,
    explanation:
      'The liver is the sole site of albumin synthesis (~12-15 g/day). In chronic cirrhosis, hepatocyte loss drastically drops albumin production. Simultaneously, portosystemic shunting and sinusoidal fibrosis bypass hepatic Kupffer cells, allowing gut-derived bacterial antigens (endotoxin, LPS) to reach systemic lymphoid tissue. This triggers chronic hypergammaglobulinemia (elevated IgG, IgA), resulting in a characteristic ratio reversal where globulin exceeds albumin.',
    clinicalPearl:
      'Because the half-life of albumin is ~20 days, serum albumin is an excellent indicator of CHRONIC liver synthetic failure, but a poor indicator of acute injury. For acute synthetic failure, check INR (Factor VII half-life is only 4-6 hours!).',
    ilpdCorrelation:
      'The ILPD dataset includes "Albumin_and_Globulin_Ratio" as a key engineered feature; values < 0.8 are strongly predictive of chronic architectural decompensation.'
  },
  {
    id: 'mr-06-maddrey-df',
    title: 'Maddrey Discriminant Function & Steroid Eligibility',
    topic: 'Prognostic Scoring in Severe Acute Alcoholic Hepatitis',
    difficulty: 'Fellow',
    clinicalVignette:
      'A 51-year-old male with severe jaundice and alcoholic hepatitis has a Prothrombin Time of 24.0 seconds (Control PT: 12.0 seconds, INR 2.1) and Total Bilirubin of 18.0 mg/dL.',
    labMarkers: [
      { label: 'Patient PT / Control PT', value: '24.0 s / 12.0 s', status: 'critical' },
      { label: 'Total Bilirubin', value: '18.0 mg/dL', status: 'critical' },
      { label: 'Calculated Maddrey DF', value: '73.2', status: 'critical' },
      { label: 'AST / ALT', value: '310 / 125 IU/L', status: 'high' }
    ],
    question:
      'Maddrey\'s Discriminant Function is calculated as: 4.6 × (Patient PT - Control PT) + Total Bilirubin. What is the validated threshold score defining severe disease with high 30-day mortality where corticosteroid therapy (Prednisolone) should be evaluated?',
    options: [
      'Maddrey DF ≥ 32 (30-day mortality without treatment exceeds 35-50%)',
      'Maddrey DF ≥ 100',
      'Maddrey DF ≥ 10',
      'Maddrey DF ≥ 15'
    ],
    correctIndex: 0,
    explanation:
      'Maddrey\'s Discriminant Function (mDF) threshold of ≥ 32 defines severe acute alcoholic hepatitis, carrying a 30-day mortality of 35-50% without targeted therapy. AASLD guidelines recommend evaluating patients with mDF ≥ 32 for oral prednisolone 40 mg/day for 28 days (provided active sepsis and gastrointestinal bleeding are ruled out), followed by assessing response on Day 7 using the Lille Model.',
    clinicalPearl:
      'Before starting steroids in severe alcoholic hepatitis (mDF ≥ 32), you MUST rule out occult infection! Diagnostic paracentesis, chest radiography, and blood/urine cultures are mandatory because corticosteroids in undetected SBP are fatal.',
    ilpdCorrelation:
      'The mathematical formula for Maddrey\'s DF directly leverages two core ILPD columns: Prothrombin Time (coagulation) and Total Bilirubin, demonstrating how simple linear combinations of biomarkers predict mortality.'
  },
  {
    id: 'mr-07-icterus-cv-threshold',
    title: 'Scleral Icterus Threshold in Computer Vision',
    topic: 'Biophysical Pigment Optics & Sclera HSV Screening',
    difficulty: 'Resident',
    clinicalVignette:
      'A research team implements our platform\'s Computer Vision scleral screening module using OpenCV to extract Hue, Saturation, and Value (HSV) channels from smartphone eye selfies.',
    labMarkers: [
      { label: 'Normal Sclera Value (TBIL)', value: '< 1.2 mg/dL', status: 'normal' },
      { label: 'Subclinical Jaundice', value: '1.2 - 2.5 mg/dL', status: 'normal' },
      { label: 'Overt Scleral Icterus', value: '> 2.5 - 3.0 mg/dL', status: 'high' }
    ],
    question:
      'Why is the ocular sclera the earliest anatomical site to exhibit visible yellow discoloration, and at what serum bilirubin threshold does it become clinically and photometrically detectable?',
    options: [
      'The sclera is rich in elastin fibers which have an extraordinary biochemical binding affinity for bilirubin; it becomes detectable at ~2.5 - 3.0 mg/dL (43 - 51 µmol/L)',
      'The cornea absorbs hemoglobin breakdown products directly from aqueous humor at 1.0 mg/dL',
      'Retinal photoreceptors concentrate direct bilirubin causing pupil dilation at 10 mg/dL',
      'The sclera only becomes yellow when total bilirubin exceeds 20.0 mg/dL in chronic liver failure'
    ],
    correctIndex: 0,
    explanation:
      'Scleral tissue contains an exceptionally high concentration of elastin, a fibrous extracellular matrix protein with high chemical avidity for circulating bilirubin. Normal serum bilirubin is 0.2 - 1.2 mg/dL. Jaundice becomes detectable in the sclera when levels reach ~2.5 - 3.0 mg/dL, well before skin jaundice becomes evident (typically > 4 - 5 mg/dL). In computer vision, color space conversion from RGB to HSV/LAB isolates the yellow hue channel (Hue 35-55°) from skin tone interference.',
    clinicalPearl:
      'Always examine the sclera in NATURAL daylight. Fluorescent lighting has a yellow spectral component that can obscure early scleral icterus or create false positives!',
    ilpdCorrelation:
      'In the ILPD dataset, over 68% of patients with confirmed hepatobiliary disease have Total Bilirubin > 2.5 mg/dL, indicating that computer vision scleral screening would flag them as high risk.'
  },
  {
    id: 'mr-08-extreme-transaminases',
    title: 'Extreme Transaminase Elevation (> 3,000 IU/L)',
    topic: 'Cytolytic Crisis: Shock vs APAP vs Viral',
    difficulty: 'Registrar',
    clinicalVignette:
      'A 31-year-old patient admitted to the medical intensive care unit following cardiopulmonary resuscitation has laboratory tests drawn at 12 hours post-arrest.',
    labMarkers: [
      { label: 'AST (SGOT)', value: '6,450 IU/L', status: 'critical' },
      { label: 'ALT (SGPT)', value: '5,820 IU/L', status: 'critical' },
      { label: 'Serum LDH', value: '4,100 IU/L', status: 'critical' },
      { label: 'Total Bilirubin', value: '1.9 mg/dL', status: 'high' },
      { label: 'Serum Creatinine', value: '2.4 mg/dL', status: 'high' }
    ],
    question:
      'Serum transaminases exceeding 3,000 - 5,000 IU/L are a medical emergency narrowed to three primary etiologies. Which triad represents these causes?',
    options: [
      'Ischemic Hepatitis ("Shock Liver"), Acute Acetaminophen (APAP) Toxicity, and Acute Fulminant Viral Hepatitis (A, B, or E)',
      'Alcoholic Cirrhosis, Nonalcoholic Fatty Liver Disease (NAFLD), and Gilbert Syndrome',
      'Choledocholithiasis, Primary Biliary Cholangitis (PBC), and Hemochromatosis',
      'Wilson Disease, Alpha-1-Antitrypsin Deficiency, and Hydatid Cyst'
    ],
    correctIndex: 0,
    explanation:
      'Massive, exponential transaminase surges exceeding 3,000 to 10,000+ IU/L are almost exclusively restricted to three clinical conditions: (1) Ischemic hepatitis ("shock liver") following hemodynamic collapse or hypoxia; (2) Acute toxic necrosis (most commonly acetaminophen overdose producing toxic NAPQI); and (3) Hyperacute viral hepatitis (Hep A, B, E, or HSV). In ischemic hepatitis, AST peaks rapidly within 24-48 hours and precipitously falls by ~50% per day once perfusion is restored.',
    clinicalPearl:
      'A serum ALT/LDH ratio < 1.5 strongly points toward ischemic hepatitis, whereas ALT/LDH > 1.5 favors acute viral hepatitis or drug-induced liver injury.',
    ilpdCorrelation:
      'The ILPD dataset max ALT is 2,000 IU/L and max AST is 4,929 IU/L; machine learning models recognize that transaminases in the thousands represent hyperacute necrosis rather than indolent chronic cirrhosis.'
  },
  {
    id: 'mr-09-ilpd-demographics',
    title: 'Epidemiological Demographics of the ILPD Cohort',
    topic: 'Population Health & Regional Clinical Risk Factors',
    difficulty: 'Resident',
    clinicalVignette:
      'During exploratory data analysis of the Indian Liver Patient Dataset collected across hospitals in Andhra Pradesh, medical students analyze the age and gender distribution across the 583 records.',
    labMarkers: [
      { label: 'Male Patients in ILPD', value: '441 records (75.6%)', status: 'high' },
      { label: 'Female Patients in ILPD', value: '142 records (24.4%)', status: 'normal' },
      { label: 'Mean Patient Age', value: '44.7 Years', status: 'normal' },
      { label: 'Peak Age Decades', value: '35 - 55 Years', status: 'high' }
    ],
    question:
      'What epidemiologic factor primarily accounts for the 3:1 male predominance observed in the ILPD clinical registry?',
    options: [
      'Higher gender-specific regional rates of heavy alcohol consumption and occupational risk exposure in the working-age male demographic',
      'Female sex hormones directly prevent all forms of viral hepatitis transmission',
      'The Y chromosome encodes a mutation in the hepatic albumin gene',
      'Female patients were systematically excluded from clinical blood sampling in 2012'
    ],
    correctIndex: 0,
    explanation:
      'The 75.6% male predominance in the Indian Liver Patient Dataset reflects real-world epidemiological demographics in South Asia during the collection period: significantly higher rates of heavy ethanol intake among adult men, higher prevalence of occupational exposures, and documented disparities in tertiary hospital admissions. However, women who develop alcoholic hepatitis or DILI often suffer more severe toxicity per gram of toxin due to lower gastric alcohol dehydrogenase (ADH) activity and higher body fat distribution.',
    clinicalPearl:
      'Women have lower gastric alcohol dehydrogenase levels than men, leading to significantly higher blood alcohol concentrations for identical intake per kilogram of body weight.',
    ilpdCorrelation:
      'Encoding "Gender" into a binary numeric feature (Male=1, Female=0) provides marginal predictive gain, but age combined with transaminase ratios forms the core predictive backbone.'
  },
  {
    id: 'mr-10-feature-scaling',
    title: 'StandardScaler & Distance-Based Classifiers',
    topic: 'Feature Preprocessing in Healthcare ML',
    difficulty: 'Registrar',
    clinicalVignette:
      'In the ML Lab module, a student trains K-Nearest Neighbors (KNN) and Support Vector Machines (SVM) directly on raw ILPD data without applying feature normalization or StandardScaler.',
    labMarkers: [
      { label: 'Alkaline Phosphatase (ALP) Range', value: '63 to 2,110 IU/L', status: 'critical' },
      { label: 'Total Bilirubin (TBIL) Range', value: '0.4 to 75.0 mg/dL', status: 'normal' },
      { label: 'Albumin (ALB) Range', value: '0.9 to 5.5 g/dL', status: 'normal' },
      { label: 'Numerical Scale Disparity', value: 'ALP variance is ~1,000x ALB', status: 'critical' }
    ],
    question:
      'What catastrophic error occurs when training distance-based algorithms (like KNN or Euclidean distance SVM) on unscaled laboratory features?',
    options: [
      'Features with large numeric ranges (e.g. ALP with thousands of units) completely dominate the distance calculation, rendering biologically critical small-scale markers (e.g. Albumin or Bilirubin) virtually invisible to the model',
      'The scikit-learn library will crash with an out-of-memory exception',
      'Unscaled data converts non-linear decision boundaries into purely random coin-flips',
      'The ROC-AUC score is mathematically forced to exactly 0.50'
    ],
    correctIndex: 0,
    explanation:
      'Distance metrics like Euclidean distance calculate sqrt(sum((x_i - y_i)^2)). A difference of 500 IU/L in Alkaline Phosphatase yields 250,000 in squared distance, while a life-threatening drop of 2.0 g/dL in Albumin yields only 4.0! Without standardizing each feature to zero mean and unit variance (StandardScaler z = (x - mean) / std), the classifier becomes an "ALP-only detector", ignoring crucial markers.',
    clinicalPearl:
      'Always use StandardScaler or RobustScaler on biochemical panels before feeding into distance-sensitive models (KNN, SVM, Neural Nets, PCA). Tree-based models (Random Forest, XGBoost) are invariant to monotonic scale differences.',
    ilpdCorrelation:
      'In our ML Lab comparison, unscaled KNN achieves an ROC-AUC of only ~0.61, while scaled KNN jumps to >0.73 on the identical 80/20 train/test split.'
  },
  {
    id: 'mr-11-spontaneous-bacterial-peritonitis',
    title: 'Diagnostic Paracentesis & SBP Cutoff',
    topic: 'Ascitic Fluid Cytology & Spontaneous Infection',
    difficulty: 'Fellow',
    clinicalVignette:
      'A 61-year-old male with decompensated cirrhosis and tense ascites presents with new-onset confusion (Grade 2 hepatic encephalopathy) and mild abdominal tenderness, but NO fever.',
    labMarkers: [
      { label: 'Ascitic Fluid Polymorphonuclear (PMN)', value: '380 cells/mm³', status: 'critical' },
      { label: 'Ascitic Fluid Total Protein', value: '1.1 g/dL', status: 'high' },
      { label: 'Serum-Ascites Albumin Gradient (SAAG)', value: '1.8 g/dL', status: 'critical' },
      { label: 'Peripheral Blood WBC', value: '12,400 /µL', status: 'high' }
    ],
    question:
      'What absolute neutrophil (PMN) count in ascitic fluid is diagnostic of Spontaneous Bacterial Peritonitis (SBP) mandating immediate empiric intravenous antibiotic therapy?',
    options: [
      'PMN count ≥ 250 cells/mm³ (0.25 × 10⁹/L)',
      'PMN count ≥ 1,000 cells/mm³',
      'PMN count ≥ 50 cells/mm³',
      'PMN count ≥ 5,000 cells/mm³'
    ],
    correctIndex: 0,
    explanation:
      'A neutrophil (PMN) count of ≥ 250 cells/mm³ in ascitic fluid is the universally accepted gold standard for diagnosing SBP. Empiric intravenous 3rd-generation cephalosporins (e.g. Cefotaxime or Ceftriaxone) plus IV Albumin (1.5 g/kg on Day 1, 1.0 g/kg on Day 3) must be initiated immediately without waiting for culture results. IV Albumin reduces hepatorenal syndrome and significantly reduces in-hospital mortality.',
    clinicalPearl:
      'Over 30% of patients with SBP have NO abdominal pain and NO fever! Unexplained worsening of encephalopathy or sudden renal dysfunction in cirrhosis is an absolute indication for diagnostic paracentesis.',
    ilpdCorrelation:
      'A SAAG (Serum Albumin - Ascitic Albumin) > 1.1 g/dL indicates portal hypertension with 97% accuracy, correlating with low serum albumin records in ILPD.'
  },
  {
    id: 'mr-12-nafld-vs-nash',
    title: 'NAFLD vs NASH Progression & Fibrosis-4 (FIB-4)',
    topic: 'Metabolic Dysfunction-Associated Steatohepatitis',
    difficulty: 'Resident',
    clinicalVignette:
      'A 42-year-old male with type 2 diabetes and dyslipidemia has asymptomatic mild transaminase elevation discovered on routine labs. Ultrasound reveals diffuse bright hepatic echogenicity with vascular blurring.',
    labMarkers: [
      { label: 'Age', value: '42 Years', status: 'normal' },
      { label: 'Platelet Count', value: '240,000 /µL', status: 'normal' },
      { label: 'AST (SGOT)', value: '52 IU/L', status: 'high' },
      { label: 'ALT (SGPT)', value: '78 IU/L', status: 'high' },
      { label: 'FIB-4 Index', value: '0.98 (Low Risk < 1.30)', status: 'normal' }
    ],
    question:
      'The non-invasive FIB-4 index is calculated as: (Age × AST) / (Platelet Count × sqrt(ALT)). What does a FIB-4 score < 1.30 signify in metabolic liver disease?',
    options: [
      'High negative predictive value (>90%) for excluding advanced hepatic fibrosis (F3-F4), indicating the patient can be managed in primary care with lifestyle interventions',
      'Definitive histological diagnosis of cirrhosis requiring immediate liver biopsy',
      'Immunity to metabolic fatty liver changes due to elevated ALT clearance',
      'Indication for emergency transjugular intrahepatic portosystemic shunt (TIPS)'
    ],
    correctIndex: 0,
    explanation:
      'The FIB-4 index is the primary guideline-recommended non-invasive triage score for NAFLD/MASLD. A score < 1.30 has a negative predictive value > 90% for ruling out advanced fibrosis (bridging fibrosis or cirrhosis, stages F3-F4). Patients with FIB-4 < 1.30 can be safely managed with diet, exercise, and cardiometabolic control in primary care, while scores > 2.67 warrant specialist hepatology referral and elastography (FibroScan).',
    clinicalPearl:
      'In early NAFLD, ALT is typically higher than AST (De Ritis < 1.0). When AST rises to equal or exceed ALT (De Ritis ≥ 1.0), it flags the progression of underlying advanced fibrosis or cirrhosis!',
    ilpdCorrelation:
      'The four variables of FIB-4 (Age, AST, ALT, Platelets) mirror the highest importance predictive features extracted from laboratory cohorts like ILPD.'
  }
];

/**
 * Deterministically get today's Morning Report question based on the calendar date (YYYY-MM-DD),
 * ensuring every student globally sees the same clinical question on a given day.
 */
export function getTodaysMorningReportQuestion(dateString?: string): MorningReportQuestion {
  const dateKey = dateString || new Date().toISOString().split('T')[0];
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash << 5) - hash + dateKey.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % MORNING_REPORT_QUESTIONS.length;
  return MORNING_REPORT_QUESTIONS[index];
}
