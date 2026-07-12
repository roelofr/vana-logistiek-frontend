import { format, isToday } from "date-fns";

function toDate(value: Date | string | undefined): Date | null {
  if (!value) return null;

  if (value instanceof Date) return value;

  try {
    return new Date(value);
  } catch (err) {
    console.warn("Failed to parse %o into a valid date: %o", value, err);
    return null;
  }
}

export function unpackDates<T extends object>(
  data: T[],
  dateKeys: (keyof T)[],
): T[] {
  return data.map((row) => {
    for (const dateKey of dateKeys)
      if (Object.hasOwn(row, dateKey) && row[dateKey]) {
        // @ts-expect-error Let's just assume the user knows what they're doing.
        row[dateKey] = toDate(row[dateKey]);
      }
    return row;
  });
}

export function formattedLocalTime(
  time: Date | string | undefined,
  wantedFormat: string,
) {
  const actualTime = toDate(time);
  if (!actualTime) return undefined;

  return format(actualTime, wantedFormat);
}

export function localTime(time: Date | string | undefined): string | undefined {
  const actualTime = toDate(time);
  if (!actualTime) return undefined;

  if (isToday(actualTime)) return format(actualTime, "HH:mm");
  return format(actualTime, "dd MMM, HH:mm");
}
