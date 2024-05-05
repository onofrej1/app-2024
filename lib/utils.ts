import { State } from "@/actions";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toPlainObject(args: any) {
  return JSON.parse(JSON.stringify(args));
}

export function parseValidationError(e: ZodError): State {
  return {
    status: "error",
    message: "Invalid form data.",
    errors: e.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    })),
  };
}
