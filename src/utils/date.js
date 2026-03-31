/**
 * Formats an ISO date string to a human-readable short date.
 * e.g. "2024-06-15T00:00:00.000Z" -> "Jun 15, 2024"
 */
export function format(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
