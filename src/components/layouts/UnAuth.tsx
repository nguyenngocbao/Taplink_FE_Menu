import Image from 'next/image';

export function UnAuth({ title, children }) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-5">
      <div className="flex flex-col items-center justify-center gap-5 lg:w-[500px] lg:p-[50px] lg:shadow-lg">
        <Image
          src="/logo.svg"
          alt=""
          height={303}
          width={303}
          className="border-black-300 h-[158px] w-[158px] rounded-full border object-cover"
        />
        <h1>CSS</h1>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}
