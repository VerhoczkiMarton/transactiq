'use server';

import { auth } from '@/auth';
import { Wallet } from '@prisma/client';
import { prisma } from '@/prisma';
import { revalidatePath } from 'next/cache';
import { redirect, unauthorized } from 'next/navigation';
import { CreateWalletInput, createWalletSchema } from '@/lib/zod-schemas';

type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; message: string; fieldErrors?: Record<string, string> };

export type SerializedWallet = {
  id: string;
  name: string;
  balance: number;
  currency: string;
  type: Wallet['type'];
  userId: string;
};

function serializeWallet(wallet: Wallet): SerializedWallet {
  return {
    ...wallet,
    balance: wallet.balance ? Number(wallet.balance) : 0,
  };
}

async function getCurrentUser() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  return session.user;
}

export async function getWallets() {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  const wallets = await prisma.wallet.findMany({
    where: { userId: user.id },
  });

  return wallets.map(serializeWallet);
}

export async function getWallet(id: string) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/signin');
  }

  const wallet = await prisma.wallet.findUnique({
    where: { id, userId: user.id },
  });

  if (!wallet) {
    return null;
  }

  return serializeWallet(wallet);
}

export async function createWallet(
  data: CreateWalletInput
): Promise<ActionResponse<SerializedWallet>> {
  const user = await getCurrentUser();

  if (!user?.id) {
    redirect('/auth/signin');
  }

  const validationResult = createWalletSchema.safeParse(data);

  if (!validationResult.success) {
    const errors = validationResult.error.flatten().fieldErrors;
    const fieldErrors: Record<string, string> = {};

    Object.entries(errors).forEach(([key, messages]) => {
      if (Array.isArray(messages) && messages.length > 0) {
        fieldErrors[key] = messages[0];
      }
    });

    return {
      success: false,
      message: 'Validation failed',
      fieldErrors,
    };
  }

  const userWallets = await prisma.wallet.findMany({
    where: { userId: user.id },
  });

  if (userWallets.length >= 10) {
    return {
      success: false,
      message: 'Failed to create wallet, maximum amount of wallets reached',
    };
  }

  try {
    const wallet = await prisma.wallet.create({
      data: {
        ...validationResult.data,
        userId: user.id,
      },
    });

    revalidatePath('/wallets');

    return {
      success: true,
      data: serializeWallet(wallet),
    };
  } catch (error) {
    console.error('Failed to create wallet:', error);

    return {
      success: false,
      message: 'Failed to create wallet',
    };
  }
}

export async function deleteWallet(walletId: string) {
  const user = await getCurrentUser();

  if (!user?.id) {
    redirect('/auth/signin');
  }

  const wallet = await prisma.wallet.findFirst({ where: { id: walletId } });

  if (user.id !== wallet?.userId) {
    unauthorized();
  }

  await prisma.wallet.delete({ where: { id: walletId } });
  revalidatePath('/wallets');
}
