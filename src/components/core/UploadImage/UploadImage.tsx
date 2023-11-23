'use client';

import Image from 'next/image';
import React, {
  FC,
  HTMLAttributes,
  memo,
  useCallback,
  useMemo,
  useRef,
  useState
} from 'react';
import Cropper from 'react-easy-crop';
import { toast } from 'react-toastify';

import { useTranslation } from '@/app/i18n/client';
import CloseWhite from '@/assets/icon/close-white.svg';
import PencilWhite from '@/assets/icon/pencil-white.svg';
import PlusPrimary from '@/assets/icon/plus-primary.svg';
import NoImage from '@/assets/image/no-image.svg';
import { KEY_CODE } from '@/constants/index';
import { isOnServer, isValidHttpUrl, mergeClasses } from '@/utils/common';

import { Button } from '../Button';
import { Dialog } from '../Dialog';

import getCroppedImg, { getBase64 } from './utils';

interface UploadImageProps
  extends Omit<HTMLAttributes<HTMLInputElement>, 'onChange'> {
  src?: FileList | File | string;
  disabled?: boolean;
  onChange?: (file: string) => void;
}

export const UploadImage: FC<UploadImageProps> = memo(
  ({ src, className, disabled, onChange, ...props }) => {
    const { t } = useTranslation('common');
    const labelRef = useRef<HTMLLabelElement>(null);
    const [tempImage, setTempImage] = useState<string>(null);
    const [isOpen, setOpen] = useState(false);

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const getImageSrc = useMemo(() => {
      if (isOnServer()) return NoImage;

      if (typeof src === 'string') {
        if (src.startsWith('blob:') || src.startsWith('data:')) {
          return src;
        }

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

      return NoImage;
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

    const reset = () => {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setOpen(false);
    };

    const onClear = () => {
      reset();
      setTempImage(null);
      onChange(null);
    };

    const onImageChange = useCallback<
      React.ChangeEventHandler<HTMLInputElement>
    >(async event => {
      const file = event.target.files[0];
      if (file?.size > 5242880) {
        toast.error(t('message.uploadImageOversize'));
        event.target.value = '';
        return;
      }
      if (file) {
        setTempImage(await getBase64(file));
        setOpen(true);
      }
    }, []);

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels);
    };

    const onSubmit = useCallback(async () => {
      try {
        const croppedImage = await getCroppedImg(tempImage, croppedAreaPixels);
        onChange(croppedImage);
        reset();
      } catch (e) {
        console.error(e);
      }
    }, [croppedAreaPixels, reset]);

    const onCloseDialog = () => {
      setOpen(false);
    };

    const onEditDialog = () => {
      setOpen(true);
    };

    return (
      <>
        <div className="mb-[16px] flex items-center gap-[16px] font-normal">
          <label ref={labelRef}>
            <div
              role={disabled ? '' : 'button'}
              tabIndex={disabled ? -1 : 0}
              onKeyDown={onKeyDown}
              className="flex h-[78px] w-[78px] shrink-0 items-center justify-center rounded-[10px] border-[0.5px] border-dashed border-primary-basic"
            >
              <Image alt="" src={PlusPrimary} />
            </div>
            <input
              disabled={disabled}
              type="file"
              aria-labelledby="upload-avatar"
              tabIndex={-1}
              style={{ width: '1px', height: '1px', position: 'absolute' }}
              accept="image/jpg, image/png, image/gif, image/jpge"
              multiple={false}
              onChange={onImageChange}
              {...props}
            />
          </label>
          <div>
            <h2 className="mb-[4px] text-[20px]/[24px] font-bold  text-primary">
              {t('label.uploadImage')}
            </h2>
            <p className="text-[16px]/[22.4px] text-black">
              {props.placeholder}
            </p>
          </div>
        </div>
        <div className="relative h-[210px] w-full overflow-hidden rounded-[10px]">
          <Image
            unoptimized
            tabIndex={-1}
            src={getImageSrc}
            alt=""
            width={80}
            height={80}
            onError={e =>
              ((e.target as HTMLImageElement).src =
                '/images/default-avatar.svg')
            }
            className={mergeClasses(
              'h-full w-full bg-white object-contain object-top',
              className
            )}
          />
          <div className="absolute right-0 top-0 z-10 flex">
            <button
              onClick={onEditDialog}
              disabled={tempImage == null}
              type="button"
              className="flex h-[40px]  w-[46px] items-center justify-center rounded-bl-[10px] bg-primary disabled:cursor-default disabled:border-current disabled:bg-disabled disabled:text-black/40"
            >
              <Image src={PencilWhite} alt="" />
            </button>
            <button
              onClick={onClear}
              disabled={tempImage == null}
              type="button"
              className="flex h-[40px] w-[46px] items-center justify-center bg-primary disabled:cursor-default disabled:border-current disabled:bg-disabled disabled:text-black/40"
            >
              <Image src={CloseWhite} alt="" />
            </button>
          </div>
        </div>
        <Dialog
          title={t('label.uploadImage')}
          isOpen={isOpen}
          onClose={onCloseDialog}
        >
          <div className="relative h-[300px] w-[calc(100vw_-_64px)]">
            <Cropper
              image={String(tempImage)}
              crop={crop}
              zoom={zoom}
              showGrid
              aspect={343 / 210}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className="mt-[10px] flex justify-end gap-[10px]">
            <Button variant="none" onClick={onCloseDialog}>
              {t('label.cancel')}
            </Button>
            <Button onClick={onSubmit}>{t('label.crop')}</Button>
          </div>
        </Dialog>
      </>
    );
  }
);

UploadImage.displayName = 'UploadImage';
