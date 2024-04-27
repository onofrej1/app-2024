import Form from "@/components/form/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prismaQuery } from '@/lib/db'
import { resources } from "@/resources";
import { redirect } from "next/navigation";

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
            field['options'] = d.map((v: any) => ({ value: v.id, label: v[field.textField!] }));
        }
        if (field.type === 'm2m') {
            include[field.name] = true;
        }
    }

    const args = { where: { id: Number(id) }, include };
    const data = await prismaQuery(resource.model, 'findUnique', args);

    const onSave = async (parsedData: any) => {
        "use server"
        const { id, ...data } = parsedData;
        const f = resource.form;
        for (const field of f) {
            if (field.type === 'fk') {
                data[field.relation!] = { connect: { id: data[field.name] } };
                delete data[field.name!];
            }
            if (field.type === 'm2m') {
                const args: any = {
                    data: { [field.name]: { set: [] } },
                    where: { id: Number(id) }
                }
                await prismaQuery(resource.model, 'update', args);
                console.log(data[field.name]);
                const values = data[field.name].filter(Boolean).map((v: any) => ({ id: v }));
                if (values) {
                    console.log('aa');
                    console.log(values);
                    data[field.name] = { connect: values };
                }
            }
        }
        const args: any = {
            data,
            where: { id: Number(id) }
        }
        await prismaQuery(resource.model, 'update', args);

        return { action: 'redirect', path: `/resource/${resourceName}`};
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Edit item</CardTitle>
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