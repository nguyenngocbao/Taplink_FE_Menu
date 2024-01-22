'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { FC, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { useTranslation } from '@/app/i18n/client';
import PlusWhite from '@/assets/icon/plus-white.svg';
import { Chip, Dialog, SelectField } from '@/components/core';
import { MenuTemplate } from '@/constants/template';
import { useDisclosure } from '@/hooks';
import { useCreate, useRead, useUpdate } from '@/hooks/features';
import { categoryService } from '@/services/category';
import { itemService } from '@/services/item';
import { Option } from '@/types';
import { ID } from '@/types/CRUD';
import { ItemDTO } from '@/types/item';
import { StoreDTO } from '@/types/store';
import {
  dataURLtoFile,
  getFormData,
  updateUrlWithParams
} from '@/utils/common';

import { ImageCard2 } from '../Cards/ImageCard2';
import { TextCard2 } from '../Cards/TextCard1';
import ItemForm from '../ItemForm';

interface BasicLayout {
  categories: Option[];
  menuTemplates: Option[];
  store: StoreDTO;
  priceTypes: Option[];
}

export const BasicLayout: FC<BasicLayout> = ({
  store,
  categories,
  menuTemplates,
  priceTypes
}) => {
  const query = useSearchParams();
  const { t } = useTranslation('myPage');
  const [selectedChipId, setSelectedChipId] = useState(categories[0]?.value);
  const { isOpen, open, close } = useDisclosure();
  const [menuTemplateId, setMenuTemplateId] = useState<number>(
    store.menuTemplateId ?? MenuTemplate.Image
  );
  const categoryId = query.get('categoryId') ?? selectedChipId;

  const { createItem, isCreating } = useCreate({ service: itemService });
  const { updateItem } = useUpdate({ service: categoryService });
  const { data, isLoading, getList } = useRead({
    service: itemService,
    useQueryParams: false,
    initialParams: {
      categoryId: String(categoryId)
    },
    enable: !!categoryId
  });

  console.log(data);
  const items = data?.content ?? [];

  const onChangeMenuTemplate = id => {
    setMenuTemplateId(Number(id));
    const selectedCategory = categories.find(c => c.value === selectedChipId);

    updateItem(
      {
        storeId: store.id,
        name: selectedCategory.label,
        templateId: Number(id)
      },
      selectedCategory.value as ID
    );
  };

  const onAddItem = async (values: ItemDTO) => {
    const { image, ...data } = values;
    try {
      await createItem(
        getFormData({
          ...data,
          ...(image && {
            image: dataURLtoFile(image, 'image.jpg')
          }),
          priceInfo: JSON.stringify(values.priceInfo)
        }),
        true,
        {
          'content-type': 'multipart/form-data'
        }
      );
      toast.success(t('createItemSuccess'));
      await getList({ categoryId: selectedChipId });
      close();
    } catch (e) {
      console.log(e);
      // toast.error(t('createItemFail'));
    }
  };

  const itemsRender = useMemo(() => {
    let ItemComponent = null;
    switch (menuTemplateId) {
      case MenuTemplate.NoImage:
        ItemComponent = TextCard2;
        break;
      default:
        ItemComponent = ImageCard2;
    }
    return (
      <div className="flex flex-wrap gap-x-[16px] gap-y-[27px]">
        {items.map(item => (
          <ItemComponent
            data={item}
            key={item.id}
            t={t}
            className="w-[calc(50%_-_8px)]"
          />
        ))}
      </div>
    );
  }, [menuTemplateId, items]);

  return (
    <>
      <div className="space-y-[36px]">
        <div className="no-scrollbar mr-[-16px] flex gap-[8px] overflow-x-auto">
          {categories?.map(cate => {
            return (
              <Chip
                onClick={() => {
                  setSelectedChipId(cate.value);
                  updateUrlWithParams({ categoryId: cate.value });
                  getList({ categoryId: cate.value });
                }}
                isActive={selectedChipId === cate.value}
                key={String(cate.value)}
              >
                {cate.label}
              </Chip>
            );
          })}
        </div>

        <SelectField
          onChange={onChangeMenuTemplate}
          options={menuTemplates}
          value={String(menuTemplateId)}
          label={t('menuTemplate')}
        ></SelectField>

        {itemsRender}

        <Dialog title={t('addItem')} isOpen={isOpen} onClose={close}>
          <div className="no-scrollbar h-[calc(100vh_-_140px)] w-[calc(100vw_-_64px)] overflow-y-auto px-[1px] text-left">
            <ItemForm
              onSubmit={onAddItem}
              data={null}
              isLoading={isCreating || isLoading}
              categories={categories}
              priceTypes={priceTypes}
            />
          </div>
        </Dialog>
      </div>
      <button
        onClick={() => {
          if (!categories.length) {
            toast.info(t('noCategories'));
            return;
          }
          open();
        }}
        className="fixed bottom-[16px] right-[16px] flex h-[56px] w-[56px] items-center justify-center rounded-[10px] bg-primary"
      >
        <Image src={PlusWhite} alt="" />
      </button>
    </>
  );
};
