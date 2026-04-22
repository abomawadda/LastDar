const ROLE_PERMISSIONS = {
  admin: ["*"],
  supervisor: [
    "dashboard.read",
    "students.read",
    "students.write",
    "guardians.read",
    "classes.read",
    "attendance.read",
    "memorization.read",
    "finance.read"
  ],
  teacher: [
    "dashboard.read",
    "classes.read",
    "attendance.read",
    "attendance.write",
    "memorization.read",
    "memorization.write",
    "students.read"
  ],
  accountant: ["dashboard.read", "students.read", "finance.read", "finance.write"],
  parent: ["dashboard.read", "student_profile.read"],
  student: ["dashboard.read", "self_profile.read"]
};

export function hasPermission(role, permission) {
  const permissions = ROLE_PERMISSIONS[role] || [];
  if (permissions.includes("*")) return true;
  return permissions.includes(permission);
}

export function getRolePermissions(role) {
  return ROLE_PERMISSIONS[role] || [];
}
