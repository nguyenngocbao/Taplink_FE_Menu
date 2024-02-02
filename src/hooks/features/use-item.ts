import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { MenuTemplate } from '@/constants/template';
import { categoryService } from '@/services/category';
import { fileService } from '@/services/file';
import { itemService } from '@/services/item';
import { CategoryDTO } from '@/types/category';
import { ItemDTO } from '@/types/item';
import { StoreDTO } from '@/types/store';
import {
  dataURLtoFile,
  getCompressedImage,
  getFormData,
  isValidHttpUrl
} from '@/utils/common';

import { useDataApi } from '../use-data-api';
import { useSearch } from '../use-search';

interface useItemProps {
  t: any;
  store: StoreDTO;
  categoryId: number;
  categories: CategoryDTO[];
}

export const useItem = ({ t, store, categoryId, categories }: useItemProps) => {
  const deleteFileApi = useDataApi(fileService.deleteImage);
  const compressImgApi = useDataApi(getCompressedImage);
  const createItemApi = useDataApi(itemService.create);
  const deleteItemApi = useDataApi(itemService.delete);
  const updateItemApi = useDataApi(itemService.update);
  const updateCategoryApi = useDataApi(categoryService.update);

  const { data, isInitialLoading, isLoading, getList } = useSearch({
    func: itemService.list,
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
      await createItemApi.call(
        getFormData({
          ...data,
          ...(image && {
            image: await compressImgApi.call(dataURLtoFile(image, 'image.jpg'))
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
      await deleteItemApi.call(id);
      toast.success(t('deleteItemSuccess'));
    } catch (e) {
      console.log(e);
    }
  };

  const editItem = async (values: ItemDTO) => {
    try {
      if (!values?.image) {
        await deleteFileApi.call({
          id: values.id,
          type: 'MENU_ITEM'
        });
      }
      await updateItemApi.call(
        getFormData({
          id: values.id,
          name: values.name,
          ...(values.image &&
            !isValidHttpUrl(values?.image) && {
              image: await compressImgApi.call(
                dataURLtoFile(values.image, 'image.png')
              )
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

    updateCategoryApi.call(
      {
        description: selectedCate.description,
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
    isCreating: createItemApi.isLoading || compressImgApi.isLoading,
    isDeleting: deleteItemApi.isLoading,
    isUpdating:
      updateItemApi.isLoading ||
      deleteFileApi.isLoading ||
      compressImgApi.isLoading,
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
