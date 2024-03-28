import { publicProcedure, router } from "./setup";

export const appRouter = router({
  userList: publicProcedure.query(async () => {
    return ["Kishore"];
  }),
});

export type AppRouter = typeof appRouter;
