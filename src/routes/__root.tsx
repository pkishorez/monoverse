import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Button } from "~/components/ui/button";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6">
        <div className="flex h-screen max-h-[1024px] w-full max-w-7xl flex-col p-3">
          <h1 className="text-3xl font-bold">monoverse</h1>
          <div className="mt-10">
            <Link to="/overview">
              {({ isActive }) => (
                <Button disabled={isActive} className="-ml-4" variant="link">
                  Overview
                </Button>
              )}
            </Link>
            <Link to="/sync">
              {({ isActive }) => (
                <Button disabled={isActive} variant="link">
                  Sync
                </Button>
              )}
            </Link>
          </div>
          <Outlet />
        </div>
      </div>
      <TanStackRouterDevtools />
    </>
  );
}
