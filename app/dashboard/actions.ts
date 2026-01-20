'use server'
import { prisma } from '@/lib/prisma'
import { auth, clerkClient } from '@clerk/nextjs/server'
import crypto from "crypto";


export async function getDashboardData() {
  const { isAuthenticated, userId } = await auth()
    if (!isAuthenticated) {
        return null
    }

    const wallet = await prisma.wallet.findUnique({
        where: { userId: userId },
    })
    const apiKeys = await prisma.apiKey.findMany({
        where: { userId: userId, status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' },
        omit: {
            key: true,
        }
    })
    const emails = await prisma.emails.findMany({
        where: { userId: userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
    })

    const getTotalEmailsSent = await prisma.emails.groupBy({
        by: 'status',
        _count: { status: true },
        where: { userId: userId },
    })

    console.log(getTotalEmailsSent)
    let total = 0;
    let sent = 0;
    let failed = 0;

    getTotalEmailsSent.forEach((item) => {
        total += item._count.status;
        if (item.status === 'SENT') {
            sent = item._count.status;
        } else if (item.status === 'FAILED') {
            failed = item._count.status;
        }
    });

    return {
        wallet,
        apiKeys,
        emails,
        totalEmailsSent: {
            total,
            sent,
            failed,
        }
    }
}


export async function revokeApiKey(apiKeyId: string) {
    const { isAuthenticated, userId } = await auth()
    if (!isAuthenticated) {
        return { error: 'No Logged In User' }
    }
    await prisma.apiKey.updateMany({
        where: { id: apiKeyId, userId: userId },
        data: { status: 'REVOKED' },
    })
    return { message: 'API Key Revoked' }
}


export async function createApiKey(){
    const { isAuthenticated, userId } = await auth()
    if (!isAuthenticated) {
        return { error: 'No Logged In User' }
    }


    const randomBytes = crypto.randomBytes(32).toString("hex");

    const apiKey = `qode_${randomBytes}`;

    const label = `qode_********${apiKey.slice(-4)}`;

    const hashedKey = crypto
        .createHash("sha256")
        .update(apiKey)
        .digest("hex");

    const newKey = await prisma.apiKey.create({
        data: {
            userId: userId,
            key: hashedKey,
            label: label,
        },
        omit: {
            key: true,
        }
    });
    return { apiKey: apiKey, message: 'API Key Created', keyDetails: newKey }
}


