'use client';

import Image from 'next/image';
import { useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { Chip, Dialog, SelectField } from '@/components/Elements';
import { useDisclosure } from '@/hooks/useDisclosure';
import { Option } from '@/types';

import PlusWhite from '../../_assets/plus-white.svg';
import { GroupImageCard } from '../Cards/GroupImageCard';
import { ImageCard1 } from '../Cards/ImageCard1';
import { ImageCard2 } from '../Cards/ImageCard2';
import { TextCard2 } from '../Cards/TextCard1';
import ItemForm from '../ItemForm';

export const BasicLayout = () => {
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
        <div className="no-scrollbar mr-[-16px] flex gap-[8px] overflow-x-auto">
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
          <GroupImageCard t={t} className="w-[calc(50%_-_8px)]" />
          <GroupImageCard t={t} className="w-[calc(50%_-_8px)]" />
          <GroupImageCard t={t} className="w-[calc(50%_-_8px)]" />
          <GroupImageCard t={t} className="w-[calc(50%_-_8px)]" />
          <GroupImageCard t={t} className="w-[calc(50%_-_8px)]" />
          <GroupImageCard t={t} className="w-[calc(50%_-_8px)]" />
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
          <TextCard2 t={t} className="w-[calc(50%_-_8px)]" />
          <TextCard2 t={t} className="w-[calc(50%_-_8px)]" />
          <TextCard2 t={t} className="w-[calc(50%_-_8px)]" />
          <TextCard2 t={t} className="w-[calc(50%_-_8px)]" />
          <TextCard2 t={t} className="w-[calc(50%_-_8px)]" />
          <TextCard2 t={t} className="w-[calc(50%_-_8px)]" />
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
          <ImageCard1 t={t} className="w-[calc(50%_-_8px)]" />
          <ImageCard1 t={t} className="w-[calc(50%_-_8px)]" />
          <ImageCard1 t={t} className="w-[calc(50%_-_8px)]" />
          <ImageCard1 t={t} className="w-[calc(50%_-_8px)]" />
          <ImageCard1 t={t} className="w-[calc(50%_-_8px)]" />
          <ImageCard1 t={t} className="w-[calc(50%_-_8px)]" />
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
          <ImageCard2 t={t} className="w-[calc(50%_-_8px)]" />
          <ImageCard2 t={t} className="w-[calc(50%_-_8px)]" />
          <ImageCard2 t={t} className="w-[calc(50%_-_8px)]" />
          <ImageCard2 t={t} className="w-[calc(50%_-_8px)]" />
          <ImageCard2 t={t} className="w-[calc(50%_-_8px)]" />
          <ImageCard2 t={t} className="w-[calc(50%_-_8px)]" />
        </div>

        <Dialog title={t('addItem')} isOpen={isOpen} onClose={close}>
          <div className="no-scrollbar h-[calc(100vh_-_140px)] w-[calc(100vw_-_64px)] overflow-y-auto px-[1px] text-left">
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
