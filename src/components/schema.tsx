import { z } from 'zod';

const regex = /^[^0-9]+$/;

export const pizzaSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(40)
    .refine((value) => regex.test(value), 'The name can only consist of letters.'),
  preparation_time: z.string().min(1).max(9),
  type: z.literal('pizza'),
  no_of_slices: z.number().int().min(2).max(20),
  diameter: z.number().multipleOf(0.01).min(10).max(90),
});

export const soupSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(40)
    .refine((value) => regex.test(value), 'The name can only consist of letters.'),
  preparation_time: z.string().min(1).max(9),
  type: z.literal('soup'),
  spiciness_scale: z.number().int().min(1).max(10),
});

export const sandwichSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(40)
    .refine((value) => regex.test(value), 'The name can only consist of letters.'),
  preparation_time: z.string().min(1).max(9),
  type: z.literal('sandwich'),
  slices_of_bread: z.number().int().min(1).max(20),
});

export const FormSchema = z.discriminatedUnion('type', [pizzaSchema, soupSchema, sandwichSchema]);

export type FormSchemaType = z.infer<typeof FormSchema>;
