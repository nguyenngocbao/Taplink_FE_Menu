import { ButtonHTMLAttributes, DetailedHTMLProps, FC, useMemo } from 'react';

import { mergeClasses } from '@/utils/common';

interface ChipInterface
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: 'primary' | 'none';
  isActive?: boolean;
}
export const Chip: FC<ChipInterface> = ({
  children,
  isActive,
  className,
  variant = 'primary',
  ...props
}) => {
  const variantStyle = useMemo(() => {
    switch (variant) {
      case 'primary':
        return `text-primary ` + (isActive ? 'bg-primary-bg2' : '');
      default:
        return ``;
    }
  }, [variant, isActive]);

  return (
    <button
      className={mergeClasses(
        'flex h-[34px] shrink-0 items-center justify-center rounded-[10px] bg-blank px-[12px]',
        variantStyle,
        className
      )}
      {...props}
    >
      <>
        <span className="text-[16px]/[22.4px] font-[600]">{children}</span>
        <svg
          width="19"
          height="18"
          viewBox="0 0 19 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={mergeClasses(
            'transition-all',
            isActive ? 'ml-[8px] h-[18px] w-[18px]' : 'w-0'
          )}
        >
          <path
            d="M15.5 4.5L7.25 12.75L3.5 9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </>
    </button>
  );
};
