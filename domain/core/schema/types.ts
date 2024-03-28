import { z } from "zod";
import { monorepoSchema, workspaceSchema } from "./schema.js";

export type Workspace = z.infer<typeof workspaceSchema>;
export type Monorepo = z.infer<typeof monorepoSchema>;
