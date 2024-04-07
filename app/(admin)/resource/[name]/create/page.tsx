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

    const onSave = async (data: any) => {
        "use server"
        const args: any = {
            data
        }
        await prismaQuery(resource.model, 'create', args);
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Create item</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form
                        fields={resource.form}
                        formSchema={resource.rules}
                        data={{}}
                        action={onSave}
                    />
                </CardContent>
            </Card>

        </>
    );
}