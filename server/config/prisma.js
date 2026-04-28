// const { PrismaClient } = require('@prisma/client');

// const prisma = new PrismaClient();

// module.exports = prisma;


const { PrismaClient } = require('@prisma/client');

// Use a global variable to store the PrismaClient instance.
// This prevents multiple instances from being created during development with hot-reloads,
// which can exhaust database connections.
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}

module.exports = prisma;
