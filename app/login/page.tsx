"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import rules, { FormSchema } from "@/validation";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Login() {
    const [error, setError] = useState('');
    const router = useRouter();

    const { handleSubmit, register, formState: { isValid, errors } } = useForm({
        mode: "onSubmit",
        resolver: zodResolver(rules[FormSchema.LoginUser]),
        defaultValues: {
            email: '',
            password: ''
        },
    });

    const onSubmit = async (data: any) => {
        try {
            const response = await signIn('credentials', { ...data, redirect: false });
            console.log(response);
            if (response && response.ok) {
                router.push('/test');
            } else {
                setError(response?.error || 'An error occured');
            }
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="min-w-[50%]">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Input type='text' {...register('email')} />
                        <ErrorMessage
                            errors={errors}
                            name={'email'} />

                        <Input type='text' {...register('password')} />
                        <ErrorMessage
                            errors={errors}
                            name={'password'}
                        //render={({ message }) => <p>{message}</p>}
                        />
                        {error && <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            {/*<AlertTitle>Error</AlertTitle>*/}
                            <AlertDescription>
                                {error}
                            </AlertDescription>
                        </Alert>}
                        <Button className="w-100" type="submit">Login</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}