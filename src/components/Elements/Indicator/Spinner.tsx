'use client';

import { mergeClasses } from '@/utils/common';

const sizes = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-16 w-16',
  xl: 'h-24 w-24'
};

const variants = {
  white: 'text-white',
  gray: 'text-gray-788'
};

export type SpinnerProps = {
  size?: keyof typeof sizes;
  variant?: keyof typeof variants;
  className?: string;
  isCenter?: boolean; // true -> fixed center screen
};

export const Spinner = ({
  size = 'md',
  variant = 'gray',
  className = '',
  isCenter = true
}: SpinnerProps) => {
  return (
    <div
      className={
        isCenter
          ? 'fixed left-0 top-0 flex h-screen w-screen items-center justify-center'
          : ''
      }
    >
      <svg
        className={mergeClasses(
          'animate-spin',
          sizes[size],
          variants[variant],
          className
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        data-testid="loading"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span className="sr-only">Loading</span>
    </div>
  );
};

export default Spinner;
