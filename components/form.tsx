"use client";

import { FieldPath, useForm } from 'react-hook-form';
import { Input } from "@/components/ui/input"
import { State, saveFormData } from '@/actions';
import { useFormState, useFormStatus } from 'react-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from './ui/button';
import { ErrorMessage } from '@hookform/error-message';
import { useEffect } from 'react';
import { FormField } from '@/resources/resources.types';
import { FormSchema } from '@/validation';
import rules from '@/validation';

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
    console.log(validation);
    const { register, formState: { isValid, errors }, setError } = useForm({
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
            alert(state.message);
        }
    }, [state, setError]);

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

                </div>
                )}

                {/*pending || !isValid */}
                <Button type="submit" className="mt-3" >Save</Button>
            </form>
        </>
    )
}
