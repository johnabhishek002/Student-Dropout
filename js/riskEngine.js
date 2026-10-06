/**
 * EduGuard AI - Explainable AI Risk Calculation Engine
 * 
 * Weights & Metrics:
 * - Attendance % (35% weight) -> Critical threshold < 75%
 * - Internal/Semester Marks % (30% weight) -> Critical threshold < 50%
 * - Assignment Completion % (20% weight) -> Incomplete submissions
 * - LMS Engagement Score (15% weight) -> Resource access, forum posts, activity hours
 * 
 * Classification Tiers:
 * - 0 - 39: Low Risk (Safe)
 * - 40 - 69: Medium Risk (Needs Attention)
 * - 70 - 100: High Risk (Critical Early Warning)
 */

const RiskEngine = {
  WEIGHTS: {
    attendance: 0.35,
    marks: 0.30,
    assignments: 0.20,
    lms: 0.15
  },

  THRESHOLDS: {
    attendanceCritical: 75,
    attendanceGood: 85,
    marksCritical: 50,
    marksGood: 70,
    assignmentsCritical: 60,
    assignmentsGood: 85,
    lmsCritical: 45,
    lmsGood: 75
  },

  TIERS: {
    LOW: { label: 'Low Risk', key: 'low', min: 0, max: 39, color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)', border: '#10B981' },
    MEDIUM: { label: 'Medium Risk', key: 'medium', min: 40, max: 69, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)', border: '#F59E0B' },
    HIGH: { label: 'High Risk', key: 'high', min: 70, max: 100, color: '#EF4444', bg: 'rgba(239, 68, 68, 0.12)', border: '#EF4444' }
  },

  DISCLAIMER: 'Early-Warning Estimate — Not a Guaranteed Outcome. Provided for proactive academic retention & targeted mentorship.',

  /**
   * Calculates individual risk points for Attendance (0 - 100)
   * Penalty accelerates steeply below 75% due to statutory debarment rules
   */
  calculateAttendanceRisk(attendance) {
    const att = Math.max(0, Math.min(100, Number(attendance) || 0));
    if (att >= this.THRESHOLDS.attendanceGood) {
      // 85 - 100%: very low risk (0 - 15)
      return (100 - att) * 1.0;
    } else if (att >= this.THRESHOLDS.attendanceCritical) {
      // 75 - 84%: moderate risk (15 - 35)
      return 15 + ((85 - att) / 10) * 20;
    } else if (att >= 60) {
      // 60 - 74%: high risk (35 - 75)
      return 35 + ((75 - att) / 15) * 40;
    } else {
      // < 60%: critical risk (75 - 100)
      return Math.min(100, 75 + ((60 - att) / 60) * 25);
    }
  },

  /**
   * Calculates individual risk points for Internal Marks (0 - 100)
   * Penalty accelerates steeply below 50% (academic passing grade)
   */
  calculateMarksRisk(marks) {
    const m = Math.max(0, Math.min(100, Number(marks) || 0));
    if (m >= this.THRESHOLDS.marksGood) {
      // 70 - 100%: minimal risk (0 - 15)
      return (100 - m) * 0.5;
    } else if (m >= this.THRESHOLDS.marksCritical) {
      // 50 - 69%: moderate risk (15 - 45)
      return 15 + ((70 - m) / 20) * 30;
    } else if (m >= 35) {
      // 35 - 49%: danger zone (45 - 80)
      return 45 + ((50 - m) / 15) * 35;
    } else {
      // < 35%: fail zone (80 - 100)
      return Math.min(100, 80 + ((35 - m) / 35) * 20);
    }
  },

  /**
   * Calculates individual risk points for Assignment Completion (0 - 100)
   */
  calculateAssignmentRisk(assignments) {
    const a = Math.max(0, Math.min(100, Number(assignments) || 0));
    if (a >= this.THRESHOLDS.assignmentsGood) {
      return (100 - a) * 0.6;
    } else if (a >= this.THRESHOLDS.assignmentsCritical) {
      return 15 + ((85 - a) / 25) * 35;
    } else {
      return 50 + ((60 - a) / 60) * 50;
    }
  },

  /**
   * Calculates individual risk points for LMS Engagement (0 - 100)
   */
  calculateLmsRisk(lms) {
    const l = Math.max(0, Math.min(100, Number(lms) || 0));
    if (l >= this.THRESHOLDS.lmsGood) {
      return (100 - l) * 0.4;
    } else if (l >= this.THRESHOLDS.lmsCritical) {
      return 15 + ((75 - l) / 30) * 35;
    } else {
      return 50 + ((45 - l) / 45) * 50;
    }
  },

  /**
   * Computes composite Risk Score (0 - 100) and full explainable diagnostics
   */
  evaluateStudent(metrics) {
    const attendance = Number(metrics.attendance) || 0;
    const marks = Number(metrics.marks) || 0;
    const assignments = Number(metrics.assignments) || 0;
    const lms = Number(metrics.lms) || 0;

    const rAttendance = this.calculateAttendanceRisk(attendance);
    const rMarks = this.calculateMarksRisk(marks);
    const rAssignments = this.calculateAssignmentRisk(assignments);
    const rLms = this.calculateLmsRisk(lms);

    // Weighted composite
    const rawScore = 
      (rAttendance * this.WEIGHTS.attendance) +
      (rMarks * this.WEIGHTS.marks) +
      (rAssignments * this.WEIGHTS.assignments) +
      (rLms * this.WEIGHTS.lms);

    const score = Math.round(Math.max(0, Math.min(100, rawScore)));

    // Determine Tier
    let tier = this.TIERS.LOW;
    if (score >= this.TIERS.HIGH.min) {
      tier = this.TIERS.HIGH;
    } else if (score >= this.TIERS.MEDIUM.min) {
      tier = this.TIERS.MEDIUM;
    }

    // Weighted risk contributions to explain score
    const contributions = [
      {
        metric: 'Attendance Rate',
        raw: attendance,
        riskPoints: Math.round(rAttendance * this.WEIGHTS.attendance * 10) / 10,
        pctImpact: Math.round(((rAttendance * this.WEIGHTS.attendance) / (rawScore || 1)) * 100),
        weight: '35%',
        status: attendance < 75 ? 'critical' : attendance < 85 ? 'warning' : 'healthy',
        description: attendance < 75 
          ? `Attendance at ${attendance}% is below mandatory 75% minimum threshold.`
          : attendance < 85 
            ? `Attendance at ${attendance}% is marginally above cutoff.`
            : `Consistent lecture attendance at ${attendance}%.`
      },
      {
        metric: 'Internal Marks',
        raw: marks,
        riskPoints: Math.round(rMarks * this.WEIGHTS.marks * 10) / 10,
        pctImpact: Math.round(((rMarks * this.WEIGHTS.marks) / (rawScore || 1)) * 100),
        weight: '30%',
        status: marks < 50 ? 'critical' : marks < 70 ? 'warning' : 'healthy',
        description: marks < 50 
          ? `Average marks (${marks}%) fall below university passing cutoff (50%).`
          : marks < 70 
            ? `Academic marks (${marks}%) require reinforcement in core subjects.`
            : `Strong academic standing with ${marks}% average marks.`
      },
      {
        metric: 'Assignment Submission',
        raw: assignments,
        riskPoints: Math.round(rAssignments * this.WEIGHTS.assignments * 10) / 10,
        pctImpact: Math.round(((rAssignments * this.WEIGHTS.assignments) / (rawScore || 1)) * 100),
        weight: '20%',
        status: assignments < 60 ? 'critical' : assignments < 85 ? 'warning' : 'healthy',
        description: assignments < 60
          ? `Assignment completion is critically low (${assignments}%), indicating missing coursework.`
          : assignments < 85
            ? `${assignments}% completion rate with pending or late submissions.`
            : `Reliable submission track record at ${assignments}%.`
      },
      {
        metric: 'LMS Engagement',
        raw: lms,
        riskPoints: Math.round(rLms * this.WEIGHTS.lms * 10) / 10,
        pctImpact: Math.round(((rLms * this.WEIGHTS.lms) / (rawScore || 1)) * 100),
        weight: '15%',
        status: lms < 45 ? 'critical' : lms < 75 ? 'warning' : 'healthy',
        description: lms < 45
          ? `Low online portal activity (${lms}/100) — minimal resource views or forum participation.`
          : lms < 75
            ? `Moderate portal engagement (${lms}/100) with sporadic login cadence.`
            : `Active digital learner with ${lms}/100 engagement index.`
      }
    ];

    // Sort factors by highest risk points to produce Top 3 Contributing Drivers
    const sortedFactors = [...contributions].sort((a, b) => b.riskPoints - a.riskPoints);
    const topFactors = sortedFactors.slice(0, 3);

    // Primary driver headline for summary tables
    const primaryDriver = topFactors[0].description;

    // Generate actionable recovery guidance
    const guidance = this.generateActionableGuidance(metrics, topFactors);

    return {
      score,
      tier,
      tierKey: tier.key,
      tierLabel: tier.label,
      color: tier.color,
      contributions,
      topFactors,
      primaryDriver,
      guidance,
      rawScore: Math.round(rawScore * 10) / 10,
      disclaimer: this.DISCLAIMER
    };
  },

  /**
   * Generates tailored step-by-step guidance to reduce risk
   */
  generateActionableGuidance(metrics, topFactors) {
    const steps = [];

    if (metrics.attendance < 75) {
      const classesNeeded = Math.ceil(((0.75 * 60) - (metrics.attendance / 100 * 60)) / 0.25) || 5;
      steps.push({
        title: 'Attendance Recovery Protocol',
        action: `Attend the next ${Math.max(3, classesNeeded)} consecutive lectures without absences to restore attendance above 75%.`,
        priority: 'Urgent',
        impact: '-15 to -22 Risk Pts'
      });
    }

    if (metrics.marks < 50) {
      steps.push({
        title: 'Subject Remedial Tutoring',
        action: `Schedule a 1-on-1 tutoring session with the Department Academic Coach for prerequisite modules before midterms.`,
        priority: 'High',
        impact: '-12 to -18 Risk Pts'
      });
    } else if (metrics.marks < 65) {
      steps.push({
        title: 'Formative Quiz Preparation',
        action: `Complete practice problem sets in LMS to target a minimum 70% in upcoming internal assessments.`,
        priority: 'Medium',
        impact: '-6 to -10 Risk Pts'
      });
    }

    if (metrics.assignments < 70) {
      steps.push({
        title: 'Coursework Catch-up',
        action: `Submit outstanding lab reports and module assignments to regain up to 20% credit weightage.`,
        priority: 'High',
        impact: '-10 to -14 Risk Pts'
      });
    }

    if (metrics.lms < 50) {
      steps.push({
        title: 'Digital Learning Cadence',
        action: `Access recorded lecture capsules and participate in at least 2 weekly discussion forum threads.`,
        priority: 'Medium',
        impact: '-5 to -8 Risk Pts'
      });
    }

    if (steps.length === 0) {
      steps.push({
        title: 'Maintain Academic Excellence',
        action: `Keep up current study habits, explore peer mentor leadership opportunities, and prepare for capstone research.`,
        priority: 'Low',
        impact: 'Maintains 0-15 Low Risk'
      });
    }

    return steps;
  },

  /**
   * Interactive What-If Simulator:
   * Predicts new risk score if student improves attendance, marks, assignments, or LMS
   */
  simulateWhatIf(currentMetrics, targetDeltas) {
    const hypothetical = {
      attendance: Math.min(100, Math.max(0, (Number(currentMetrics.attendance) || 0) + (Number(targetDeltas.attendanceDelta) || 0))),
      marks: Math.min(100, Math.max(0, (Number(currentMetrics.marks) || 0) + (Number(targetDeltas.marksDelta) || 0))),
      assignments: Math.min(100, Math.max(0, (Number(currentMetrics.assignments) || 0) + (Number(targetDeltas.assignmentsDelta) || 0))),
      lms: Math.min(100, Math.max(0, (Number(currentMetrics.lms) || 0) + (Number(targetDeltas.lmsDelta) || 0)))
    };

    const currentResult = this.evaluateStudent(currentMetrics);
    const simulatedResult = this.evaluateStudent(hypothetical);
    const scoreDiff = simulatedResult.score - currentResult.score;

    return {
      currentScore: currentResult.score,
      simulatedScore: simulatedResult.score,
      scoreDiff, // negative means improved (risk dropped)
      hypotheticalMetrics: hypothetical,
      simulatedTier: simulatedResult.tier,
      isRiskReduced: scoreDiff < 0
    };
  }
};

// Export to window for browser SPA usage
if (typeof window !== 'undefined') {
  window.RiskEngine = RiskEngine;
}
