"use client"

import { ErrorMessage } from '@hookform/error-message';
import { Label } from '../ui/label';
import { DefaultFormData } from './form';
import { FieldErrors } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { renderError } from './utils';

interface SelectOption {
  label: string,
  value: string | number,
}

interface InputProps {
  label: string,
  name: string,
  errors?: FieldErrors<DefaultFormData>,
  options: SelectOption[],
  value: string | number,
  onChange: (value: string) => void,
}

export default function FormSelect({
  label,
  name,
  errors,
  options,
  value,
  onChange
}: InputProps) {

  return (
    <>
      <Label>{label}</Label>
      <div>
        <Select
          name={name}
          onValueChange={onChange}
          defaultValue={value?.toString()}
        >
          <SelectTrigger>
            <SelectValue placeholder={label} />
          </SelectTrigger>
          <SelectContent>
            {options && options?.map(option =>
              <SelectItem
                key={option.value}
                value={option.value.toString()}>{option.label}</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      {errors && <ErrorMessage
        errors={errors}
        name={name}
        render={renderError}
      />}
    </>
  )
}