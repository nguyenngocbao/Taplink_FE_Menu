import { Menu, Transition } from '@headlessui/react';
import Image from 'next/image';
import { FC, Fragment, HTMLAttributes } from 'react';

import SquarePencilPrimary from '@/assets/icon/square-pencil-primary.svg';
import ThreeDot from '@/assets/icon/three-dot.svg';
import TrashWarning from '@/assets/icon/trash-warning.svg';
import Spa from '@/assets/image/spa.png';
import { ItemDTO } from '@/types/item';
import { mergeClasses } from '@/utils/common';

interface GroupImageCard extends HTMLAttributes<HTMLElement> {
  t: any;
  data?: ItemDTO;
  onEdit?: () => void;
  onRemove?: () => void;
}

export const GroupImageCard: FC<GroupImageCard> = ({
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
        'relative flex flex-col gap-[12px] rounded-[10px] bg-primary-bg px-[4px] pb-[10px] pt-[4px]',
        className
      )}
      {...props}
    >
      <div className="relative h-[195px] w-full rounded-[10px]">
        <Image
          src={Spa}
          alt=""
          className="rounded-[10px] object-cover object-top"
          fill
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

      <div className="px-[8px] text-left">
        <p className="mb-[4px] text-[20px]/[24px] font-bold text-primary">
          Chăm sóc da
        </p>
        <p className="mb-[4px] text-[12px]/[16.8px] font-normal text-[#000]">
          Lorem Ipsum is simply dummy text of the printing
        </p>
      </div>
    </article>
  );
};
