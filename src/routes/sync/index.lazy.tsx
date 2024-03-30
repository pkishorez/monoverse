import { createLazyFileRoute } from "@tanstack/react-router";
import { trpc } from "~/src/client";
import { DataTable, columns } from "./-components";

export const Route = createLazyFileRoute("/sync/")({
  component: Sync,
});

function Sync() {
  const { isLoading, error, data } = trpc.getSyncUpdates.useQuery(
    "/Users/kishorepolamarasetty/CAREER/NUMA/numa-web",
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="container grow px-0 py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
