import { z } from "zod";

export const exportRequestSchema = z.object({
  assessmentId: z.string().uuid(),
});

export type ExportRequestBody = z.infer<typeof exportRequestSchema>;
