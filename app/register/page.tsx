"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from '@/lib/db'
import rules, { FormSchema } from "@/validation";
import bcrypt from 'bcrypt';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
