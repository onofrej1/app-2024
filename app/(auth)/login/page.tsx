"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import rules, { FormSchema } from "@/validation";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label";
import { renderError } from "@/components/form/utils";
import Image from 'next/image';
import GithubIcon from "@/public/github.svg";
import GoogleIcon from "@/public/google.svg";
import { useSession, signIn } from "next-auth/react"

export default function LoginPage() {
  const [error, setError] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();

  const { handleSubmit, register, formState: { isValid, errors } } = useForm({
    mode: "onSubmit",
    resolver: zodResolver(rules[FormSchema.LoginUser]),
    defaultValues: {
      email: '',
      password: ''
    },
  });

  if (session) {
    router.push('/profile');
  }

  if (status === 'loading') {
    return null;
  }

  const onSubmit = async (data: any) => {
    try {
      const response = await signIn('credentials', { ...data, redirect: false });
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
    <>
      <a href="#" className="flex items-center justify-center mt-4 text-white rounded-lg shadow-md hover:bg-gray-100">
        <div className="px-4 py-3">
          <Image
            priority
            src={GithubIcon}
            width={24}
            alt="Follow us on github"
          />

        </div>
        <h1 onClick={() => signIn('github')} className="px-4 py-3 w-5/6 text-center text-gray-600 font-bold">Sign in with Github</h1>
      </a>
      <a href="#" className="flex items-center justify-center mt-4 text-white rounded-lg shadow-md hover:bg-gray-100">
        <div className="px-4 py-3">
          <Image
            priority
            src={GoogleIcon}
            width={24}
            alt="Follow us on google"
          />

        </div>
        <h1 onClick={() => signIn('google')} className="px-4 py-3 w-5/6 text-center text-gray-600 font-bold">Sign in with Google</h1>
      </a>
      <div className="mt-6 mb-4 flex items-center justify-between">
        <span className="border-b w-1/5 lg:w-1/4"></span>
        <a href="#" className="text-xs text-center text-gray-500 uppercase">or login with email</a>
        <span className="border-b w-1/5 lg:w-1/4"></span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label>
            Email
          </Label>
          <div className="mt-2">
            <Input type='text' {...register('email')} />
          </div>
          <ErrorMessage
            errors={errors}
            name={'email'}
            render={renderError}
          />
        </div>
        <div>
          <Label>
            Password
          </Label>
          <div className="mt-2">
            <Input type='text' {...register('password')} />
          </div>
          <ErrorMessage
            errors={errors}
            name={'password'}
            render={renderError}
          />
        </div>

        {error && <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          {/*<AlertTitle>Error</AlertTitle>*/}
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>}
        <Button className="w-full" type="submit">Login</Button>
      </form>
    </>
  );
}