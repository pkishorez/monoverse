import { z } from "zod";

export const packageSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  repository: z.string().optional(),
  licence: z.string().optional(),

  versions: z.array(z.string()),
});
