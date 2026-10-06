/**
 * EduGuard AI - User Interface Controller & View Renderers
 * 
 * Orchestrates views, tables, drawer panels, modals, toasts,
 * and live Explainable AI simulations.
 */

const UI = {
  currentView: 'faculty', // 'landing' | 'faculty' | 'student' | 'interventions'
  selectedStudentId: null,
  activeFilterDept: 'ALL',
  activeFilterRisk: 'ALL',
  activeSearchQuery: '',
  activeSortBy: 'risk_desc',

  init() {
    this.bindGlobalEvents();
    this.render();
  },

  bindGlobalEvents() {
    // Listen for Store updates
    window.addEventListener('eduguard:stateChanged', (e) => {
      this.render();
      if (e.detail?.type === 'student_added') {
        this.showToast(`Student ${e.detail.payload.name} added successfully!`, 'success');
      } else if (e.detail?.type === 'student_updated') {
        this.showToast(`Student ${e.detail.payload.name} updated. Risk recalculated.`, 'success');
      } else if (e.detail?.type === 'student_deleted') {
        this.showToast(`Student record removed.`, 'warning');
      } else if (e.detail?.type === 'intervention_added') {
        this.showToast(`Intervention assigned to ${e.detail.payload.studentName}!`, 'success');
      } else if (e.detail?.type === 'reset') {
        this.showToast(`Demo data restored to initial state.`, 'info');
      }
    });

    // Close drawer / modals on escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeDrawer();
        this.closeModals();
      }
    });
  },

  // ---------------- ROUTING & RENDERING ---------------- //

  navigate(viewName, studentId = null) {
    this.currentView = viewName;
    if (studentId) {
      this.selectedStudentId = studentId;
    }
    this.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  render() {
    const user = Store.getCurrentUser();
    this.renderNavbar(user);

    const mainContainer = document.getElementById('mainContentArea');
    if (!mainContainer) return;

    if (this.currentView === 'landing') {
      mainContainer.innerHTML = this.getLandingHTML();
      this.attachLandingEvents();
    } else if (this.currentView === 'student') {
      mainContainer.innerHTML = this.getStudentDashboardHTML();
      this.attachStudentDashboardEvents();
    } else if (this.currentView === 'interventions') {
      mainContainer.innerHTML = this.getInterventionsViewHTML();
      this.attachInterventionsEvents();
    } else {
      // Default to Faculty Dashboard
      mainContainer.innerHTML = this.getFacultyDashboardHTML();
      this.attachFacultyDashboardEvents();
    }
  },

  // ---------------- NAVBAR RENDERING ---------------- //

  renderNavbar(user) {
    const navbar = document.getElementById('appNavbar');
    if (!navbar) return;

    const currentEmail = user?.email || 'admin@edu.com';

    navbar.innerHTML = `
      <div class="brand-wrapper" onclick="UI.navigate('landing')">
        <div class="brand-logo-icon">🛡️</div>
        <div class="brand-text">
          <h1>EduGuard AI <span class="brand-badge">Hackathon Demo</span></h1>
          <div class="brand-subtitle">Student Dropout Risk Early Warning System</div>
        </div>
      </div>

      <div class="nav-actions">
        <!-- 1-Click Quick Demo Persona Switcher -->
        <div class="demo-switcher-wrap" title="Switch Demo Account instantly">
          <span class="demo-switcher-label">🎭 Demo Persona:</span>
          <select id="personaQuickSelect" class="persona-select" onchange="UI.handlePersonaSwitch(this.value)">
            <option value="admin@edu.com" ${currentEmail === 'admin@edu.com' ? 'selected' : ''}>👨‍🏫 Faculty: Dr. Aris Vance (Admin)</option>
            <option value="alex@edu.com" ${currentEmail === 'alex@edu.com' ? 'selected' : ''}>🔴 High Risk: Alex Rivera (CS)</option>
            <option value="sarah@edu.com" ${currentEmail === 'sarah@edu.com' ? 'selected' : ''}>🟡 Med Risk: Sarah Chen (IT)</option>
            <option value="jordan@edu.com" ${currentEmail === 'jordan@edu.com' ? 'selected' : ''}>🟢 Low Risk: Jordan Taylor (EC)</option>
          </select>
        </div>

        <button class="btn btn-sm btn-reset-demo" onclick="Store.resetToDemoData()" title="Reset mock data to fresh demo state">
          🔄 Reset Demo Data
        </button>

        ${user ? `
          <div class="user-profile-menu">
            <div class="user-avatar-badge">${user.avatar || '👤'}</div>
            <div class="user-info-snippet">
              <div class="user-name-snippet">${user.name}</div>
              <div class="user-role-badge">${user.role.toUpperCase()}</div>
            </div>
            <button class="btn btn-sm btn-secondary" onclick="UI.handleLogout()" style="margin-left: 0.5rem; padding: 4px 8px;">
              Exit
            </button>
          </div>
        ` : `
          <button class="btn btn-sm btn-primary" onclick="UI.openAuthModal('login')">Sign In</button>
        `}
      </div>
    `;
  },

  handlePersonaSwitch(email) {
    const res = Store.login(email);
    if (res.success) {
      if (res.user.role === 'student') {
        // Find matching student
        const stu = Store.getStudentByEmail(email);
        this.selectedStudentId = stu ? stu.id : 'STU-001';
        this.navigate('student', this.selectedStudentId);
      } else {
        this.navigate('faculty');
      }
      this.showToast(`Switched persona to ${res.user.name} (${res.user.role})`, 'success');
    }
  },

  handleLogout() {
    Store.logout();
    this.navigate('landing');
    this.showToast('Logged out successfully', 'info');
  },

  // ==========================================================================
  // 1. LANDING PAGE VIEW
  // ==========================================================================

  getLandingHTML() {
    return `
      <div class="landing-container">
        <!-- Hero Section -->
        <section class="hero-section">
          <div class="hero-pill-tag">
            <span>✨ AI-Powered Academic Retention Engine</span>
          </div>
          <h1 class="hero-title">
            Predict & Prevent <span class="hero-gradient-text">Student Dropout</span><br/>
            Before It's Too Late
          </h1>
          <p class="hero-subtitle">
            An explainable early-warning intelligence platform combining multi-tier statutory attendance, 
            internal exam marks, assignment trends, and LMS telemetry to rescue at-risk students proactively.
          </p>

          <div class="hero-cta-group">
            <button class="btn btn-lg btn-primary" onclick="UI.handlePersonaSwitch('admin@edu.com')">
              🚀 Launch Faculty Dashboard
            </button>
            <button class="btn btn-lg btn-secondary" onclick="UI.handlePersonaSwitch('alex@edu.com')">
              🧑‍💻 Test Student Portal (High-Risk)
            </button>
          </div>
        </section>

        <!-- 1-Click Hackathon Quick Demo Accounts Showcase -->
        <div class="demo-accounts-card">
          <div class="demo-accounts-header">
            <div>
              <h3>🎯 Hackathon 1-Click Demo Profiles</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
                Experience both Faculty and Student personas with realistic metrics and active interventions.
              </p>
            </div>
            <span class="risk-badge low">Instant 1-Click Login</span>
          </div>

          <div class="demo-account-grid">
            <!-- Faculty -->
            <div class="demo-login-tile" onclick="UI.handlePersonaSwitch('admin@edu.com')">
              <div>
                <span class="demo-tile-role" style="background: rgba(99, 102, 241, 0.2); color: #A5B4FC;">Faculty / Admin</span>
                <div class="demo-tile-name">Dr. Aris Vance</div>
                <div class="demo-tile-email">admin@edu.com</div>
              </div>
              <button class="btn btn-sm btn-primary" style="width: 100%;">Login as Faculty ➔</button>
            </div>

            <!-- High Risk -->
            <div class="demo-login-tile" onclick="UI.handlePersonaSwitch('alex@edu.com')">
              <div>
                <span class="demo-tile-role" style="background: var(--risk-high-bg); color: #F87171;">High Risk (81/100)</span>
                <div class="demo-tile-name">Alex Rivera</div>
                <div class="demo-tile-email">alex@edu.com (CS Dept)</div>
              </div>
              <button class="btn btn-sm btn-outline-danger" style="width: 100%;">View High Risk ➔</button>
            </div>

            <!-- Medium Risk -->
            <div class="demo-login-tile" onclick="UI.handlePersonaSwitch('sarah@edu.com')">
              <div>
                <span class="demo-tile-role" style="background: var(--risk-med-bg); color: #FBBF24;">Med Risk (51/100)</span>
                <div class="demo-tile-name">Sarah Chen</div>
                <div class="demo-tile-email">sarah@edu.com (IT Dept)</div>
              </div>
              <button class="btn btn-sm btn-secondary" style="width: 100%;">View Med Risk ➔</button>
            </div>

            <!-- Low Risk -->
            <div class="demo-login-tile" onclick="UI.handlePersonaSwitch('jordan@edu.com')">
              <div>
                <span class="demo-tile-role" style="background: var(--risk-low-bg); color: #34D399;">Low Risk (10/100)</span>
                <div class="demo-tile-name">Jordan Taylor</div>
                <div class="demo-tile-email">jordan@edu.com (EC Dept)</div>
              </div>
              <button class="btn btn-sm btn-secondary" style="width: 100%;">View Low Risk ➔</button>
            </div>
          </div>
        </div>

        <!-- System Architecture & Pillars -->
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon-box" style="background: rgba(99, 102, 241, 0.15); color: #818CF8;">⚖️</div>
            <h3 class="feature-title">Weighted Risk Engine</h3>
            <p class="feature-desc">
              Weighted formula: 35% Statutory Attendance (&lt;75% steep non-linear penalty), 30% Internal Marks, 20% Assignment Rate, 15% LMS telemetry.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon-box" style="background: rgba(16, 185, 129, 0.15); color: #34D399;">💡</div>
            <h3 class="feature-title">Explainable AI (XAI)</h3>
            <p class="feature-desc">
              No black-box guesses. Pinpoints top 3 explicit risk factors with mathematical point breakdown and transparent disclaimers.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon-box" style="background: rgba(245, 158, 11, 0.15); color: #FBBF24;">🤝</div>
            <h3 class="feature-title">Actionable Interventions</h3>
            <p class="feature-desc">
              Direct intervention dispatch: Attendance Recovery Protocols, Faculty 1-on-1s, Peer Tutoring, and Counselor referral workflows.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon-box" style="background: rgba(239, 68, 68, 0.15); color: #F87171;">🔮</div>
            <h3 class="feature-title">What-If Risk Simulator</h3>
            <p class="feature-desc">
              Interactive recovery calculator for students and mentors to test hypothetical scenarios and visualize risk reduction in real time.
            </p>
          </div>
        </div>

        <!-- Impact Statistics -->
        <div class="impact-stats-bar">
          <div class="stat-item">
            <h4>87%</h4>
            <p>Retention Improvement with Week-4 Interventions</p>
          </div>
          <div class="stat-item">
            <h4>3.2x</h4>
            <p>Faster Identification of At-Risk Students</p>
          </div>
          <div class="stat-item">
            <h4>100%</h4>
            <p>Explainable Factor Transparency</p>
          </div>
          <div class="stat-item">
            <h4>4 Pillars</h4>
            <p>Holistic Student Lifecycle Monitoring</p>
          </div>
        </div>
      </div>
    `;
  },

  attachLandingEvents() {
    // Landing page interactive hooks
  },

  // ==========================================================================
  // 2. FACULTY / ADMIN DASHBOARD VIEW
  // ==========================================================================

  getFacultyDashboardHTML() {
    const students = Store.getStudents();
    const interventions = Store.getInterventions();

    // Compute KPIs
    const totalStudents = students.length;
    let highRiskCount = 0;
    let medRiskCount = 0;
    let lowRiskCount = 0;
    let sumAttendance = 0;
    let sumMarks = 0;

    students.forEach(s => {
      const score = s.evaluation?.score || 0;
      if (score >= 70) highRiskCount++;
      else if (score >= 40) medRiskCount++;
      else lowRiskCount++;

      sumAttendance += Number(s.metrics.attendance) || 0;
      sumMarks += Number(s.metrics.marks) || 0;
    });

    const avgAttendance = totalStudents ? Math.round(sumAttendance / totalStudents) : 0;
    const avgMarks = totalStudents ? Math.round(sumMarks / totalStudents) : 0;

    return `
      <div class="app-layout">
        <!-- Sidebar Navigation -->
        <aside class="sidebar">
          <div>
            <ul class="sidebar-nav-list">
              <li class="sidebar-nav-item active">
                <button onclick="UI.navigate('faculty')">
                  <span class="nav-icon">📊</span> Faculty Dashboard
                </button>
              </li>
              <li class="sidebar-nav-item">
                <button onclick="UI.navigate('interventions')">
                  <span class="nav-icon">📋</span> Intervention Hub (${interventions.length})
                </button>
              </li>
              <li class="sidebar-nav-item">
                <button onclick="UI.handlePersonaSwitch('alex@edu.com')">
                  <span class="nav-icon">🧑‍💻</span> Student Portal View
                </button>
              </li>
            </ul>
          </div>

          <div class="sidebar-footer-card">
            <div style="font-weight: 700; color: #FFF; margin-bottom: 4px;">Faculty Operations</div>
            <div>Dept: Computer Science & Engineering</div>
            <div style="color: var(--indigo-500); margin-top: 6px;">Term: Fall 2026 (W10)</div>
          </div>
        </aside>

        <!-- Main Content Area -->
        <main class="content-area">
          <!-- Top Dashboard Header -->
          <div class="dashboard-header-row">
            <div class="dashboard-title-group">
              <h2>Faculty Risk Intelligence Center</h2>
              <p style="color: var(--text-muted); font-size: 0.9rem;">
                Real-time student retention monitoring across CS, IT, and EC departments.
              </p>
            </div>

            <div class="dashboard-actions-group">
              <button class="btn btn-secondary btn-sm" onclick="UI.exportStudentsCSV()">
                📥 Export CSV
              </button>
              <button class="btn btn-primary btn-sm" onclick="UI.openAddStudentModal()">
                ➕ Add Student
              </button>
            </div>
          </div>

          <!-- KPI Summary Cards -->
          <div class="kpi-cards-grid">
            <!-- Total Students -->
            <div class="kpi-card">
              <div class="kpi-header">
                <span class="kpi-title">Total Enrolled</span>
                <div class="kpi-icon-badge" style="background: rgba(99, 102, 241, 0.15); color: #818CF8;">👥</div>
              </div>
              <div class="kpi-value">${totalStudents}</div>
              <div class="kpi-subtext">Active cohort size</div>
            </div>

            <!-- High Risk Count -->
            <div class="kpi-card" style="border-color: rgba(239, 68, 68, 0.4);">
              <div class="kpi-header">
                <span class="kpi-title" style="color: #F87171;">Critical High Risk</span>
                <div class="kpi-icon-badge" style="background: var(--risk-high-bg); color: #EF4444;">🚨</div>
              </div>
              <div class="kpi-value" style="color: #F87171;">${highRiskCount}</div>
              <div class="kpi-subtext">
                <span class="beacon-dot" style="background: #EF4444; width: 6px; height: 6px;"></span>
                Immediate intervention required
              </div>
            </div>

            <!-- Medium Risk Count -->
            <div class="kpi-card" style="border-color: rgba(245, 158, 11, 0.3);">
              <div class="kpi-header">
                <span class="kpi-title" style="color: #FBBF24;">Needs Attention</span>
                <div class="kpi-icon-badge" style="background: var(--risk-med-bg); color: #F59E0B;">⚠️</div>
              </div>
              <div class="kpi-value" style="color: #FBBF24;">${medRiskCount}</div>
              <div class="kpi-subtext">Borderline attendance / marks</div>
            </div>

            <!-- Low Risk Count -->
            <div class="kpi-card">
              <div class="kpi-header">
                <span class="kpi-title" style="color: #34D399;">Safe Retention</span>
                <div class="kpi-icon-badge" style="background: var(--risk-low-bg); color: #10B981;">🛡️</div>
              </div>
              <div class="kpi-value" style="color: #34D399;">${lowRiskCount}</div>
              <div class="kpi-subtext">${totalStudents ? Math.round((lowRiskCount / totalStudents) * 100) : 0}% Cohort Stability</div>
            </div>

            <!-- Average Attendance -->
            <div class="kpi-card">
              <div class="kpi-header">
                <span class="kpi-title">Avg Attendance</span>
                <div class="kpi-icon-badge" style="background: rgba(6, 182, 212, 0.15); color: #22D3EE;">📅</div>
              </div>
              <div class="kpi-value">${avgAttendance}%</div>
              <div class="kpi-subtext" style="color: ${avgAttendance >= 75 ? '#34D399' : '#F87171'};">
                ${avgAttendance >= 75 ? '✓ Above statutory 75%' : '⚠ Below university cutoff'}
              </div>
            </div>

            <!-- Average Internal Marks -->
            <div class="kpi-card">
              <div class="kpi-header">
                <span class="kpi-title">Avg Internal Marks</span>
                <div class="kpi-icon-badge" style="background: rgba(168, 85, 247, 0.15); color: #C084FC;">📝</div>
              </div>
              <div class="kpi-value">${avgMarks}%</div>
              <div class="kpi-subtext">Target benchmark: 65%</div>
            </div>
          </div>

          <!-- Charts Grid -->
          <div class="charts-grid">
            <!-- Chart 1: Risk Tier Distribution -->
            <div class="chart-card">
              <div class="chart-card-header">
                <h3>📊 Cohort Risk Tier Breakdown</h3>
                <span class="risk-badge low" style="font-size: 0.7rem;">Live XAI Classification</span>
              </div>
              <div class="chart-container-box">
                <canvas id="riskDistributionChart"></canvas>
              </div>
            </div>

            <!-- Chart 2: Attendance vs Marks Scatter Plot -->
            <div class="chart-card">
              <div class="chart-card-header">
                <h3>🎯 Attendance vs. Marks Correlation Matrix</h3>
                <span style="font-size: 0.75rem; color: var(--text-dim);">Red quadrant indicates high dropout risk</span>
              </div>
              <div class="chart-container-box">
                <canvas id="attendanceScatterChart"></canvas>
              </div>
            </div>
          </div>

          <!-- Department Comparison Bar Chart -->
          <div class="chart-card" style="margin-bottom: 2rem;">
            <div class="chart-card-header">
              <h3>🏢 Department-wise Risk Distribution (CS vs IT vs EC)</h3>
              <span style="font-size: 0.75rem; color: var(--text-dim);">Breakdown by academic department</span>
            </div>
            <div class="chart-container-box" style="height: 240px;">
              <canvas id="deptComparisonChart"></canvas>
            </div>
          </div>

          <!-- Student Directory Table -->
          <div class="data-table-card">
            <div class="table-toolbar">
              <div class="search-box-wrap">
                <span class="search-icon">🔍</span>
                <input 
                  type="text" 
                  class="table-search-input" 
                  placeholder="Search student name, ID, or email..." 
                  value="${this.activeSearchQuery}"
                  oninput="UI.handleTableSearch(this.value)"
                />
              </div>

              <div class="table-filters-group">
                <!-- Department Filter -->
                <select class="filter-select" onchange="UI.handleDeptFilter(this.value)">
                  <option value="ALL" ${this.activeFilterDept === 'ALL' ? 'selected' : ''}>All Departments</option>
                  <option value="CS" ${this.activeFilterDept === 'CS' ? 'selected' : ''}>Computer Science (CS)</option>
                  <option value="IT" ${this.activeFilterDept === 'IT' ? 'selected' : ''}>Information Tech (IT)</option>
                  <option value="EC" ${this.activeFilterDept === 'EC' ? 'selected' : ''}>Electronics & Comm (EC)</option>
                </select>

                <!-- Risk Filter -->
                <select class="filter-select" onchange="UI.handleRiskFilter(this.value)">
                  <option value="ALL" ${this.activeFilterRisk === 'ALL' ? 'selected' : ''}>All Risk Tiers</option>
                  <option value="high" ${this.activeFilterRisk === 'high' ? 'selected' : ''}>High Risk (70-100)</option>
                  <option value="medium" ${this.activeFilterRisk === 'medium' ? 'selected' : ''}>Medium Risk (40-69)</option>
                  <option value="low" ${this.activeFilterRisk === 'low' ? 'selected' : ''}>Low Risk (0-39)</option>
                </select>

                <!-- Sorting -->
                <select class="filter-select" onchange="UI.handleSortChange(this.value)">
                  <option value="risk_desc" ${this.activeSortBy === 'risk_desc' ? 'selected' : ''}>Sort: Highest Risk First</option>
                  <option value="risk_asc" ${this.activeSortBy === 'risk_asc' ? 'selected' : ''}>Sort: Lowest Risk First</option>
                  <option value="attendance_asc" ${this.activeSortBy === 'attendance_asc' ? 'selected' : ''}>Sort: Lowest Attendance</option>
                  <option value="marks_asc" ${this.activeSortBy === 'marks_asc' ? 'selected' : ''}>Sort: Lowest Marks</option>
                  <option value="name_asc" ${this.activeSortBy === 'name_asc' ? 'selected' : ''}>Sort: Student Name</option>
                </select>
              </div>
            </div>

            <!-- Table Body -->
            <div class="table-responsive-wrapper">
              <table class="students-table">
                <thead>
                  <tr>
                    <th>Student Info</th>
                    <th>Dept</th>
                    <th>Attendance</th>
                    <th>Marks</th>
                    <th>LMS Index</th>
                    <th>Risk Score</th>
                    <th>Primary XAI Driver</th>
                    <th style="text-align: right;">Quick Actions</th>
                  </tr>
                </thead>
                <tbody id="studentTableBody">
                  ${this.getFilteredStudentsTableRowsHTML()}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    `;
  },

  getFilteredStudentsTableRowsHTML() {
    let list = Store.getStudents();

    // Search query filter
    if (this.activeSearchQuery.trim()) {
      const q = this.activeSearchQuery.trim().toLowerCase();
      list = list.filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      );
    }

    // Department filter
    if (this.activeFilterDept !== 'ALL') {
      list = list.filter(s => s.department === this.activeFilterDept);
    }

    // Risk Tier filter
    if (this.activeFilterRisk !== 'ALL') {
      list = list.filter(s => s.evaluation?.tierKey === this.activeFilterRisk);
    }

    // Sorting
    list.sort((a, b) => {
      if (this.activeSortBy === 'risk_desc') return (b.evaluation?.score || 0) - (a.evaluation?.score || 0);
      if (this.activeSortBy === 'risk_asc') return (a.evaluation?.score || 0) - (b.evaluation?.score || 0);
      if (this.activeSortBy === 'attendance_asc') return a.metrics.attendance - b.metrics.attendance;
      if (this.activeSortBy === 'marks_asc') return a.metrics.marks - b.metrics.marks;
      if (this.activeSortBy === 'name_asc') return a.name.localeCompare(b.name);
      return 0;
    });

    if (list.length === 0) {
      return `
        <tr>
          <td colspan="8" style="text-align: center; padding: 3rem; color: var(--text-dim);">
            🔍 No students match the selected filter criteria.
          </td>
        </tr>
      `;
    }

    return list.map(student => {
      const evalRes = student.evaluation || RiskEngine.evaluateStudent(student.metrics);
      const tierKey = evalRes.tierKey;
      const attColor = student.metrics.attendance < 75 ? '#EF4444' : student.metrics.attendance < 85 ? '#F59E0B' : '#10B981';
      const marksColor = student.metrics.marks < 50 ? '#EF4444' : student.metrics.marks < 70 ? '#F59E0B' : '#10B981';

      return `
        <tr>
          <td>
            <div class="student-meta-cell" style="cursor: pointer;" onclick="UI.openStudentDrawer('${student.id}')">
              <div class="student-avatar">${student.avatar || '🎓'}</div>
              <div>
                <span class="student-name-bold">${student.name}</span>
                <span class="student-id-code">${student.studentId} • ${student.email}</span>
              </div>
            </div>
          </td>
          <td>
            <span class="dept-badge ${student.department}">${student.department}</span>
          </td>
          <td>
            <div class="metric-cell-wrap">
              <div class="metric-number-line">
                <span style="color: ${attColor};">${student.metrics.attendance}%</span>
                <span style="color: var(--text-dim); font-size: 0.7rem;">Cutoff 75%</span>
              </div>
              <div class="mini-progress-track">
                <div class="mini-progress-fill" style="width: ${student.metrics.attendance}%; background: ${attColor};"></div>
              </div>
            </div>
          </td>
          <td>
            <div class="metric-cell-wrap">
              <div class="metric-number-line">
                <span style="color: ${marksColor};">${student.metrics.marks}%</span>
                <span style="color: var(--text-dim); font-size: 0.7rem;">Pass 50%</span>
              </div>
              <div class="mini-progress-track">
                <div class="mini-progress-fill" style="width: ${student.metrics.marks}%; background: ${marksColor};"></div>
              </div>
            </div>
          </td>
          <td>
            <div style="font-weight: 700; color: #FFF;">${student.metrics.lms} <span style="font-size: 0.72rem; color: var(--text-dim);">/ 100</span></div>
          </td>
          <td>
            <span class="risk-badge ${tierKey}">
              <span class="beacon-dot"></span>
              ${evalRes.score} • ${evalRes.tierLabel}
            </span>
          </td>
          <td style="max-width: 260px;">
            <div style="font-size: 0.82rem; color: ${evalRes.color}; line-height: 1.3;" title="${evalRes.primaryDriver}">
              ${evalRes.primaryDriver}
            </div>
          </td>
          <td style="text-align: right;">
            <div class="actions-cell-group" style="justify-content: flex-end;">
              <button class="btn btn-sm btn-secondary" onclick="UI.openStudentDrawer('${student.id}')" title="View 360° Profile Drawer">
                🔍 360°
              </button>
              <button class="btn btn-sm btn-primary" onclick="UI.openInterveneModal('${student.id}')" title="Trigger Retention Intervention">
                ⚡ Intervene
              </button>
              <button class="btn btn-sm btn-secondary" onclick="UI.openEditStudentModal('${student.id}')" title="Edit Student">
                ✏️
              </button>
              <button class="btn btn-sm btn-outline-danger" onclick="UI.confirmDeleteStudent('${student.id}')" title="Delete Record">
                🗑️
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  attachFacultyDashboardEvents() {
    const students = Store.getStudents();
    // Render charts
    setTimeout(() => {
      Charts.renderRiskDistributionChart('riskDistributionChart', students);
      Charts.renderAttendanceMarksScatter('attendanceScatterChart', students);
      Charts.renderDepartmentComparison('deptComparisonChart', students);
    }, 50);
  },

  handleTableSearch(query) {
    this.activeSearchQuery = query;
    const tbody = document.getElementById('studentTableBody');
    if (tbody) tbody.innerHTML = this.getFilteredStudentsTableRowsHTML();
  },

  handleDeptFilter(dept) {
    this.activeFilterDept = dept;
    const tbody = document.getElementById('studentTableBody');
    if (tbody) tbody.innerHTML = this.getFilteredStudentsTableRowsHTML();
  },

  handleRiskFilter(tier) {
    this.activeFilterRisk = tier;
    const tbody = document.getElementById('studentTableBody');
    if (tbody) tbody.innerHTML = this.getFilteredStudentsTableRowsHTML();
  },

  handleSortChange(sortVal) {
    this.activeSortBy = sortVal;
    const tbody = document.getElementById('studentTableBody');
    if (tbody) tbody.innerHTML = this.getFilteredStudentsTableRowsHTML();
  },

  exportStudentsCSV() {
    const students = Store.getStudents();
    const headers = ['Student ID', 'Full Name', 'Email', 'Department', 'Attendance %', 'Internal Marks %', 'Assignment %', 'LMS Score', 'Risk Score', 'Risk Tier', 'Top Risk Driver'];
    const rows = students.map(s => {
      const e = s.evaluation || RiskEngine.evaluateStudent(s.metrics);
      return [
        `"${s.studentId}"`,
        `"${s.name}"`,
        `"${s.email}"`,
        `"${s.department}"`,
        s.metrics.attendance,
        s.metrics.marks,
        s.metrics.assignments,
        s.metrics.lms,
        e.score,
        `"${e.tierLabel}"`,
        `"${e.primaryDriver.replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EduGuard_Student_Risk_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showToast('CSV Export downloaded successfully!', 'success');
  },

  // ==========================================================================
  // 3. STUDENT DASHBOARD VIEW
  // ==========================================================================

  getStudentDashboardHTML() {
    // Current student
    const user = Store.getCurrentUser();
    let student = null;
    if (this.selectedStudentId) {
      student = Store.getStudentById(this.selectedStudentId);
    }
    if (!student && user) {
      student = Store.getStudentByEmail(user.email);
    }
    if (!student) {
      student = Store.getStudents()[0];
    }

    const evalRes = student.evaluation || RiskEngine.evaluateStudent(student.metrics);
    const interventions = Store.getInterventionsForStudent(student.studentId);

    return `
      <div class="app-layout">
        <!-- Sidebar Navigation -->
        <aside class="sidebar">
          <div>
            <ul class="sidebar-nav-list">
              <li class="sidebar-nav-item active">
                <button onclick="UI.navigate('student', '${student.id}')">
                  <span class="nav-icon">🧑‍🎓</span> My Risk Overview
                </button>
              </li>
              <li class="sidebar-nav-item">
                <button onclick="UI.navigate('faculty')">
                  <span class="nav-icon">👨‍🏫</span> Faculty Dashboard
                </button>
              </li>
            </ul>
          </div>

          <div class="sidebar-footer-card">
            <div style="font-weight: 700; color: #FFF; margin-bottom: 4px;">Student Advisor</div>
            <div>${student.advisor || 'Dr. Aris Vance'}</div>
            <div style="color: var(--text-dim); margin-top: 4px;">Office: CS-Wing 302</div>
          </div>
        </aside>

        <!-- Main Content Area -->
        <main class="content-area">
          <!-- Student Hero Header -->
          <div class="student-hero-banner">
            <div class="student-meta-summary">
              <div class="student-large-avatar">${student.avatar || '🎓'}</div>
              <div>
                <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 4px;">
                  <h2 style="font-size: 1.8rem; margin: 0;">${student.name}</h2>
                  <span class="dept-badge ${student.department}">${student.department} Dept</span>
                </div>
                <div style="color: var(--text-muted); font-size: 0.88rem;">
                  ID: <strong style="color: #FFF;">${student.studentId}</strong> • ${student.semester} • Email: ${student.email}
                </div>
              </div>
            </div>

            <!-- Risk Meter Gauge -->
            <div style="display: flex; align-items: center; gap: 1.5rem;">
              <div>
                ${Charts.createCircularGaugeSVG(evalRes.score, evalRes.color, 140)}
              </div>
              <div>
                <span class="risk-badge ${evalRes.tierKey}" style="font-size: 0.85rem;">
                  <span class="beacon-dot"></span>
                  ${evalRes.tierLabel}
                </span>
                <p style="font-size: 0.78rem; color: var(--text-dim); max-width: 180px; margin-top: 6px;">
                  Real-time composite prediction based on 4 academic vectors.
                </p>
                <button class="btn btn-sm btn-primary" style="margin-top: 8px;" onclick="UI.openRequestHelpModal('${student.id}')">
                  🙋 Request Academic Help
                </button>
              </div>
            </div>
          </div>

          <!-- 4 Core Pillars Grid -->
          <div class="student-metrics-quad-grid">
            <!-- Attendance -->
            <div class="pillar-card">
              <div>
                <div class="pillar-header">
                  <span class="pillar-label">Statutory Attendance</span>
                  <span style="font-size: 1.2rem;">📅</span>
                </div>
                <div class="pillar-value" style="color: ${student.metrics.attendance < 75 ? '#EF4444' : '#10B981'};">
                  ${student.metrics.attendance}%
                </div>
              </div>
              <div>
                <div class="mini-progress-track" style="margin-bottom: 6px;">
                  <div class="mini-progress-fill" style="width: ${student.metrics.attendance}%; background: ${student.metrics.attendance < 75 ? '#EF4444' : '#10B981'};"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-dim);">
                  <span>Min Req: 75%</span>
                  <span>Weight: 35%</span>
                </div>
              </div>
            </div>

            <!-- Internal Marks -->
            <div class="pillar-card">
              <div>
                <div class="pillar-header">
                  <span class="pillar-label">Internal Exam Marks</span>
                  <span style="font-size: 1.2rem;">📝</span>
                </div>
                <div class="pillar-value" style="color: ${student.metrics.marks < 50 ? '#EF4444' : '#10B981'};">
                  ${student.metrics.marks}%
                </div>
              </div>
              <div>
                <div class="mini-progress-track" style="margin-bottom: 6px;">
                  <div class="mini-progress-fill" style="width: ${student.metrics.marks}%; background: ${student.metrics.marks < 50 ? '#EF4444' : '#10B981'};"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-dim);">
                  <span>Pass Cutoff: 50%</span>
                  <span>Weight: 30%</span>
                </div>
              </div>
            </div>

            <!-- Assignments -->
            <div class="pillar-card">
              <div>
                <div class="pillar-header">
                  <span class="pillar-label">Coursework / Labs</span>
                  <span style="font-size: 1.2rem;">🔬</span>
                </div>
                <div class="pillar-value" style="color: ${student.metrics.assignments < 60 ? '#EF4444' : '#10B981'};">
                  ${student.metrics.assignments}%
                </div>
              </div>
              <div>
                <div class="mini-progress-track" style="margin-bottom: 6px;">
                  <div class="mini-progress-fill" style="width: ${student.metrics.assignments}%; background: ${student.metrics.assignments < 60 ? '#EF4444' : '#10B981'};"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-dim);">
                  <span>Submission Rate</span>
                  <span>Weight: 20%</span>
                </div>
              </div>
            </div>

            <!-- LMS Engagement -->
            <div class="pillar-card">
              <div>
                <div class="pillar-header">
                  <span class="pillar-label">LMS Portal Telemetry</span>
                  <span style="font-size: 1.2rem;">💻</span>
                </div>
                <div class="pillar-value" style="color: ${student.metrics.lms < 50 ? '#EF4444' : '#10B981'};">
                  ${student.metrics.lms} <span style="font-size: 1rem; color: var(--text-dim);">/ 100</span>
                </div>
              </div>
              <div>
                <div class="mini-progress-track" style="margin-bottom: 6px;">
                  <div class="mini-progress-fill" style="width: ${student.metrics.lms}%; background: ${student.metrics.lms < 50 ? '#EF4444' : '#10B981'};"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-dim);">
                  <span>Resource Logins</span>
                  <span>Weight: 15%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Explainable AI Diagnostic Factors Card -->
          <div class="factors-breakdown-card">
            <h3 style="font-size: 1.15rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
              <span>💡</span> Top 3 Contributing Dropout Risk Drivers (Explainable AI Breakdown)
            </h3>
            
            <div>
              ${evalRes.topFactors.map(f => `
                <div class="factor-item">
                  <div class="factor-icon-indicator" style="background: ${f.status === 'critical' ? 'var(--risk-high-bg)' : f.status === 'warning' ? 'var(--risk-med-bg)' : 'var(--risk-low-bg)'}; color: ${f.status === 'critical' ? '#EF4444' : f.status === 'warning' ? '#F59E0B' : '#10B981'};">
                    ${f.status === 'critical' ? '⚠️' : f.status === 'warning' ? '⚡' : '✓'}
                  </div>
                  <div style="flex: 1;">
                    <div class="factor-title-line">${f.metric} (${f.raw}%)</div>
                    <div class="factor-desc-text">${f.description}</div>
                  </div>
                  <div style="text-align: right;">
                    <span class="factor-weight-tag" style="background: rgba(255, 255, 255, 0.05); color: #FFF;">+${f.riskPoints} Risk Pts</span>
                    <div style="font-size: 0.7rem; color: var(--text-dim); margin-top: 2px;">Impact: ${f.pctImpact}%</div>
                  </div>
                </div>
              `).join('')}
            </div>

            <div class="ai-disclaimer-box">
              <strong>Institutional Disclaimer:</strong> ${evalRes.disclaimer}
            </div>
          </div>

          <!-- Interactive What-If Simulator -->
          <div class="simulator-card">
            <div class="simulator-header">
              <div>
                <h3 style="font-size: 1.2rem; display: flex; align-items: center; gap: 0.5rem;">
                  <span>🔮</span> Interactive "What-If" Academic Recovery Simulator
                </h3>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
                  Test hypothetical recovery efforts to see how attending future lectures and submitting pending labs lowers your risk.
                </p>
              </div>
              <button class="btn btn-sm btn-secondary" onclick="UI.resetWhatIfSliders('${student.id}')">Reset Sliders</button>
            </div>

            <div class="simulator-sliders-grid">
              <!-- Attendance Slider -->
              <div class="slider-group">
                <div class="slider-label-row">
                  <span>Additional Lecture Attendance</span>
                  <span id="attDeltaBadge" class="slider-delta-badge">+0%</span>
                </div>
                <input 
                  type="range" 
                  id="simAttRange" 
                  class="sim-range-input" 
                  min="0" 
                  max="30" 
                  value="0" 
                  oninput="UI.handleWhatIfInput('${student.id}')"
                />
                <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-dim); margin-top: 4px;">
                  <span>Current: ${student.metrics.attendance}%</span>
                  <span>Target: Up to +30%</span>
                </div>
              </div>

              <!-- Marks Slider -->
              <div class="slider-group">
                <div class="slider-label-row">
                  <span>Upcoming Midterm Exam Improvement</span>
                  <span id="marksDeltaBadge" class="slider-delta-badge">+0%</span>
                </div>
                <input 
                  type="range" 
                  id="simMarksRange" 
                  class="sim-range-input" 
                  min="0" 
                  max="35" 
                  value="0" 
                  oninput="UI.handleWhatIfInput('${student.id}')"
                />
                <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-dim); margin-top: 4px;">
                  <span>Current: ${student.metrics.marks}%</span>
                  <span>Target: Up to +35%</span>
                </div>
              </div>

              <!-- Assignments Slider -->
              <div class="slider-group">
                <div class="slider-label-row">
                  <span>Pending Assignment Submissions</span>
                  <span id="assignDeltaBadge" class="slider-delta-badge">+0%</span>
                </div>
                <input 
                  type="range" 
                  id="simAssignRange" 
                  class="sim-range-input" 
                  min="0" 
                  max="40" 
                  value="0" 
                  oninput="UI.handleWhatIfInput('${student.id}')"
                />
                <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-dim); margin-top: 4px;">
                  <span>Current: ${student.metrics.assignments}%</span>
                  <span>Target: Up to +40%</span>
                </div>
              </div>

              <!-- LMS Engagement Slider -->
              <div class="slider-group">
                <div class="slider-label-row">
                  <span>Weekly LMS Study Hours & Quiz Practice</span>
                  <span id="lmsDeltaBadge" class="slider-delta-badge">+0 Pts</span>
                </div>
                <input 
                  type="range" 
                  id="simLmsRange" 
                  class="sim-range-input" 
                  min="0" 
                  max="40" 
                  value="0" 
                  oninput="UI.handleWhatIfInput('${student.id}')"
                />
                <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-dim); margin-top: 4px;">
                  <span>Current: ${student.metrics.lms}/100</span>
                  <span>Target: Up to +40</span>
                </div>
              </div>
            </div>

            <!-- Dynamic Output Banner -->
            <div class="sim-output-banner" id="simOutputBanner">
              <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="font-size: 2rem;" id="simIconIndicator">🔮</div>
                <div>
                  <div style="font-weight: 700; color: #FFF; font-size: 1rem;">
                    Simulated Projected Risk: <span id="simScoreVal" style="color: ${evalRes.color}; font-size: 1.3rem;">${evalRes.score}</span> / 100
                  </div>
                  <div id="simMessageText" style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">
                    Adjust sliders above to test your risk reduction roadmap.
                  </div>
                </div>
              </div>

              <div>
                <span id="simTierBadge" class="risk-badge ${evalRes.tierKey}">
                  ${evalRes.tierLabel}
                </span>
              </div>
            </div>
          </div>

          <!-- Step-by-Step AI Guidance & Active Interventions -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
            <!-- AI Guidance Card -->
            <div class="chart-card">
              <h3 style="font-size: 1.1rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🎯</span> Recommended Recovery Steps
              </h3>
              <div class="guidance-list">
                ${evalRes.guidance.map(g => `
                  <div class="guidance-step-card">
                    <div>
                      <div style="font-weight: 700; color: #FFF; font-size: 0.88rem; margin-bottom: 2px;">
                        ${g.title}
                      </div>
                      <div style="font-size: 0.82rem; color: var(--text-muted);">
                        ${g.action}
                      </div>
                    </div>
                    <div style="text-align: right; flex-shrink: 0;">
                      <span class="risk-badge ${g.priority === 'Urgent' ? 'high' : g.priority === 'High' ? 'medium' : 'low'}" style="font-size: 0.68rem;">
                        ${g.priority}
                      </span>
                      <div style="font-size: 0.72rem; color: #34D399; font-weight: 600; margin-top: 4px;">
                        ${g.impact}
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Interventions Tracked by Faculty -->
            <div class="chart-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3 style="font-size: 1.1rem; margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                  <span>📋</span> Faculty Intervention Log
                </h3>
                <span style="font-size: 0.75rem; color: var(--text-dim);">${interventions.length} Assigned</span>
              </div>

              ${interventions.length === 0 ? `
                <div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-dim); font-size: 0.85rem;">
                  🎉 No active faculty intervention plans required at this time.
                </div>
              ` : `
                <div class="guidance-list">
                  ${interventions.map(intv => `
                    <div class="guidance-step-card" style="border-left: 3px solid ${intv.status === 'Resolved' ? '#10B981' : intv.status === 'In Progress' ? '#6366F1' : '#F59E0B'};">
                      <div>
                        <div style="font-weight: 700; color: #FFF; font-size: 0.88rem;">
                          ${intv.type}
                        </div>
                        <div style="font-size: 0.8rem; color: var(--text-muted); margin: 2px 0;">
                          Mentor: ${intv.faculty} • Due: ${intv.dueDate}
                        </div>
                        <div style="font-size: 0.78rem; color: var(--text-dim); font-style: italic;">
                          "${intv.notes}"
                        </div>
                      </div>
                      <div style="flex-shrink: 0; text-align: right;">
                        <span class="risk-badge ${intv.status === 'Resolved' ? 'low' : intv.status === 'In Progress' ? 'medium' : 'high'}" style="font-size: 0.7rem;">
                          ${intv.status}
                        </span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>
          </div>
        </main>
      </div>
    `;
  },

  attachStudentDashboardEvents() {
    // Simulator events are attached inline via UI.handleWhatIfInput
  },

  handleWhatIfInput(studentId) {
    const student = Store.getStudentById(studentId);
    if (!student) return;

    const attDelta = Number(document.getElementById('simAttRange')?.value || 0);
    const marksDelta = Number(document.getElementById('simMarksRange')?.value || 0);
    const assignDelta = Number(document.getElementById('simAssignRange')?.value || 0);
    const lmsDelta = Number(document.getElementById('simLmsRange')?.value || 0);

    // Update Badges
    const bAtt = document.getElementById('attDeltaBadge');
    if (bAtt) bAtt.innerText = `+${attDelta}%`;
    const bMarks = document.getElementById('marksDeltaBadge');
    if (bMarks) bMarks.innerText = `+${marksDelta}%`;
    const bAssign = document.getElementById('assignDeltaBadge');
    if (bAssign) bAssign.innerText = `+${assignDelta}%`;
    const bLms = document.getElementById('lmsDeltaBadge');
    if (bLms) bLms.innerText = `+${lmsDelta} Pts`;

    const simResult = RiskEngine.simulateWhatIf(student.metrics, {
      attendanceDelta: attDelta,
      marksDelta: marksDelta,
      assignmentsDelta: assignDelta,
      lmsDelta: lmsDelta
    });

    const scoreElem = document.getElementById('simScoreVal');
    const tierElem = document.getElementById('simTierBadge');
    const msgElem = document.getElementById('simMessageText');
    const iconElem = document.getElementById('simIconIndicator');

    if (scoreElem) {
      scoreElem.innerText = simResult.simulatedScore;
      scoreElem.style.color = simResult.simulatedTier.color;
    }

    if (tierElem) {
      tierElem.className = `risk-badge ${simResult.simulatedTier.key}`;
      tierElem.innerText = simResult.simulatedTier.label;
    }

    if (msgElem) {
      if (simResult.scoreDiff < 0) {
        msgElem.innerHTML = `<strong style="color: #34D399;">Great news!</strong> Projected risk drops by <strong>${Math.abs(simResult.scoreDiff)} points</strong> (from ${simResult.currentScore} to ${simResult.simulatedScore}). Safe progression achieved!`;
        if (iconElem) iconElem.innerText = '🎉';
      } else {
        msgElem.innerText = 'Drag sliders above to simulate improvements in attendance, exams, or labs.';
        if (iconElem) iconElem.innerText = '🔮';
      }
    }
  },

  resetWhatIfSliders(studentId) {
    const ids = ['simAttRange', 'simMarksRange', 'simAssignRange', 'simLmsRange'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = 0;
    });
    this.handleWhatIfInput(studentId);
  },

  // ==========================================================================
  // 4. INTERVENTIONS HUB VIEW
  // ==========================================================================

  getInterventionsViewHTML() {
    const list = Store.getInterventions();

    return `
      <div class="app-layout">
        <!-- Sidebar Navigation -->
        <aside class="sidebar">
          <div>
            <ul class="sidebar-nav-list">
              <li class="sidebar-nav-item">
                <button onclick="UI.navigate('faculty')">
                  <span class="nav-icon">📊</span> Faculty Dashboard
                </button>
              </li>
              <li class="sidebar-nav-item active">
                <button onclick="UI.navigate('interventions')">
                  <span class="nav-icon">📋</span> Intervention Hub (${list.length})
                </button>
              </li>
            </ul>
          </div>
        </aside>

        <!-- Main Content Area -->
        <main class="content-area">
          <div class="dashboard-header-row">
            <div>
              <h2>Intervention & Action Tracking Center</h2>
              <p style="color: var(--text-muted); font-size: 0.9rem;">
                Manage and audit all faculty-assigned retention interventions and recovery roadmaps.
              </p>
            </div>
            <div>
              <button class="btn btn-primary btn-sm" onclick="UI.openInterveneModal()">
                ⚡ Assign New Intervention
              </button>
            </div>
          </div>

          <div class="data-table-card">
            <div class="table-responsive-wrapper">
              <table class="students-table">
                <thead>
                  <tr>
                    <th>Student Target</th>
                    <th>Dept</th>
                    <th>Intervention Type</th>
                    <th>Priority</th>
                    <th>Faculty Lead</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th style="text-align: right;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${list.map(intv => `
                    <tr>
                      <td>
                        <strong style="color: #FFF;">${intv.studentName}</strong>
                        <div style="font-size: 0.75rem; color: var(--text-dim);">${intv.studentId}</div>
                      </td>
                      <td>
                        <span class="dept-badge ${intv.department}">${intv.department}</span>
                      </td>
                      <td>
                        <div style="font-weight: 600; color: #FFF;">${intv.type}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">${intv.notes}</div>
                      </td>
                      <td>
                        <span class="risk-badge ${intv.priority === 'Critical' ? 'high' : intv.priority === 'High' ? 'medium' : 'low'}" style="font-size: 0.7rem;">
                          ${intv.priority}
                        </span>
                      </td>
                      <td>${intv.faculty}</td>
                      <td>${intv.dueDate}</td>
                      <td>
                        <select 
                          class="filter-select" 
                          style="padding: 4px 8px; font-size: 0.75rem;" 
                          onchange="Store.updateInterventionStatus('${intv.id}', this.value)"
                        >
                          <option value="Pending" ${intv.status === 'Pending' ? 'selected' : ''}>⏳ Pending</option>
                          <option value="In Progress" ${intv.status === 'In Progress' ? 'selected' : ''}>⚡ In Progress</option>
                          <option value="Resolved" ${intv.status === 'Resolved' ? 'selected' : ''}>✓ Resolved</option>
                        </select>
                      </td>
                      <td style="text-align: right;">
                        <button class="btn btn-sm btn-outline-danger" onclick="Store.deleteIntervention('${intv.id}')">
                          🗑️
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    `;
  },

  attachInterventionsEvents() {},

  // ==========================================================================
  // 5. STUDENT 360° PROFILE DRAWER
  // ==========================================================================

  openStudentDrawer(studentId) {
    const student = Store.getStudentById(studentId);
    if (!student) return;

    this.selectedStudentId = studentId;
    const evalRes = student.evaluation || RiskEngine.evaluateStudent(student.metrics);
    const interventions = Store.getInterventionsForStudent(student.studentId);

    const drawerBackdrop = document.getElementById('drawerBackdrop');
    const drawerPanel = document.getElementById('drawerPanel');
    if (!drawerBackdrop || !drawerPanel) return;

    drawerPanel.innerHTML = `
      <div class="drawer-header">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div class="student-avatar" style="width: 48px; height: 48px; font-size: 1.5rem;">${student.avatar || '🎓'}</div>
          <div>
            <h2 style="font-size: 1.3rem; margin: 0;">${student.name}</h2>
            <div style="font-size: 0.8rem; color: var(--text-muted);">
              ID: ${student.studentId} • ${student.department} • ${student.email}
            </div>
          </div>
        </div>

        <button class="btn-close-icon" onclick="UI.closeDrawer()">✕</button>
      </div>

      <div class="drawer-body">
        <!-- Top Status Banner -->
        <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(10, 15, 29, 0.6); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 1.5rem;">
          <div>
            <span class="risk-badge ${evalRes.tierKey}">
              <span class="beacon-dot"></span>
              Score: ${evalRes.score} • ${evalRes.tierLabel}
            </span>
            <div style="font-size: 0.78rem; color: var(--text-dim); margin-top: 6px;">Advisor: ${student.advisor || 'Dr. Aris Vance'}</div>
          </div>
          <button class="btn btn-sm btn-primary" onclick="UI.openInterveneModal('${student.id}')">
            ⚡ Trigger Intervention
          </button>
        </div>

        <!-- Metric Quadrant Summary -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
          <div class="pillar-card" style="padding: 1rem;">
            <div style="font-size: 0.75rem; color: var(--text-muted);">Attendance</div>
            <div style="font-size: 1.5rem; font-weight: 800; color: ${student.metrics.attendance < 75 ? '#EF4444' : '#10B981'};">
              ${student.metrics.attendance}%
            </div>
            <div style="font-size: 0.7rem; color: var(--text-dim);">Cutoff: 75%</div>
          </div>

          <div class="pillar-card" style="padding: 1rem;">
            <div style="font-size: 0.75rem; color: var(--text-muted);">Internal Marks</div>
            <div style="font-size: 1.5rem; font-weight: 800; color: ${student.metrics.marks < 50 ? '#EF4444' : '#10B981'};">
              ${student.metrics.marks}%
            </div>
            <div style="font-size: 0.7rem; color: var(--text-dim);">Cutoff: 50%</div>
          </div>

          <div class="pillar-card" style="padding: 1rem;">
            <div style="font-size: 0.75rem; color: var(--text-muted);">Assignments Completed</div>
            <div style="font-size: 1.5rem; font-weight: 800; color: ${student.metrics.assignments < 60 ? '#EF4444' : '#10B981'};">
              ${student.metrics.assignments}%
            </div>
            <div style="font-size: 0.7rem; color: var(--text-dim);">Labs & Submissions</div>
          </div>

          <div class="pillar-card" style="padding: 1rem;">
            <div style="font-size: 0.75rem; color: var(--text-muted);">LMS Engagement</div>
            <div style="font-size: 1.5rem; font-weight: 800; color: ${student.metrics.lms < 50 ? '#EF4444' : '#10B981'};">
              ${student.metrics.lms} / 100
            </div>
            <div style="font-size: 0.7rem; color: var(--text-dim);">Portal Telemetry</div>
          </div>
        </div>

        <!-- Explainable Drivers -->
        <div class="factors-breakdown-card" style="margin-bottom: 1.5rem;">
          <h4 style="font-size: 0.95rem; margin-bottom: 0.75rem; color: #FFF;">Explainable Contributing Risk Factors</h4>
          ${evalRes.topFactors.map(f => `
            <div class="factor-item">
              <div style="flex: 1;">
                <div style="font-size: 0.85rem; font-weight: 700; color: #FFF;">${f.metric} (${f.raw}%)</div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">${f.description}</div>
              </div>
              <span class="risk-badge ${f.status === 'critical' ? 'high' : f.status === 'warning' ? 'medium' : 'low'}" style="font-size: 0.65rem;">
                +${f.riskPoints} pts
              </span>
            </div>
          `).join('')}
        </div>

        <!-- 360° Radar Competency Chart -->
        <div class="chart-card" style="margin-bottom: 1.5rem;">
          <h4 style="font-size: 0.95rem; margin-bottom: 0.75rem; color: #FFF;">🎯 360° Student Competency Radar</h4>
          <div class="chart-container-box" style="height: 250px;">
            <canvas id="drawerRadarChart"></canvas>
          </div>
        </div>

        <!-- Historical Trajectory Chart -->
        <div class="chart-card" style="margin-bottom: 1.5rem;">
          <h4 style="font-size: 0.95rem; margin-bottom: 0.75rem; color: #FFF;">📈 10-Week Academic Trajectory</h4>
          <div class="chart-container-box" style="height: 220px;">
            <canvas id="drawerTrendChart"></canvas>
          </div>
        </div>

        <!-- Assigned Interventions -->
        <div>
          <h4 style="font-size: 0.95rem; margin-bottom: 0.75rem; color: #FFF;">Active Interventions (${interventions.length})</h4>
          ${interventions.length === 0 ? `
            <div style="color: var(--text-dim); font-size: 0.82rem; padding: 1rem; background: rgba(255,255,255,0.02); border-radius: var(--radius-sm);">
              No active interventions currently dispatched.
            </div>
          ` : `
            <div class="guidance-list">
              ${interventions.map(intv => `
                <div class="guidance-step-card">
                  <div>
                    <div style="font-weight: 700; color: #FFF; font-size: 0.85rem;">${intv.type}</div>
                    <div style="font-size: 0.78rem; color: var(--text-muted);">${intv.notes}</div>
                  </div>
                  <span class="risk-badge ${intv.status === 'Resolved' ? 'low' : intv.status === 'In Progress' ? 'medium' : 'high'}" style="font-size: 0.68rem;">
                    ${intv.status}
                  </span>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    `;

    drawerBackdrop.classList.add('active');

    setTimeout(() => {
      Charts.renderSkillsRadar('drawerRadarChart', student);
      Charts.renderStudentTrend('drawerTrendChart', student);
    }, 50);
  },

  closeDrawer() {
    const drawerBackdrop = document.getElementById('drawerBackdrop');
    if (drawerBackdrop) drawerBackdrop.classList.remove('active');
  },

  // ==========================================================================
  // 6. MODALS: CRUD & ACTIONS
  // ==========================================================================

  closeModals() {
    const overlays = document.querySelectorAll('.modal-overlay');
    overlays.forEach(m => m.classList.remove('active'));
  },

  openAddStudentModal() {
    const overlay = document.getElementById('studentModalOverlay');
    const form = document.getElementById('studentForm');
    if (!overlay || !form) return;

    form.reset();
    document.getElementById('modalStudentTitle').innerText = 'Add New Student Record';
    document.getElementById('studentFormId').value = '';
    
    // Set default preview
    this.updateModalRiskPreview();
    overlay.classList.add('active');
  },

  openEditStudentModal(studentId) {
    const student = Store.getStudentById(studentId);
    if (!student) return;

    const overlay = document.getElementById('studentModalOverlay');
    if (!overlay) return;

    document.getElementById('modalStudentTitle').innerText = `Edit Metrics: ${student.name}`;
    document.getElementById('studentFormId').value = student.id;
    document.getElementById('stuFormName').value = student.name;
    document.getElementById('stuFormEmail').value = student.email;
    document.getElementById('stuFormDept').value = student.department;
    document.getElementById('stuFormAtt').value = student.metrics.attendance;
    document.getElementById('stuFormMarks').value = student.metrics.marks;
    document.getElementById('stuFormAssign').value = student.metrics.assignments;
    document.getElementById('stuFormLms').value = student.metrics.lms;
    document.getElementById('stuFormNotes').value = student.notes || '';

    this.updateModalRiskPreview();
    overlay.classList.add('active');
  },

  updateModalRiskPreview() {
    const att = Number(document.getElementById('stuFormAtt')?.value || 75);
    const marks = Number(document.getElementById('stuFormMarks')?.value || 65);
    const assign = Number(document.getElementById('stuFormAssign')?.value || 70);
    const lms = Number(document.getElementById('stuFormLms')?.value || 60);

    const evalRes = RiskEngine.evaluateStudent({ attendance: att, marks, assignments: assign, lms });
    const badge = document.getElementById('modalRiskPreviewBadge');
    if (badge) {
      badge.className = `risk-badge ${evalRes.tierKey}`;
      badge.innerHTML = `<span class="beacon-dot"></span> Live Calc: ${evalRes.score} (${evalRes.tierLabel})`;
    }
  },

  handleStudentFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('studentFormId').value;
    const studentData = {
      name: document.getElementById('stuFormName').value.trim(),
      email: document.getElementById('stuFormEmail').value.trim(),
      department: document.getElementById('stuFormDept').value,
      attendance: Number(document.getElementById('stuFormAtt').value),
      marks: Number(document.getElementById('stuFormMarks').value),
      assignments: Number(document.getElementById('stuFormAssign').value),
      lms: Number(document.getElementById('stuFormLms').value),
      notes: document.getElementById('stuFormNotes').value.trim()
    };

    if (id) {
      Store.updateStudent(id, studentData);
    } else {
      Store.addStudent(studentData);
    }

    this.closeModals();
  },

  confirmDeleteStudent(studentId) {
    const s = Store.getStudentById(studentId);
    if (!s) return;
    if (confirm(`Are you sure you want to delete student "${s.name}" (${s.studentId})?`)) {
      Store.deleteStudent(studentId);
      this.closeDrawer();
    }
  },

  // ---------------- INTERVENTION MODAL ---------------- //

  openInterveneModal(studentId = null) {
    const overlay = document.getElementById('interventionModalOverlay');
    const select = document.getElementById('intvStudentSelect');
    if (!overlay || !select) return;

    const students = Store.getStudents();
    select.innerHTML = students.map(s => `
      <option value="${s.studentId}" ${studentId && (s.id === studentId || s.studentId === studentId) ? 'selected' : ''}>
        ${s.name} (${s.studentId} - ${s.department}) - Risk: ${s.evaluation?.score || 0}
      </option>
    `).join('');

    overlay.classList.add('active');
  },

  handleInterventionSubmit(e) {
    e.preventDefault();
    const studentId = document.getElementById('intvStudentSelect').value;
    const student = Store.getStudents().find(s => s.studentId === studentId);
    if (!student) return;

    const type = document.getElementById('intvTypeSelect').value;
    const priority = document.getElementById('intvPrioritySelect').value;
    const dueDate = document.getElementById('intvDueDate').value || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
    const notes = document.getElementById('intvNotes').value.trim();

    Store.addIntervention({
      studentId: student.studentId,
      studentName: student.name,
      department: student.department,
      type,
      priority,
      dueDate,
      notes
    });

    this.closeModals();
  },

  // ---------------- STUDENT HELP REQUEST MODAL ---------------- //

  openRequestHelpModal(studentId) {
    const student = Store.getStudentById(studentId);
    if (!student) return;

    const note = prompt(`Enter a note for your academic advisor (${student.advisor || 'Dr. Aris Vance'}):`, 'I would like to schedule a 1-on-1 tutoring session regarding my upcoming exam.');
    if (note) {
      Store.addIntervention({
        studentId: student.studentId,
        studentName: student.name,
        department: student.department,
        type: 'Student-Initiated Academic Mentoring Request',
        priority: 'High',
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        notes: `Student Request: "${note}"`
      });
      this.showToast('Help request dispatched to faculty advisor!', 'success');
    }
  },

  // ---------------- TOAST ALERTS SYSTEM ---------------- //

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'danger' ? 'danger' : type === 'warning' ? 'warning' : type === 'success' ? 'success' : ''}`;
    const icon = type === 'success' ? '✓' : type === 'warning' ? '⚠️' : type === 'danger' ? '✕' : 'ℹ️';

    toast.innerHTML = `
      <span style="font-weight: 800; color: #FFF;">${icon}</span>
      <div style="flex: 1; color: var(--text-main); font-weight: 500;">${message}</div>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
};

if (typeof window !== 'undefined') {
  window.UI = UI;
}
