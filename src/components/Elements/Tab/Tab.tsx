'use client';

import { Tab, TabGroupProps } from '@headlessui/react';
import { PlusIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import React, { FC, memo, MutableRefObject, ReactElement } from 'react';

import { mergeClasses } from '@/utils/common';

import { Spinner } from '../Indicator';

interface TabsProps extends TabGroupProps<any> {
  labels: Array<string>;
  panels: Array<ReactElement>;
  tabBtnClass?: string;
  menu?: React.ReactElement;
  menuDisabled?: boolean[];
  onAddTab?: React.MouseEventHandler<HTMLButtonElement>;
  onOpenMenu?: (e: any, label: string, index: number) => void;
  isAdding?: boolean;
  tabListRef?: MutableRefObject<HTMLElement>;
}

export const Tabs: FC<TabsProps> = memo(
  ({
    labels,
    panels,
    tabBtnClass,
    menu,
    menuDisabled,
    isAdding,
    tabListRef,
    onAddTab,
    onOpenMenu,
    ...props
  }) => {
    return (
      <div className="w-full text-black">
        <Tab.Group {...props}>
          <Tab.List
            ref={tabListRef}
            className="flex w-full items-end space-x-2 overflow-x-auto"
          >
            {labels.map((label, index) => (
              <Tab
                key={index}
                className={({ selected }) =>
                  mergeClasses(
                    'flex h-[40px] w-[200px] shrink-0 items-center rounded-[8px_8px_0_0] p-[9px_12px] font-medium',
                    selected ? 'h-[44px] bg-white' : tabBtnClass || 'bg-purple'
                  )
                }
              >
                <span
                  className={mergeClasses(
                    'inline-block truncate',
                    menu && !menuDisabled?.[index] ? 'w-[150px]' : 'w-full'
                  )}
                >
                  {label}
                </span>
                {menu && !menuDisabled?.[index] && (
                  <div
                    role="presentation"
                    onClick={e => onOpenMenu(e, label, index)}
                    className="hover:bg-black-200 flex h-[30px] w-[30px] items-center justify-center rounded-[4px] text-[#707070]"
                  >
                    <ArrowDownIcon />
                  </div>
                )}
              </Tab>
            ))}
            {onAddTab && (
              <button
                disabled={isAdding}
                onClick={onAddTab}
                className="bg-purple h-[40px] rounded-[8px_8px_0_0] p-[9px_12px]"
              >
                {isAdding ? (
                  <Spinner
                    isCenter={false}
                    size="sm"
                    className="text-current"
                  />
                ) : (
                  <PlusIcon
                    aria-hidden="true"
                    className="text-black-900 h-[20px] w-[20px]"
                  />
                )}
              </button>
            )}
          </Tab.List>
          <Tab.Panels className="min-h-[80px] rounded-[0_16px_16px] bg-white">
            {panels.map((panel, index) => (
              <Tab.Panel key={index} className="p-5">
                {panel}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
        {menu}
      </div>
    );
  }
);
