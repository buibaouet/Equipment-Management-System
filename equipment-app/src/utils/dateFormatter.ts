/**
 * Formats a Date object to avoid timezone issues when sending to API.
 * Creates a date at noon local time to prevent day shift when converted to UTC.
 * 
 * @param date - The Date object to format
 * @returns A new Date object at noon local time
 */
export const formatDateForAPI = (date: Date): Date => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return date;
  }
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  // Create new date at noon local time to avoid timezone shift
  return new Date(year, month, day, 12, 0, 0, 0);
};

/**
 * Recursively formats all Date objects in an object or array to avoid timezone issues.
 * This function traverses nested objects and arrays to find and format all Date instances.
 * 
 * @param obj - The object, array, or value to process
 * @returns A new object/array/value with all Date objects formatted
 */
export const formatDatesInObject = (obj: any): any => {
  // Handle null or undefined
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Handle Date objects
  if (obj instanceof Date) {
    return formatDateForAPI(obj);
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => formatDatesInObject(item));
  }

  // Handle objects
  if (typeof obj === 'object') {
    const formatted: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        formatted[key] = formatDatesInObject(obj[key]);
      }
    }
    return formatted;
  }

  // Return primitive values as-is
  return obj;
};

