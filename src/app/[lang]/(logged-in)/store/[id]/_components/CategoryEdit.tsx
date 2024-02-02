import { FC } from 'react';
import { toast } from 'react-toastify';

import { useTranslation } from '@/app/i18n/client';
import { Dialog } from '@/components/core';
import { CategoryForm } from '@/components/features';
import { useDataApi } from '@/hooks';
import { categoryService } from '@/services/category';
import { fileService } from '@/services/file';
import { CategoryDTO } from '@/types/category';
import {
  dataURLtoFile,
  getCompressedImage,
  isValidHttpUrl
} from '@/utils/common';

interface CategoryEdit {
  data: CategoryDTO;
  isOpen?: boolean;
  close: () => void;
}

export const CategoryEdit: FC<CategoryEdit> = ({ isOpen, data, close }) => {
  const { t } = useTranslation('myPage');

  const updateCategoryApi = useDataApi(categoryService.update);
  const deleteFileApi = useDataApi(fileService.deleteImage);
  const compressImgApi = useDataApi(getCompressedImage);

  const onSubmit = async (value: CategoryDTO) => {
    if (!value?.image) {
      await deleteFileApi.call({
        id: data.id,
        type: 'CATEGORY'
      });
    }
    await updateCategoryApi.call(
      {
        name: value.name,
        description: value.description,
        templateId: value.templateId,
        storeId: value.storeId,
        ...(value.image &&
          !isValidHttpUrl(value?.image) && {
            image: await compressImgApi.call(
              dataURLtoFile(value.image, 'image.png')
            )
          })
      },
      data.id,
      true,
      {
        'content-type': 'multipart/form-data'
      }
    );
    close();
    toast.success(t('updateCateSuccess'));
  };

  return (
    <>
      <Dialog title={t('addCategory')} isOpen={isOpen} onClose={close}>
        <div className="no-scrollbar h-[calc(100vh_-_140px)] w-[calc(100vw_-_64px)] overflow-y-auto px-[1px] text-left">
          <CategoryForm
            data={data}
            isLoading={
              updateCategoryApi.isLoading ||
              deleteFileApi.isLoading ||
              compressImgApi.isLoading
            }
            onSubmit={onSubmit}
          />
        </div>
      </Dialog>
    </>
  );
};
