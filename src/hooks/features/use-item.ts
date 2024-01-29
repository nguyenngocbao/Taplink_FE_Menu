import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { MenuTemplate } from '@/constants/template';
import { categoryService } from '@/services/category';
import { itemService } from '@/services/item';
import { CategoryDTO } from '@/types/category';
import { ItemDTO } from '@/types/item';
import { StoreDTO } from '@/types/store';
import { dataURLtoFile, getFormData } from '@/utils/common';

import { useCreate, useDelete, useList, useUpdate } from './crud';

interface useItemProps {
  t: any;
  store: StoreDTO;
  categoryId: number;
  categories: CategoryDTO[];
}

export const useItem = ({ t, store, categoryId, categories }: useItemProps) => {
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

  const items = (data?.content ?? []).sort((a, b) => a.id - b.id);

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
        description: selectedCate.description,
        image: selectedCate.image,
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

  return {
    items,
    isLoading,
    isCreating,
    isDeleting,
    isUpdating,
    imageAspect,
    isInitialLoading,
    selectedTemplate,
    addItem,
    removeItem,
    editItem,
    getListItem: getList,
    onChangeMenuTemplate
  };
};
