'use server'

import { prisma } from '@/lib/prisma'
import { auth, clerkClient } from '@clerk/nextjs/server'

export const completeOnboarding = async (formData: FormData) => {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated) {
    return { message: 'No Logged In User' }
  }

  const client = await clerkClient()

  try {
    const res = await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
        organizationName: formData.get('organizationName'),
        purpose: formData.get('purpose'),
      },
    })

    const user = await prisma.user.findUnique({
        where: { id: userId },
    })
    if (!user) {
        await prisma.user.create({
            data: {
                id: userId,
                email: res.emailAddresses[0].emailAddress,
                name: res.fullName || null,
            },
        })

        await prisma.wallet.create({
            data: {
                userId: userId,
                balanceCredits: 100, // Initial balance
            },
        })
    } 
    
    return { message: res.publicMetadata }
  } catch (err) {
    return { error: 'There was an error updating the user metadata.' }
  }
}