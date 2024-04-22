import { prismaQuery } from '@/lib/db'
import TableUI, { TableData } from "@/components/table";
import { resources } from "@/resources";
import { redirect } from 'next/navigation';

interface ResourceProps {
    params: {
        name: string;
    },
    searchParams: { [key: string]: string }
}

export default async function Resource({ params, searchParams }: ResourceProps) {
    const { page, skip, ...where } = searchParams;

    const resourceName = params.name;
    const resource = resources.find(r => r.resource === resourceName);
    if (!resource) {
        throw new Error(`Resource ${resourceName} not found !`);
    }
    const args = { where };
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
            <TableUI headers={resource.list} data={data} actions={actions} />
        </>
    );
}