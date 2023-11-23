import { NextResponse } from 'next/server';
import { NextRequestWithAuth } from 'next-auth/middleware';

import { STORE_OWNER_ROUTE } from '@/constants/routes';
import { getServerSession } from '@/lib/auth';
import { deviceService } from '@/services/device';

export async function GET(
  request: NextRequestWithAuth,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  console.log(session);
  const id = params.id;
  try {
    await deviceService.get(id);
  } catch (e) {
    if (session) {
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
