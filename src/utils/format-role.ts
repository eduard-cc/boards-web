import { Role } from "@/types/member";

export function formatRole(role: Role): string {
  const lowerCaseRole = role.toLowerCase();
  return lowerCaseRole.charAt(0).toUpperCase() + lowerCaseRole.slice(1);
}
