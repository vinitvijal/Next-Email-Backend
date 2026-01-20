'use server'
import { prisma } from '@/lib/prisma'
import { auth, clerkClient } from '@clerk/nextjs/server'

export async function getDashboardData() {
  const { isAuthenticated, userId } = await auth()
    if (!isAuthenticated) {
        return null
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
    })
    const wallet = await prisma.wallet.findUnique({
        where: { userId: userId },
    })
    const apiKeys = await prisma.apiKey.findMany({
        where: { userId: userId },
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

    return {
        user,
        wallet,
        apiKeys,
        emails,
    }
}