'use client';

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/solid';
import { FC, HTMLAttributes, memo, useRef, useState } from 'react';

import { Button, ConfirmationDialog } from '@/components/core';
import { mergeClasses } from '@/utils/common';

interface BaseLayoutProps extends HTMLAttributes<HTMLDivElement> {
  menu: (isOpen, setOpen) => React.ReactElement;
}

export const BaseLayout: FC<BaseLayoutProps> = memo(
  ({ menu, children, className }) => {
    const logoutDialogRef = useRef(null);
    const [isOpen, setOpen] = useState(true);

    return (
      <div className="flex flex-col lg:flex-row">
        {isOpen && (
          <div
            role="presentation"
            className="fixed inset-0 z-40 bg-gray-700 bg-opacity-75 transition-opacity lg:hidden"
            onClick={() => setOpen(false)}
          ></div>
        )}
        <button
          onClick={() => setOpen(pre => !pre)}
          className="nline-flex text-black-700 m-2 h-[35px] w-[35px] items-center justify-center rounded-l-[8px] text-sm hover:bg-gray-100 focus:outline-none  focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 sm:hidden lg:ml-3 lg:mt-2"
        >
          <span className="sr-only">Open sidebar</span>
          <svg
            className="h-6 w-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
            ></path>
          </svg>
        </button>

        <aside
          className={mergeClasses(
            'fixed left-0 top-0 z-40 h-screen text-[14px] leading-[17px] shadow-sm transition-all lg:static',
            isOpen
              ? 'w-[250px] overflow-visible'
              : 'w-0 overflow-hidden lg:w-[52px]'
          )}
          aria-label="Sidebar"
        >
          <div
            className={mergeClasses(
              'relative h-full pt-[60px]',
              isOpen ? 'pl-[20px]' : 'pl-0',
              className
            )}
          >
            {menu(isOpen, setOpen)}
            <button
              className={mergeClasses(
                'hover:bg-black-100 hover:text-black-900 absolute bottom-[52px] right-0 flex h-[52px] w-[52px] items-center p-[17px_0_15px_16px]'
              )}
              onClick={() => logoutDialogRef.current.open()}
            >
              <ArrowRightOnRectangleIcon className="h-[18px] w-[18px]" />
            </button>
            <button
              className={mergeClasses(
                'hover:bg-black-100 hover:text-black-900 absolute bottom-0 right-0 flex h-[52px] w-[52px] items-center p-[17px_0_15px_16px]'
              )}
              onClick={() => setOpen(pre => !pre)}
            >
              {isOpen ? (
                <ChevronLeftIcon className="h-[18px] w-[18px]" />
              ) : (
                <ChevronRightIcon className="h-[18px] w-[18px]" />
              )}
            </button>
          </div>
        </aside>
        <main className="bg-alice-blue h-screen flex-[1] overflow-auto p-4 xl:p-[56px_40px]">
          <div className="max-w-[1180px]">{children}</div>
        </main>
        <ConfirmationDialog
          ref={logoutDialogRef}
          icon="info"
          title="ログアウト"
          body="ログアウトしても宜しいでしょうか？"
          confirmButton={
            <Button
              className="bg-blue hover:bg-bright-navy-blue text-white"
              onClick={() => {
                // logout();
              }}
            >
              OK
            </Button>
          }
        />
      </div>
    );
  }
);
