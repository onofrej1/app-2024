import { Prisma, PrismaClient } from '@prisma/client'

class Decorator<Interface> {
  private target!: Interface;
}

export type DecoratorClass<Interface> = {
  new (target: Interface): Decorator<Interface> & Interface;
  prototype: Decorator<Interface> & Interface;
}

export function createDecoratorProxy<Interface>(methods: ReadonlyArray<keyof Interface>): DecoratorClass<Interface> {

  class Decorator {
      constructor(private target: Interface) {}
  }    

  for (const key of methods) {
      (Decorator.prototype as any)[key] = function (...args: any[]) {
          return this.target[key](...args);
      }
  }

  return Decorator as any
}

class UserRepository extends createDecoratorProxy<Prisma.UserDelegate>([
  "aggregate",
  "count",
  "create",
  "createMany",
  "delete",
  "findFirst",
  "findFirstOrThrow",
  "findMany",
  "findUnique",
  "findUniqueOrThrow",
  "update",
  "updateMany",
  "upsert",
]) {}
class PostRepository extends createDecoratorProxy<Prisma.PostDelegate>([
  "aggregate",
  "count",
  "create",
  "createMany",
  "delete",
  "findFirst",
  "findFirstOrThrow",
  "findMany",
  "findUnique",
  "findUniqueOrThrow",
  "update",
  "updateMany",
  "upsert",
]) {}

const prisma = new PrismaClient()

export const userRepository = new UserRepository(prisma.user)
export const postRepository = new PostRepository(prisma.post)