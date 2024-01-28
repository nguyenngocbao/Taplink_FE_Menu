import Image from 'next/image';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import PlusWhite from '@/assets/icon/plus-white.svg';
import { Dialog, SelectField } from '@/components/core';
import {
  ImageCard1,
  ImageCard1Skeleton,
  ImageCard2,
  ImageCard2Skeleton,
  ItemForm,
  TextCard2,
  TextCard2Skeleton
} from '@/components/features';
import { MenuTemplate } from '@/constants/template';
import { categoryService } from '@/services/category';
import { itemService } from '@/services/item';
import { useDispatch } from '@/stores';
import {
  hideConfirmDialog,
  showConfirmDialog
} from '@/stores/slices/confirmDialog';
import { Option } from '@/types';
import { CategoryDTO } from '@/types/category';
import { ItemDTO } from '@/types/item';
import { StoreDTO } from '@/types/store';
import { dataURLtoFile, getFormData } from '@/utils/common';

import { useDisclosure } from '../use-disclosure';

import { useCreate, useDelete, useList, useUpdate } from './crud';

interface useItemProps {
  t: any;
  store: StoreDTO;
  categoryId: number;
  isEditable: boolean;
  categories: CategoryDTO[];
  priceTypes: Option[];
  menuTemplates: Option[];
}

export const useItem = ({
  t,
  store,
  categoryId,
  isEditable,
  categories,
  priceTypes,
  menuTemplates
}: useItemProps) => {
  const dispatch = useDispatch();
  const { isOpen, open, close } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState(null);
  const { createItem, isCreating } = useCreate({ service: itemService });
  const { deleteItem, isDeleting } = useDelete({ service: itemService });
  const { updateItem, isUpdating } = useUpdate({ service: itemService });
  const { updateItem: updateCategory } = useUpdate({
    service: categoryService
  });

  const { data, isInitialLoading, isLoading, getList } = useList({
    service: itemService,
    useQueryParams: false,
    initialParams: {
      categoryId: String(categoryId)
    },
    enable: !!categoryId
  });
  const selectedCate = categories.find(c => c.id === categoryId);

  const [selectedTemplate, setSelectedTemplate] = useState<number>(
    selectedCate.templateId ?? MenuTemplate.DrinkImage
  );

  const items = data?.content ?? [];

  const addItem = async (values: ItemDTO) => {
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
      await getList({ categoryId: categoryId });
      close();
    } catch (e) {
      console.log(e);
    }
  };

  const removeItem = async (id: number) => {
    try {
      await deleteItem(id);
      toast.success(t('deleteItemSuccess'));
    } catch (e) {
      console.log(e);
    }
  };

  const editItem = async (values: ItemDTO) => {
    try {
      await updateItem(
        getFormData({
          id: values.id,
          name: values.name,
          ...(values.image && {
            image: dataURLtoFile(values.image, 'image.png')
          }),
          description: values.description,
          categoryId: values.categoryId,
          priceTypeId: values.priceTypeId,
          priceInfo: JSON.stringify(values.priceInfo)
        }),
        values.id
      );
      toast.success(t('updateItemSuccess'));
    } catch (e) {
      console.log(e);
    }
  };

  const onChangeMenuTemplate = id => {
    setSelectedTemplate(Number(id));

    updateCategory(
      {
        ...selectedCate,
        storeId: store.id,
        name: selectedCate.name,
        templateId: Number(id)
      },
      selectedCate.id,
      false,
      {
        'content-type': 'multipart/form-data'
      }
    );
  };

  const imageAspect = useMemo(() => {
    switch (selectedTemplate) {
      case MenuTemplate.FoodImage:
        return 326 / 212;
      case MenuTemplate.DrinkImage:
        return 152 / 294;
      default:
        return undefined;
    }
  }, [selectedTemplate]);

  const changeTemplateRender = useMemo(() => {
    return (
      isEditable && (
        <SelectField
          onChange={onChangeMenuTemplate}
          options={menuTemplates}
          value={String(selectedTemplate)}
          label={t('menuTemplate')}
        ></SelectField>
      )
    );
  }, [selectedTemplate, onChangeMenuTemplate, menuTemplates, t]);

  const itemsRender = useMemo(() => {
    let ItemComponent = null;
    let ItemSkeleton = null;
    switch (selectedTemplate) {
      case MenuTemplate.NoImage:
        ItemComponent = TextCard2;
        ItemSkeleton = TextCard2Skeleton;
        break;
      case MenuTemplate.FoodImage:
        ItemComponent = ImageCard1;
        ItemSkeleton = ImageCard1Skeleton;
        break;
      default:
        ItemComponent = ImageCard2;
        ItemSkeleton = ImageCard2Skeleton;
    }

    if (isInitialLoading) {
      return (
        <div className="flex flex-wrap gap-x-[16px] gap-y-[27px]">
          <ItemSkeleton className="w-[calc(50%_-_8px)]" />
          <ItemSkeleton className="w-[calc(50%_-_8px)]" />
          <ItemSkeleton className="w-[calc(50%_-_8px)]" />
          <ItemSkeleton className="w-[calc(50%_-_8px)]" />
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-x-[16px] gap-y-[27px]">
        {items.map(item => (
          <ItemComponent
            data={item}
            key={item.id}
            t={t}
            readOnly={!isEditable}
            className="w-[calc(50%_-_8px)]"
            onEdit={() => {
              setSelectedItem(item);
              open();
            }}
            onRemove={async () => {
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
                    await getList({ categoryId: categoryId });
                    dispatch(hideConfirmDialog());
                  }
                })
              );
            }}
          />
        ))}
      </div>
    );
  }, [
    isInitialLoading,
    selectedTemplate,
    items,
    items,
    categoryId,
    isEditable
  ]);

  const addItemDialogRender = useMemo(() => {
    return (
      isEditable && (
        <>
          <Dialog title={t('addItem')} isOpen={isOpen} onClose={close}>
            <div className="no-scrollbar h-[calc(100vh_-_140px)] w-[calc(100vw_-_64px)] overflow-y-auto px-[1px] text-left">
              <ItemForm
                onSubmit={async (newItem: ItemDTO) => {
                  try {
                    const action = selectedItem ? editItem : addItem;
                    await action(newItem);
                    getList({ categoryId: categoryId });
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
            className="fixed bottom-[16px] right-[16px] flex h-[56px] w-[56px] items-center justify-center rounded-[10px] bg-primary"
          >
            <Image src={PlusWhite} alt="" />
          </button>
        </>
      )
    );
  }, [
    isEditable,
    isOpen,
    selectedItem,
    isCreating,
    isLoading,
    isUpdating,
    imageAspect,
    categories,
    priceTypes
  ]);

  return {
    isInitialLoading,
    isLoading,
    isCreating,
    isDeleting,
    isUpdating,
    getListItem: getList,
    addItem,
    removeItem,
    editItem,
    items,
    itemsRender,
    addItemDialogRender,
    changeTemplateRender,
    imageAspect,
    selectedItem,
    setSelectedItem
  };
};
