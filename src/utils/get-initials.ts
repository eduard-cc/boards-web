export function getInitials(name: string): string {
  if (!name) {
    return "";
  }

  const initials = name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  return initials.slice(0, 2);
}
