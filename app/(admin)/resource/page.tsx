import TableUI from "@/components/table";
import { Button } from "@/components/ui/button"
import prisma from '@/lib/db'

export default async function Test() {
    const posts = await prisma.post.findMany();
    console.log(posts);

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


    const allUsers = await prisma.user.findMany({
        include: {
            posts: true,
            profile: true,
        },
    });

    console.log(allUsers);

    return (
        <>
            <TableUI />
            {allUsers.map(u => <div key={u.id}>
                {u.name}
            </div>)}
        </>
    );
}