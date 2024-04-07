import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout")({
  component: Layout,
});

function Layout() {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6">
      <div className="flex h-screen max-h-[1024px] w-full max-w-7xl flex-col p-3">
        <Outlet />
      </div>
    </div>
  );
}
