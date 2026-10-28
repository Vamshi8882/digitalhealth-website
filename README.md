# Digitalization in Healthcare: Medical Data Science & ML Education Platform

An immersive, clinical-grade educational platform designed for medical students, healthcare developers, and bioinformatics researchers. Grounded in the **Indian Liver Patient Dataset (ILPD)** from Andhra Pradesh, India, this platform teaches laboratory feature engineering, supervised diagnostic modeling, clinical evaluation metrics (ROC-AUC vs Accuracy Paradox), explainable AI (SHAP), computer vision for scleral icterus screening, and clinical ethics.

---

## 1. Windows PowerShell Quick Start Guide

This project is fully optimized for Windows and PowerShell. Across all scripts and guides, use `python` (never `python3`).

### Step 1: Open PowerShell and Clone Repository
```powershell
git clone https://github.com/organization/digital_health_platform.git
cd digital_health_platform
```

### Step 2: Create and Activate Virtual Environment
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```
*(If script execution is restricted on your Windows machine, run: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`)*

### Step 3: Install Required Dependencies
```powershell
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

### Step 4: Initialize Idempotent Database (WAL Mode)
```powershell
python database/db_init.py
```
*Creates `database.db` with Write-Ahead Logging (WAL) and populates the 583 authentic ILPD records.*

### Step 5: Execute ML Model Training & Serialization
```powershell
python ml/train_model.py
```
*Performs 5-fold stratified cross-validation across 6 candidate models (Random Forest, Logistic Regression, Gradient Boosting, SVM, KNN, Decision Tree) and serializes artifacts into `ml/model_store/` and `ml/metrics.json`.*

### Step 6: Run Automated Smoke Tests
```powershell
python tests/smoke_test.py
```

### Step 7: Launch Multi-Threaded Production Server
```powershell
python run_server.py
```
Access the application in your browser at: **`http://localhost:5000`**

---

## 2. Platform Architecture & Features

### A. 3D Procedural Liver Anatomy & Jaundice Simulation
- Interactive 3D spatial model rendered via Three.js with PBR RoomEnvironment reflections and zero 404 dependencies.
- Real-time **Jaundice/Bilirubin Accumulation Slider** simulating progressive tissue pigmentation from healthy red-brown to severe icteric olive-yellow.
- Exploded view isolating Couinaud segments, Gallbladder, Hepatic Portal Vein, Proper Hepatic Artery, and Common Bile Duct.
- Classical hexagonal **Hepatic Lobule** micro-architecture visualization.

### B. Clinical Risk Predictor
- Hard-rejects implausible physiological entries (e.g. Age > 110, Direct Bilirubin > Total Bilirubin).
- Pre-filled clinical teaching cases: Healthy Adult, Acute Alcoholic Hepatitis, Obstructive Cholestasis, Decompensated Cirrhosis.
- Explainable AI (XAI) feature attribution waterfall mapping individual marker contributions.
- Prominent persistent regulatory notice: **"EDUCATIONAL SYSTEM ONLY: NOT A MEDICAL DIAGNOSTIC DEVICE"**.
- Transparent reliability statement disclosing true Sensitivity (84.1%) and False-Alarm Rate (29.1%).

### C. Dataset Dashboard & SQL Console
- Multi-demographic cuts analyzing patient prevalence across age bins (<30, 30-45, 46-60, >60) and gender distributions.
- 5-Fold Stratified Cross-Validation benchmark table comparing ROC-AUC, Accuracy, Precision, Recall, and F1.
- In-browser interactive SQL query playground executing against the in-memory SQLite database.

### D. Computer Vision Scleral Icterus Screener
- Dual-color space segmentation (HSV & CIE LAB) isolating hyperbilirubinemic yellow chrominance on the bulbar sclera.
- Deterministic heuristic parameters without hidden black-box neural networks.
- Side-by-side overlay highlighting suspect pixel clusters and computing the Icteric Surface Ratio.

