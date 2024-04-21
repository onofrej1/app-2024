"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSchema } from "@/validation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerUser, registerUserSuccess } from "@/actions";
import Form from "@/components/form";

export default function Register() {
    const [error, setError] = useState('');
    const router = useRouter();

    const fields = [
        { name: 'name', type: 'text', label: 'Name' },
        { name: 'email', type: 'text', label: 'Email' },
        { name: 'password', type: 'text', label: 'Password' }
    ];

    const defaultValues = {
        name: '',
        email: '',
        password: ''
    };    

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="min-w-[50%]">
                <CardHeader>
                    <CardTitle>Create account</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form 
                        fields={fields} 
                        formSchema={FormSchema.RegisterUser} 
                        data={defaultValues} 
                        action={registerUser}
                        onSuccess={registerUserSuccess}
                        />
                </CardContent>
            </Card>
        </div>
    );
}
