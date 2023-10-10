import { z } from "zod";
import { BaseSchema } from 'protolib/base'

export const BaseProductSchema = z.object({
  name: z.string(),
  lastModify: z.date(),
  uploadedAt: z.date(),
  uploadedBy: z.string(),
  pagesIds: z.array(z.string()),
})

export const ProductSchema = z.object({
  ...BaseSchema.shape,
  ...BaseProductSchema.shape
});

export type ProductType = z.infer<typeof ProductSchema>;


