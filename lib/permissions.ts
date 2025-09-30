import { isUserAdmin } from "@/lib/auth";

export function hasPermission(user: any, permission: string): boolean {
  if (!user) return false;
  
  switch (permission) {
    case 'canAddProducts':
    case 'canEditProducts':
    case 'canDeleteProducts':
    case 'canViewAdminPanel':
      return isUserAdmin();
    default:
      return false;
  }
}

export function isAdmin(user: any): boolean {
  return isUserAdmin();
}