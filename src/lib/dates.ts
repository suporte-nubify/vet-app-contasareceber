/** Limites de mês no fuso America/Sao_Paulo (aproximado via offset -03). */

function spParts(d = new Date()) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const [year, month, day] = fmt.format(d).split("-").map(Number);
  return { year, month, day };
}

function utcFromSp(year: number, month: number, day: number) {
  // midnight in SP ≈ 03:00 UTC
  return new Date(Date.UTC(year, month - 1, day, 3, 0, 0));
}

export function monthBounds(reference = new Date()) {
  const { year, month } = spParts(reference);
  const m0 = utcFromSp(year, month, 1);
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const m1 = utcFromSp(nextYear, nextMonth, 1);

  let y3 = year;
  let m3 = month - 3;
  while (m3 <= 0) {
    m3 += 12;
    y3 -= 1;
  }
  const mMinus3 = utcFromSp(y3, m3, 1);

  return { m0, m1, mMinus3 };
}

export type MonthRange = {
  key: string;
  year: number;
  month: number;
  start: Date;
  end: Date;
  label: string;
};

export function currentMonthKey(reference = new Date()) {
  const { year, month } = spParts(reference);
  return `${year}-${String(month).padStart(2, "0")}`;
}

/** Mês civil em UTC, no mesmo calendário das datas gravadas como dia (YYYY-MM-DD). */
export function calendarMonthRange(key: string | null | undefined): MonthRange | null {
  const match = /^(\d{4})-(\d{2})$/.exec(key ?? "");
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12 || year < 2000 || year > 2100) return null;

  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 1));
  const raw = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(start);
  const label = raw.charAt(0).toUpperCase() + raw.slice(1);

  return {
    key: `${year}-${String(month).padStart(2, "0")}`,
    year,
    month,
    start,
    end,
    label,
  };
}
