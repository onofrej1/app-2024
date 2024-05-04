import { prismaQuery } from '@/lib/db'
import Table, { TableData } from "@/components/table";
import { resources } from "@/resources";
import { redirect } from 'next/navigation';
import TablePagination from "@/components/table-pagination";
import TableFilter from "@/components/table-filter";

interface ResourceProps {
  params: {
    name: string;
  },
  searchParams: { [key: string]: string }
}

export default async function Resource({ params, searchParams }: ResourceProps) {
  const { page, pageCount, ...where } = searchParams;

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

  const skip = (Number(page) || 1) - 1;
  const args = {
    where: whereQuery,
    skip: skip * (Number(pageCount) || 10),
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
      <TableFilter />
      <Table
        headers={resource.list}
        totalRows={totalRows}
        data={data}
        actions={actions} />
      <TablePagination totalRows={totalRows} />
    </>
  );
}