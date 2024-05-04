"use client"
import { FormField } from "@/resources/resources.types";
import rules, { FormSchema } from "@/validation";
import { ZodError } from "zod";
import { redirect } from 'next/navigation';
import { State } from "@/actions";

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
      if (field.type === 'm2m') {
        data[field.name] = formData.getAll(field.name);
      } else {
        data[field.name] = formData.get(field.name);
      }
    });
    const validation = rules[formSchema];
    const parsedData = validation ? validation.parse(data) : data;

    response = await action(...actionParams, parsedData);
  } catch (e) {
    console.log('An error occured saving form data:', e);

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