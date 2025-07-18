/**
 * Initialize the Prisma client.
 *
 * Uses `NEON_DATABASE_URL` when set (e.g. on Neon or Netlify) and falls back to
 * `DATABASE_URL` or a local PostgreSQL instance. When the generated client is
 * unavailable, a simple mock is provided so that Next.js builds do not fail.
 */
let PrismaClient: any
let Prisma: any
let prisma: any
const connectionUrl =
  process.env.NEON_DATABASE_URL ||
  process.env.DATABASE_URL ||
  'postgresql://localhost:5432/principle_learn'
try {
  // Attempt to load the real Prisma client
  ;({ PrismaClient, Prisma } = require('@prisma/client'))
  prisma =
    global.prisma ||
    new PrismaClient({
      datasources: { db: { url: connectionUrl } },
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
  prisma = new PrismaClient({ datasources: { db: { url: connectionUrl } } })
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: any
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

export { Prisma };
export default prisma;
