require('dotenv').config();

// Novas importações obrigatórias no Prisma V7
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

// 1. Pega a URL de conexão do seu arquivo .env
const connectionString = process.env.DATABASE_URL;

// 2. Cria a conexão "raiz" usando a biblioteca oficial do PostgreSQL
const pool = new Pool({ connectionString });

// 3. Passa essa conexão para o Adaptador do Prisma
const adapter = new PrismaPg(pool);

// 4. Inicializa o Prisma Client passando apenas o adaptador!
const prisma = new PrismaClient({ adapter });

module.exports = prisma;