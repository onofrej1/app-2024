"use server";

import { FormField } from "@/resources/resources.types";
import rules, { FormSchema } from "@/validation";
import { ZodError, z } from "zod";

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
  //resource: PrismaModel, 
  fields: FormField[], 
  formSchema: FormSchema,
  action: (data: any) => any,
  prevState: State | null,
  formData: FormData
): Promise<State> {
  try {
    const data: { [key: string]: any } = {};
    fields.forEach((field) => {
      if (field.type === 'm2m') {
        data[field.name] = formData.getAll(field.name);
        console.log(data[field.name]);
      } else {
        data[field.name] = formData.get(field.name);
      }
    });
    //console.log(data);

    const validation = rules[formSchema];
    const parsedData = validation.parse(data);
    console.log('parsed data:');
    console.log(parsedData);
    action(parsedData);

    return {
      status: "success",
      message: "Data successfully saved."
      //message: `Welcome, ${data.get("email")} ${data.get("content")}!`,
    };
  } catch (e) {
    console.log(e);
    if (e instanceof ZodError) {
      return {
        status: "error",
        message: "Invalid form data.",
        errors: e.issues.map((issue) => ({
          path: issue.path.join("."),
          message: `Server validation: ${issue.message}`,
        })),
      };
    }
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }
}
