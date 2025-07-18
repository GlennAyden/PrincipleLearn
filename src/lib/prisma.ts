// src/lib/prisma.ts
let PrismaClient: any
let Prisma: any
let prisma: any
try {
  // Attempt to load the real Prisma client
  ;({ PrismaClient, Prisma } = require('@prisma/client'))
  prisma = global.prisma || new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'stdout', level: 'error' },
      { emit: 'stdout', level: 'info' },
      { emit: 'stdout', level: 'warn' },
    ],
  })
} catch (err) {
  // Fallback mock when the client has not been generated or cannot be used
  console.warn('Using mock PrismaClient because real client is unavailable')
  PrismaClient = class {
    $on() {}
    $use() {}
    async $connect() {}
    async $disconnect() {}
  }
  Prisma = { QueryEvent: class {} }
  prisma = new PrismaClient()
}

declare global {
<<<<<<< HEAD
   
  var prisma: PrismaClient | undefined;
=======
  // eslint-disable-next-line no-var
  var prisma: any
>>>>>>> 5caecbc5b9af3522dde0e40bc0eb53536170354d
}

// Use the Prisma instance initialised above

// Tambahkan event listeners untuk query logging
if (process.env.NODE_ENV !== 'production') {
  prisma.$on?.('query' as never, (e: any) => {
    console.log('Query: ' + e.query)
    console.log('Params: ' + e.params)
    console.log('Duration: ' + e.duration + 'ms')
  })

  console.log('Prisma Client initialized with logging enabled')
  global.prisma = prisma
}

export default prisma;
