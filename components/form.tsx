"use client";

import { FieldPath, useForm } from 'react-hook-form';
import { Input } from "@/components/ui/input"
import { State, saveFormData } from '@/actions';
import { useFormState, useFormStatus } from 'react-dom';
import { FormSchemaInputType, formSchema } from '@/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from './ui/button';
import { ErrorMessage } from '@hookform/error-message';
import { useEffect } from 'react';

enum Entity {
    user = "user",
    post = "post"
}

export interface FormValues {
    email: string;
    name: string;
}

export function Form() {
    const resource = Entity.user;
    const { register, formState: { isValid, errors }, setError } = useForm<FormSchemaInputType>({
        mode: "onSubmit",
        resolver: zodResolver(formSchema),
    });
    const [state, formAction] = useFormState<State, FormData>(saveFormData, null);
    const { pending } = useFormStatus();

    const form = {
        [Entity.user]: [
            { name: 'id', header: 'Id' },
            { name: 'email', header: 'Email' },
            { name: 'name', header: 'Name' },
        ],
        [Entity.post]: [
            { name: 'id', header: 'Id' },
            { name: 'content', header: 'Content' },
        ]
    }

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
        if (state.status === "success") {
            alert(state.message);
        }
    }, [state, setError]);

    return (
        <>

            <form action={formAction}>

                {form[resource].map((c: any) => <div key={c.name}>

                    <Input type="text" {...register(c.name)} placeholder={c.header} />
                    <ErrorMessage
                        errors={errors}
                        name={c.name}
                    //render={({ message }) => <p>{message}</p>}
                    />
                </div>)}


                {pending || !isValid}
                <Button type="submit" >Send</Button>

                <p className="mt-5">
                    <>{state && JSON.stringify(state)}</>
                </p>
            </form>

        </>
    )
}
