import { AuthClientSetup } from '@/components/layouts/AuthClientSetup';
import { getServerSession } from '@/lib/auth';

export default async function ({ children }) {
  const session = await getServerSession();
  return (
    <>
      <AuthClientSetup session={session} />;{children}
    </>
  );
}
