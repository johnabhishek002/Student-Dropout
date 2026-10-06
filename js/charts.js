/**
 * EduGuard AI - Chart & Visual Analytics Module
 * 
 * Provides interactive charts using Chart.js with dark-mode styling,
 * gradients, responsive tooltips, and dynamic SVG gauges.
 */

const Charts = {
  instances: {},

  // Color Tokens matching UI design system
  colors: {
    low: '#10B981',
    lowAlpha: 'rgba(16, 185, 129, 0.25)',
    medium: '#F59E0B',
    mediumAlpha: 'rgba(245, 158, 11, 0.25)',
    high: '#EF4444',
    highAlpha: 'rgba(239, 68, 68, 0.25)',
    primary: '#6366F1',
    primaryAlpha: 'rgba(99, 102, 241, 0.2)',
    secondary: '#8B5CF6',
    cyan: '#06B6D4',
    gridColor: 'rgba(255, 255, 255, 0.07)',
    textColor: '#94A3B8'
  },

  destroyChart(id) {
    if (this.instances[id]) {
      this.instances[id].destroy();
      delete this.instances[id];
    }
  },

  /**
   * 1. Risk Tier Distribution Chart (Donut / Doughnut)
   */
  renderRiskDistributionChart(canvasId, students) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    this.destroyChart(canvasId);

    const counts = { low: 0, medium: 0, high: 0 };
    students.forEach(s => {
      const tier = s.evaluation?.tierKey || 'low';
      if (counts[tier] !== undefined) counts[tier]++;
    });

    if (typeof Chart === 'undefined') return;

    const ctx = canvas.getContext('2d');
    this.instances[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Low Risk (Safe)', 'Medium Risk (Monitor)', 'High Risk (Critical)'],
        datasets: [{
          data: [counts.low, counts.medium, counts.high],
          backgroundColor: [this.colors.low, this.colors.medium, this.colors.high],
          borderColor: '#111827',
          borderWidth: 3,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: this.colors.textColor,
              font: { family: "'Inter', sans-serif", size: 12 },
              padding: 16,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#F8FAFC',
            bodyColor: '#CBD5E1',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
            callbacks: {
              label: (context) => {
                const total = counts.low + counts.medium + counts.high;
                const pct = total ? Math.round((context.raw / total) * 100) : 0;
                return ` ${context.label}: ${context.raw} students (${pct}%)`;
              }
            }
          }
        },
        cutout: '72%'
      }
    });
  },

  /**
   * 2. Attendance vs Marks Correlation Scatter Chart
   */
  renderAttendanceMarksScatter(canvasId, students) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    this.destroyChart(canvasId);

    if (typeof Chart === 'undefined') return;

    const lowData = [];
    const medData = [];
    const highData = [];

    students.forEach(s => {
      const pt = {
        x: s.metrics.attendance,
        y: s.metrics.marks,
        name: s.name,
        id: s.studentId,
        dept: s.department,
        risk: s.evaluation?.score || 0
      };
      const tier = s.evaluation?.tierKey;
      if (tier === 'high') highData.push(pt);
      else if (tier === 'medium') medData.push(pt);
      else lowData.push(pt);
    });

    const ctx = canvas.getContext('2d');
    this.instances[canvasId] = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'High Risk',
            data: highData,
            backgroundColor: this.colors.high,
            borderColor: '#EF4444',
            pointRadius: 6,
            pointHoverRadius: 9
          },
          {
            label: 'Medium Risk',
            data: medData,
            backgroundColor: this.colors.medium,
            borderColor: '#F59E0B',
            pointRadius: 6,
            pointHoverRadius: 9
          },
          {
            label: 'Low Risk',
            data: lowData,
            backgroundColor: this.colors.low,
            borderColor: '#10B981',
            pointRadius: 6,
            pointHoverRadius: 9
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: this.colors.textColor,
              usePointStyle: true,
              pointStyle: 'circle',
              font: { family: "'Inter', sans-serif", size: 12 }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#F8FAFC',
            bodyColor: '#CBD5E1',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              title: (items) => {
                const raw = items[0].raw;
                return `${raw.name} (${raw.id}) - ${raw.dept}`;
              },
              label: (context) => {
                const raw = context.raw;
                return [
                  `Attendance: ${raw.x}%`,
                  `Internal Marks: ${raw.y}%`,
                  `Risk Score: ${raw.risk}/100`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Attendance Rate (%)',
              color: this.colors.textColor,
              font: { family: "'Inter', sans-serif", size: 12 }
            },
            min: 30,
            max: 100,
            grid: { color: this.colors.gridColor },
            ticks: { color: this.colors.textColor }
          },
          y: {
            title: {
              display: true,
              text: 'Internal Marks Average (%)',
              color: this.colors.textColor,
              font: { family: "'Inter', sans-serif", size: 12 }
            },
            min: 20,
            max: 100,
            grid: { color: this.colors.gridColor },
            ticks: { color: this.colors.textColor }
          }
        }
      }
    });
  },

  /**
   * 3. Department Risk Comparison Bar Chart
   */
  renderDepartmentComparison(canvasId, students) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    this.destroyChart(canvasId);

    if (typeof Chart === 'undefined') return;

    const depts = ['CS', 'IT', 'EC'];
    const deptStats = {
      CS: { total: 0, high: 0, med: 0, low: 0, riskSum: 0 },
      IT: { total: 0, high: 0, med: 0, low: 0, riskSum: 0 },
      EC: { total: 0, high: 0, med: 0, low: 0, riskSum: 0 }
    };

    students.forEach(s => {
      const d = s.department || 'CS';
      if (!deptStats[d]) deptStats[d] = { total: 0, high: 0, med: 0, low: 0, riskSum: 0 };
      deptStats[d].total++;
      deptStats[d].riskSum += (s.evaluation?.score || 0);
      const tier = s.evaluation?.tierKey;
      if (tier === 'high') deptStats[d].high++;
      else if (tier === 'medium') deptStats[d].med++;
      else deptStats[d].low++;
    });

    const ctx = canvas.getContext('2d');
    this.instances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Computer Science (CS)', 'Information Tech (IT)', 'Electronics & Comm (EC)'],
        datasets: [
          {
            label: 'High Risk',
            data: [deptStats.CS.high, deptStats.IT.high, deptStats.EC.high],
            backgroundColor: this.colors.high,
            borderRadius: 6
          },
          {
            label: 'Medium Risk',
            data: [deptStats.CS.med, deptStats.IT.med, deptStats.EC.med],
            backgroundColor: this.colors.medium,
            borderRadius: 6
          },
          {
            label: 'Low Risk',
            data: [deptStats.CS.low, deptStats.IT.low, deptStats.EC.low],
            backgroundColor: this.colors.low,
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: this.colors.textColor,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 12
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: this.colors.textColor }
          },
          y: {
            stacked: true,
            title: { display: true, text: 'Student Count', color: this.colors.textColor },
            grid: { color: this.colors.gridColor },
            ticks: { color: this.colors.textColor, stepSize: 1 }
          }
        }
      }
    });
  },

  /**
   * 4. Student 360° Skills & Engagement Radar Chart
   */
  renderSkillsRadar(canvasId, student) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    this.destroyChart(canvasId);

    if (typeof Chart === 'undefined') return;

    const radar = student.skillsRadar || {
      theory: student.metrics.marks,
      practical: student.metrics.assignments,
      participation: student.metrics.attendance,
      punctuality: student.metrics.attendance,
      collaboration: student.metrics.lms
    };

    const ctx = canvas.getContext('2d');
    this.instances[canvasId] = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Theory Mastery', 'Practical & Labs', 'LMS Participation', 'Attendance Punctuality', 'Teamwork / Forum'],
        datasets: [{
          label: `${student.name} Competency`,
          data: [radar.theory, radar.practical, radar.participation, radar.punctuality, radar.collaboration],
          backgroundColor: student.evaluation?.tierKey === 'high' 
            ? 'rgba(239, 68, 68, 0.25)' 
            : student.evaluation?.tierKey === 'medium'
              ? 'rgba(245, 158, 11, 0.25)'
              : 'rgba(16, 185, 129, 0.25)',
          borderColor: student.evaluation?.color || this.colors.primary,
          borderWidth: 2,
          pointBackgroundColor: student.evaluation?.color || this.colors.primary,
          pointBorderColor: '#fff',
          pointHoverRadius: 6
        },
        {
          label: 'Department Cohort Benchmark',
          data: [75, 78, 70, 80, 75],
          backgroundColor: 'rgba(99, 102, 241, 0.08)',
          borderColor: 'rgba(99, 102, 241, 0.4)',
          borderWidth: 1.5,
          borderDash: [4, 4],
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: this.colors.textColor, font: { size: 11 } }
          }
        },
        scales: {
          r: {
            angleLines: { color: this.colors.gridColor },
            grid: { color: this.colors.gridColor },
            pointLabels: { color: '#E2E8F0', font: { size: 11, family: "'Inter', sans-serif" } },
            ticks: { display: false, maxTicksLimit: 5, backdropColor: 'transparent' },
            suggestedMin: 20,
            suggestedMax: 100
          }
        }
      }
    });
  },

  /**
   * 5. Historical Trajectory Line Chart
   */
  renderStudentTrend(canvasId, student) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    this.destroyChart(canvasId);

    if (typeof Chart === 'undefined') return;

    const attTrend = student.history?.attendanceTrend || [75, 70, 65, student.metrics.attendance];
    const marksTrend = student.history?.marksTrend || [65, 60, 55, student.metrics.marks];
    const labels = ['Week 2', 'Week 4', 'Week 6', 'Week 8', 'Current (W10)'].slice(5 - attTrend.length);

    const ctx = canvas.getContext('2d');
    this.instances[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Attendance %',
            data: attTrend,
            borderColor: '#38BDF8',
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            tension: 0.35,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6
          },
          {
            label: 'Marks %',
            data: marksTrend,
            borderColor: '#A855F7',
            backgroundColor: 'rgba(168, 85, 247, 0.1)',
            tension: 0.35,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: this.colors.textColor, usePointStyle: true }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            grid: { color: this.colors.gridColor },
            ticks: { color: this.colors.textColor }
          },
          y: {
            min: 20,
            max: 100,
            grid: { color: this.colors.gridColor },
            ticks: { color: this.colors.textColor }
          }
        }
      }
    });
  },

  /**
   * 6. Render Dynamic SVG Circular Risk Gauge (Used on Student & Profile view)
   */
  createCircularGaugeSVG(score, tierColor = '#EF4444', size = 160) {
    const strokeWidth = 12;
    const radius = (size / 2) - strokeWidth;
    const circumference = 2 * Math.PI * radius;
    // Map score 0-100 to arc
    const progressOffset = circumference - ((score / 100) * circumference);

    return `
      <div class="circular-gauge" style="width: ${size}px; height: ${size}px; position: relative; margin: 0 auto;">
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform: rotate(-90deg);">
          <!-- Background track -->
          <circle
            cx="${size / 2}"
            cy="${size / 2}"
            r="${radius}"
            stroke="rgba(255, 255, 255, 0.08)"
            stroke-width="${strokeWidth}"
            fill="transparent"
          />
          <!-- Animated Progress Stroke -->
          <circle
            cx="${size / 2}"
            cy="${size / 2}"
            r="${radius}"
            stroke="${tierColor}"
            stroke-width="${strokeWidth}"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${progressOffset}"
            stroke-linecap="round"
            fill="transparent"
            style="transition: stroke-dashoffset 0.8s ease, stroke 0.5s ease;"
          />
        </svg>
        <div class="gauge-center" style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
          <span class="gauge-value" style="font-size: 2.2rem; font-weight: 800; color: #FFFFFF; line-height: 1; font-family: 'Outfit', sans-serif;">${score}</span>
          <span class="gauge-unit" style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: ${tierColor}; font-weight: 600; margin-top: 4px;">/ 100 Risk</span>
        </div>
      </div>
    `;
  }
};

if (typeof window !== 'undefined') {
  window.Charts = Charts;
}
