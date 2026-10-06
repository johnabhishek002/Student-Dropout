# EduGuard AI - Student Dropout Risk Prediction System
**Early-Warning & Explainable Academic Retention Intelligence Platform**

Designed and engineered for college hackathon demonstrations, academic advisory boards, and university administration.

---

## 🌟 Executive Overview
**EduGuard AI** is a full-stack, responsive, explainable AI web application built to predict, understand, and proactively reverse student academic disengagement and dropout trajectories.

Instead of functioning as an uninterpretable "black-box" model, EduGuard AI utilizes a multi-metric weighted diagnostic engine that exposes the exact root causes of academic distress (statutory attendance debarment cutoffs, internal exam dips, missing coursework, and LMS inactivity) and couples them with automated, trackable faculty interventions and an interactive **What-If Academic Recovery Simulator**.

---

## 🚀 1-Click Quick Demo Accounts
Instant access to all core personas directly on the landing page or top navigation bar:

| Role / Persona | Credentials | Key Details | Risk Tier |
| :--- | :--- | :--- | :--- |
| **Faculty / Admin** | `admin@edu.com` / `password` | Dr. Aris Vance (Dept Head CS) | Full cohort analytics & CRUD |
| **High-Risk Student** | `alex@edu.com` / `password` | Alex Rivera (CS-2023-042) | 🔴 High Risk (81/100) |
| **Medium-Risk Student** | `sarah@edu.com` / `password` | Sarah Chen (IT-2023-118) | 🟡 Medium Risk (51/100) |
| **Low-Risk Student** | `jordan@edu.com` / `password` | Jordan Taylor (EC-2023-009) | 🟢 Low Risk (10/100) |

---

## 📐 Explainable AI (XAI) Risk Engine

### 1. Weighted Metrics & Non-Linear Penalty Curves
The risk score $R \in [0, 100]$ is computed as:
$$R = 0.35 \times R_{\text{Attendance}} + 0.30 \times R_{\text{Marks}} + 0.20 \times R_{\text{Assignments}} + 0.15 \times R_{\text{LMS}}$$

* **Attendance % (Weight: 35%)**: Statutory cutoff is **75%**. When attendance drops below 75%, non-linear acceleration penalizes the score steeply due to institutional debarment policies.
* **Internal / Semester Marks % (Weight: 30%)**: University passing threshold is **50%**. Scores under 50% trigger high-risk failure alarms.
* **Assignment Completion % (Weight: 20%)**: Tracks missed coursework and late laboratory submissions.
* **LMS Engagement Score (Weight: 15%)**: Evaluates portal login cadence, digital textbook reads, and forum participation.

### 2. Classification Tiers
* 🟢 **0 – 39**: **Low Risk (Safe)** — Healthy academic velocity; eligible for peer tutoring roles.
* 🟡 **40 – 69**: **Medium Risk (Needs Attention)** — Marginal attendance or exam dips; early warning notice dispatched.
* 🔴 **70 – 100**: **High Risk (Critical)** — Debarment imminent or multi-vector academic distress; urgent intervention mandated.

### 3. Explainability Output & Institutional Disclaimer
* Dynamically extracts the **Top 3 contributing risk drivers** ranked by weighted point impact.
* Accompanied by institutional advisory: *"Early-Warning Estimate — Not a Guaranteed Outcome. Provided for proactive academic retention & targeted mentorship."*

---

## 💻 Core Application Modules

### 1. Landing & Authentication
* College-themed hero section, live impact metrics, 1-click hackathon demo account cards, and system pillars.
* Flexible authentication modal supporting both instant demo logins and custom student/faculty registrations.

### 2. Faculty / Admin Command Center
* **KPI Summary Cards**: Real-time counts of Total Enrolled, High Risk, Medium Risk, Low Risk, Average Cohort Attendance %, and Average Marks %.
* **Visual Analytics (Chart.js)**:
  * Donut chart for Risk Tier Breakdown.
  * Scatter plot correlating Attendance vs. Internal Marks with risk-coded quadrants.
  * Grouped Bar chart comparing Risk across CS, IT, and EC departments.
* **Interactive Student Directory**:
  * Real-time search across student names, IDs, and emails.
  * Multi-dimensional filtering by Department (CS, IT, EC) and Risk Tier (High, Medium, Low).
  * Dynamic sorting by Risk Score, Attendance, Marks, and Name.
  * Clean CSV export generating timestamped student reports.
* **Student 360° Drawer**:
  * Slide-out profile deep dive featuring historical 10-week attendance and marks trajectory line charts.
  * 5-axis Competency Radar Chart comparing the student against the department cohort benchmark.
  * Complete list of assigned interventions.
* **Full CRUD Operations**:
  * Add new student records with real-time risk calculation preview.
  * Edit existing student metrics with instant recalculation.
  * Delete records with confirmation.

### 3. Intervention & Action Tracking Hub
* Multi-action protocol assignment:
  * **Attendance Recovery Plan** (Biometric check-ins & makeup lectures)
  * **Faculty 1-on-1 Mentoring Session** (Office hours & milestone roadmaps)
  * **Peer Tutor Assignment** (Pairing at-risk students with top-ranking senior peers)
  * **Academic Counseling** (Stress management & study strategies)
* Dedicated tracking view to manage and update statuses (`Pending` ➔ `In Progress` ➔ `Resolved`).

### 4. Student Empowerment Dashboard
* **Dynamic Circular SVG Risk Gauge** (animated stroke and color shift).
* **4-Pillars Academic Health Overview** with benchmark comparison indicators.
* **Explainable AI Insights**: Explains exactly what factors produced the current risk score.
* **Interactive "What-If" Academic Recovery Simulator**:
  * Real-time sliders allowing students to simulate hypothetical attendance and exam improvements.
  * Instant feedback highlighting projected risk score reduction (e.g., *"Attending next 5 lectures drops risk from 81 to 52!"*).
* **Direct Help Request**: Student can dispatch immediate help requests to their assigned faculty advisor.

---

## 🛠️ Local Running Instructions
The application is self-contained and serves out-of-the-box with zero npm setup:

```bash
# Start local server (running Python 3)
python server.py
```
Open **[http://localhost:3000](http://localhost:3000)** in any modern web browser.
