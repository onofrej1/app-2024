import { PrismaModel, Resource } from '@/resources/resources.types';

/*const rules = object({
  employeeId: string().required(),
});*/

const user: Resource = {
    name: 'User',
    name_plural: 'Users',
    model: PrismaModel.user,
    resource: 'users',
    menuIcon: '',
    //relations: ['posts'],
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