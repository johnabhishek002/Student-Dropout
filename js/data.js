/**
 * EduGuard AI - Initial Seed Data
 * 
 * Realistic multi-department student roster (CS, IT, EC),
 * preset authentication credentials, and sample intervention logs.
 */

const PRESET_ACCOUNTS = [
  {
    email: 'admin@edu.com',
    password: 'password',
    name: 'Dr. Aris Vance',
    role: 'faculty',
    department: 'Computer Science & Engineering',
    avatar: '👨‍🏫',
    title: 'Department Head & Academic Dean',
    badge: 'Faculty / Admin Demo'
  },
  {
    email: 'alex@edu.com',
    password: 'password',
    name: 'Alex Rivera',
    studentId: 'CS-2023-042',
    role: 'student',
    department: 'Computer Science',
    semester: 'Semester 4',
    avatar: '🧑‍💻',
    title: 'CS Undergraduate',
    badge: 'High-Risk Demo'
  },
  {
    email: 'sarah@edu.com',
    password: 'password',
    name: 'Sarah Chen',
    studentId: 'IT-2023-118',
    role: 'student',
    department: 'Information Technology',
    semester: 'Semester 4',
    avatar: '👩‍💻',
    title: 'IT Undergraduate',
    badge: 'Medium-Risk Demo'
  },
  {
    email: 'jordan@edu.com',
    password: 'password',
    name: 'Jordan Taylor',
    studentId: 'EC-2023-009',
    role: 'student',
    department: 'Electronics & Communication',
    semester: 'Semester 4',
    avatar: '👨‍🎓',
    title: 'EC Undergraduate',
    badge: 'Low-Risk Demo'
  }
];

