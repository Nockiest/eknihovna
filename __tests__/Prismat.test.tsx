import {prisma} from '../lib/prisma'
import { prismaMock } from '../singleton'
import { testBook } from '@/data/values'
import { Book } from '@/types/types'
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

let mockCtx: MockContext
let ctx: Context

beforeEach(() => {
  mockCtx = createMockContext()
  ctx = mockCtx
})

export async function createBook(book:Book,ctx:Context ) {
      return await ctx.prisma.knihy.create({
        data: book,
      })

  }


test('should create new book', async () => {
  mockCtx.prisma.knihy.create.mockResolvedValue(testBook,  )
  console.log("does it work")
  await expect(createBook(testBook,mockCtx)).resolves.toEqual(testBook)
})

// test('should update a users name ', async () => {
//   const user = {
//     id: 1,
//     name: 'Rich Haines',
//     email: 'hello@prisma.io',
//     acceptTermsAndConditions: true,
//   }

//   prismaMock.user.update.mockResolvedValue(user)

//   await expect(updateUsername(user)).resolves.toEqual({
//     id: 1,
//     name: 'Rich Haines',
//     email: 'hello@prisma.io',
//     acceptTermsAndConditions: true,
//   })
// })

// test('should fail if user does not accept terms', async () => {
//   const user = {
//     id: 1,
//     name: 'Rich Haines',
//     email: 'hello@prisma.io',
//     acceptTermsAndConditions: false,
//   }

//   prismaMock.user.create.mockImplementation()

//   await expect(createUser(user)).resolves.toEqual(
//     new Error('User must accept terms!')
//   )
// })