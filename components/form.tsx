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

    const { register, formState: { isValid, errors }, getValues, setError, control, reset } = useForm({
        mode: "onSubmit",
        resolver: zodResolver(validation),
        defaultValues: data,
    });

    const saveData = saveFormData.bind(null, fields, formSchema, action);
    const [state, formAction] = useFormState<State, FormData>(saveData, null);
    const { pending } = useFormStatus();
    console.log(state);

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
            //alert(state.message);
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
                            }) => {
                                const selectValue = value && value.length ? value.map((v: any) => ({ value: Number(v.value || v.id), label: v.label || v[field.textField!] })) : [];
                                console.log(selectValue);
                                return (
                                    <>
                                        <ReactSelect
                                            defaultValue={selectValue}
                                            value={selectValue}
                                            isMulti={true}
                                            onChange={onChange}
                                            ref={ref}
                                            instanceId={field.name}
                                            name={name}
                                            options={field.options}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                        />
                                    </>
                                )
                            }
                            }
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
