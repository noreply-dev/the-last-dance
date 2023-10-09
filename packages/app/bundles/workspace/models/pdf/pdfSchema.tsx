import { z } from "zod";
import { BaseSchema } from 'protolib/base'

export const BasePdfSchema = z.object({
  name: z.string(),
  lastModify: z.date(),
  uploadedAt: z.date(),
  uploadedBy: z.string(),
  pages: z.array(z.string()),
})

export const PdfSchema = z.object({
  ...BaseSchema.shape,
  ...BasePdfSchema.shape
});

export type PdfType = z.infer<typeof PdfSchema>;


