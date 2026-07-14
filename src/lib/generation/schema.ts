import { z } from "zod";

export const generateRequestSchema = z.object({
  assessmentId: z.string().uuid(),
  dryRun: z.boolean().optional().default(false),
});

export type GenerateRequestParsed = z.infer<typeof generateRequestSchema>;
