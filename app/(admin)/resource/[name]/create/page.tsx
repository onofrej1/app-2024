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

export default async function CreateResource({ params }: ResourceProps) {
    const { name: resourceName } = params;
    const resource = resources.find(r => r.resource === resourceName);
    if (!resource) {
        throw new Error(`Resource ${resourceName} not found !`);
    }
    const form = resource.form;

    for (const field of form) {
        if (['fk', 'm2m'].includes(field.type) && field.resource) {
            const d = await prismaQuery(field.resource, 'findMany', null);
            field['options'] = d.map((v: any) => ({ value: v.id, label: v[field.textField!] }));
        }
    }

    const onSave = async (data: any) => {
        "use server"
        const f = resource.form;
        f.forEach(field => {
            if (field.type === 'fk') {
                data[field.relation!] = { connect: { id: data[field.name] } };
                delete data[field.name!];
            }

            if (field.type === 'm2m') {
                const values = data[field.name].map((v: any) => ({ id: v }));
                if (values) {
                    data[field.name] = { connect: values };
                }
            }
        });
        const args: any = {
            data
        };
        console.log(args.data);

        await prismaQuery(resource.model, 'create', args);

        return { action: 'redirect', path: `/resource/${resourceName}` };
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