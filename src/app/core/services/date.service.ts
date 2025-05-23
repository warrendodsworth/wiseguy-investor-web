import firebase from 'firebase/compat/app';
import { DateTime, Zone } from 'luxon';
import { map } from 'rxjs/operators';

import { DatePredicate } from './base-firestore.service';

/**
 * Retrieve
 * - Timestamps are returned by firestore - we convert them to ISOStrings
 * Post
 * - Send firestore.Timestamp.now() as a Timestamp
 * - Convert ISOStrings given to us by ion-datepicker to firestore.Timestamp objects
 *
 * Issue - sometimes using Timestamp.now() causes date to be stored as a map object in firestore { seconds:, nano: }
 *
 * JsDate saves as string in firestore doc
 */
export const now = () => firebase.firestore.Timestamp.now();

/**
 * To Luxon DateTime
 *
 * @param value custom DatePredicate (or any really)
 */
export function toLuxonDateTime(value: DatePredicate) {
  let date: DateTime = null;

  try {
    if (typeof value == 'string') {
      date = DateTime.fromISO(value);
    } else if (value instanceof firebase.firestore.Timestamp) {
      date = DateTime.fromJSDate(value.toDate());
    } else if ((value as any) instanceof Date) {
      date = DateTime.fromJSDate(value);
    }
  } catch (error) {
    date = DateTime.invalid('Invalid Date');
  }

  return date;
}

/**
 * Converts firestore.Timestamp to ISO Date string when reteiving
 *
 * @returns iso datetime string
 */
export const toISO = (timestamp: firebase.firestore.Timestamp) => DateTime.fromJSDate(timestamp.toDate()).toISO();

/**
 * Converts all firestore.Timestamp to ISO Date string when reteiving
 */
export const toISOs = <T>(obj: T) => {
  if (!obj) return null;
  if (typeof obj == 'string') return obj;

  for (const [key, value] of Object.entries(obj)) {
    if (value instanceof firebase.firestore.Timestamp) {
      obj[key] = toISO(value);
    } else if (Array.isArray(value)) {
      obj[key] = value.map(v => toISOs(v));
    }
  }
  return obj as T;
};

export const mapObjectISOs = <T>() => map<T, T>(item => toISOs(item));
export const mapArrayISOs = <T>() => map<T[], T[]>(items => items.map<T>(toISOs));

/**
 * Converts ISO Date string to firebase.Timestamp when saving
 *
 * @param value ISO string | firestore.Timestamp | JS Date
 */
export const toTimestamp = (value: DatePredicate) => {
  const date = toLuxonDateTime(value);
  return date && date.isValid ? firebase.firestore.Timestamp.fromDate(date.toJSDate()) : null;
};

/**
 * Converts all ISO Date string to firebase.Timestamp when saving
 *
 * @param obj { birthday: DatePredicate }
 */
export function toTimestamps<T>(obj: T) {
  if (!obj) return null;

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value == 'string') {
      const timestamp = toTimestamp(value);
      if (timestamp) {
        // console.log(`[key:timestamp]`, key, timestamp.toDate());
        obj[key] = timestamp;
      }
    }
  }
  return obj as T;
}

/**
 * UNUSED
 * https://stackoverflow.com/questions/46583883 typescript-pick-properties-with-a-defined-type
 * Based on https://github.com/microsoft/TypeScript/issues/16350#issuecomment-397374468
 */
export function toUtc(isoDateString: string): DateTime {
  return DateTime.fromISO(isoDateString).setZone('UTC');
}
export function toTimezone(isoDateString: string, zone: string | Zone): DateTime {
  return DateTime.fromISO(isoDateString).setZone(zone);
}
