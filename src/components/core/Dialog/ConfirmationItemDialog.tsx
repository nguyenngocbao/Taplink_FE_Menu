'use client';

import { Fragment, useState } from 'react';

import { Button, Dialog } from '@/components/core';
import { useDispatch, useSelector } from '@/stores';
import { hideConfirmDialog } from '@/stores/slices/confirmDialog';
import { mergeClasses } from '@/utils/common';

export function ConfirmationItemDialog() {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const {
    title,
    desc,
    items,
    isOpen,
    cancelBtnText,
    submitBtnText,
    action,
    callback
  } = useSelector(state => state.confirmDialog);

  const handleClose = async () => {
    dispatch(hideConfirmDialog());
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      callback && (await callback());
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog title={title} isOpen={isOpen} onClose={handleClose}>
        <div className="space-y-[10px] text-left">
          <div>
            <>{desc}</>
          </div>

          {!!items?.length && (
            <div className="bg-primary-bg p-[15px]">
              {items.map(item => {
                return (
                  <Fragment key={String(item.value)}>
                    <p className="text-[12px]/[19px] font-medium">
                      {item.label}
                    </p>
                    <p className="font-semibold">{item?.value}</p>
                  </Fragment>
                );
              })}
            </div>
          )}
        </div>
        {(cancelBtnText || submitBtnText) && (
          <div className="mt-[20px] flex justify-center gap-[10px]">
            {cancelBtnText && (
              <Button variant="none" onClick={handleClose}>
                {cancelBtnText}
              </Button>
            )}
            {submitBtnText && (
              <Button
                isLoading={isLoading}
                disabled={isLoading}
                onClick={handleConfirm}
                className={mergeClasses(action === 'delete' && 'bg-warning')}
              >
                {submitBtnText}
              </Button>
            )}
          </div>
        )}
      </Dialog>
    </>
  );
}
