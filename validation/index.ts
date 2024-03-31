import { z } from "zod";

export const formSchema = z.object({
    //id: z.number(),
    name: z.string().trim().min(4),
    email: z.string().min(1)
  });

export type FormSchemaInputType = z.input<typeof formSchema>;
export type FormSchemaOutputType = z.output<typeof formSchema>;