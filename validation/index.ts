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
  authorId: z.string().min(1, 'Author field is required'),
  categories: z.array(z.coerce.number())
    .optional()
    .default([])
    //.transform((val) => val ? val : []),
});

export enum FormSchema {
  //'CreateEditUser' = 'CreateEditUser',
  'RegisterUser' = 'RegisterUser',
  'LoginUser' = 'LoginUser',
  'CreateEditPost' = 'CreateEditPost',
  'CreateEditCategory' = 'CreateEditCategory',
  'FilterResource' = 'FilterResource'
}

const FilterResource = z.object({
  id: z.string().optional(),
});

const rules = {
  //CreateEditUser,
  CreateEditPost,
  CreateEditCategory,
  RegisterUser,
  LoginUser,
  FilterResource: z.any(),
};

export default rules;

//export type FormSchemaInputType = z.input<typeof formSchema>;
//export type FormSchemaOutputType = z.output<typeof formSchema>;