import { FC } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { MenuTemplate } from '@/constants/template';
import { ItemDTO } from '@/types/item';

import {
  ImageCard1,
  ImageCard1Skeleton,
  ImageCard2,
  ImageCard2Skeleton,
  TextCard2,
  TextCard2Skeleton
} from '../cards';

interface ItemList {
  items: ItemDTO[];
  isEditable?: boolean;
  selectedTemplate: MenuTemplate;
  isInitialLoading?: boolean;
  onEdit: (item: ItemDTO) => void;
  onDelete: (item: ItemDTO) => void;
}

export const ItemList: FC<ItemList> = ({
  items,
  isEditable,
  selectedTemplate,
  isInitialLoading,
  onEdit,
  onDelete
}) => {
  const { t } = useTranslation(['myPage', 'common']);
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
            onEdit(item);
          }}
          onRemove={async () => {
            onDelete(item);
          }}
        />
      ))}
      {items.length === 0 && (
        <p className="w-full text-center text-sm text-[#c3c3c3]">
          {t('label.noItem', { ns: 'common' })}
        </p>
      )}
    </div>
  );
};
