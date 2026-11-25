const MONTHS = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
const MONTH_TOTALS = [520000, 610000, 480000, 830000, 760000, 910000];

export const DEMO_DATA = {
  stats: [
    { label: "Total Students", value: "1,248" },
    { label: "Teachers", value: "84" },
    { label: "Active Courses", value: "42" },
    { label: "Fees Collected", value: "Rs 4.8M" },
  ],
  funnel: [
    { name: "Applied", count: 1450, percent: 100 },
    { name: "Interviewed", count: 820, percent: 57 },
    { name: "Admitted", count: 450, percent: 31 },
    { name: "Enrolled", count: 310, percent: 21 },
  ],
  fees: {
    months: MONTHS.map((label, i) => ({ key: label, label, total: MONTH_TOTALS[i] })),
    max: Math.max(...MONTH_TOTALS),
  },
  courses: [
    { id: "d1", code: "CS101", title: "Intro to AI", instructor: "Dr. Sarah", students: 48 },
    { id: "d2", code: "CS220", title: "Data Structures", instructor: "Prof. Ali", students: 39 },
    { id: "d3", code: "EE310", title: "Digital Circuits", instructor: "Dr. Hina", students: 27 },
  ],
  recentStudents: [
    { student_code: "ST-1024", name: "Ayesha Khan", dept: "Computer Science" },
    { student_code: "ST-1036", name: "Omar Farooq", dept: "Electrical Engineering" },
    { student_code: "ST-1041", name: "Hira Malik", dept: "Business Administration" },
  ],
  attendance: 88,
};