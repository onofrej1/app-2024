"use client";

import { Controller, FieldPath, useForm } from 'react-hook-form';
import { State, submitForm } from '@/actions';
import { submitForm as submitFormClient } from '@/actions-client';

import { useFormState, useFormStatus } from 'react-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { FormField, MultiSelectOption } from '@/resources/resources.types';
import { FormSchema } from '@/validation';
import rules from '@/validation';
import FormInput from './input';
import FormSelect from './select';
import FormMultiSelect from './multi-select';
import FormCheckbox from './checkbox';
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from 'next/navigation';

export interface DefaultFormData {
  [key: string]: any;
}

export interface FormValues {
  email: string;
  name: string;
}

export interface FormState {
  isValid: boolean,
  pending: boolean,
}

export type FormRenderFunc = (props: { fields: Record<string, JSX.Element>, formState: FormState }) => JSX.Element;

interface FormProps {
  fields: FormField[];
  validation: FormSchema,
  data?: DefaultFormData;
  useClient?: boolean,
  action: (...args: any[]) => any,
  actionParams?: any;
  buttons?: ((props: FormState) => JSX.Element)[],
  render?: FormRenderFunc,
}

export default function Form({ fields, validation, data, useClient = false, action, actionParams = [], buttons, render }: FormProps) {
  const { toast } = useToast();
  const { replace } = useRouter();

  const validationRules = rules[validation];

  const { register, formState: { isValid, errors }, setError, control } = useForm({
    mode: "onSubmit",
    resolver: zodResolver(validationRules),
    defaultValues: data,
  });

  const submitHandler = useClient ? submitFormClient : submitForm;
  const submit = submitHandler.bind(null, fields, validation, action, actionParams);
  const [state, formAction] = useFormState<State, FormData>(submit, null);
  const { pending } = useFormStatus();

  useEffect(() => {
    if (!state) {
      return;
    }
    if (state.status === "error" && state.errors) {
      state.errors?.forEach((error) => {
        setError(error.path as FieldPath<FormValues>, {
          message: error.message,
        });
      });
    }
    if (state.status === "error" && state.message) {
      console.log(state.message);
    }
    if (state.status === "success") {
      toast({
        title: state.status.toUpperCase(),
        description: state.message,
      });
      if (state.redirect) {
        replace(state.redirect);
      }
    }
  }, [state, setError, toast, replace]);

  //console.log(getValues());

  const renderField = (field: FormField) =>
    <>
      {['text', 'number', 'email', 'hidden'].includes(field.type) && <>
        <FormInput
          label={field.label}
          name={field.name}
          errors={errors}
          type={field.type}
          register={register}
          onChange={field.onChange}
        />
      </>
      }

      {field.type === 'checkbox' && <>
        <Controller
          control={control}
          name={field.name}
          render={({
            field: { onChange, value, name },
          }) => (
            <FormCheckbox
              label={field.label}
              name={name}
              errors={errors}
              checked={!!value}
              onChange={(value) => {
                onChange(value);
                if (field.onChange) {
                  field.onChange(value);
                }
              }}
            />
          )}
        />

      </>
      }

      {['select', 'fk'].includes(field.type) &&
        <Controller
          control={control}
          name={field.name}
          render={({
            field: { onChange, value, name },
          }) => (
            <FormSelect
              label={field.label}
              name={name}
              errors={errors}
              value={value}
              className={field.className}
              onChange={(value) => {
                onChange(value);
                if (field.onChange) {
                  field.onChange(value);
                }
              }}
              options={field.options!}
            />
          )}
        />
      }

      {['m2m'].includes(field.type) &&
        <Controller
          control={control}
          name={field.name}
          render={({
            field: { onChange, value, name, ref },
          }) => (
            <FormMultiSelect
              label={field.label}
              name={name}
              errors={errors}
              value={value}
              onChange={onChange}
              textField={field.textField!}
              options={field.options! as MultiSelectOption[]}
              //ref={ref}
            />
          )
          }
        />
      }
    </>

  const fieldsToRender = fields.reduce((acc, field) => {
    acc[field.name] = renderField(field);
    return acc;
  }, {} as Record<string, JSX.Element>);

  if (render) {
    const renderContent = render({ fields: fieldsToRender, formState: { isValid, pending } });
    return (
      <>
        {renderContent}
      </>
    );
  }

  return (
    <>
      <form action={formAction}>
        {fields.map(field => <div className="mb-3" key={field.name}>{renderField(field)}</div>)}
        {buttons?.length ? <div className='flex space-x-2'>
          {buttons.map((Button, index) => <Button
            key={index}
            isValid={isValid}
            pending={pending}
          />)}
        </div> :
          <Button type="submit" className="mt-3">Save changes</Button>}
      </form >
    </>
  )
}
