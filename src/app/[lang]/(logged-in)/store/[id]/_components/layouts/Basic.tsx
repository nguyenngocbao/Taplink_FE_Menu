'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { FC, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { useTranslation } from '@/app/i18n/client';
import PlusWhite from '@/assets/icon/plus-white.svg';
import { Chip, Dialog, SelectField, Spinner } from '@/components/core';
import { MenuTemplate } from '@/constants/template';
import { useDisclosure } from '@/hooks';
import { useUpdate } from '@/hooks/features';
import { useItem } from '@/hooks/features/use-item';
import { categoryService } from '@/services/category';
import { Option } from '@/types';
import { ID } from '@/types/CRUD';
import { ItemDTO } from '@/types/item';
import { StoreDTO } from '@/types/store';
import { updateUrlWithParams } from '@/utils/common';

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
  const [selectedCate, setSelectedCate] = useState(categories[0]?.value);
  const [selectedItem, setSelectedItem] = useState(null);
  const { isOpen, open, close } = useDisclosure();
  const [selectedTemplate, setSelectedTemplate] = useState<number>(
    store.menuTemplateId ?? MenuTemplate.Image
  );
  const categoryId = Number(query.get('categoryId') ?? selectedCate);

  const {
    items,
    addItem,
    getListItem,
    removeItem,
    editItem,
    isUpdating,
    isDeleting,
    isCreating,
    isLoading
  } = useItem(categoryId, t);

  const { updateItem } = useUpdate({ service: categoryService });

  const onChangeMenuTemplate = id => {
    setSelectedTemplate(Number(id));
    const selectedCategory = categories.find(c => c.value === selectedCategory);

    updateItem(
      {
        storeId: store.id,
        name: selectedCategory.label,
        templateId: Number(id)
      },
      selectedCategory.value as ID
    );
  };

  const itemsRender = useMemo(() => {
    let ItemComponent = null;
    switch (selectedTemplate) {
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
            onEdit={() => {
              setSelectedItem(item);
              open();
            }}
            onRemove={async () => {
              //TODO: show confirm
              await removeItem(item.id);
              getListItem({ categoryId: categoryId });
            }}
          />
        ))}
      </div>
    );
  }, [selectedTemplate, items]);

  return (
    <>
      <div className="space-y-[36px]">
        <div className="no-scrollbar mr-[-16px] flex gap-[8px] overflow-x-auto">
          {categories?.map(cate => {
            return (
              <Chip
                onClick={() => {
                  setSelectedCate(cate.value);
                  updateUrlWithParams({ categoryId: cate.value });
                  getListItem({ categoryId: cate.value });
                }}
                isActive={selectedCate === cate.value}
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
          value={String(selectedTemplate)}
          label={t('menuTemplate')}
        ></SelectField>

        {itemsRender}

        <Dialog title={t('addItem')} isOpen={isOpen} onClose={close}>
          <div className="no-scrollbar h-[calc(100vh_-_140px)] w-[calc(100vw_-_64px)] overflow-y-auto px-[1px] text-left">
            <ItemForm
              onSubmit={async (newItem: ItemDTO) => {
                try {
                  const action = selectedItem ? editItem : addItem;
                  await action(newItem);
                  getListItem({ categoryId: categoryId });
                  close();
                } catch (e) {
                  console.log(e);
                }
              }}
              data={selectedItem}
              isLoading={isCreating || isLoading || isUpdating}
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
          setSelectedItem(null);
          open();
        }}
        className="fixed bottom-[16px] right-[16px] flex h-[56px] w-[56px] items-center justify-center rounded-[10px] bg-primary"
      >
        <Image src={PlusWhite} alt="" />
      </button>
      {isDeleting && <Spinner isCenter />}
    </>
  );
};
