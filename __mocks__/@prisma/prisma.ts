// __mocks__/@prisma/client.ts

import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

// Mocking Prisma client using jest-mock-extended for deep mocks
export const prisma = mockDeep<PrismaClient>();

// To export a typed mock, so that it's easier to work with in tests
export type MockPrismaClient = DeepMockProxy<PrismaClient>;
export default prisma;
