import { createTRPCReact } from "@trpc/react-query";
import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/trpc";

export const trpc = createTRPCReact<AppRouter>({});

export type TrpcRouterOutputs = inferRouterOutputs<AppRouter>;
