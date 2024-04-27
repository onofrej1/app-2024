"use client";

import { Controller, FieldPath, useForm } from 'react-hook-form';
import { Input } from "@/components/ui/input"
import { State, saveFormData } from '@/actions';
import { useFormState, useFormStatus } from 'react-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@hookform/error-message';
import { useEffect } from 'react';
import { FormField, MultiSelectOption } from '@/resources/resources.types';
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
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Label } from '../ui/label';
import FormInput from './input';
import FormSelect from './select';
import FormMultiSelect from './multi-select';

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
            //alert(state.message);
        }
        if (state.status === "success") {
            //alert(state.message);
        }
    }, [state, setError]);

    console.log(getValues());

    return (
        <>
            <form action={formAction}>
                {fields.map((field) =>
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
                )}

                {/*pending || !isValid */}
                <Button type="submit" className="mt-3" >Save changes</Button>

            </form >
        </>
    )
}
