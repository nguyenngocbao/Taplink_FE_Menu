import React, { MutableRefObject } from 'react';

import { Button } from '../Button';
import { Table, TableColumn } from '../Table';

import {
  ConfirmationDialog,
  ConfirmationDialogProps,
  ConfirmationDialogRef
} from './ConfirmationDialog';

interface DeleteConfirmDeletionDialogProps<T>
  extends Omit<ConfirmationDialogProps, 'confirmButton' | 'title'> {
  data: Array<{
    title: string;
    value: Array<T>;
    columns: TableColumn<T>[];
  }>;
  isLoading?: boolean;
  onDeleteTask: () => void;
  ref: MutableRefObject<ConfirmationDialogRef>;
}

function _ConfirmDeletionDialog<T extends { id: string | number }>(
  {
    data,
    isLoading,
    onDeleteTask,
    ...props
  }: DeleteConfirmDeletionDialogProps<T>,
  ref
) {
  return (
    <ConfirmationDialog
      ref={ref}
      icon="danger"
      title="削除"
      className="sm:max-w-xl"
      body={
        <>
          <p className="mb-[10px]">
            このレコードを削除しても宜しいでしょうか？
          </p>
          {data.map((item, i) => {
            return (
              <div key={i}>
                {item.value?.length > 0 && (
                  <>
                    <h4 className="mb-[10px]">{item.title}</h4>
                    <Table<T> data={item.value} columns={item.columns} />
                  </>
                )}
              </div>
            );
          })}
        </>
      }
      confirmButton={
        <Button
          isLoading={isLoading}
          className="bg-red hover:bg-american-red text-white"
          onClick={onDeleteTask}
        >
          OK
        </Button>
      }
      {...props}
    />
  );
}

export const ConfirmDeletionDialog = React.forwardRef(
  _ConfirmDeletionDialog
) as typeof _ConfirmDeletionDialog;
