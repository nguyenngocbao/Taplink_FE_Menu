import { Menu, Transition } from '@headlessui/react';
import Image from 'next/image';
import { FC, Fragment, HTMLAttributes } from 'react';

import SquarePencilPrimary from '@/assets/icon/square-pencil-primary.svg';
import ThreeDot from '@/assets/icon/three-dot.svg';
import TrashWarning from '@/assets/icon/trash-warning.svg';
import Drink1 from '@/assets/image/drink1.png';
import { ItemRequest } from '@/types/item';
import { mergeClasses } from '@/utils/common';

interface ImageCard2 extends HTMLAttributes<HTMLElement> {
  t: any;
  data?: ItemRequest;
  onEdit?: () => void;
  onRemove?: () => void;
}

export const ImageCard2: FC<ImageCard2> = ({
  t,
  data,
  className,
  onEdit,
  onRemove,
  ...props
}) => {
  console.log(data);
  return (
    <article
      className={mergeClasses(
        'relative flex flex-col gap-[29px] rounded-[10px] bg-primary-bg px-[4px] pb-[10px] pt-[4px]',
        className
      )}
      {...props}
    >
      <div className="relative h-[142px] w-full rounded-[10px] bg-primary-bg2">
        <div className="absolute left-[12px] top-0 h-[17px] rounded-b-[6px] bg-primary px-[4px] text-[12px]/[16.8px] font-normal text-white">
          {t('new')}
        </div>
        <Image
          src={Drink1}
          alt=""
          className="absolute left-[50%] top-[24px] h-[147px] w-auto max-w-full translate-x-[-50%]"
        />
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
      </div>

      <div>
        <p className="mb-[4px] text-[20px]/[24px] font-bold text-primary">
          Trà long nhãn
        </p>
        <p className="mb-[4px] text-[12px]/[16.8px] font-normal text-[#000]">
          Lorem Ipsum is simply dummy text
        </p>
        <span className="flex items-center justify-center gap-[13px]">
          <span className="text-[20px]/[24px] font-bold">25.000đ</span>
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
