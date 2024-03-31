"use server";

import { formSchema } from "@/validation";
import { ZodError } from "zod";

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

const fields = ['id', 'name', 'email'];

export async function saveFormData(prevState: State | null,
    formData: FormData,
): Promise<State> {
    try {
        const data: { [key: string]: any } = {};
        fields.forEach((field) => (data[field] = formData.get(field)));

        const { /*id,*/ name, email } = formSchema.parse(data);
    
        return {
            status: "success",
            message: "Welcome"
            //message: `Welcome, ${data.get("email")} ${data.get("content")}!`,
        };
    } catch(e) {
        if (e instanceof ZodError) {
            return {
              status: "error",
              message: "Invalid form data",
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
