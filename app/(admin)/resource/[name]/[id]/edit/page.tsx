import Form from "@/components/form";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import prisma, { prismaQuery } from '@/lib/db'
import { resources } from "@/resources";

interface ResourceProps {
    params: {
        name: string;
        id: string;
    },
    searchParams: { [key: string]: string }
}

export default async function EditResource({ params, searchParams }: ResourceProps) {
    console.log(searchParams);
    const { page, skip, ...where } = searchParams;

    const { name: resourceName, id } = params;
    const resource = resources.find(r => r.resource === resourceName);
    if (!resource) {
        throw new Error(`Resource ${resourceName} not found !`);
    }
    const args = { where: { id: Number(id) } };
    const data = await prismaQuery(resource.model, 'findUnique', args);
    console.log(data);
    //const data = { title: 'article', content: '123', authorId: 1 };
    /*const args = {
        data
    };*/
    //const d = await prismaDb(resource, args, 'create');

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Edit item</CardTitle>
                    {/*<CardDescription>Card Description</CardDescription>*/}
                </CardHeader>
                <CardContent>
                    <Form fields={resource.form} data={data} />
                </CardContent>
            </Card>
           
        </>
    );
}