const INITIAL_STUDENTS = [
  {
    id: 'STU-001',
    studentId: 'CS-2023-042',
    name: 'Alex Rivera',
    email: 'alex@edu.com',
    department: 'CS',
    semester: 'Semester 4',
    avatar: '🧑‍💻',
    phone: '+1 (555) 234-8901',
    advisor: 'Dr. Aris Vance',
    metrics: {
      attendance: 56,
      marks: 44,
      assignments: 48,
      lms: 34
    },
    history: {
      attendanceTrend: [78, 70, 64, 58, 56],
      marksTrend: [62, 55, 49, 45, 44]
    },
    skillsRadar: {
      theory: 45,
      practical: 55,
      participation: 30,
      punctuality: 42,
      collaboration: 50
    },
    notes: 'Struggling with Data Structures coursework. Missed 5 consecutive 8:00 AM lab sessions.'
  },
  {
    id: 'STU-002',
    studentId: 'IT-2023-118',
    name: 'Sarah Chen',
    email: 'sarah@edu.com',
    department: 'IT',
    semester: 'Semester 4',
    avatar: '👩‍💻',
    phone: '+1 (555) 876-1234',
    advisor: 'Prof. Helen Ross',
    metrics: {
      attendance: 71,
      marks: 62,
      assignments: 65,
      lms: 58
    },
    history: {
      attendanceTrend: [85, 80, 76, 73, 71],
      marksTrend: [70, 68, 65, 63, 62]
    },
    skillsRadar: {
      theory: 68,
      practical: 72,
      participation: 60,
      punctuality: 65,
      collaboration: 70
    },
    notes: 'Good problem-solving ability, but attendance has slipped below the 75% boundary recently.'
  },
  {
    id: 'STU-003',
    studentId: 'EC-2023-009',
    name: 'Jordan Taylor',
    email: 'jordan@edu.com',
    department: 'EC',
    semester: 'Semester 4',
    avatar: '👨‍🎓',
    phone: '+1 (555) 345-6789',
    advisor: 'Dr. Marcus Sterling',
    metrics: {
      attendance: 94,
      marks: 88,
      assignments: 96,
      lms: 88
    },
    history: {
      attendanceTrend: [92, 94, 93, 95, 94],
      marksTrend: [84, 86, 88, 87, 88]
    },
    skillsRadar: {
      theory: 90,
      practical: 92,
      participation: 88,
      punctuality: 95,
      collaboration: 90
    },
    notes: 'Exemplary academic and lab record. Candidate for peer tutoring leadership.'
  },
  {
    id: 'STU-004',
    studentId: 'EC-2023-031',
    name: 'Liam Vance',
    email: 'liam.vance@edu.com',
    department: 'EC',
    semester: 'Semester 4',
    avatar: '🧑‍🔬',
    phone: '+1 (555) 432-8765',
    advisor: 'Dr. Marcus Sterling',
    metrics: {
      attendance: 60,
      marks: 42,
      assignments: 52,
      lms: 38
    },
    history: {
      attendanceTrend: [80, 72, 68, 62, 60],
      marksTrend: [58, 50, 46, 44, 42]
    },
    skillsRadar: {
      theory: 40,
      practical: 60,
      participation: 35,
      punctuality: 45,
      collaboration: 55
    },
    notes: 'Severe difficulty in Signals and Systems. Absent on internal assessment day.'
  },
  {
    id: 'STU-005',
    studentId: 'IT-2023-089',
    name: 'Priya Patel',
    email: 'priya.patel@edu.com',
    department: 'IT',
    semester: 'Semester 4',
    avatar: '👩‍🔬',
    phone: '+1 (555) 678-9012',
    advisor: 'Prof. Helen Ross',
    metrics: {
      attendance: 63,
      marks: 48,
      assignments: 40,
      lms: 42
    },
    history: {
      attendanceTrend: [75, 71, 68, 65, 63],
      marksTrend: [60, 54, 50, 48, 48]
    },
    skillsRadar: {
      theory: 48,
      practical: 52,
      participation: 40,
      punctuality: 50,
      collaboration: 45
    },
    notes: 'Reported family health emergencies leading to unsubmitted database lab assignments.'
  },
  {
    id: 'STU-006',
    studentId: 'CS-2023-097',
    name: 'Marcus Brody',
    email: 'marcus.brody@edu.com',
    department: 'CS',
    semester: 'Semester 4',
    avatar: '🧑‍💼',
    phone: '+1 (555) 987-6543',
    advisor: 'Dr. Aris Vance',
    metrics: {
      attendance: 52,
      marks: 51,
      assignments: 55,
      lms: 30
    },
    history: {
      attendanceTrend: [70, 65, 60, 55, 52],
      marksTrend: [55, 53, 52, 50, 51]
    },
    skillsRadar: {
      theory: 50,
      practical: 58,
      participation: 28,
      punctuality: 38,
      collaboration: 42
    },
    notes: 'Minimal portal logins. Missed mandatory group project presentations.'
  },
  {
    id: 'STU-007',
    studentId: 'CS-2023-015',
    name: 'Devansh Sharma',
    email: 'devansh.sharma@edu.com',
    department: 'CS',
    semester: 'Semester 4',
    avatar: '👨‍💻',
    phone: '+1 (555) 210-9876',
    advisor: 'Dr. Aris Vance',
    metrics: {
      attendance: 74,
      marks: 58,
      assignments: 70,
      lms: 62
    },
    history: {
      attendanceTrend: [82, 79, 76, 75, 74],
      marksTrend: [65, 62, 60, 59, 58]
    },
    skillsRadar: {
      theory: 62,
      practical: 75,
      participation: 55,
      punctuality: 68,
      collaboration: 70
    },
    notes: 'Attendance is right on the edge of the 75% boundary (74%). Advised to attend next 3 classes.'
  },
  {
    id: 'STU-008',
    studentId: 'EC-2023-074',
    name: 'Chloe Bennett',
    email: 'chloe.bennett@edu.com',
    department: 'EC',
    semester: 'Semester 4',
    avatar: '👩‍🎓',
    phone: '+1 (555) 543-2109',
    advisor: 'Dr. Marcus Sterling',
    metrics: {
      attendance: 78,
      marks: 56,
      assignments: 68,
      lms: 50
    },
    history: {
      attendanceTrend: [85, 82, 80, 78, 78],
      marksTrend: [64, 60, 58, 57, 56]
    },
    skillsRadar: {
      theory: 55,
      practical: 64,
      participation: 62,
      punctuality: 72,
      collaboration: 65
    },
    notes: 'Regular attendance but scores dipping on Digital Signal Processing exams.'
  },
  {
    id: 'STU-009',
    studentId: 'IT-2023-045',
    name: 'Nina Gomez',
    email: 'nina.gomez@edu.com',
    department: 'IT',
    semester: 'Semester 4',
    avatar: '👩‍💼',
    phone: '+1 (555) 890-1234',
    advisor: 'Prof. Helen Ross',
    metrics: {
      attendance: 68,
      marks: 66,
      assignments: 75,
      lms: 52
    },
    history: {
      attendanceTrend: [80, 76, 72, 70, 68],
      marksTrend: [68, 67, 65, 66, 66]
    },
    skillsRadar: {
      theory: 70,
      practical: 68,
      participation: 58,
      punctuality: 60,
      collaboration: 72
    },
    notes: 'Good conceptual knowledge; commutes from far away which affects early lecture attendance.'
  },
  {
    id: 'STU-010',
    studentId: 'CS-2023-002',
    name: 'Emily Zhang',
    email: 'emily.zhang@edu.com',
    department: 'CS',
    semester: 'Semester 4',
    advisor: 'Dr. Aris Vance',
    avatar: '👩‍🏫',
    phone: '+1 (555) 321-6547',
    metrics: {
      attendance: 96,
      marks: 92,
      assignments: 98,
      lms: 94
    },
    history: {
      attendanceTrend: [95, 96, 96, 95, 96],
      marksTrend: [90, 91, 93, 92, 92]
    },
    skillsRadar: {
      theory: 95,
      practical: 96,
      participation: 92,
      punctuality: 98,
      collaboration: 94
    },
    notes: 'Top 1% performer in Operating Systems and Algorithms. Department hackathon winner.'
  },
  {
    id: 'STU-011',
    studentId: 'IT-2023-019',
    name: 'Kevin O\'Connor',
    email: 'kevin.oconnor@edu.com',
    department: 'IT',
    semester: 'Semester 4',
    avatar: '🧑‍💻',
    phone: '+1 (555) 654-7890',
    advisor: 'Prof. Helen Ross',
    metrics: {
      attendance: 88,
      marks: 81,
      assignments: 90,
      lms: 82
    },
    history: {
      attendanceTrend: [86, 88, 87, 89, 88],
      marksTrend: [78, 80, 81, 82, 81]
    },
    skillsRadar: {
      theory: 82,
      practical: 86,
      participation: 80,
      punctuality: 88,
      collaboration: 84
    },
    notes: 'Consistent academic standing. Active in Cloud Computing student club.'
  },
  {
    id: 'STU-012',
    studentId: 'CS-2023-066',
    name: 'Aisha Khan',
    email: 'aisha.khan@edu.com',
    department: 'CS',
    semester: 'Semester 4',
    avatar: '👩‍🎓',
    phone: '+1 (555) 789-0123',
    advisor: 'Dr. Aris Vance',
    metrics: {
      attendance: 91,
      marks: 85,
      assignments: 92,
      lms: 85
    },
    history: {
      attendanceTrend: [90, 92, 90, 91, 91],
      marksTrend: [82, 84, 85, 86, 85]
    },
    skillsRadar: {
      theory: 88,
      practical: 86,
      participation: 85,
      punctuality: 92,
      collaboration: 88
    },
    notes: 'Solid project contributor. Regularly tutors junior students.'
  },
  {
    id: 'STU-013',
    studentId: 'EC-2023-055',
    name: 'Lucas Wright',
    email: 'lucas.wright@edu.com',
    department: 'EC',
    semester: 'Semester 4',
    avatar: '👨‍🔬',
    phone: '+1 (555) 890-4321',
    advisor: 'Dr. Marcus Sterling',
    metrics: {
      attendance: 89,
      marks: 79,
      assignments: 85,
      lms: 80
    },
    history: {
      attendanceTrend: [87, 89, 88, 90, 89],
      marksTrend: [75, 78, 80, 79, 79]
    },
    skillsRadar: {
      theory: 80,
      practical: 84,
      participation: 76,
      punctuality: 86,
      collaboration: 80
    },
    notes: 'Steady performance across VLSI design and Embedded Systems.'
  }
];

