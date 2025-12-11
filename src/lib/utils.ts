import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { twMerge } from "tailwind-merge";

dayjs.extend(timezone);
dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.locale("pt-br");

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const parseDate = (
  date: string | dayjs.Dayjs | Date,
  options: {
    format?: string;
    timezone?: string;
  } = {},
) => {
  let parsedDate = dayjs(date, options.format);
  if (options.timezone) {
    parsedDate = parsedDate.tz(options.timezone);
  }
  return parsedDate;
};
