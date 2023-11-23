'use server';

import { revalidateTag as _revalidateTag } from 'next/cache';

export const revalidateTag = prefix => {
  _revalidateTag(prefix);
};
