'use client';

import { Menu, Transition } from '@headlessui/react';
import Image from 'next/image';
import { Fragment } from 'react';

import useLanguages from '@/hooks/useLanguages';

export const LangSwicher = () => {
  const { languages, selectedLanguage, onChangeLanguage } = useLanguages();

  return (
    <Menu
      as="div"
      className="absolute right-0 z-50 inline-block h-[56px] w-[56px]"
    >
      <Menu.Button className="flex h-full w-full items-center justify-center">
        <Image
          src={selectedLanguage.iconUrl}
          width={48}
          height={48}
          alt={selectedLanguage.name}
          className="h-[24px] w-[24px]"
        />
        <svg
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-[15px] right-[15px]"
        >
          <rect width="8" height="8" rx="4" fill="white" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.82322 2.82322C1.92085 2.72559 2.07915 2.72559 2.17678 2.82322L4 4.64645L5.82322 2.82322C5.92085 2.72559 6.07915 2.72559 6.17678 2.82322C6.27441 2.92085 6.27441 3.07915 6.17678 3.17678L4.17678 5.17678C4.07915 5.27441 3.92085 5.27441 3.82322 5.17678L1.82322 3.17678C1.72559 3.07915 1.72559 2.92085 1.82322 2.82322Z"
            fill="#52525B"
          />
        </svg>
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
            {languages.map(_lang => (
              <Menu.Item key={_lang.id}>
                {() => (
                  <button
                    onClick={() => onChangeLanguage(_lang.id)}
                    className={`${
                      selectedLanguage.id === _lang.id
                        ? 'bg-primary text-white'
                        : 'text-gray-900'
                    } group flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm`}
                  >
                    <Image
                      src={_lang.iconUrl}
                      width={48}
                      height={48}
                      alt={_lang.name}
                      className="h-[24px] w-[24px]"
                    />
                    <span>{_lang.name}</span>
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
