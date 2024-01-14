import { NextResponse } from 'next/server';
import { NextRequestWithAuth } from 'next-auth/middleware';

import { STORE_OWNER_ROUTE } from '@/constants/routes';
import { getServerSession } from '@/lib/auth';
import { deviceService } from '@/services/device';
import { storeService } from '@/services/store';

export async function GET(
  request: NextRequestWithAuth,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  const id = params.id;
  try {
    const { storeId } = await deviceService.get(id);
    if (storeId) {
      return NextResponse.redirect(
        `${request.nextUrl.origin}/${STORE_OWNER_ROUTE.STORE}/${storeId}`
      );
    }
  } catch (e) {
    if (session) {
      const stores = await storeService.list({ pageSize: 100 });
      const hasStore = stores.totalElements > 0;

      if (hasStore) {
        return NextResponse.redirect(
          `${request.nextUrl.origin}?device_id=${id}`
        );
      }
      return NextResponse.redirect(
        `${request.nextUrl.origin}/${STORE_OWNER_ROUTE.CREATE_STORE}?device_id=${id}`
      );
    } else {
      return NextResponse.redirect(
        `${request.nextUrl.origin}/${STORE_OWNER_ROUTE.LOGIN}?callbackUrl=${STORE_OWNER_ROUTE.CREATE_STORE}?device_id=${id}`
      );
    }
  }
}
