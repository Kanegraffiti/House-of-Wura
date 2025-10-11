import { z } from 'zod';

export const OrderItem = z.object({
  id: z.string(),
  sku: z.string(),
  title: z.string(),
  priceFrom: z.number().optional(),
  image: z.string().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  qty: z.number().int().positive()
});

export const Order = z.object({
  orderId: z.string(),
  createdAt: z.number(),
  status: z.enum(['PENDING', 'PROOF_SUBMITTED', 'CONFIRMED', 'REJECTED']),
  items: z.array(OrderItem),
  email: z.string().email().nullable().optional(),
  whatsapp: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  subtotal: z.number().nonnegative().default(0),
  proofs: z
    .array(
      z.object({
        url: z.string(),
        uploadedAt: z.number()
      })
    )
    .optional(),
  confirmedAt: z.number().optional(),
  rejectedAt: z.number().optional(),
  rejectReason: z.string().optional()
});

export type OrderItemInput = z.input<typeof OrderItem>;
export type OrderInput = z.input<typeof Order>;
export type OrderType = z.infer<typeof Order>;
