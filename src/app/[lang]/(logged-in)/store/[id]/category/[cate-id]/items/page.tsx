import { MENU_TEMPLATES } from '@/constants/template';
import { getCurrentUser } from '@/lib/auth';
import { categoryService } from '@/services/category';
import { itemService } from '@/services/item';
import { storeService } from '@/services/store';

import { CategoryItems } from './_component/CategoryItems';

export const metadata = {
  title: 'Items of category',
  description: 'Items of category in taplink'
};

export default async function ({ params }) {
  const storeId = params.id;
  const cateId = params['cate-id'];

  const promises = Promise.all([getCurrentUser(), itemService.getPriceTypes()]);
  const store = await storeService.get(storeId);
  const categories = await categoryService.list({ storeId: storeId });
  const [user, priceTypeRes] = await promises;

  const sortedCategories = categories.content.sort((a, b) => a.id - b.id);
  const isOwner = user && user?.id === store?.storeOwnerId;

  return (
    <main className="relative items-center space-y-[36px] p-[16px] text-center">
      <CategoryItems
        menuTemplates={MENU_TEMPLATES}
        categories={sortedCategories ?? []}
        store={store}
        priceTypes={priceTypeRes}
        isOwner={isOwner}
        categoryId={Number(cateId)}
      />
    </main>
  );
}
