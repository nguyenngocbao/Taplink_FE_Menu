import { FC, HTMLAttributes } from 'react';

import { mergeClasses } from '@/utils/common';

interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
  content: string | React.ReactElement;
  xDirection?: 'left' | 'right';
  yDirection?: 'top' | 'bottom' | 'center';
}

export const Tooltip: FC<TooltipProps> = ({
  children,
  xDirection = 'right',
  yDirection = 'center',
  content
}) => {
  return (
    <div className="group relative inline-block">
      <div>{children}</div>
      <div
        className={mergeClasses(
          'text-tooltip border-silver-sand invisible absolute z-10 flex w-max items-center justify-end rounded-[4px] border-[1px] bg-white p-[3px_8px] shadow-md transition-all group-hover:visible',
          xDirection === 'left'
            ? 'left-[-5px] translate-x-[-100%]'
            : 'left-[120%]',
          yDirection === 'top' && 'bottom-0',
          yDirection === 'center' && ' top-[50%] translate-y-[-50%]',
          yDirection === 'bottom' && 'top-[100%]'
        )}
      >
        {content}
      </div>
    </div>
  );
};
