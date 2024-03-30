import { z } from "zod";
import { getOverview, getSyncUpdates } from "./functionality";
import { publicProcedure, router } from "./setup";

export const appRouter = router({
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
});

export type AppRouter = typeof appRouter;