### E. Natural Language ML Lab Console
- Students describe experiments in plain English (e.g. *"Train random forest with depth 4 and 35 trees using bilirubin and enzymes"*).
- Token-parser clamps hyperparameters to safe limits (Depth &le; 5, Trees &le; 50) to prevent denial-of-service.
- Returns instant 2x2 confusion matrix grid, ROC-AUC, and clinical diagnostic feedback.
- Global "Hall of Fame" leaderboard.

### F. 10 Comprehensive Curriculum Modules
1. Digital Transformation in Medicine: From Paper Charts to Clinical AI
2. Healthcare Data Architecture & EHR Standards (HL7, FHIR, DICOM)
3. The Indian Liver Patient Dataset (ILPD): Hepatology Biomarkers Deep Dive
4. Clinical Feature Engineering: De Ritis Ratio (AST/ALT) & Bilirubin Conjugation
5. Supervised Machine Learning in Diagnostic Decision Support
6. Model Evaluation in Medicine: ROC-AUC vs Accuracy & Asymmetric Costs
7. Explainable AI (XAI): SHAP, LIME, and Demystifying Black-Box Algorithms
8. Clinical Decision Support Systems (CDSS) & Workflow Integration
9. Medical Computer Vision: Color Spaces (HSV/LAB) for Scleral Icterus
10. Medical AI Ethics, Algorithmic Bias & Regulatory Compliance (FDA/SaMD)

### G. Clinical Ethics & First-Aid Portal
- **India Universal Emergency Number: 112** displayed prominently across emergency layouts.
- Actionable **Do/Don't** emergency cards: CPR (100-120 bpm, 5-6 cm depth), Choking (Heimlich), Severe Bleeding (Direct pressure & Tourniquet), Stroke (FAST), Anaphylaxis (Epinephrine IM), Burns, Seizures.
- The Five Golden Steps of Medical AI Deployment & Nine Ethical Rules of Digital Medicine.
- Healthcare Digitalization Problems & Solutions handbook.

### H. Unified Play Arcade (6 Server-Authoritative Mini-Games)
1. **Lab Rapid-Fire**: 30s fast-paced biomarker categorization (Low, Normal, High).
2. **Diagnose Dash**: Human clinician vs algorithmic diagnostic prediction race.
3. **Memory Match**: Clinical symptom and biomarker card matching.
4. **SQL Clause Sorter**: Interactive rearrangement of scrambled query blocks.
5. **Quiz Blitz**: Decreasing timers and 50/50 lifeline.
6. **Life-Saver Sim**: Acute variceal hemorrhage branching triage decision paths.
- Temporal anti-cheat telemetry enforcing a 180ms reaction floor and daily XP caps.

---

## 3. Operational Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/` | `GET` | Main Platform Overview |
| `/predictor` | `GET` | Clinical Risk Predictor Interface |
| `/api/predict` | `POST` | REST JSON Clinical Prediction Service |
| `/dashboard` | `GET` | Dataset Analytics & SQL Query Console |
| `/screening` | `GET` | Computer Vision Scleral Icterus Screener |
| `/mllab` | `GET` | Custom Natural Language Experiment Console |
| `/api/mllab/experiment` | `POST` | Executes NLP Parsed Model Training |
| `/healthz` | `GET` | Operational Micro-Endpoint Checking DB and ML Models |

---

## 4. Docker Deployment
```powershell
docker build -t digital-health-platform:latest .
docker run -d -p 5000:5000 --name med-platform digital-health-platform:latest
```
Check container health:
```powershell
curl http://localhost:5000/healthz
```

---

## 5. Medical Disclaimer
**EDUCATIONAL SYSTEM ONLY: NOT A MEDICAL DIAGNOSTIC DEVICE.**
This software is built strictly for medical student training, academic research, and algorithmic transparency education. It must never be used for autonomous clinical diagnosis, patient prescription, or critical emergency triage. In real-world acute emergencies across India, immediately dial **112**.
