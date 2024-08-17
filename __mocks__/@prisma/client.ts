const mockPrismaClient = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
    },
  };

  export const PrismaClient = jest.fn(() => mockPrismaClient);
