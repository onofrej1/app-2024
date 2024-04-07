import { PrismaModel, Resource } from '@/resources/resources.types';
import { FormSchema } from '@/validation';

/*const rules = object({
  employeeId: string().required(),
});*/
import { z } from "zod";

export const formSchema = z.object({
    //id: z.number(),
    name: z.string().trim().min(4),
    email: z.string().min(1)
  });

const user: Resource = {
    name: 'User',
    name_plural: 'Users',
    model: PrismaModel.user,
    resource: 'users',
    menuIcon: '',
    //relations: ['posts'],
    rules: FormSchema.CreateEditUser,
    //rules,
    /*filter: [
      { name: 'name', type: 'text', label: 'Name' },
      { name: 'email', type: 'text', label: 'Email' },
    ],*/
    form: [
        { name: 'name', type: 'text', label: 'Name' },
        { name: 'email', type: 'text', label: 'Email' },
    ],
    list: [
        { name: 'name', header: 'Name' },
        { name: 'email', header: 'Email' },
    ],
};
export { user };