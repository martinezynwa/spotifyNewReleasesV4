import { addDays, differenceInDays, format, parseISO, set } from "date-fns";

export const getCurrentDateAndTime = () =>
  format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

export const getCurrentDate = () => format(new Date(), "yyyy-MM-dd");
export const adjustDateByDays = (days: number) =>
  format(addDays(new Date(), days), "yyyy-MM-dd");

export const countDifferenceBetweenDates = (date1: string, date2: string) =>
  differenceInDays(parseISO(date1), parseISO(date2));

export const passingDaysLimit = (releaseDate: string, dayLimit: number) =>
  countDifferenceBetweenDates(getCurrentDate(), releaseDate) <= dayLimit ||
  false;

const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
const dateWithMs = "yyyy-MM-dd'T'HH:mm:ss.SSS";

export const formatToDateWithMs = (inputDate: string, index?: number) => {
  const currentDate = new Date();

  if (!dateFormatRegex.test(inputDate)) {
    return format(currentDate, dateWithMs);
  }

  const parsedDate = new Date(inputDate);

  const updatedDate = set(parsedDate, {
    hours: currentDate.getHours(),
    minutes: currentDate.getMinutes(),
    seconds: currentDate.getSeconds(),
    milliseconds: index
      ? parseInt(index.toString().padStart(3, "0"))
      : currentDate.getMilliseconds(),
  });

  return format(updatedDate, dateWithMs);
};
