import { PrismaModel } from '@/resources/resources.types'
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}


declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

export async function prismaQuery(resource: PrismaModel, operation: any, args: any) {
  return (prisma[resource][operation] as any)(args);
}