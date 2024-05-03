"use client"
import { FormField } from "@/resources/resources.types";
import rules, { FormSchema } from "@/validation";
import { ZodError } from "zod";
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
  //action: (data: any) => any,
  action: (...args : any[]) => any,
  actionParams: any,
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
    const parsedData = validation ? validation.parse(data) : data;

    console.log('params', actionParams);
    response = await action(...actionParams, parsedData);
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

  if (response) {
    if (response.action === 'redirect') {
      return redirect(response.path);
    }
  }

  return {
    status: "success",
    message: "Action done."
  };
}

export async function filterResource(pathname: string, searchParams: any, replace: any, data: any) {
    console.log('data', data);
    console.log(searchParams);

    const params = new URLSearchParams(searchParams);
    params.set('page', '0');
    Object.keys(data).forEach(name => {
      params.set(name, data[name]);
    });
    console.log(params.toString());
    console.log(pathname);
    //return redirect(`${pathname}?${params.toString()}`);
    const path = `${pathname}?${params.toString()}`;
    replace(path);
    //return { action: 'redirect', path };
}