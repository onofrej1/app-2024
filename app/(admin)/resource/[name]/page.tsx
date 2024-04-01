import { prismaQuery } from '@/lib/db'
import TableUI from "@/components/table";
import { resources } from "@/resources";

interface ResourceProps {
    params: {
        name: string;
    },
    searchParams: { [key: string]: string }
}

export default async function Resource({ params, searchParams }: ResourceProps) {
    console.log(searchParams);
    const { page, skip, ...where } = searchParams;

    const resourceName = params.name;
    const resource = resources.find(r => r.resource === resourceName);
    if (!resource) {
        throw new Error(`Resource ${resourceName} not found !`);
    }
    const args = { where };
    const data = await prismaQuery(resource.model, 'findMany', args);

    return (
        <>  
            <TableUI headers={resource.list} data={data} />
        </>
    );
}