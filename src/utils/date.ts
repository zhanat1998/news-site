export function formatDateForUrl(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // "2025-12-13"
}