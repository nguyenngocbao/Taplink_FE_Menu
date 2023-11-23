'use client';

import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/solid';
import { DotsHorizontalIcon } from '@heroicons/react/solid';
import { FC, HTMLAttributes, memo, useMemo } from 'react';

import { getArrayOfNumber, mergeClasses } from '@/utils/common';

/**
 * Note: Every index variable in this file starts from 1
 */

interface PaginationItemProps extends HTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  isActive?: boolean;
}

const PaginationItem: FC<PaginationItemProps> = ({
  disabled,
  isActive,
  children,
  ...props
}) => {
  return (
    <button
      disabled={disabled}
      className={mergeClasses(
        'border-black-400 text-black-900 flex min-h-[32px] min-w-[32px] items-center justify-center gap-1 rounded-[4px] border px-[9px] text-[12px] leading-[25px]',
        disabled ? 'border-silver-sand text-silver-sand' : 'hover:border-blue',
        isActive
          ? 'border-blue bg-blue hover:bg-bright-navy-blue text-white'
          : ''
      )}
      {...props}
    >
      {children}
    </button>
  );
};

interface PaginationProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  total: number;
  pageSize?: number;
  pageIndex: number;
  middleItemNumber?: number;
  onChange: (page: number) => void;
}

export const Pagination: FC<PaginationProps> = memo(
  ({
    className,
    onChange,
    middleItemNumber = 5,
    total,
    pageSize: limit,
    pageIndex: page,
    ...props
  }) => {
    const pageCount = Math.ceil(total / limit);

    const middlePaginationItems = useMemo(() => {
      if (pageCount <= middleItemNumber) {
        const array = Array.from(Array(pageCount)).map((it, i) => i + 1);
        return array.map(pageIdx => (
          <PaginationItem
            key={pageIdx}
            isActive={page === pageIdx}
            onClick={() => onChange(pageIdx)}
          >
            {pageIdx}
          </PaginationItem>
        ));
      }

      let array = null;
      const lastIndexOfFirstItems = middleItemNumber - 2;
      const firstIndexOfLastItems = pageCount - (middleItemNumber - 2) + 1;

      const isPageIndexInLast = page >= firstIndexOfLastItems;
      const isPageIndexInMid = page > lastIndexOfFirstItems;

      if (isPageIndexInLast) {
        array = [1, 0, ...getArrayOfNumber(firstIndexOfLastItems, pageCount)];
      } else if (isPageIndexInMid) {
        array = [
          ...getArrayOfNumber(page - lastIndexOfFirstItems + 1, page),
          0,
          pageCount
        ];
      } else {
        array = [...getArrayOfNumber(1, lastIndexOfFirstItems), 0, pageCount];
      }

      return array.map(pageIdx =>
        pageIdx ? (
          <PaginationItem
            key={pageIdx}
            isActive={page === pageIdx}
            disabled={pageIdx === 0}
            onClick={() => onChange(pageIdx)}
          >
            {pageIdx}
          </PaginationItem>
        ) : (
          <div
            key={pageIdx}
            className="flex h-[32px] w-[32px] items-center justify-center"
          >
            <DotsHorizontalIcon className="text-silver-sand w-[14px]" />
          </div>
        )
      );
    }, [page, pageCount]);

    return (
      <div
        className={mergeClasses('mb-2 flex items-center space-x-2', className)}
        {...props}
      >
        <PaginationItem disabled={page === 1} onClick={() => onChange(1)}>
          <ChevronDoubleLeftIcon className="h-[10px] w-[10px]" />
          最初へ
        </PaginationItem>
        <PaginationItem
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
        >
          <ChevronLeftIcon className="h-[10px] w-[10px]" />
          前へ
        </PaginationItem>
        {middlePaginationItems}
        <PaginationItem
          disabled={page === pageCount}
          onClick={() => onChange(page + 1)}
        >
          次へ
          <ChevronRightIcon className="h-[10px] w-[10px]" />
        </PaginationItem>
        <PaginationItem
          disabled={page === pageCount}
          onClick={() => onChange(pageCount)}
        >
          最後へ
          <ChevronDoubleRightIcon className="h-[10px] w-[10px]" />
        </PaginationItem>
      </div>
    );
  }
);
