import { z } from "zod";
import { BaseSchema } from 'protolib/base'

export const BaseProductSchema = z.object({
  //name: z.string(),
  //lastModify: z.date(),
  //uploadedAt: z.date(),
  //uploadedBy: z.string(),
  page: z.string(),
  positionInPage: z.number(),
  //pdfName: z.string(),
  pdfPath: z.string(),
  data: z.any()
})

export const ProductSchema = z.object({
  ...BaseSchema.shape,
  ...BaseProductSchema.shape
});

export type ProductType = z.infer<typeof ProductSchema>;


