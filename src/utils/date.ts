export function getTodayString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function addDays(dateString: string, days: unknown): string {
  const date = new Date(`${dateString}T00:00:00`);
  const parsedDays = Number(days);
  const safeDays = Number.isFinite(parsedDays) ? parsedDays : 0;

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  date.setDate(date.getDate() + safeDays);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
