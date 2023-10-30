import clsx, { ClassValue } from 'clsx';
import { toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';

import { ERROR_MESSAGE_ID } from '@/constants';
import { ServerError } from '@/types';

export const mergeClasses = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getErrorText = (e: ServerError): string => {
  if (e?.errors) {
    const errors = Object.values(e.errors);
    return errors[0][0];
  }
  if (e?.message) {
    return e.message;
  }

  if (typeof e === 'string') return e;

  return 'Undefined error';
};

export const handleServerError = (e: ServerError) => {
  toast.error(getErrorText(e));
};

export const isOnServer = () => {
  return typeof window === 'undefined';
};

export function isValidHttpUrl(string: string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}

export function getFormData(object) {
  const formData = new FormData();
  for (const key in object) {
    formData.append(key, object[key]);
  }
  return formData;
}

export function debounce<Params extends any[]>(
  func: (...args: Params) => any,
  timeout: number
): (...args: Params) => void {
  let timer: NodeJS.Timeout;
  return (...args: Params) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}

export function download(filename, text) {
  const element = document.createElement('a');
  element.setAttribute(
    'href',
    'data:text/csv;charset=shift_jis,' + encodeURI(text)
  );

  element.setAttribute('custom-ignore', 'true');

  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export const mergeQueryParams = (params: Record<string, any>) => {
  const query = new URLSearchParams(location.search);

  for (const key in params) {
    query.set(key, params[key]);
  }

  return (
    window.location.protocol +
    '//' +
    window.location.host +
    window.location.pathname +
    '?' +
    query.toString()
  );
};

function generateUUID() {
  // Public Domain/MIT
  let d = new Date().getTime(); //Timestamp
  let d2 =
    (typeof performance !== 'undefined' &&
      performance.now &&
      performance.now() * 1000) ||
    0; //Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function getUniqueId(length = 16) {
  return generateUUID().slice(0, length);
}

export const getArrayOfNumber = (from, to) => {
  const arr = [];
  for (let i = from; i <= to; i++) {
    arr.push(i);
  }
  return arr;
};

export const scrollToTheEnd = (delay = 100) => {
  setTimeout(() => {
    document
      .getElementsByTagName('main')[0]
      .scrollTo(0, window.innerHeight * 2);
  }, delay);
};

export const scrollToErrorMessage = (delay = 100) => {
  setTimeout(
    () => document.getElementById(ERROR_MESSAGE_ID)?.scrollIntoView(),
    delay
  );
};
