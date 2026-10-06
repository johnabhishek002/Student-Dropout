/**
 * EduGuard AI - Persistent Data Store & State Management
 * 
 * Manages LocalStorage persistence, reactive event broadcasting,
 * authentication sessions, student CRUD operations, and intervention tracking.
 */

const Store = {
  KEYS: {
    STUDENTS: 'eduguard_students_v2',
    INTERVENTIONS: 'eduguard_interventions_v2',
    SESSION: 'eduguard_session_v2',
    CUSTOM_USERS: 'eduguard_custom_users_v2'
  },

  listeners: [],

  init() {
    this.ensureInitialized();
  },

  ensureInitialized() {
    // If students not in localStorage or corrupted, seed with INITIAL_STUDENTS
    if (!localStorage.getItem(this.KEYS.STUDENTS)) {
      this.resetToDemoData(false);
    }
    // Set default session if none exists (defaults to Faculty for immediate rich view or prompt login)
    if (!localStorage.getItem(this.KEYS.SESSION)) {
      // Default to guest/landing or preset faculty demo
      const defaultUser = window.PRESET_ACCOUNTS ? window.PRESET_ACCOUNTS[0] : null;
      if (defaultUser) {
        localStorage.setItem(this.KEYS.SESSION, JSON.stringify(defaultUser));
      }
    }
  },

  resetToDemoData(notify = true) {
    const rawStudents = JSON.parse(JSON.stringify(window.INITIAL_STUDENTS || []));
    // Enrich with live RiskEngine evaluations
    const enriched = rawStudents.map(student => {
      const evaluation = window.RiskEngine.evaluateStudent(student.metrics);
      return {
        ...student,
        evaluation
      };
    });

    localStorage.setItem(this.KEYS.STUDENTS, JSON.stringify(enriched));
    localStorage.setItem(this.KEYS.INTERVENTIONS, JSON.stringify(window.INITIAL_INTERVENTIONS || []));
    
    if (notify) {
      this.broadcastChange('reset');
    }
  },

  // ---------------- STUDENTS CRUD ---------------- //

  getStudents() {
    try {
      const raw = localStorage.getItem(this.KEYS.STUDENTS);
      if (!raw) {
        this.resetToDemoData(false);
        return this.getStudents();
      }
      const students = JSON.parse(raw);
      // Re-verify evaluations
      return students.map(s => ({
        ...s,
        evaluation: window.RiskEngine ? window.RiskEngine.evaluateStudent(s.metrics) : s.evaluation
      }));
    } catch (err) {
      console.error('Failed to parse students, resetting demo data', err);
      this.resetToDemoData(false);
      return JSON.parse(localStorage.getItem(this.KEYS.STUDENTS) || '[]');
    }
  },

  getStudentById(id) {
    const students = this.getStudents();
    return students.find(s => s.id === id || s.studentId === id);
  },

  getStudentByEmail(email) {
    if (!email) return null;
    const students = this.getStudents();
    return students.find(s => s.email.toLowerCase() === email.toLowerCase());
  },

  addStudent(studentData) {
    const students = this.getStudents();
    const id = `STU-${String(students.length + 1).padStart(3, '0')}`;
    const studentId = studentData.studentId || `${studentData.department}-2023-${Math.floor(100 + Math.random() * 900)}`;
    
    const metrics = {
      attendance: Number(studentData.attendance) || 0,
      marks: Number(studentData.marks) || 0,
      assignments: Number(studentData.assignments) || 0,
      lms: Number(studentData.lms) || 0
    };

    const evaluation = window.RiskEngine.evaluateStudent(metrics);

    const newStudent = {
      id,
      studentId,
      name: studentData.name || 'Anonymous Student',
      email: studentData.email || `${studentId.toLowerCase()}@edu.com`,
      department: studentData.department || 'CS',
      semester: studentData.semester || 'Semester 4',
      avatar: studentData.avatar || '🎓',
      phone: studentData.phone || '+1 (555) 000-0000',
      advisor: studentData.advisor || 'Dr. Aris Vance',
      metrics,
      evaluation,
      history: {
        attendanceTrend: [metrics.attendance + 5, metrics.attendance + 3, metrics.attendance],
        marksTrend: [metrics.marks + 4, metrics.marks + 2, metrics.marks]
      },
      skillsRadar: {
        theory: Math.round(metrics.marks * 0.9),
        practical: Math.round(metrics.marks * 1.05),
        participation: Math.round(metrics.attendance * 0.8),
        punctuality: Math.round(metrics.attendance * 0.95),
        collaboration: Math.round(metrics.lms * 0.85)
      },
      notes: studentData.notes || 'Newly registered student record.'
    };

    students.unshift(newStudent);
    localStorage.setItem(this.KEYS.STUDENTS, JSON.stringify(students));
    this.broadcastChange('student_added', newStudent);
    return newStudent;
  },

  updateStudent(id, updatedFields) {
    const students = this.getStudents();
    const index = students.findIndex(s => s.id === id || s.studentId === id);
    if (index === -1) return null;

    const current = students[index];
    const metrics = {
      attendance: updatedFields.attendance !== undefined ? Number(updatedFields.attendance) : current.metrics.attendance,
      marks: updatedFields.marks !== undefined ? Number(updatedFields.marks) : current.metrics.marks,
      assignments: updatedFields.assignments !== undefined ? Number(updatedFields.assignments) : current.metrics.assignments,
      lms: updatedFields.lms !== undefined ? Number(updatedFields.lms) : current.metrics.lms
    };

    const evaluation = window.RiskEngine.evaluateStudent(metrics);

    students[index] = {
      ...current,
      name: updatedFields.name || current.name,
      email: updatedFields.email || current.email,
      department: updatedFields.department || current.department,
      semester: updatedFields.semester || current.semester,
      phone: updatedFields.phone || current.phone,
      advisor: updatedFields.advisor || current.advisor,
      notes: updatedFields.notes !== undefined ? updatedFields.notes : current.notes,
      metrics,
      evaluation
    };

    localStorage.setItem(this.KEYS.STUDENTS, JSON.stringify(students));
    this.broadcastChange('student_updated', students[index]);
    return students[index];
  },

  deleteStudent(id) {
    let students = this.getStudents();
    const target = students.find(s => s.id === id || s.studentId === id);
    if (!target) return false;

    students = students.filter(s => s.id !== id && s.studentId !== id);
    localStorage.setItem(this.KEYS.STUDENTS, JSON.stringify(students));
    this.broadcastChange('student_deleted', target);
    return true;
  },

  // ---------------- INTERVENTIONS ---------------- //

  getInterventions() {
    try {
      const raw = localStorage.getItem(this.KEYS.INTERVENTIONS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  getInterventionsForStudent(studentId) {
    const list = this.getInterventions();
    return list.filter(i => i.studentId === studentId);
  },

  addIntervention(interventionData) {
    const list = this.getInterventions();
    const id = `INT-${Date.now().toString().slice(-4)}`;

    const newIntervention = {
      id,
      studentId: interventionData.studentId,
      studentName: interventionData.studentName,
      department: interventionData.department || 'CS',
      type: interventionData.type || 'Faculty 1-on-1 Mentoring Session',
      priority: interventionData.priority || 'High',
      faculty: interventionData.faculty || (this.getCurrentUser()?.name || 'Faculty Mentor'),
      assignedDate: interventionData.assignedDate || new Date().toISOString().split('T')[0],
      dueDate: interventionData.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: interventionData.status || 'Pending',
      notes: interventionData.notes || '',
      plan: interventionData.plan || [
        { step: 'Initial diagnostics session completed', done: false },
        { step: 'Mid-term milestone check-in', done: false }
      ]
    };

    list.unshift(newIntervention);
    localStorage.setItem(this.KEYS.INTERVENTIONS, JSON.stringify(list));
    this.broadcastChange('intervention_added', newIntervention);
    return newIntervention;
  },

  updateInterventionStatus(id, newStatus) {
    const list = this.getInterventions();
    const item = list.find(i => i.id === id);
    if (!item) return null;

    item.status = newStatus;
    localStorage.setItem(this.KEYS.INTERVENTIONS, JSON.stringify(list));
    this.broadcastChange('intervention_updated', item);
    return item;
  },

  deleteIntervention(id) {
    let list = this.getInterventions();
    list = list.filter(i => i.id !== id);
    localStorage.setItem(this.KEYS.INTERVENTIONS, JSON.stringify(list));
    this.broadcastChange('intervention_deleted', id);
    return true;
  },

  // ---------------- AUTH & SESSION ---------------- //

  getCurrentUser() {
    try {
      const raw = localStorage.getItem(this.KEYS.SESSION);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  login(email, password, roleHint) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    
    // Check preset accounts
    const preset = window.PRESET_ACCOUNTS.find(acc => acc.email.toLowerCase() === normalizedEmail);
    if (preset) {
      localStorage.setItem(this.KEYS.SESSION, JSON.stringify(preset));
      this.broadcastChange('auth_changed', preset);
      return { success: true, user: preset };
    }

    // Check custom registered users
    const customUsers = JSON.parse(localStorage.getItem(this.KEYS.CUSTOM_USERS) || '[]');
    const existing = customUsers.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      localStorage.setItem(this.KEYS.SESSION, JSON.stringify(existing));
      this.broadcastChange('auth_changed', existing);
      return { success: true, user: existing };
    }

    // Check if email matches any student in current roster
    const student = this.getStudentByEmail(normalizedEmail);
    if (student) {
      const user = {
        email: student.email,
        name: student.name,
        studentId: student.studentId,
        role: 'student',
        department: student.department,
        semester: student.semester,
        avatar: student.avatar,
        title: `${student.department} Undergraduate`
      };
      localStorage.setItem(this.KEYS.SESSION, JSON.stringify(user));
      this.broadcastChange('auth_changed', user);
      return { success: true, user };
    }

    // If faculty role chosen or arbitrary demo login
    if (roleHint === 'faculty') {
      const user = {
        email: normalizedEmail,
        name: normalizedEmail.split('@')[0].toUpperCase() + ' (Faculty)',
        role: 'faculty',
        department: 'Academic Affairs',
        avatar: '👨‍🏫',
        title: 'Faculty Advisor'
      };
      localStorage.setItem(this.KEYS.SESSION, JSON.stringify(user));
      this.broadcastChange('auth_changed', user);
      return { success: true, user };
    }

    return { success: false, message: 'Invalid credentials. Please select one of the 1-Click Demo Accounts.' };
  },

  register(userData) {
    const customUsers = JSON.parse(localStorage.getItem(this.KEYS.CUSTOM_USERS) || '[]');
    const newUser = {
      ...userData,
      email: userData.email.toLowerCase(),
      avatar: userData.role === 'faculty' ? '👨‍🏫' : '🧑‍🎓'
    };
    customUsers.push(newUser);
    localStorage.setItem(this.KEYS.CUSTOM_USERS, JSON.stringify(customUsers));

    // If student registered, also add to student directory so they appear in faculty table
    if (newUser.role === 'student') {
      this.addStudent({
        name: newUser.name,
        email: newUser.email,
        studentId: newUser.studentId || `CS-2023-${Math.floor(100 + Math.random() * 900)}`,
        department: newUser.department || 'CS',
        attendance: 80,
        marks: 75,
        assignments: 80,
        lms: 70
      });
    }

    localStorage.setItem(this.KEYS.SESSION, JSON.stringify(newUser));
    this.broadcastChange('auth_changed', newUser);
    return { success: true, user: newUser };
  },

  logout() {
    localStorage.removeItem(this.KEYS.SESSION);
    this.broadcastChange('auth_changed', null);
  },

  // ---------------- EVENT BUS ---------------- //

  broadcastChange(type, payload = null) {
    const event = new CustomEvent('eduguard:stateChanged', {
      detail: { type, payload }
    });
    window.dispatchEvent(event);
  }
};

if (typeof window !== 'undefined') {
  window.Store = Store;
  // Initialize immediately
  Store.init();
}
