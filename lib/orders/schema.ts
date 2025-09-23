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
  customer: z.object({
    prefer: z.enum(['whatsapp', 'email']),
    whatsappNumber: z.string().optional(),
    email: z.string().email().optional()
  }),
  notes: z.string().optional(),
  items: z.array(OrderItem),
  displayedSubtotal: z.number().nonnegative().default(0),
  proof: z
    .object({
      urls: z.array(z.string()).default([]),
      reference: z.string().optional(),
      submittedAt: z.number().optional()
    })
    .default({ urls: [] }),
  confirmedAt: z.number().optional(),
  rejectedAt: z.number().optional(),
  rejectReason: z.string().optional()
});

export type OrderItemInput = z.input<typeof OrderItem>;
export type OrderInput = z.input<typeof Order>;
export type OrderType = z.infer<typeof Order>;
