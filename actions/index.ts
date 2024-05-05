"use server";
import prisma from "@/lib/db";
import { FormField } from "@/resources/resources.types";
import rules, { FormSchema } from "@/validation";
import { ZodError } from "zod";
import bcrypt from 'bcrypt';
import { parseValidationError } from "@/lib/utils";

export type State =
  | {
    status: "success";
    message: string;
    redirect?: string;    
  }
  | {
    status: "error";
    message: string;
    errors?: Array<{
      path: string;
      message: string;
    }>;
  }
  | null;

export async function submitForm(
  fields: FormField[],
  formSchema: FormSchema,
  action: (...args : any[]) => any,
  actionParams: any,
  prevState: State | null,
  formData: FormData,
): Promise<State> {
  let response;
  try {
    const data: { [key: string]: any } = {};
    fields.forEach((field) => {      
        data[field.name] = field.type === 'm2m' ? formData.getAll(field.name) : formData.get(field.name);      
    });
    const validation = rules[formSchema];
    const parsedData = validation ? validation.parse(data) : data;

    response = await action(...actionParams, parsedData);
  } catch (e) {
    console.log('An error occured saving form data:', e);

    if (e instanceof ZodError) {
      return parseValidationError(e);
    }
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  if (response) {
    return {
      status: "success",
      message: "Done.",
      redirect: response.redirect      
    };
  }

  return {
    status: "success",
    message: "Done.",
  };
}

export async function registerUser(data: any) {
  const { name, email, password } = data;

  const exist = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (exist) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        name,
        email: email,
        password: hashedPassword,
        role: 'user'
      }
    });
  } catch (e) {
    console.log(e);
  }
  return { action: 'redirect', path: '/profile'};
}
