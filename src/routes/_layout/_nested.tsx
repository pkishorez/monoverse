import { Button } from "@components/ui/button";
import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { Sun } from "lucide-react";
import { Logo } from "~/src/components";
import { useStore } from "../../store";

export const Route = createFileRoute("/_layout/_nested")({
  component: Layout,
});

function Layout() {
  const { toggleTheme } = useStore();
  return (
    <>
      <div className="flex items-center justify-between">
        <Link to="/">
          <Logo className="text-3xl font-bold" />
        </Link>
        <Button variant="ghost" onClick={toggleTheme}>
          <Sun />
        </Button>
      </div>
      <div className="mt-10">
        <Link to="/overview">
          {({ isActive }) => (
            <Button variant={isActive ? "default" : "secondary"}>
              Overview
            </Button>
          )}
        </Link>
        <Link to="/sync">
          {({ isActive }) => (
            <Button variant={isActive ? "default" : "secondary"}>Sync</Button>
          )}
        </Link>
      </div>
      <Outlet />
    </>
  );
}
