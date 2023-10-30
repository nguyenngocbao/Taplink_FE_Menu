'use client';

import Image from 'next/image';
import React, {
  FC,
  HTMLAttributes,
  memo,
  useCallback,
  useMemo,
  useRef
} from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

import { KEY_CODE } from '@/constants/index';
import { isOnServer, isValidHttpUrl, mergeClasses } from '@/utils/common';

interface UploadImageProps extends HTMLAttributes<HTMLInputElement> {
  src?: FileList | File | string;
  disabled?: boolean;
  registration?: Partial<UseFormRegisterReturn>;
}

export const UploadImage: FC<UploadImageProps> = memo(
  ({ src, registration, className, disabled, ...props }) => {
    const labelRef = useRef<HTMLLabelElement>(null);

    const getImageSrc = useMemo(() => {
      const DEFAULT_AVATAR_URL = '/images/default-avatar.svg';

      if (isOnServer()) return DEFAULT_AVATAR_URL;

      if (typeof src === 'string') {
        return isValidHttpUrl(src)
          ? src
          : process.env.NEXT_PUBLIC_SERVER_URL + src;
      }

      if (src?.constructor === File) {
        return URL.createObjectURL(src);
      }

      if (src?.constructor === FileList) {
        return URL.createObjectURL(src?.[0]);
      }

      return DEFAULT_AVATAR_URL;
    }, [src]);

    const onKeyDown: React.KeyboardEventHandler<HTMLImageElement> = useCallback(
      e => {
        if ([KEY_CODE.ENTER, KEY_CODE.SPACE].includes(e.keyCode)) {
          e.preventDefault();
          labelRef.current?.click();
        }
      },
      []
    );

    return (
      <label
        ref={labelRef}
        className={mergeClasses('relative', disabled ? '' : 'cursor-pointer')}
      >
        <div
          role={disabled ? '' : 'button'}
          className=""
          tabIndex={disabled ? -1 : 0}
          onKeyDown={onKeyDown}
        >
          <input
            disabled={disabled}
            type="file"
            aria-labelledby="upload-avatar"
            tabIndex={-1}
            style={{ width: '1px', height: '1px', position: 'absolute' }}
            accept="image/jpg, image/png, image/gif, image/jpge"
            multiple={false}
            {...registration}
            {...props}
          />
          <Image
            tabIndex={-1}
            src={getImageSrc}
            alt=""
            width={80}
            height={80}
            unoptimized
            onError={e =>
              ((e.target as HTMLImageElement).src =
                '/images/default-avatar.svg')
            }
            className={mergeClasses(
              'h-[80px] w-[80px] rounded-full bg-white object-cover',
              className
            )}
          />
        </div>
      </label>
    );
  }
);

UploadImage.displayName = 'UploadImage';
