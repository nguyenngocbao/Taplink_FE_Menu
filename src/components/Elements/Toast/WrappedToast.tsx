'use client';

import { FC } from 'react';
import { ToastContainer } from 'react-toastify';

export const WrappedToast: FC = () => {
  return <ToastContainer theme="colored" />;
};

WrappedToast.displayName = 'WrappedToast';
