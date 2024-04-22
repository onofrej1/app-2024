"use server";
import prisma from "@/lib/db";
import { FormField } from "@/resources/resources.types";
import rules, { FormSchema } from "@/validation";
import { ZodError } from "zod";
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';

export type State =
  | {
    status: "success";
    message: string;
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

export async function saveFormData(
  fields: FormField[],
  formSchema: FormSchema,
  action: (data: any) => any,
  prevState: State | null,
  formData: FormData,
): Promise<State> {
  let response;
  try {
    const data: { [key: string]: any } = {};
    fields.forEach((field) => {
      if (field.type === 'm2m') {
        data[field.name] = formData.getAll(field.name);
      } else {
        data[field.name] = formData.get(field.name);
      }
    });
    
    const validation = rules[formSchema];
    const parsedData = validation.parse(data);
    response = await action(parsedData);
  } catch (e) {
    console.log('Save form data error:', e);

    if (e instanceof ZodError) {
      return {
        status: "error",
        message: "Invalid form data.",
        errors: e.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      };
    }
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  if (response && response.action) {
    if (response.action === 'redirect') {
      return redirect(response.path);
    }
  }

  return {
    status: "success",
    message: "Action done."
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
  return { action: 'redirect', path: `test`};
}
