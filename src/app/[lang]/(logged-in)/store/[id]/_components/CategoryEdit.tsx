import { FC } from 'react';
import { toast } from 'react-toastify';

import { useTranslation } from '@/app/i18n/client';
import { Dialog } from '@/components/core';
import { CategoryForm } from '@/components/features';
import { useUpdate } from '@/hooks/features';
import { categoryService } from '@/services/category';
import { CategoryDTO } from '@/types/category';
import { dataURLtoFile, isValidHttpUrl } from '@/utils/common';

interface CategoryEdit {
  data: CategoryDTO;
  isOpen?: boolean;
  close: () => void;
}

export const CategoryEdit: FC<CategoryEdit> = ({ isOpen, data, close }) => {
  const { t } = useTranslation('myPage');

  const { updateItem, isUpdating } = useUpdate({ service: categoryService });

  const onSubmit = async (value: CategoryDTO) => {
    await updateItem(
      {
        name: value.name,
        description: value.description,
        templateId: value.templateId,
        storeId: value.storeId,
        ...(value?.image && {
          image: isValidHttpUrl(value?.image)
            ? value?.image
            : dataURLtoFile(value.image, 'image.png')
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
            isLoading={isUpdating}
            onSubmit={onSubmit}
          />
        </div>
      </Dialog>
    </>
  );
};
