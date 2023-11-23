import { SignUp } from './_components';

export const metadata = {
  title: 'Sign up',
  description: 'Create new account'
};

export default async function () {
  return (
    <main className="px-[16px] py-[29px]">
      <SignUp />
    </main>
  );
}
