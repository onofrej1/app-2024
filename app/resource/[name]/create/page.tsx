import { Form } from "@/components/form";
import { Button } from "@/components/ui/button"
import prisma from '@/lib/db'

interface ResourceProps {
    params: {
        name: string;
    },
    searchParams: { [key: string]: string }
}

enum Entity {
    user = "user",
    post = "post"
}

async function prismaDb(resource: Entity, args: any, op: any) {
    return (prisma[resource][op] as any)(args);
}

/*async function saveData(resource: Entity, args: any, op: any) {
    const map1 = new Map<Entity, any>([
        [Entity.user, () => (prisma[resource][op] as any)(args)],
        //[Entity.Post, () => prisma.post[op](args)]
    ]);
    return map1.get(resource)();
}*/

export default async function Resource({ params, searchParams }: ResourceProps) {
    console.log(searchParams);
    const { page, skip, ...where } = searchParams;

    const resource: Entity = params.name as any;

    /*await prisma.user.create({
        data: {
            name: 'Alice3',
            email: 'alice3@prisma.io',
            posts: {
                create: { title: 'Hello World' },
            },
            profile: {
                create: { bio: 'I like turtles' },
            },
        },
    })*/
    //const data = { name: 'abc', 'email': 'abc2@post.sk' };
    const data = { title: 'article', content: '123', authorId: 1 };
    const args = {
        data
    };
    //const d = await prismaDb(resource, args, 'create');

    const form = {
        [Entity.user]: [
            { name: 'id', header: 'Id' },
            { name: 'email', header: 'Email' },
        ],
        [Entity.post]: [
            { name: 'id', header: 'Id' },
            { name: 'content', header: 'Content' },
        ]
    }

    return (
        <>
            <div className="text-5xl">Create page</div>
            <Form />
        </>
    );
}