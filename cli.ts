/* eslint-disable import/no-named-as-default-member */
// eslint-disable-next-line import/no-internal-modules
import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { appRouter } from "./trpc";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(
  "/api",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  }),
);

app.use(express.static("dist"));
app.get("*", (_req, res) => {
  res.sendFile(resolve(__dirname, "dist/index.html"));
});

app.listen(21213, () => {
  console.log("Server listening... http://localhost:21213/");
});
