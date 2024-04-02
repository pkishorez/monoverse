import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Sun } from "lucide-react";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { useStore } from "../store";

export const Route = createRootRoute({
  component: RootComponent,
  beforeLoad(opts) {
    console.log(opts.location.pathname);
  },
});

function RootComponent() {
  const { theme, toggleTheme } = useStore();

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <>
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6">
        <div className="flex h-screen max-h-[1024px] w-full max-w-7xl flex-col p-3">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">monoverse</h1>
            <Button variant="ghost" onClick={toggleTheme}>
              <Sun />
            </Button>
          </div>
          <div className="mt-10">
            <Link to="/overview">
              {({ isActive }) => (
                <Button disabled={isActive} className="-ml-4" variant="ghost">
                  Overview
                </Button>
              )}
            </Link>
            <Link to="/sync">
              {({ isActive }) => (
                <Button disabled={isActive} variant="ghost">
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
