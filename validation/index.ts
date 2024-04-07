import { z } from "zod";

const CreateEditUser = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(4),
  email: z.string().min(1)
});

const CreateEditCategory = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(4)
});

const SelectOption = z.object({
  value: z.string(),
  label: z.string()
});

const CreateEditPost = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(4),
  content: z.string().min(1),
  //author: z.string(),
  authorId: z.string(),
  categories: z.array(z.string()), // z.array(z.string())
});

export enum FormSchema {
  'CreateEditUser' = 'CreateEditUser',
  'CreateEditPost' = 'CreateEditPost',
  'CreateEditCategory' = 'CreateEditCategory'
}

const rules = {
  CreateEditUser,
  CreateEditPost,
  CreateEditCategory
};
export default rules;

//export type FormSchemaInputType = z.input<typeof formSchema>;
//export type FormSchemaOutputType = z.output<typeof formSchema>;