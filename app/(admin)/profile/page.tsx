"use client"

import { Button } from "@/components/ui/button"
import { signOut, useSession } from "next-auth/react";
import Image from 'next/image';
import { useRouter } from "next/navigation";

export default function Profile() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'loading') {
        return <>Loading user session...</>
    }

    if (!session) {
        return router.push('/login');
    }

    return (
        <div className="min-h-full flex items-center justify-center">
            <div className="text-center">
                <div className="flex items-center justify-center">
                    <div className="w-44 h-44 relative mb-4">
                        {session.user?.image && <Image
                            src={session.user?.image as string}
                            fill
                            alt=""
                            className="object-cover rounded-full"
                        />}
                    </div>
                </div>
                <p className="text-2xl mb-2">
                    Welcome <span className="font-bold">{session.user?.name}</span>. 
                    Signed In As
                </p>
                <p className="font-bold mb-4">{session.user?.email}</p>

                <div className="mb-3">
                    <Button onClick={() => signOut()}>Sign out</Button>
                </div>
            </div>
        </div>
    );
}