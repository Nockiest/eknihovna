//context.ts
import { PrismaClient } from '@prisma/client'
import { mockDeep, DeepMockProxy } from 'jest-mock-extended'

export type Context = {
  prisma: PrismaClient
}

export type MockContext = {
  prisma: DeepMockProxy<PrismaClient>
}

export const createMockContext = (): MockContext => {
  return {
    prisma: mockDeep<PrismaClient>(),
  }
}

// singleton.ts
// import { PrismaClient } from '@prisma/client'
// import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

// import { prisma } from './lib/prisma'

// jest.mock('./client', () => ({
//   __esModule: true,
//   default: mockDeep<PrismaClient>(),
// }))

// beforeEach(() => {
//   mockReset(prismaMock)
// })

// export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>
