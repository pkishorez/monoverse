import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useEffect } from "react";
import { ENV } from "../env.ts";
import { useStore } from "../store/index.ts";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { theme } = useStore();

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <>
      <Outlet />
      {ENV.IS_DEV && <TanStackRouterDevtools />}
    </>
  );
}
