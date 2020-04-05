import { Inject, Injectable, InjectionToken, LOCALE_ID, Optional } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { DateTime, Info } from 'luxon';

export const DATE_LOCALE = new InjectionToken<string>('DATE_LOCALE');

/** Provider for MAT_DATE_LOCALE injection token. */
export const DATE_LOCALE_PROVIDER = { provide: DATE_LOCALE, useExisting: LOCALE_ID };

const ISO_8601_REGEX = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|(?:(?:\+|-)\d{2}:\d{2}))?)?$/;

/** Creates an array and fills it with values. */
function range<T>(length: number, valueFunction: (index: number) => T): T[] {
  const valuesArray = Array(length);
  for (let i = 0; i < length; i++) {
    valuesArray[i] = valueFunction(i);
  }
  return valuesArray;
}

@Injectable()
export class LuxonDateAdapter extends DateAdapter<DateTime> {
  constructor(@Optional() @Inject(DATE_LOCALE) dateLocale: string) {
    super();
    this.setLocale(dateLocale || DateTime.local().locale);
  }

  getYear(date: DateTime): number {
    return date.year;
  }

  getMonth(date: DateTime): number {
    return date.month;
  }

  getDate(date: DateTime): number {
    return date.day;
  }

  getDayOfWeek(date: DateTime): number {
    return date.weekday;
  }

  getMonthNames(style): string[] {
    return Info.months(style, { locale: this.locale });
  }

  getDateNames(): string[] {
    return range(31, i =>
      DateTime.local(2018, 1, i)
        .setLocale(this.locale)
        .toFormat('d')
    );
  }

  getDayOfWeekNames(style): string[] {
    return Info.weekdays(style, { locale: this.locale });
  }

  getYearName(date: DateTime): string {
    return date.toFormat('y');
  }

  getFirstDayOfWeek(): number {
    return 0;
  }

  getNumDaysInMonth(date: DateTime): number {
    return date.daysInMonth;
  }

  clone(date: DateTime): DateTime {
    return date;
  }

  createDate(year: number, month: number, date: number): DateTime {
    return DateTime.local(year, month + 1, date).setLocale(this.locale);
  }

  today(): DateTime {
    return DateTime.local().setLocale(this.locale);
  }

  parse(value: any, parseFormat: any): DateTime | null {
    if (!value) return null;

    if (typeof value == 'string') return DateTime.fromFormat(value, parseFormat, { locale: this.locale });
    else if (typeof value == 'number') return DateTime.fromMillis(value, { locale: this.locale });
    else if (value instanceof Date) return DateTime.fromJSDate(value, { locale: this.locale });
    else if (typeof value == 'object') return DateTime.fromObject({ ...value, locale: this.locale });
    else return null;
  }

  format(date: DateTime, displayFormat: string): string {
    return date.toFormat(displayFormat);
  }

  addCalendarYears(date: DateTime, years: number): DateTime {
    return date.plus({ years });
  }

  addCalendarMonths(date: DateTime, months: number): DateTime {
    return date.plus({ months });
  }

  addCalendarDays(date: DateTime, days: number): DateTime {
    return date.plus({ days });
  }

  toIso8601(date: DateTime): string {
    return date.toISO();
  }

  isDateInstance(obj: any): boolean {
    return obj instanceof DateTime;
  }

  isValid(date: DateTime): boolean {
    return date.isValid;
  }

  invalid(): DateTime {
    return DateTime.invalid('Invalid Date');
  }

  deserialize(value: any): DateTime | null {
    if (typeof value === 'string') {
      if (!value) {
        return null;
      }

      if (ISO_8601_REGEX.test(value)) {
        const date = DateTime.fromISO(value as string);
        if (this.isValid(date)) {
          return date;
        }
      }
    }
    return super.deserialize(value);
  }

  setLocale(locale: any): void {
    super.setLocale(locale);
  }
}

// declare var DateTime: {
//   year: number;
//   month: number;
//   day: number;
//   weekday: number;
//   daysInMonth: number;
//   isValid: boolean;
//   fromJSDate(value: Date, opts?: any);
//   fromObject(value: Object);
//   fromMillis(value: number, opts?: any);
//   fromString(value: string, parseFormat: string, opts?: any);
//   fromISO(value: string);
//   invalid();
//   local(...args: any[]);
//   plus(value: any);
//   toFormat(format: string);
//   toISO();
// };
