import NextAuth from "next-auth"
import bcrypt from 'bcrypt'
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { Adapter } from 'next-auth/adapters'
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/db";

const handler = NextAuth({
    adapter: PrismaAdapter(prisma) as Adapter,
    pages: {
        signIn: '/login',
    },
    callbacks: {
        jwt({ token, user }) {
            console.log('jwt callback');
            console.log(user);
            if (user) {
                token.role = user.role ?? 'user';
            }
            return token
        },
        session({ session, token }) {
            console.log('session callback');
            if (session.user) {
                session.user.role = token.role;
            }
            return session;
        },
    },
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
            profile(profile) {
                console.log('profile github');
                console.log(profile);
                
                return {
                    //...profile,
                    id: profile.id.toString(),
                    name: profile.name,
                    email: profile.email,
                    image: profile.avatar_url,
                    role: profile.role ?? 'user',
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            profile(profile) {
                console.log('profile google');
                console.log(profile);
                
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    role: profile.role ?? 'user',
                }
            }
        }),
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" },
                username: { label: "Username", type: "text", placeholder: "John Smith" },
            },
            async authorize(credentials, req) {
                if (!credentials || !credentials.email || !credentials.password) {
                    throw new Error('Please enter an email and password')
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });

                if (!user || !user?.password) {
                    throw new Error('No user found')
                }
                const passwordMatch = await bcrypt.compare(credentials.password, user.password)
                if (!passwordMatch) {
                    throw new Error('Incorrect password')
                }
                return user;
            },
        }),
    ],
    secret: process.env.SECRET,
    session: {
        strategy: "jwt",
    }
});

export { handler as GET, handler as POST }