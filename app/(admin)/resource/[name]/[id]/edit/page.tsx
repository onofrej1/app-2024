import Form from "@/components/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prismaQuery } from '@/lib/db'
import { resources } from "@/resources";

interface ResourceProps {
    params: {
        name: string;
        id: string;
    },
    searchParams: { [key: string]: string }
}

export default async function EditResource({ params }: ResourceProps) {
    const { name: resourceName, id } = params;
    const resource = resources.find(r => r.resource === resourceName);
    if (!resource) {
        throw new Error(`Resource ${resourceName} not found !`);
    }
    const args = { where: { id: Number(id) } };
    const data = await prismaQuery(resource.model, 'findUnique', args);

    const form = [{ name: 'id', type: 'hidden', label: 'Id' }, ...resource.form];

    const onSave = async (parsedData: any) => {
        "use server"
        const { id, ...data } = parsedData;
        const args: any = {
            data,
            where: { id: Number(id) }
        }
        await prismaQuery(resource.model, 'update', args);
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Edit item</CardTitle>
                    {/*<CardDescription>Card Description</CardDescription>*/}
                </CardHeader>
                <CardContent>
                    <Form
                        fields={form}
                        formSchema={resource.rules}
                        data={data}
                        action={onSave}
                    />
                </CardContent>
            </Card>
        </>
    );
}