import { z } from "zod";

/*const CreateEditUser = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(4),
  email: z.string().min(1)
});*/

const RegisterUser = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(4),
  email: z.string().min(1),
  password: z.string().min(1)
});

const LoginUser = z.object({  
  email: z.string().min(1),
  password: z.string().min(1)
});

const CreateEditCategory = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(4)
});

const CreateEditPost = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(4),
  content: z.string().min(1),
  authorId: z.string(),
  categories: z.array(z.coerce.number()).optional(),
});

export enum FormSchema {
  //'CreateEditUser' = 'CreateEditUser',
  'RegisterUser' = 'RegisterUser',
  'LoginUser' = 'LoginUser',
  'CreateEditPost' = 'CreateEditPost',
  'CreateEditCategory' = 'CreateEditCategory'
}

const rules = {
  //CreateEditUser,
  CreateEditPost,
  CreateEditCategory,
  RegisterUser,
  LoginUser
};
export default rules;

//export type FormSchemaInputType = z.input<typeof formSchema>;
//export type FormSchemaOutputType = z.output<typeof formSchema>;