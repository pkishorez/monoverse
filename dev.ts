// eslint-disable-next-line import/no-internal-modules
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(
  "/api",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  }),
);

app.listen(21212, () => {
  console.log("Server listening... http://localhost:21212/");
});
