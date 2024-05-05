export function formatDate(dateString: string): {
  formattedDate: string;
  hasPassed: boolean;
} {
  const date = new Date(dateString);
  const currentDate = new Date();
  const hasPassed = date < currentDate;

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric" as const,
  };
  let formattedDate = date.toLocaleDateString("nl-NL", options);
  formattedDate = formattedDate.replace(/^0+/, "");

  return { formattedDate, hasPassed };
}
