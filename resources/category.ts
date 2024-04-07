import { PrismaModel, Resource } from '@/resources/resources.types';
import { FormSchema } from '@/validation';

const category: Resource = {
    name: 'Category',
    name_plural: 'Categories',
    model: PrismaModel.category,
    resource: 'categories',
    menuIcon: '',
    //relations: ['posts'],
    rules: FormSchema.CreateEditCategory,
    //rules,
    /*filter: [
      { name: 'name', type: 'text', label: 'Name' },
      { name: 'email', type: 'text', label: 'Email' },
    ],*/
    form: [
        { name: 'name', type: 'text', label: 'Name' },
    ],
    list: [
        { name: 'name', header: 'Name' },
    ],
};
export { category };