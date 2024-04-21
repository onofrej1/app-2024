import { Button } from "@/components/ui/button"
import prisma from '@/lib/db'

export default async function Test() {
    const posts = await prisma.post.findMany();
    //console.log(posts);

    return (
        <>
            <div className="text-5xl">Test page</div>
            <div className="mb-3">
                <Button>Click me button</Button>
            </div>
        </>
    );
}