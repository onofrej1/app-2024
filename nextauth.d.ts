import { DefaultSession, DefaultUser } from "next-auth"; 
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {

    /*interface User {
        id: string;
        role: string;
      }*/

    interface Session {
        /*user: {
            id: string,
            role: string,
        } & DefaultSession*/
        user: User,
    };

    interface User extends DefaultUser {
        id: string,
        role: string,
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        role: string,
    }
}