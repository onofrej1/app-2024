import prisma, { prismaQuery } from '@/lib/db'
import TableUI, { TableData } from "@/components/table";
import { resources } from "@/resources";
import { redirect, usePathname, useRouter } from 'next/navigation';

import { faker } from '@faker-js/faker';
import { PrismaModel } from '@/resources/resources.types';
// or, if desiring a different locale
// import { fakerDE as faker } from '@faker-js/faker';

interface ResourceProps {
  params: {
    name: string;
  },
  searchParams: { [key: string]: string }
}

export default async function Resource({ params, searchParams }: ResourceProps) {
  const { page, ...where } = searchParams;

  console.log(page);

  const randomName = faker.person.fullName(); // Rowan Nikolaus
  const randomEmail = faker.internet.email();

  for (var _i = 0; _i < 1; _i++) {
    const a = {
      data: {
        title: faker.lorem.word(),
        content: faker.lorem.word(),
        author: {
          connect: { id: "clvbdkuqg0000jnn5ms9wk1aw" }
        }

      }
    };
    //await prismaQuery(PrismaModel.post, 'create', a);
  }

  const resourceName = params.name;
  const resource = resources.find(r => r.resource === resourceName);
  if (!resource) {
    throw new Error(`Resource ${resourceName} not found !`);
  }
  const args = { 
    //where,
    skip: Number(page) || 0,
    take: 5, 
  };
  const data = await prismaQuery(resource.model, 'findMany', args);

  const actions = [
    {
      label: 'Edit',
      action: async (data: TableData) => {
        "use server"
        redirect(`/resource/${resourceName}/${data.id}/edit`)
      },
    },
    {
      label: 'Delete',
      action: async (data: TableData) => {
        "use server"
        console.log(data)
      },
    }
  ]

  const pageNumber = Number(page) || 0;

  return (
    <>
      

      <TableUI headers={resource.list} data={data} actions={actions} />
    </>
  );
}