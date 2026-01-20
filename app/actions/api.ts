'use server';
import crypto from "crypto";
import { prisma } from '@/lib/prisma'


async function generateHashedKey(apiKey: string) {
    return crypto.createHash('sha256').update(apiKey).digest('hex');
}

export async function getApiData(apiKey: string){
    const hashedKey = await generateHashedKey(apiKey);
    console.log(hashedKey)
    const data = await prisma.apiKey.findUnique({
        where: { key: hashedKey, status: 'ACTIVE' },
        include: {
            user: {
                include: {
                    wallet: true,
                },
            }
        },
    })
    return data;
}