'use client';

import Image from 'next/image';
import { useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { Chip, Dialog, SelectField } from '@/components/Elements';
import { useDisclosure } from '@/hooks/useDisclosure';
import { Option } from '@/types';

import PlusWhite from '../../_assets/plus-white.svg';
import ItemForm from '../ItemForm';

import { DrinkWithImageCard } from './cards/DrinkWithImageCard';

export const CafeLayout = () => {
  const { t } = useTranslation('myPage');
  const chips: Option[] = [
    {
      label: 'Milk tea',
      value: 'Milk tea'
    },
    {
      label: 'Bread',
      value: 'Bread'
    },
    {
      label: 'Ăn vặt',
      value: 'Ăn vặt'
    },
    {
      label: 'Cafe',
      value: 'Cafe'
    },
    {
      label: 'Bread1',
      value: 'Bread1'
    },
    {
      label: 'Bread2',
      value: 'Bread2'
    }
  ];
  const [selectedChipId, setSelectedChipId] = useState(chips[0].value);
  const { isOpen, open, close } = useDisclosure();

  return (
    <>
      <div className="space-y-[36px]">
        <div className="mr-[-16px] flex gap-[8px] overflow-x-auto">
          {chips.map(chip => {
            return (
              <Chip
                onClick={() => setSelectedChipId(chip.value)}
                isActive={selectedChipId === chip.value}
                key={chip.value}
              >
                {chip.value}
              </Chip>
            );
          })}
        </div>
        <SelectField
          options={[
            {
              value: 'template1',
              label: 'Template 1'
            }
          ]}
          label={t('menuTemplate')}
        ></SelectField>
        <div className="flex flex-wrap gap-x-[16px] gap-y-[27px]">
          <DrinkWithImageCard t={t} className="w-[calc(50%_-_8px)]" />
          <DrinkWithImageCard t={t} className="w-[calc(50%_-_8px)]" />
          <DrinkWithImageCard t={t} className="w-[calc(50%_-_8px)]" />
          <DrinkWithImageCard t={t} className="w-[calc(50%_-_8px)]" />
          <DrinkWithImageCard t={t} className="w-[calc(50%_-_8px)]" />
          <DrinkWithImageCard t={t} className="w-[calc(50%_-_8px)]" />
        </div>
        <Dialog title={t('addItem')} isOpen={isOpen} onClose={close}>
          <div className="h-[calc(100vh_-_230px)] w-[calc(100vw_-_64px)] overflow-y-auto text-left">
            <ItemForm data={null} itemTypes={[]} />
          </div>
        </Dialog>
      </div>
      <button
        onClick={open}
        className="fixed bottom-[16px] right-[16px] flex h-[56px] w-[56px] items-center justify-center rounded-[10px] bg-primary"
      >
        <Image src={PlusWhite} alt="" />
      </button>
    </>
  );
};
