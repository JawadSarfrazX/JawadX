// Mock data. Baad mein services se replace karein.
export const dashboardData = {
  stats: [
    { key: "students", label: "Total Students", value: "2,847", delta: "+6.4%" },
    { key: "teachers", label: "Teachers", value: "168", delta: "+4" },
    { key: "courses", label: "Active Courses", value: "94", delta: "+3" },
    { key: "fees", label: "Fees Collected", value: "$1.24M", delta: "+16.6%" },
  ],
  funnel: [
    { name: "Applied", count: 847, percent: 95, tone: "bg-brand" },
    { name: "Interviewed", count: 694, percent: 82, tone: "bg-ink" },
    { name: "Admitted", count: 421, percent: 48, tone: "bg-ink" },
    { name: "Enrolled", count: 167, percent: 16, tone: "bg-ink" },
  ],
  fees: {
    total: "$1,240,834", growth: "+21.0%",
    parts: [
      { label: "Tuition", value: 36, color: "#f28c28" },
      { label: "Hostel", value: 21, color: "#26262b" },
      { label: "Exam Fees", value: 34, color: "#8a8a8f" },
      { label: "Other", value: 9, color: "#d6d3d1" },
    ],
  },
  topStudents: [
    { id: "ST-1024", name: "Ayesha Khan", dept: "Computer Science", attendance: "96%", cgpa: "3.92", img: "https://i.pravatar.cc/120?img=47" },
    { id: "ST-1036", name: "Omar Farooq", dept: "Electrical Eng.", attendance: "93%", cgpa: "3.85", img: "https://i.pravatar.cc/120?img=33" },
    { id: "ST-1041", name: "Hira Malik", dept: "Business Admin", attendance: "91%", cgpa: "3.79", img: "https://i.pravatar.cc/120?img=5" },
  ],
  insight: {
    title: "Attendance risk detected",
    text: "38 students in BS Computer Science dropped below 75% attendance this month and may miss exam eligibility.",
    confidence: 78,
  },
};
