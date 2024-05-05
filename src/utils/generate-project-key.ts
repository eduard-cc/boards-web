export function generateProjectKey(name: string): string {
  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    let key = words[0].toUpperCase().slice(0, 5);

    // Key doesn't start with a number
    if (/^[0-9]/.test(key)) {
      key = "A" + key.slice(1);
    }

    // Key only contains alphanumeric characters
    key = key.replace(/[^A-Z0-9]/g, "");

    return key;
  } else {
    const initials = words.map((word) => word.charAt(0).toUpperCase()).join("");

    // Key only contains alphanumeric characters
    return initials.slice(0, 5).replace(/[^A-Z0-9]/g, "");
  }
}
