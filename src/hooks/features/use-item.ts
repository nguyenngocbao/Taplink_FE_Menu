import { toast } from 'react-toastify';

import { itemService } from '@/services/item';
import { ItemDTO } from '@/types/item';
import { dataURLtoFile, getFormData } from '@/utils/common';

import { useCreate, useDelete, useRead, useUpdate } from './crud';

export const useItem = (categoryId: number, t) => {
  const { createItem, isCreating } = useCreate({ service: itemService });
  const { deleteItem, isDeleting } = useDelete({ service: itemService });
  const { updateItem, isUpdating } = useUpdate({ service: itemService });
  const { data, isLoading, getList } = useRead({
    service: itemService,
    useQueryParams: false,
    initialParams: {
      categoryId: String(categoryId)
    },
    enable: !!categoryId
  });

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

  return {
    isLoading,
    isCreating,
    isDeleting,
    isUpdating,
    getListItem: getList,
    addItem,
    removeItem,
    editItem,
    items
  };
};
