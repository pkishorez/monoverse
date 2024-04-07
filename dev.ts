/* eslint-disable import/no-internal-modules */
// eslint-disable-next-line import/no-internal-modules
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";
import { appRouter } from "./trpc";

const app = express();

app.use(cors());
app.use(
  "/api",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  }),
);

const port = 21212;

app.listen(port, () => {
  console.log(`Server listening... http://localhost:${port}/`);
});
