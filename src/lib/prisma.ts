import { PrismaClient } from "@/generated/prisma"

const prismaClientSingletons = () => {
  return new PrismaClient();
}

declare const globalThis : {
  prismaGlobal: ReturnType<typeof prismaClientSingletons>
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingletons()

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
export default prisma;
