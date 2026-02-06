const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// Log all properties that might be models (usually start with lowercase)
// But actually prisma client instance has model delegates as properties.
// Example: prisma.user, prisma.project
// We want to see if it is dMPMetadata or something else.
console.log('Keys starting with d/D:');
console.log(Object.keys(prisma).filter(k => k.toLowerCase().startsWith('d')));
