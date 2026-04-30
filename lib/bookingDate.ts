export function parseBookingDateDdMmYyyy(dateStr: string): Date | null {
  if (!dateStr || typeof dateStr !== "string") return null;
  const parts = dateStr.trim().split("/");
  if (parts.length !== 3) return null;
  const d = Number(parts[0]);
  const m = Number(parts[1]);
  const y = Number(parts[2]);
  if (!d || !m || !y) return null;
  return new Date(y, m - 1, d);
}

export function isVisitDateOnOrBeforeToday(dateStr: string): boolean {
  const visit = parseBookingDateDdMmYyyy(dateStr);
  if (!visit) return false;
  visit.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return visit.getTime() <= today.getTime();
}
