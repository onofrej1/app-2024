import { PrismaModel, Resource } from '@/resources/resources.types';

/*const rules = object({
  employeeId: string().required(),
});*/

const post: Resource = {
    name: 'Post',
    name_plural: 'Posts',
    model: PrismaModel.post,
    resource: 'posts',
    menuIcon: '',
    //relations: ['posts'],
    //rules,
    /*filter: [
      { name: 'name', type: 'text', label: 'Name' },
      { name: 'email', type: 'text', label: 'Email' },
    ],*/
    form: [
        { name: 'title', type: 'text', label: 'Title' },
        { name: 'content', type: 'text', label: 'Content' },
    ],
    list: [
        { name: 'title', header: 'Title' },
        { name: 'content', header: 'Content' },
    ],
};
export { post };