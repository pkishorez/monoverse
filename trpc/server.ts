import { z } from "zod";
import { downloadGitRepo } from "~/domain/index.ts";
import {
  getOverview,
  getSyncUpdates,
  syncVersions,
} from "./functionality/index.ts";
import { publicProcedure, router } from "./setup.ts";

export const appRouter = router({
  helloWorld: publicProcedure.query(async () => {
    return "Hello, World!";
  }),
  getOverview: publicProcedure
    .input(
      z.object({
        type: z.union([z.literal("filepath"), z.literal("url")]),
        value: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { type, value } = input;

      if (type === "filepath") {
        const dirPath = value;

        const result = getOverview(dirPath);
        return {
          success: true as const,
          result,
        };
      } else {
        const { projectDir, cleanupDir } = await downloadGitRepo(value);
        const result = getOverview(projectDir);

        await cleanupDir();

        return {
          success: true as const,
          result,
        };
      }
    }),
  getSyncUpdates: publicProcedure
    .input(
      z.object({
        type: z.union([z.literal("filepath"), z.literal("url")]),
        value: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { type, value } = input;

      if (type === "filepath") {
        const dirPath = value;

        const result = getSyncUpdates(dirPath);
        return {
          success: true as const,
          result,
        };
      } else {
        const { projectDir, cleanupDir } = await downloadGitRepo(value);
        const result = getSyncUpdates(projectDir);

        await cleanupDir();

        return {
          success: true as const,
          result,
        };
      }
    }),

  syncDependencies: publicProcedure
    .input(
      z.object({
        dirPath: z.string(),
        updates: z.array(
          z.object({
            dependencyName: z.string(),
            versionRange: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const result = syncVersions(input.dirPath, input.updates);

      return result;
    }),
});

export type AppRouter = typeof appRouter;
