'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { FC, useState } from 'react';
import { toast } from 'react-toastify';

import { useTranslation } from '@/app/i18n/client';
import PlusWhite from '@/assets/icon/plus-white.svg';
import { Chip, Dialog, SelectField } from '@/components/core';
import { ItemForm } from '@/components/features';
import { ItemList } from '@/components/features/item/ItemList';
import { useDisclosure } from '@/hooks';
import { useItem } from '@/hooks/features/use-item';
import { useDispatch } from '@/stores';
import {
  hideConfirmDialog,
  showConfirmDialog
} from '@/stores/slices/confirmDialog';
import { Option } from '@/types';
import { CategoryDTO } from '@/types/category';
import { ItemDTO } from '@/types/item';
import { StoreDTO } from '@/types/store';
import { updateUrlWithParams } from '@/utils/common';

interface BasicLayout {
  categories: CategoryDTO[];
  menuTemplates: Option[];
  store: StoreDTO;
  priceTypes: Option[];
  isOwner?: boolean;
}

export const BasicLayout: FC<BasicLayout> = ({
  store,
  categories,
  menuTemplates,
  priceTypes,
  isOwner
}) => {
  const dispatch = useDispatch();
  const { isOpen, open, close } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState(null);

  const query = useSearchParams();
  const { t } = useTranslation(['myPage', 'common']);
  const categoryId = Number(query.get('categoryId') ?? categories[0]?.id);

  const {
    items,
    isInitialLoading,
    isCreating,
    isUpdating,
    isLoading,
    imageAspect,
    addItem,
    editItem,
    removeItem,
    getListItem,
    selectedTemplate,
    onChangeMenuTemplate
  } = useItem({
    t,
    store,
    categoryId,
    categories
  });

  return (
    <>
      <div className="space-y-[36px]">
        <div className="no-scrollbar mr-[-16px] flex gap-[8px] overflow-x-auto">
          {categories?.map(cate => {
            return (
              <Chip
                onClick={() => {
                  updateUrlWithParams({ categoryId: cate.id });
                  getListItem({ categoryId: cate.id });
                }}
                isActive={categoryId === cate.id}
                key={String(cate.id)}
              >
                {cate.name}
              </Chip>
            );
          })}
        </div>

        {isOwner && (
          <SelectField
            onChange={onChangeMenuTemplate}
            options={menuTemplates}
            value={String(selectedTemplate)}
            label={t('menuTemplate')}
          ></SelectField>
        )}

        <ItemList
          items={items}
          isEditable={isOwner}
          selectedTemplate={selectedTemplate}
          isInitialLoading={isInitialLoading}
          onEdit={item => {
            setSelectedItem(item);
            open();
          }}
          onDelete={item => {
            dispatch(
              showConfirmDialog({
                title: t('label.confirmDelete', { ns: 'common' }),
                desc: t('confirmDeleteItem'),
                items: [
                  {
                    label: t('itemName'),
                    value: item.name
                  }
                ],
                action: 'delete',
                submitBtnText: t('label.submit', { ns: 'common' }),
                async callback() {
                  await removeItem(item.id);
                  await getListItem({ categoryId: categoryId });
                  dispatch(hideConfirmDialog());
                }
              })
            );
          }}
        />

        {isOwner && (
          <>
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
                  imageAspect={imageAspect}
                />
              </div>
            </Dialog>
            <button
              onClick={() => {
                if (!categories.length) {
                  toast.info(t('noCategories'));
                  return;
                }
                setSelectedItem(null);
                open();
              }}
              style={{
                bottom: '16px',
                right: '16px'
              }}
              className="fixed bottom-[16px] right-[16px] flex h-[56px] w-[56px] items-center justify-center rounded-[10px] bg-primary"
            >
              <Image src={PlusWhite} alt="" />
            </button>
          </>
        )}
      </div>
    </>
  );
};
