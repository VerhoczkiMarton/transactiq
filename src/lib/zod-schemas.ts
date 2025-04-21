import { z } from 'zod';

// ==== Wallet ====

export const WalletTypeSchema = z.enum(['MANUAL', 'SYNCHRONIZED']);
export type WalletType = z.infer<typeof WalletTypeSchema>;

const baseWalletSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(30, 'Name cannot be longer than 30 characters'),
  balance: z.coerce.number().nonnegative('Balance must be a positive number'),
  currency: z.string().length(3, 'Currency must be a 3-letter code'),
  type: WalletTypeSchema,
});

export const createWalletSchema = baseWalletSchema;
export type CreateWalletInput = z.infer<typeof createWalletSchema>;

export const updateWalletSchema = baseWalletSchema.partial().extend({
  id: z.string().uuid('Invalid wallet ID'),
});
export type UpdateWalletInput = z.infer<typeof updateWalletSchema>;

export const getWalletSchema = z.object({
  id: z.string().uuid('Invalid wallet ID'),
});
export type GetWalletInput = z.infer<typeof getWalletSchema>;

export const deleteWalletSchema = z.object({
  id: z.string().uuid('Invalid wallet ID'),
});
export type DeleteWalletInput = z.infer<typeof deleteWalletSchema>;
