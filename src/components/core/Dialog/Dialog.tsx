'use client';

import { Dialog as UIDialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import * as React from 'react';

import CloseIcon from '@/assets/icon/close-black.svg';

type DialogProps = {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  initialFocus?: React.MutableRefObject<null>;
};

export const DialogTitle = UIDialog.Title;

export const DialogDescription = UIDialog.Description;

export const Dialog = ({
  title,
  isOpen,
  onClose,
  children,
  initialFocus
}: DialogProps) => {
  return (
    <>
      <Transition.Root show={isOpen} as={React.Fragment}>
        <UIDialog
          as="div"
          static
          className="fixed inset-0 z-50 overflow-hidden"
          open={isOpen}
          onClose={onClose}
          initialFocus={initialFocus}
        >
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <UIDialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>
            <Transition.Child
              as="div"
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              className="z-50 rounded-[10px] bg-white"
            >
              <UIDialog.Title className="flex h-[53px] w-full items-center justify-between border-b-[0.5px] border-disabled">
                <span className="text-[20]/[24px] truncate px-[16px] font-bold">
                  {title}
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-full w-[53px] items-center justify-center "
                >
                  <Image src={CloseIcon} alt="close" />
                </button>
              </UIDialog.Title>
              <UIDialog.Panel className="px-[16px] py-[21px]">
                {children}
              </UIDialog.Panel>
            </Transition.Child>
          </div>
        </UIDialog>
      </Transition.Root>
    </>
  );
};
