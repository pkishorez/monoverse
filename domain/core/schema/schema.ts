import { z } from "zod";

export const dependencySchema = z.object({
  name: z.string(),
  versionRange: z.string(),
  type: z.enum([
    "dependency",
    "devDependency",
    "peerDependency",
    "optionalDependency",
  ]),
});

export const workspaceSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  dependencies: z.array(dependencySchema),
});

export const monorepoSchema = z.object({
  workspaces: z.array(workspaceSchema),
});

const dependencyRecordSchema = z.record(z.string());

export const packageJsonSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  version: z.string().optional(),

  // Dependencies
  dependencies: dependencyRecordSchema.optional(),
  devDependencies: dependencyRecordSchema.optional(),
  peerDependencies: dependencyRecordSchema.optional(),
  optionalDependencies: dependencyRecordSchema.optional(),
});
