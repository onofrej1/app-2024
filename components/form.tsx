"use client";

import { Controller, FieldPath, useForm } from 'react-hook-form';
import { Input } from "@/components/ui/input"
import { State, saveFormData } from '@/actions';
import { useFormState, useFormStatus } from 'react-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@hookform/error-message';
import { useEffect } from 'react';
import { FormField } from '@/resources/resources.types';
import { FormSchema } from '@/validation';
import rules from '@/validation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { default as ReactSelect } from 'react-select';

export interface DefaultFormData {
    [key: string]: any;
}

export interface FormValues {
    email: string;
    name: string;
}

interface FormProps {
    fields: FormField[];
    formSchema: FormSchema,
    data: DefaultFormData;
    action: (data: any) => any;
}

export default function Form({ fields, formSchema, data, action }: FormProps) {
    //useForm<FormSchemaInputType>
    const validation = rules[formSchema];
    //console.log(validation);
    console.log('aaa');
    console.log(data);
    const { register, formState: { isValid, errors }, getValues, setError, control, reset } = useForm({
        mode: "onSubmit",
        //resolver: zodResolver(validation),
        defaultValues: data,
    });

    const saveData = saveFormData.bind(null, fields, formSchema, action);
    const [state, formAction] = useFormState<State, FormData>(saveData, null);
    const { pending } = useFormStatus();
    //console.log(state);
    //console.log(pending);
    console.log(isValid);

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
            alert(state.message);
        }
        if (state.status === "success") {
            alert(state.message);
        }
    }, [state, setError]);

    console.log(getValues());

    return (
        <>
            <form action={formAction}>
                {fields.map((field) => <div key={field.name} className="mb-2">
                    {['text', 'nunber', 'email', 'hidden'].includes(field.type) && <>
                        <Input type={field.type || 'text'} {...register(field.name)} placeholder={field.label} />
                        <ErrorMessage
                            errors={errors}
                            name={field.name}
                        //render={({ message }) => <p>{message}</p>}
                        />
                    </>
                    }

                    {['select', 'fk'].includes(field.type) &&
                        <Controller
                            control={control}
                            name={field.name}
                            render={({
                                field: { onChange, value, name },
                                fieldState: { invalid, isTouched, isDirty, error },
                                formState,
                            }) => (
                                <Select
                                    name={name}
                                    onValueChange={onChange}
                                    defaultValue={value?.toString()}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={field.label} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {field.options && field.options?.map(option =>
                                            <SelectItem
                                                key={option.value}
                                                value={option.value.toString()}>{option.label} {name}</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    }

                    {['m2m'].includes(field.type) &&
                        <Controller
                            control={control}
                            name={field.name}
                            render={({
                                field: { onChange, value, name, ref },
                                fieldState: { invalid, isTouched, isDirty, error },
                                formState,
                            }) => (
                                <div>
                                    value: {JSON.stringify(value)}
                                <ReactSelect
                                    defaultValue={value ? value.map((v: any) => ({ value: Number(v.id), label: v[field.textField!]})) : []}
                                    //value={value}
                                    isMulti={true}
                                    onChange={(e => {
                                        console.log('ccc');
                                        console.log(e);
                                        onChange(e);
                                        //onChange(e.map(t => t.value));
                                    })}
                                    ref={ref}
                                    name={name}
                                    options={field.options}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                />
                                </div>
                            )}
                        />
                    }

                </div>
                )}

                {/*pending || !isValid */}
                <Button type="submit" className="mt-3" >Save</Button>
            </form >
        </>
    )
}
