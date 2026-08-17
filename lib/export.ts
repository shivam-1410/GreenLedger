/**
 * Utility functions to export protocol datasets into downloadable CSV or JSON files.
 */

export function exportToJsonFile<T>(filename: string, data: T): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function convertToCsv<T extends Record<string, any>>(items: T[]): string {
  if (items.length === 0) return '';
  const headers = Object.keys(items[0]).join(',');
  const rows = items.map((item) =>
    Object.values(item)
      .map((val) => `"${String(val).replace(/"/g, '""')}"`)
      .join(',')
  );
  return [headers, ...rows].join('\n');
}

export function exportToCsvFile<T extends Record<string, any>>(filename: string, items: T[]): void {
  const csvStr = convertToCsv(items);
  const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
