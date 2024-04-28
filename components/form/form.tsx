"use client";

import { Controller, FieldPath, useForm } from 'react-hook-form';
import { State, saveFormData } from '@/actions';
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
  formSchema: FormSchema,
  data?: DefaultFormData;
  action: (data: any) => any;
  buttons?: ((props: FormState) => JSX.Element)[],
  render?: FormRenderFunc,
}

export default function Form({ fields, formSchema, data, action, buttons, render }: FormProps) {
  const validation = rules[formSchema];

  const { register, formState: { isValid, errors }, getValues, setError, control, reset } = useForm({
    mode: "onSubmit",
    resolver: zodResolver(validation),
    defaultValues: data,
  });

  const saveData = saveFormData.bind(null, fields, formSchema, action);
  const [state, formAction] = useFormState<State, FormData>(saveData, null);
  const { pending } = useFormStatus();

  useEffect(() => {
    if (!state) {
      return;
    }
    if (state.status === "error") {
      state.errors?.forEach((error) => {
        setError(error.path as FieldPath<FormValues>, {
          message: error.message,
        });
      });
    }
    if (state.status === "error" && state.message) {
      //alert(state.message);
    }
    if (state.status === "success") {
      //alert(state.message);
    }
  }, [state, setError]);

  console.log(getValues());

  const renderField = (field: FormField) => 
    <div key={field.name} className="mb-2">
      {['text', 'number', 'email', 'hidden'].includes(field.type) && <>
        <FormInput
          label={field.label}
          name={field.name}
          errors={errors}
          type={field.type}
          register={register}
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
              onChange={onChange}
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
              onChange={onChange}
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
              ref={ref}
            />
          )
          }
        />
      }
    </div>

  const fieldsToRender = fields.reduce((acc,field)=> {
    acc[field.name] = renderField(field);
    return acc;
  }, {} as Record<string, JSX.Element>);

  if (render) {
    return render({ fields: fieldsToRender, formState: { isValid, pending }});
  }

  return (
    <>
      <form action={formAction}>
        {fields.map(Field => renderField(Field))}
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
