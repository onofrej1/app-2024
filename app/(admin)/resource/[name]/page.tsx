import { prismaQuery } from '@/lib/db'
import TableUI, { TableData } from "@/components/table";
import { resources } from "@/resources";
import { redirect } from 'next/navigation';

import { faker } from '@faker-js/faker';

interface ResourceProps {
  params: {
    name: string;
  },
  searchParams: { [key: string]: string }
}

export default async function Resource({ params, searchParams }: ResourceProps) {
  const { page, pageCount, ...where } = searchParams;

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

  const whereQuery = Object.keys(where).reduce((acc, k) => {
    const value = where[k];
    if (value === '') return acc;
    acc[k] = { contains: value };
    return acc;
  }, {} as Record<string, any>);

  const totalRows = await prismaQuery(resource.model, 'count', { where: whereQuery });

  const args = {
    where: whereQuery,
    skip: (Number(page) || 0) * (Number(pageCount) || 10),
    take: Number(pageCount) || 10,
    orderBy: [{ 'id': 'asc' }]
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

  return (
    <>
      <TableUI
        headers={resource.list}
        totalRows={totalRows}
        data={data}
        actions={actions} />
    </>
  );
}