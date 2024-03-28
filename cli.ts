// eslint-disable-next-line import/no-internal-modules
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc";
import express from "express";

const app = express();

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  })
);

app.listen(4000);
