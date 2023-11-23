import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import {
  useForm,
  UseFormReturn,
  SubmitHandler,
  UseFormProps,
  DeepPartial
} from 'react-hook-form';
import { ZodType, ZodTypeDef } from 'zod';

import { mergeClasses } from '@/utils/common';

export type FormProps<TFormValues, Schema> = {
  className?: string;
  onSubmit: SubmitHandler<TFormValues>;
  onChangeValue?: (
    value: DeepPartial<TFormValues>,
    name: string,
    type: string,
    methods: UseFormReturn<TFormValues, any, undefined>
  ) => void;
  children: (methods: UseFormReturn<TFormValues>) => React.ReactNode;
  options?: UseFormProps<TFormValues>;
  id?: string;
  schema?: Schema;
  ref?: React.MutableRefObject<UseFormReturn<TFormValues>>;
};

const _Form = <
  TFormValues extends Record<string, unknown> = Record<string, unknown>,
  Schema extends ZodType<unknown, ZodTypeDef, unknown> = ZodType<
    unknown,
    ZodTypeDef,
    unknown
  >
>(
  {
    onSubmit,
    onChangeValue,
    children,
    className,
    options,
    id,
    schema
  }: FormProps<TFormValues, Schema>,
  ref
) => {
  const methods = useForm<TFormValues>({
    ...options,
    resolver: schema && zodResolver(schema)
  });

  React.useImperativeHandle(ref, () => methods);

  React.useEffect(() => {
    const subscription = methods.watch(
      (value, { name, type }) =>
        onChangeValue && onChangeValue(value, name, type, methods)
    );
    return () => subscription.unsubscribe();
  }, [onChangeValue, methods]);

  return (
    <form
      className={mergeClasses('space-y-[36px]', className)}
      onSubmit={methods.handleSubmit(onSubmit)}
      id={id}
    >
      {children(methods)}
    </form>
  );
};

_Form.displayName = 'Form';

export const Form = React.forwardRef(_Form) as typeof _Form;
