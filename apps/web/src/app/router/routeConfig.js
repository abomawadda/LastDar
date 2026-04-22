export const routeConfig = {
  dashboard: "/",
  classes: "/classes",
  attendance: "/attendance",
  memorization: "/memorization",
  finance: "/finance",
  students: "/students",
  studentsCreate: "/students/create",
  studentDetails: (studentId = ":studentId") => `/students/${studentId}`,
  studentEdit: (studentId = ":studentId") => `/students/${studentId}/edit`,
  studentFreeze: (studentId = ":studentId") => `/students/${studentId}/freeze`,
  studentTransfer: (studentId = ":studentId") => `/students/${studentId}/transfer`,
  guardians: "/guardians",
  guardiansCreate: "/guardians/create"
};
