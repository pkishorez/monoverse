import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="mt-10">
      <h3>Welcome to monoverse!</h3>
    </div>
  );
}
