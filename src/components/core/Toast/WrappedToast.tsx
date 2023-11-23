'use client';

import { FC } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const WrappedToast: FC = () => {
  return <ToastContainer theme="colored" />;
};

WrappedToast.displayName = 'WrappedToast';
