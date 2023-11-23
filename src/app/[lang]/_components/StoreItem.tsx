'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { FC, HTMLAttributes } from 'react';

import MarkerBlack from '@/app/[lang]/_assets/marker-black.svg';
import NoImage from '@/app/[lang]/_assets/no-image.svg';
import PhoneBlack from '@/app/[lang]/_assets/phone-black.svg';
import { StoreResponse } from '@/types/store';
import { mergeClasses } from '@/utils/common';
import { getStoreAddress } from '@/utils/store';

interface StoreItem extends HTMLAttributes<HTMLDivElement> {
  data: StoreResponse;
}

export const StoreItem: FC<StoreItem> = ({ data, className, ...props }) => {
  const { lang } = useParams();

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
            <Image src={MarkerBlack} alt="" className="h-[10px] w-[10px]" />
            <span>{data.phoneNumber}</span>
          </p>
          <p className="flex items-start gap-[8px] text-[12px]/[16.8px]">
            <Image src={PhoneBlack} alt="" className="h-[10px] w-[10px]" />
            <span>{getStoreAddress(data.address, String(lang))}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
