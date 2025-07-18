// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';

declare global {
   
  var prisma: PrismaClient | undefined;
}

// Inisialisasi Prisma Client dengan logging
const prisma = global.prisma || 
  new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'stdout',
        level: 'error',
      },
      {
        emit: 'stdout',
        level: 'info',
      },
      {
        emit: 'stdout',
        level: 'warn',
      },
    ],
  });

// Tambahkan event listeners untuk query logging
if (process.env.NODE_ENV !== 'production') {
  prisma.$on('query' as never, (e: Prisma.QueryEvent) => {
    console.log('Query: ' + e.query);
    console.log('Params: ' + e.params);
    console.log('Duration: ' + e.duration + 'ms');
  });
  
  console.log('Prisma Client initialized with logging enabled');
  global.prisma = prisma;
}

export default prisma;
