import { PrismaModel, Resource } from '@/resources/resources.types';
import { FormSchema } from '@/validation';

const category: Resource = {
    name: 'Category',
    name_plural: 'Categories',
    model: PrismaModel.category,
    resource: 'categories',
    menuIcon: '',
    rules: FormSchema.CreateEditCategory,    
    form: [
        { name: 'name', type: 'text', label: 'Name' },
    ],
    list: [
        { name: 'name', header: 'Name' },
    ],
};
export { category };