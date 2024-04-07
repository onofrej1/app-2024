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
    const form = [{ name: 'id', type: 'hidden', label: 'Id' }, ...resource.form];

    const include: Record<string, boolean> = {};
    for (const field of form) {
        if (['fk', 'm2m'].includes(field.type) && field.resource) {
            const d = await prismaQuery(field.resource, 'findMany', null);
            field['options'] = d.map((v: any) => ({ value: v.id, label: v[field.textField!]}));
        }
        if (field.type === 'm2m') {
            include[field.name] = true;
        }
    }

    const args = { where: { id: Number(id) }, include };
    const data = await prismaQuery(resource.model, 'findUnique', args);
    console.log(data);

    const onSave = async (parsedData: any) => {
        "use server"
        const { id, ...data } = parsedData;
        console.log('on save');
        console.log(data);
        const f = resource.form;
        f.forEach(field => {
            if (field.type === 'fk') {
                //data[field.relation!] = { connect: { id: Number(data[field.name]) }}
                data[field.name] = Number(data[field.name]);
            }
            if (field.type === 'm2m') {
                const values = data[field.name].map((v: any) => ({ id: Number(v) }));
                data[field.name] = { connect: values };
            }
        });
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