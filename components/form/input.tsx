"use client"

import { ErrorMessage } from '@hookform/error-message';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { DefaultFormData } from './form';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { renderError } from './utils';

interface InputProps {
    label: string,
    type: string,
    name: string,
    errors: FieldErrors<DefaultFormData>,
    register: UseFormRegister<DefaultFormData>,
}

export default function FormInput({ label, name, type, errors, register }: InputProps) {
    if (type === 'hidden') {
        return <Input type={type || 'text'} {...register(name)} placeholder={label} />;
    }

    return (
        <>
            <Label>{label}</Label>
            <div className='pt-1'>
                <Input type={type || 'text'} {...register(name)} placeholder={label} />
            </div>

            <ErrorMessage
                errors={errors}
                name={name}
                render={renderError}
            />
        </>
    )
}