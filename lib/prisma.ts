import { PrismaClient } from '@prisma/client'


export const prisma = new PrismaClient()
 
// const globalForPrisma = global as unknown as { prisma: PrismaClient }

// export const prisma =
//   globalForPrisma.prisma ||
//   new PrismaClient({
//     // log: ['query'],
//   })

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma