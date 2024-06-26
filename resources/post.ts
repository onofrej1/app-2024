import { PrismaModel, Resource } from '@/resources/resources.types';
import { FormSchema } from '@/validation';

/*const rules = object({
  employeeId: string().required(),
});*/

const post: Resource = {
  name: 'Post',
  name_plural: 'Posts',
  model: PrismaModel.post,
  resource: 'posts',
  rules: FormSchema.CreateEditPost,
  menuIcon: '',
  //relations: ['posts'],
  //rules,
  filter: [
    { name: 'title', type: 'text', label: 'Title' },
    //{ name: 'content', type: 'text', label: 'Content' },
    { name: 'content', type: 'select', className: 'w-60', label: 'Content', options: [
      {
        label: 'All',
        value: 'all'
      },
      {
        label: 'first',
        value: 'yyyyy'
      },
      {
        label: 'sedond',
        value: 'apud'
      }
    ]},
  ],
  form: [
    { name: 'title', type: 'text', label: 'Title' },
    { name: 'content', type: 'text', label: 'Content' },
    {
      name: 'authorId', 
      type: 'fk',
      relation: 'author',
      label: 'Author',
      resource: PrismaModel.user,
      textField: 'name'
    },
    {
      name: 'categories', 
      type: 'm2m',
      label: 'Categories',
      resource: PrismaModel.category,
      textField: 'name'
    }
  ],
  list: [
    { name: 'id', header: 'Id'},
    { name: 'title', header: 'Title' },
    { name: 'content', header: 'Content' },
  ],
};
export { post };