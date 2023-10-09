import { z } from "zod";
import { BaseSchema } from 'protolib/base'

export const BasePageSchema = z.object({
  name: z.string(),
  lastModify: z.date(),
  uploadedAt: z.date(),
  uploadedBy: z.string(),
  pdfId: z.array(z.string()),
  productsIds:z.array(z.string())
})

export const PageSchema = z.object({
  ...BaseSchema.shape,
  ...BasePageSchema.shape
});

export type PageType = z.infer<typeof PageSchema>;

