// // import { PrismaClient } from '@prisma/client';
// // // import { getUserById } from './userService'; // Example service function

// // const prisma = new PrismaClient();
// // // class UserService {
// // //   constructor(private prisma: PrismaClient) {}

// //   const  getBooksById = async  function (id: number) {
// //     const stringid = id.toString();
// //     return prisma.knihy.findUnique({ where: { id: stringid} });
// //   }
// // // }
// import { MockContext, createMockContext, Context } from '@/__mocks__/@prisma/prismaContext';
// import { testBook } from '@/data/values';
// import { Book } from '@/types/types';
// export async function updateBook(kniha: Book , ctx: Context) {
//   return await ctx.prisma.knihy.update({
//     where: { id: kniha.id },
//     data: kniha,
//   })
// }
// let mockCtx: MockContext
// let ctx: Context

// beforeEach(() => {
//   mockCtx = createMockContext()
//   ctx = mockCtx as unknown as Context
// })
// describe('updateBook', () => {
//   it('should update the book with the given data', async () => {
//     // Arrange
//     const updatedBook = { ...testBook }; // Assuming testBook is your mock data
//     mockCtx.prisma.knihy.update.mockResolvedValue(updatedBook);

//     // Act
//     const result = await updateBook(testBook, ctx);

//     // Assert
//     expect(mockCtx.prisma.knihy.update).toHaveBeenCalledWith({
//       where: { id: testBook.id },
//       data: testBook,
//     });
//     expect(result).toEqual(updatedBook);
//   });
// });