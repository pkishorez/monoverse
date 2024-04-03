import { z } from "zod";
import { getOverview, getSyncUpdates, syncVersions } from "./functionality";
import { publicProcedure, router } from "./setup";

export const appRouter = router({
  helloWorld: publicProcedure.query(async () => {
    return "Hello, World!";
  }),
  getOverview: publicProcedure
    .input(z.string().optional())
    .query(async ({ input: dirPath }) => {
      const result = getOverview(dirPath ?? process.cwd());

      return result;
    }),
  getSyncUpdates: publicProcedure
    .input(z.string())
    .query(async ({ input: dirPath }) => {
      const result = getSyncUpdates(dirPath);

      return result;
    }),

  syncDependencies: publicProcedure
    .input(
      z.object({
        dirPath: z.string(),
        updates: z.array(
          z.object({
            dependencyName: z.string(),
            versionRange: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ input }) => {
      const result = syncVersions(input.dirPath, input.updates);

      return result;
    }),
});

export type AppRouter = typeof appRouter;
