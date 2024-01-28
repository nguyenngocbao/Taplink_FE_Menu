'use client';

import Image from 'next/image';
import { FC, HTMLAttributes } from 'react';

import MarkerBlack from '@/assets/icon/marker-black.svg';
import PhoneBlack from '@/assets/icon/phone-black.svg';
import NoImage from '@/assets/image/no-image.svg';
import { SkeletonProps } from '@/types';
import { StoreDTO } from '@/types/store';
import { mergeClasses } from '@/utils/common';

interface StoreItem extends HTMLAttributes<HTMLDivElement> {
  data: StoreDTO;
}

export const StoreItem: FC<StoreItem> = ({ data, className, ...props }) => {
  return (
    <div
      className={mergeClasses(
        'rounded-[10px] bg-primary-bg p-[10px] text-left',
        className
      )}
      {...props}
    >
      <p className="mb-[7px] text-primary">{data.name}</p>
      <div className="flex gap-[9.3px]">
        <div className="relative h-[73px] w-[73px] shrink-0 rounded-[6px]">
          <Image
            className="object-cover"
            fill
            src={data.image || NoImage}
            alt={data.name}
          />
        </div>

        <div className="flex flex-col justify-center gap-[5px]">
          <p className="flex items-center gap-[8px] text-[12px]/[16.8px]">
            <Image src={PhoneBlack} alt="" className="h-[10px] w-[10px]" />
            <span>{data.phone}</span>
          </p>
          <p className="flex items-start gap-[8px] text-[12px]/[16.8px]">
            <Image src={MarkerBlack} alt="" className="h-[10px] w-[10px]" />
            <span>{data.fullAddress}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export const StoreItemSkeleton: FC<SkeletonProps> = ({ length = 1 }) => {
  return (
    <>
      {[...new Array(length)].map((item, i) => (
        <div
          key={i}
          className="loading bg-red h-[122px] w-full rounded-[10px]"
        ></div>
      ))}
    </>
  );
};
