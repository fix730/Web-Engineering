// src/config/prisma.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Optional: Teste die Verbindung beim Start (nicht unbedingt nötig mit Prisma Client)
interface PrismaConnectSuccess {
    (): void;
}

interface PrismaConnectError {
    (e: Error): void;
}

prisma.$connect()
    .then((() => {
        console.log('Erfolgreich mit der MySQL-Datenbank über Prisma verbunden.');
    }) as PrismaConnectSuccess)
    .catch(((e: Error) => {
        console.error('Fehler beim Verbinden mit der Prisma-Datenbank:', e);
    }) as PrismaConnectError);


export default prisma;
