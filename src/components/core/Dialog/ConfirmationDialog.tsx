'use client';

import {
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/solid';
import * as React from 'react';

import { Button } from '@/components/core/Button';
import { Dialog, DialogTitle } from '@/components/core/Dialog';
import { useDisclosure } from '@/hooks';
import { mergeClasses } from '@/utils/common';

export type ConfirmationDialogProps = {
  confirmButton: React.ReactElement;
  title: string;
  body?: string | React.ReactElement;
  cancelButtonText?: string;
  icon?: 'danger' | 'info';
  isDone?: boolean;
  isFullWidth?: boolean;
  className?: string;
};

export type ConfirmationDialogRef = {
  open: () => void;
  close: () => void;
};

export function _ConfirmationDialog(
  {
    confirmButton,
    title,
    body = '',
    cancelButtonText = 'キャンセル',
    icon = 'danger',
    isFullWidth,
    className
  }: ConfirmationDialogProps,
  ref
) {
  const { close, open, isOpen } = useDisclosure(false);

  const cancelButtonRef = React.useRef(null);

  React.useImperativeHandle(
    ref,
    (): ConfirmationDialogRef => ({
      open,
      close
    }),
    []
  );

  return (
    <Dialog isOpen={isOpen} onClose={close} initialFocus={cancelButtonRef}>
      <div
        className={mergeClasses(
          'inline-block transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:p-6 sm:align-middle',
          isFullWidth ? 'sm:max-w-[calc(100vw_-_20px)]' : 'sm:max-w-lg',
          className
        )}
      >
        <div className="sm:flex sm:items-start">
          {icon === 'danger' && (
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <ExclamationTriangleIcon
                className="text-red h-6 w-6"
                aria-hidden="true"
              />
            </div>
          )}

          {icon === 'info' && (
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
              <InformationCircleIcon
                className="h-6 w-6 text-blue-600"
                aria-hidden="true"
              />
            </div>
          )}
          <div className="mt-3 overflow-hidden text-center sm:ml-4 sm:mt-0 sm:text-left lg:w-[calc(100%_-_56px)]">
            <DialogTitle
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900"
            >
              {title}
            </DialogTitle>
            {body && <div className="mt-2">{body} </div>}
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button onClick={close} ref={cancelButtonRef}>
            {cancelButtonText}
          </Button>
          {confirmButton}
        </div>
      </div>
    </Dialog>
  );
}

export const ConfirmationDialog = React.forwardRef(_ConfirmationDialog);

ConfirmationDialog.displayName = 'ConfirmationDialog';
