import { FC, useCallback } from 'react';
import { toast } from 'react-toastify';

import { useTranslation } from '@/app/i18n/client';
import { Dialog } from '@/components/core';
import { CategoryForm } from '@/components/features';
import { useUpdate } from '@/hooks/features';
import { categoryService } from '@/services/category';
import { CategoryDTO } from '@/types/category';
import { dataURLtoFile } from '@/utils/common';

interface CategoryEdit {
  data: CategoryDTO;
  isOpen?: boolean;
  close: () => void;
}

export const CategoryEdit: FC<CategoryEdit> = ({ isOpen, data, close }) => {
  const { t } = useTranslation('myPage');

  const { updateItem, isUpdating } = useUpdate({ service: categoryService });

  const onSubmit = useCallback(async (value: CategoryDTO) => {
    await updateItem(
      {
        name: value.name,
        description: value.description,
        templateId: value.templateId,
        storeId: value.storeId,
        ...(value?.image && {
          image: dataURLtoFile(value.image, 'image.png')
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
  }, []);

  return (
    <>
      <Dialog title={t('addCategory')} isOpen={isOpen} onClose={close}>
        <CategoryForm data={data} isLoading={isUpdating} onSubmit={onSubmit} />
      </Dialog>
    </>
  );
};
