import { useState } from 'react';

export const useMultiCheckbox = (
  initialData?: Record<string | number, boolean>
) => {
  const [checked, setChecked] = useState<Record<string, boolean>>(
    initialData ?? {}
  );

  const checkEntries = Object.entries(checked);

  const isNoneSelected =
    checkEntries.length === 0 || checkEntries.every(([, value]) => !value);

  const isSelectedAll =
    !isNoneSelected && checkEntries.every(([, value]) => value === true);

  const onChangeChecked = (id: string | number, value?: boolean) => {
    setChecked(pre => {
      pre[id] = value ?? !pre[id];
      return { ...pre };
    });
  };

  const onChangeAllChecked = (ids: string[] | number[]) => {
    if (isSelectedAll) {
      const newChecked = ids.reduce((pre, cur) => {
        pre[cur] = false;
        return pre;
      }, {});

      setChecked(pre => ({ ...pre, ...newChecked }));
    } else {
      const newChecked = ids.reduce((pre, cur) => {
        pre[cur] = true;
        return pre;
      }, {});

      setChecked(pre => ({ ...pre, ...newChecked }));
    }
  };

  const onResetChecked = () => {
    setChecked(initialData ?? {});
  };

  return {
    checked,
    isNoneSelected,
    isSelectedAll,
    onChangeChecked,
    onChangeAllChecked,
    onResetChecked
  };
};
