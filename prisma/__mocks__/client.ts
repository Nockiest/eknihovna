// prisma/__mocks__/client.ts
const prismaMock = {
    knihy: {
      findUnique: jest.fn(),
    },
  };

  export const PrismaClient = jest.fn(() => prismaMock);
