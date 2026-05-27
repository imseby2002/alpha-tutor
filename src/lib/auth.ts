export type UserRole = "student" | "guide" | "parent" | "admin";

export type UserProfile = {
  id: string;
  display_name: string | null;
  role: UserRole;
  level: number;
  xp: number;
  link_code: string;
};

export const ROLE_LABEL: Record<UserRole, string> = {
  student: "學生",
  guide: "導師",
  parent: "家長",
  admin: "管理員",
};

export const ROLE_HOME: Record<UserRole, string> = {
  student: "/",
  guide: "/guide",
  parent: "/parent",
  admin: "/admin",
};

export function canAccessPath(role: UserRole, pathname: string): boolean {
  if (pathname.startsWith("/admin")) return role === "admin";
  if (pathname.startsWith("/guide")) return role === "guide" || role === "admin";
  if (pathname.startsWith("/parent")) return role === "parent" || role === "admin";
  if (pathname === "/" || pathname.startsWith("/student")) {
    return role === "student" || role === "admin";
  }
  return true;
}
