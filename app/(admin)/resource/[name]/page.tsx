import { prismaQuery } from '@/lib/db'
import Table, { TableData } from "@/components/table";
import { resources } from "@/resources";
import { redirect } from 'next/navigation';
import TablePagination from "@/components/table-pagination";
import TableFilter from "@/components/table-filter";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ResourceProps {
  params: {
    name: string;
  },
  searchParams: { [key: string]: string }
}

export default async function Resource({ params, searchParams }: ResourceProps) {
  const { page, pageCount, sortBy = 'id', sortDir = 'asc', ...where } = searchParams;

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
  const take = Number(pageCount) || 10;

  const args = {
    where: whereQuery,
    skip: skip * take,
    take: take,
    orderBy: [{ [sortBy]: sortDir }]
  };
  const data = await prismaQuery(resource.model, 'findMany', args);

  const actions = [
    {
      label: 'Edit',
      icon: 'edit' as const,
      action: async (data: TableData) => {
        "use server"
        redirect(`/resource/${resourceName}/${data.id}/edit`);
      },
    },
    {
      label: 'Delete',
      icon: 'delete' as const,
      action: async (data: TableData) => {
        "use server"
        console.log(data);
      },
    }
  ]

  const createResource = async () => {
    "use server"    
    redirect(`/resource/${resourceName}/create`);
  };

  return (
    <>
      <div className="flex flex-row items-end justify-between">
        <TableFilter />
        <form action={createResource}>
          <Button type='submit' variant="default">
            <Plus className="h-5 w-5" /> Add new
          </Button>
        </form>
      </div>

      <Table
        headers={resource.list}
        totalRows={totalRows}
        data={data}
        actions={actions} />
      <TablePagination totalRows={totalRows} />
    </>
  );
}