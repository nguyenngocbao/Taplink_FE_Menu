'use client';

import { Provider } from 'react-redux';

import { useProgress } from '@/hooks/useProgress';

import { store } from './index';

export const ReduxProvider = ({ children }) => {
  useProgress();
  return <Provider store={store}>{children}</Provider>;
};
