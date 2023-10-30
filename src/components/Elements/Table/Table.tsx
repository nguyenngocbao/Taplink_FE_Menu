'use client';

import { ArchiveBoxIcon } from '@heroicons/react/24/solid';
import * as React from 'react';
import { useState } from 'react';

import { mergeClasses } from '@/utils/common';

import { Spinner } from '../Indicator';

export type TableColumn<Entry> = {
  width?: string | number;
  title: string;
  field: keyof Entry;
  className?: string;
  tooltip?: string | React.ReactElement;
  Cell?({
    entry,
    index,
    expand
  }: {
    entry: Entry;
    index: number;
    expand: boolean;
  }): React.ReactElement;
};

export type TableProps<Entry> = {
  data: Entry[];
  horizontalAlign?: 'left' | 'center' | 'right';
  className?: string;
  columns: TableColumn<Entry>[];
  isLoading?: boolean;
  highlightRows?: string[]; // id[] of entry
  tdClassName?: string;
  tdRowClassName?: string;
  thRowClassName?: string;
  containerClassName?: string;
  containerLv4ClassName?: string;
  containerLv5ClassName?: string;
  scrollContainerRef?: React.MutableRefObject<HTMLDivElement>;
  noEntryMessage?: string;
};

const _Table = <Entry extends { id: number | string; children?: Entry[] }>({
  data,
  columns,
  className,
  isLoading,
  highlightRows,
  horizontalAlign = 'left',
  tdClassName,
  tdRowClassName,
  thRowClassName,
  containerClassName,
  containerLv4ClassName,
  containerLv5ClassName,
  scrollContainerRef,
  noEntryMessage = 'データが存在しません'
}: TableProps<Entry>) => {
  const [expands, setExpands] = useState([]);

  return (
    <div
      className={mergeClasses(
        'relative h-full w-full overflow-hidden rounded-[8px] pb-2 text-[14px] leading-[25px]',
        containerClassName
      )}
    >
      {isLoading && (
        <div className="absolute inset-0 z-20 flex w-full items-center justify-center bg-white/90 backdrop:filter">
          <Spinner isCenter={false} />
        </div>
      )}
      {!data?.length && !isLoading ? (
        <div className="text-dark-silver-70 mt-2 flex h-80 flex-col items-center justify-center gap-[5px] bg-white">
          <ArchiveBoxIcon className="h-[25px] w-[25px]" />
          <h4 className="text-[16px] font-normal leading-[19px]">
            {noEntryMessage}
          </h4>
        </div>
      ) : (
        <div className={mergeClasses('flex flex-col', className)}>
          <div
            ref={scrollContainerRef}
            className="gray-scrollbar -my-2 overflow-x-scroll sm:-mx-6 lg:-mx-8"
          >
            <div
              className={mergeClasses(
                'inline-block min-w-full pb-[11px] pt-[8px] align-middle sm:px-3 lg:px-8',
                containerLv4ClassName
              )}
            >
              <div
                className={mergeClasses(
                  'border-silver-sand overflow-hidden rounded-[8px] border px-[0.5px] pb-[1px]',
                  containerLv5ClassName
                )}
              >
                <table
                  className={mergeClasses(
                    'min-w-full table-auto border-collapse',
                    {
                      'text-left': horizontalAlign === 'left',
                      'text-center': horizontalAlign === 'center',
                      'text-right': horizontalAlign === 'right'
                    }
                  )}
                >
                  <colgroup>
                    {columns.map((column, index) => (
                      <col
                        key={column.title + index}
                        style={{
                          width: column.width,
                          minWidth: column.width
                        }}
                      ></col>
                    ))}
                  </colgroup>
                  <thead>
                    <tr>
                      {columns.map((column, index) => (
                        <th
                          key={column.title + index}
                          scope="col"
                          className={mergeClasses(
                            'border-silver-sand h-[40px] whitespace-nowrap border-x border-b px-3 text-left text-[12px] font-bold uppercase tracking-wider first:border-l-0 last:border-r-0',
                            thRowClassName
                          )}
                        >
                          <div
                            className={mergeClasses(
                              'flex h-full w-full items-center gap-[10px]',
                              {
                                'justify-start': horizontalAlign === 'left',
                                'justify-center': horizontalAlign === 'center',
                                'justify-end': horizontalAlign === 'right'
                              }
                            )}
                          >
                            {column.title}
                            {column?.tooltip}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((entry, entryIndex) => (
                      <React.Fragment key={entry?.id || entryIndex}>
                        <tr
                          className={mergeClasses(
                            'odd:bg-black-100 even:bg-white',
                            tdRowClassName,
                            entry.children?.length > 0 &&
                              'odd:bg-alice-blue even:bg-alice-blue cursor-pointer',
                            highlightRows?.includes(String(entry.id)) &&
                              'odd:bg-begonia-light even:bg-begonia-light'
                          )}
                          onClick={() =>
                            setExpands(pre => {
                              pre[entryIndex] = !pre[entryIndex];
                              return [...pre];
                            })
                          }
                        >
                          {columns.map(
                            (
                              { Cell, field, title, className },
                              columnIndex
                            ) => (
                              <td
                                key={title + columnIndex}
                                className={mergeClasses(
                                  'border-silver-sand h-[40px] whitespace-nowrap border-x border-t px-3 font-medium first:border-l-0 last:border-r-0',
                                  tdClassName,
                                  className
                                )}
                              >
                                {Cell ? (
                                  <Cell
                                    entry={entry}
                                    index={entryIndex}
                                    expand={expands[entryIndex]}
                                  />
                                ) : (
                                  (entry[field] as any)
                                )}
                              </td>
                            )
                          )}
                        </tr>
                        {expands[entryIndex] &&
                          entry?.children?.map((childEntry, childIdx) => {
                            return (
                              <tr
                                key={childEntry?.id || childIdx}
                                className={mergeClasses(
                                  tdRowClassName,
                                  highlightRows?.includes(
                                    String(childEntry.id)
                                  ) &&
                                    'odd:bg-begonia-light even:bg-begonia-light'
                                )}
                              >
                                {columns.map(
                                  (
                                    { Cell, field, title, className },
                                    columnIndex
                                  ) => (
                                    <td
                                      key={title + columnIndex}
                                      className={mergeClasses(
                                        'border-silver-sand h-[40px] whitespace-nowrap border-x border-t px-3 font-medium first:border-l-0 last:border-r-0',
                                        tdClassName,
                                        className
                                      )}
                                    >
                                      {Cell ? (
                                        <Cell
                                          entry={childEntry}
                                          index={childIdx}
                                          expand={expands[entryIndex]}
                                        />
                                      ) : (
                                        (childEntry[field] as any)
                                      )}
                                    </td>
                                  )
                                )}
                              </tr>
                            );
                          })}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const Table = React.memo(_Table) as typeof _Table;
