// eslint-disable-next-line import/no-internal-modules
import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import { appRouter } from "../trpc";

const app = express();

app.use(
  "/api",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  }),
);

export default app;
