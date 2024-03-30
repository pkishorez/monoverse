import { createLazyFileRoute } from "@tanstack/react-router";
import { trpc } from "../client";

export const Route = createLazyFileRoute("/overview")({
  component: Overview,
});

function Overview() {
  const { data, isLoading, isError } = trpc.getOverview.useQuery(
    "/Users/kishorepolamarasetty/CAREER/NUMA/numa-web",
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError || !data) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="mt-10 flex grow flex-wrap gap-4">
      {data.workspaces.map((workspace) => (
        <div key={workspace.name} className="w-64 overflow-hidden">
          <div className="text-lg font-bold">{workspace.name}</div>
          <div className="">Dependencies {workspace.dependencies.length}</div>
        </div>
      ))}
    </div>
  );
}
