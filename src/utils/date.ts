// utils/date.ts
export function formatDateForUrl(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // 2025-12-13
}

export function formatRelativeTime(dateString: string): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Жаңы эле';
  if (diffMins < 60) return `${diffMins} мүн мурун`;
  if (diffHours < 24) return `${diffHours} саат мурун`;
  if (diffDays < 7) return `${diffDays} күн мурун`;

  return date.toLocaleDateString('ky-KG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}