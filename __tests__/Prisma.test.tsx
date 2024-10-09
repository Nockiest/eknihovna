import { testBook } from '@/data/values'
import { prismaMock } from '../singleton'
import { createBook } from '@/app/api/prismaHanlder'


test('should create new user ', async () => {

    prismaMock.knihy.create.mockResolvedValue(testBook)

    await expect(createBook(testBook)).resolves.toEqual(testBook)
  })

//   test('should update a users name ', async () => {
//     const user = {
//       id: 1,
//       name: 'Rich Haines',
//       email: 'hello@prisma.io',
//       acceptTermsAndConditions: true,
//     }

//     // prismaMock.knihy.update.mockResolvedValue(user)


//   })