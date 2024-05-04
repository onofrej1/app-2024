import { faker } from '@faker-js/faker';
import { prismaQuery } from '@/lib/db'
import { PrismaModel } from '@/resources/resources.types';

export default async function Seed() {
  for (var i = 0; i < 1; i++) {
    const args = {
      data: {
        title: faker.lorem.word(),
        content: faker.lorem.word(),
        author: {
          connect: { id: "clvbdkuqg0000jnn5ms9wk1aw" }
        }

      }
    };
    await prismaQuery(PrismaModel.post, 'create', args);
  }  
}