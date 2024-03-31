import { Button } from "@/components/ui/button"
import prisma from '@/lib/db'

interface ResourceProps {
    params: {
        name: string;
    },
    searchParams: { [key: string]: string }
}

/*const getModel = (name: string) => {
    switch (name) {
        case "post": {
            //return prisma.post; 
            return postRepository;
            break;
        }
        case "user": {
            //return prisma.user;
            return userRepository;
            break;
        }
        default: {
            return userRepository;
            break;
        }
    }
}*/

enum Entity {
    user = "user",
    post = "post"
}

async function getData(resource: Entity, find: any) {
    const map1 = new Map<Entity, any>([
        [Entity.user, () => prisma.user.findMany(find)],
        [Entity.post, () => prisma.post.findMany(find)]
    ]);
    return map1.get(resource)();
}

async function prismaDb(resource: Entity, args: any, op: any) {
    return (prisma[resource][op] as any)(args);
}

export default async function Resource({ params, searchParams }: ResourceProps) {
    console.log(searchParams);
    const { page, skip, ...where } = searchParams;

    console.log(params.name);
    const resource: Entity = params.name as any;

    const find = { where };
    const data: any = await prismaDb(resource, find, 'findMany');

    const list = {
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
            <div className="text-5xl">Test page</div>
            <div className="mb-3">
                <Button>Click me button</Button>
            </div>
            {data.map((u: any) => <div key={u.id}>

                {list[resource].map((c: any) => <div key={c.name}>
                    {c.name}: {u[c.name]}
                </div>)}
            </div>)}
        </>
    );
}