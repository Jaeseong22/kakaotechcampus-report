const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayKey() {
  return toDateKey(new Date());
}

export function normalizeDateKey(value?: string | string[]) {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (!candidate || !DATE_PATTERN.test(candidate)) {
    return todayKey();
  }

  const date = new Date(`${candidate}T00:00:00`);
  return Number.isNaN(date.getTime()) ? todayKey() : candidate;
}

export function moveDate(dateKey: string, amount: number) {
  const date = new Date(`${dateKey}T00:00:00`);
  date.setDate(date.getDate() + amount);
  return toDateKey(date);
}

export function formatLongDate(dateKey: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(new Date(`${dateKey}T00:00:00`));
}

export function getWeekDates(dateKey: string) {
  const selected = new Date(`${dateKey}T00:00:00`);
  const day = selected.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  selected.setDate(selected.getDate() + mondayOffset);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(selected);
    date.setDate(selected.getDate() + index);
    return toDateKey(date);
  });
}

export function formatTimeRange(start: string | null, end: string | null) {
  if (!start && !end) return "시간 미정";
  if (start && !end) return `${start.slice(0, 5)}부터`;
  if (!start && end) return `${end.slice(0, 5)}까지`;
  return `${start?.slice(0, 5)} – ${end?.slice(0, 5)}`;
}