const INITIAL_INTERVENTIONS = [
  {
    id: 'INT-101',
    studentId: 'CS-2023-042',
    studentName: 'Alex Rivera',
    department: 'CS',
    type: 'Faculty 1-on-1 Mentoring Session',
    priority: 'Critical',
    faculty: 'Dr. Aris Vance',
    assignedDate: '2026-09-28',
    dueDate: '2026-10-12',
    status: 'In Progress',
    notes: 'Conducted preliminary meeting. Established schedule for missing Data Structures labs. Follow-up review set for Thursday.',
    plan: [
      { step: 'Submit overdue Lab 3 and Lab 4 codes', done: true },
      { step: 'Attend Morning Office Hours Tuesdays 9 AM', done: true },
      { step: 'Mid-term retest qualification check', done: false }
    ]
  },
  {
    id: 'INT-102',
    studentId: 'CS-2023-042',
    studentName: 'Alex Rivera',
    department: 'CS',
    type: 'Attendance Recovery Plan',
    priority: 'Critical',
    faculty: 'Dr. Aris Vance',
    assignedDate: '2026-10-01',
    dueDate: '2026-10-20',
    status: 'Pending',
    notes: 'Parental notification dispatched. Student agreed to mandatory check-in with academic counselor every Monday morning.',
    plan: [
      { step: 'Daily biometric attendance check verification', done: false },
      { step: 'Zero unexcused absence policy adherence', done: false }
    ]
  },
  {
    id: 'INT-103',
    studentId: 'EC-2023-031',
    studentName: 'Liam Vance',
    department: 'EC',
    type: 'Peer Tutor Assignment',
    priority: 'High',
    faculty: 'Dr. Marcus Sterling',
    assignedDate: '2026-09-25',
    dueDate: '2026-10-15',
    status: 'In Progress',
    notes: 'Paired with Jordan Taylor (EC-2023-009) for Signals and Systems circuit analysis workshops 3x/week.',
    plan: [
      { step: 'Complete weekly Fourier transform problem set with Jordan', done: true },
      { step: 'Retake unit quiz 2 by Oct 14', done: false }
    ]
  },
  {
    id: 'INT-104',
    studentId: 'IT-2023-118',
    studentName: 'Sarah Chen',
    department: 'IT',
    type: 'Attendance Recovery Plan',
    priority: 'Medium',
    faculty: 'Prof. Helen Ross',
    assignedDate: '2026-10-02',
    dueDate: '2026-10-18',
    status: 'Pending',
    notes: 'Current attendance is 71%. Target is to reach 76% before semester final exam hall ticket release.',
    plan: [
      { step: 'Attend all remaining October lectures without absence', done: false },
      { step: 'Submit make-up technical essay on Distributed Databases', done: false }
    ]
  },
  {
    id: 'INT-105',
    studentId: 'IT-2023-089',
    studentName: 'Priya Patel',
    department: 'IT',
    type: 'Academic Counseling',
    priority: 'High',
    faculty: 'Prof. Helen Ross',
    assignedDate: '2026-09-22',
    dueDate: '2026-10-08',
    status: 'Resolved',
    notes: 'Dean granted medical leave concession for 1 week. Structured makeup timeline agreed upon and first milestone cleared successfully.',
    plan: [
      { step: 'Medical certificate verification by Dean office', done: true },
      { step: 'Extension on Database assignment submission', done: true },
      { step: 'Rescheduled internal quiz completed (Grade: B+)', done: true }
    ]
  }
];

if (typeof window !== 'undefined') {
  window.PRESET_ACCOUNTS = PRESET_ACCOUNTS;
  window.INITIAL_STUDENTS = INITIAL_STUDENTS;
  window.INITIAL_INTERVENTIONS = INITIAL_INTERVENTIONS;
}
