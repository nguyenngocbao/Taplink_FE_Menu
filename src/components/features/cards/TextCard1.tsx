import { Menu, Transition } from '@headlessui/react';
import Image from 'next/image';
import { FC, Fragment, HTMLAttributes } from 'react';

import SquarePencilPrimary from '@/assets/icon/square-pencil-primary.svg';
import ThreeDot from '@/assets/icon/three-dot.svg';
import TrashWarning from '@/assets/icon/trash-warning.svg';
import { PRICE_SIZE_TYPES } from '@/constants/item';
import { ItemDTO, PriceType } from '@/types/item';
import { mergeClasses } from '@/utils/common';

interface TextCard2 extends HTMLAttributes<HTMLElement> {
  t: any;
  data?: ItemDTO;
  readOnly?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
}

export const TextCard2: FC<TextCard2> = ({
  t,
  data,
  readOnly,
  className,
  onEdit,
  onRemove,
  ...props
}) => {
  return (
    <article
      className={mergeClasses(
        'relative flex flex-col justify-between gap-[9px] rounded-[10px] bg-primary-bg px-[4px] pb-[10px] pt-[4px] text-left',
        className
      )}
      {...props}
    >
      <div className="relative w-full rounded-[10px] bg-primary-bg2 p-[25px_27px_7px_12px]">
        <div className="absolute left-[12px] top-0 h-[17px] rounded-b-[6px] bg-primary px-[4px] text-[12px]/[16.8px] font-normal text-white">
          {t('new')}
        </div>
        <div>
          <p className="mb-[4px] text-[20px]/[24px] font-bold text-primary">
            {data?.name}
          </p>
        </div>
        {!readOnly && (
          <Menu
            as="div"
            className="absolute right-0 top-[7px] inline-block h-[20px] w-[20px]"
          >
            <Menu.Button className="flex items-center justify-center">
              <Image src={ThreeDot} alt="" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-[150px] origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                <div className="px-1 py-1 ">
                  <Menu.Item>
                    <button
                      onClick={onEdit}
                      className={`group flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm`}
                    >
                      <Image
                        src={SquarePencilPrimary}
                        alt=""
                        className="h-[20px] w-[20px]"
                      />
                      <span>{t('edit')}</span>
                    </button>
                  </Menu.Item>
                  <Menu.Item>
                    <button
                      onClick={onRemove}
                      className={`group flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm`}
                    >
                      <Image
                        src={TrashWarning}
                        alt=""
                        className="h-[20px] w-[20px]"
                      />
                      <span>{t('delete')}</span>
                    </button>
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        )}
      </div>

      <div className="px-[12px]">
        <p className="mb-[11px] text-[14px]/[19.6px] font-normal text-[#000]">
          {data?.description}
        </p>
        <span className="flex items-center justify-between gap-[13px]">
          {data?.priceTypeId === PriceType.Single && (
            <span className="text-[20px]/[24px] font-bold">
              {data.priceInfo.price.toLocaleString()}đ
            </span>
          )}

          {data?.priceTypeId === PriceType.Range && (
            <span className="text-[15px]/[20px] font-bold">
              {data.priceInfo.price[0].toLocaleString()}-
              {data.priceInfo.price[1].toLocaleString()}đ
            </span>
          )}

          {data?.priceTypeId === PriceType.Size && (
            <span className="flex flex-[1] flex-col text-[15px]/[20px] font-bold">
              {PRICE_SIZE_TYPES.map(type => {
                return (
                  <span className="flex justify-between" key={type.value}>
                    <span>{type.label}: </span>
                    <span>
                      {data.priceInfo.price[type.value].toLocaleString()}đ
                    </span>
                  </span>
                );
              })}
            </span>
          )}

          <span className="flex gap-[2px] text-[14px]/[24px] font-normal">
            <svg
              width="12"
              height="13"
              viewBox="0 0 12 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mt-[3px]"
            >
              <path
                d="M5.09749 1.39137C5.45972 0.632244 6.54028 0.632245 6.90252 1.39137L7.92637 3.53703C8.07215 3.84254 8.3626 4.05355 8.6982 4.09779L11.0552 4.40849C11.8891 4.51842 12.2231 5.54609 11.613 6.12518L9.88876 7.76197C9.64326 7.99503 9.53232 8.33646 9.59395 8.66931L10.0268 11.007C10.18 11.8341 9.30578 12.4692 8.56652 12.068L6.47701 10.9339C6.1795 10.7724 5.8205 10.7724 5.52298 10.9339L3.43348 12.068C2.69422 12.4692 1.82003 11.8341 1.97318 11.007L2.40605 8.66931C2.46768 8.33646 2.35674 7.99503 2.11124 7.76197L0.386979 6.12518C-0.223052 5.54609 0.110861 4.51842 0.944765 4.40849L3.3018 4.09779C3.63741 4.05355 3.92785 3.84254 4.07363 3.53703L5.09749 1.39137Z"
                fill="#171717"
              />
            </svg>

            <span>5.0</span>
          </span>
        </span>
      </div>
    </article>
  );
};

export const TextCard2Skeleton = ({ className, ...props }) => {
  return (
    <article
      className={mergeClasses('loading h-[181px] rounded-[10px]', className)}
      {...props}
    ></article>
  );
};
