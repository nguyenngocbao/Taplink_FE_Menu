import querystring from 'querystring';

import { Method } from 'axios';
import clsx, { ClassValue } from 'clsx';
import { toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';

import { ERROR_MESSAGE_ID } from '@/constants';
import axios from '@/lib/axios';
import fetchServer from '@/lib/fetch-server';
import { ServerError, SortOrder } from '@/types';

export const mergeClasses = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const handleServerError = (e: ServerError) => {
  if (e.isResolved) {
    toast.error(e.message);
    throw e;
  }
  throw e;
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

export const updateUrlWithParams = (params: Record<string, any>) => {
  const trimedParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value)
  );
  const newUrl = mergeQueryParams(trimedParams);
  window.history.replaceState(
    { ...window.history.state, as: newUrl, url: newUrl },
    document.title,
    newUrl
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

export const formatDateTimeJp = (d?: any) => {
  const date = d ? new Date(d) : new Date();

  const _year = date.getFullYear();
  const _month = `0${date.getMonth() + 1}`.slice(-2);
  const _date = `0${date.getDate()}`.slice(-2);

  return `${_year}年${_month}月${_date}日`;
};

export const getMockError = obj => {
  const res = Object.entries(obj).map(([key, value]) => [
    key,
    typeof value === 'object' && !(value instanceof Date)
      ? getMockError(value)
      : ['Error validation message']
  ]);
  return Object.fromEntries(res);
};

export async function callApi<R>(
  href: string,
  method: Method,
  body?: any,
  isMock?: boolean,
  headers?: Record<string, string>
): Promise<R> {
  switch (method) {
    case 'GET':
    case 'get':
    case 'DELETE':
    case 'delete':
      if (isOnServer()) {
        const params = new URLSearchParams(body);
        return fetchServer(`${href}?${params}`, method, {
          tags: [href],
          isMock: isMock,
          headers: headers
        });
      }

      return await axios[method.toLowerCase()](href, {
        params: body,
        baseURL: isMock ? process.env.NEXT_PUBLIC_NEXT_SERVER_URL : undefined,
        ...(headers && { headers: headers })
      });
    case 'POST':
    case 'post':
    case 'PUT':
    case 'put':
      if (isOnServer()) {
        return fetchServer(href, method, {
          tags: [href],
          isMock: isMock,
          body: body,
          headers: headers
        });
      }

      return await axios[method.toLowerCase()](href, body, {
        baseURL: isMock ? process.env.NEXT_PUBLIC_NEXT_SERVER_URL : undefined,
        ...(headers && { headers: headers })
      });

    default:
      console.error('Method does not support');
  }
}

/**
 *
 * @param number start from 0
 * @returns
 */
export const getLastDateInMonth = (number: number) => {
  const now = new Date();
  const d = new Date(now.getFullYear(), number + 1, 0);
  return d.getDate();
};

/**
 *
 * @param month start from 0
 * @returns
 */
export const getDatesOfMonth = (month: number) => {
  return getArrayOfNumber(1, getLastDateInMonth(month));
};

export const getStandardFormatDate = (d: any) => {
  const date = d ? new Date(d) : new Date();

  const _year = date.getFullYear();
  const _month = `0${date.getMonth() + 1}`.slice(-2);
  const _date = `0${date.getDate()}`.slice(-2);

  return `${_year}-${_month}-${_date}`;
};

export const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const sortArrByKey = (
  arr: Array<any>,
  sortKey: string,
  order: SortOrder
) => {
  return arr.sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];

    if (order === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return bValue < aValue ? -1 : bValue > aValue ? 1 : 0;
    }
  });
};

export function queryStringToObject(searchString: string) {
  const result: Record<string, any> = {};

  Object.entries(querystring.parse(searchString)).forEach(([key, value]) => {
    const match = key.match(/^([^&.]+)\[(.+)\]$/);
    if (match) {
      const [, objKey, fieldName] = match;
      if (result[objKey]) {
        result[objKey][fieldName] = value;
      } else {
        result[objKey] = {
          [fieldName]: value
        };
      }
    } else {
      result[key] = value;
    }
  });

  return result;
}

export const getQueryParam = key => {
  if (isOnServer()) {
    return undefined;
  }
  const query = new URLSearchParams(location.search);
  return query.get(key);
};

export function blobToBase64(blob): Promise<string> {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

export function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[arr.length - 1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
