import { createLazyFileRoute } from "@tanstack/react-router";
import { GroupingState } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogOverlay } from "~/components/ui/dialog";
import { cn } from "~/components/utils";
import { TrpcRouterOutputs, trpc } from "~/src/client";
import {
  DataTable,
  FixSyncDependency,
  columns,
  getOutofSyncDependencies,
} from "./-components";

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
      <Loaded initialData={data} />
    </div>
  );
}

const Loaded = ({
  initialData,
}: {
  initialData: Exclude<TrpcRouterOutputs["getSyncUpdates"], null>;
}) => {
  const [data, setData] = useState(initialData);
  const [grouping, setGrouping] = useState<GroupingState>(["dependencyName"]);

  const syncErrors = useMemo(() => getOutofSyncDependencies(data), [data]);

  const [fixSyncDependency, setFixSyncDependency] = useState<
    string | undefined
  >("typescript");

  const fixSyncInfo = syncErrors.find(
    (v) => v.dependencyName === fixSyncDependency,
  );

  return (
    <div className="flex h-min flex-col gap-4 overflow-auto">
      <div className="flex">
        <Button
          className={cn({})}
          variant={syncErrors.length > 1 ? "destructive" : "outline"}
          onClick={() => setData(syncErrors.flatMap((v) => v.dependencies))}
        >
          Sync Errors {syncErrors.length}
        </Button>
      </div>
      <div className="overflow-auto">
        <DataTable
          grouping={grouping}
          setGrouping={setGrouping}
          columns={columns}
          data={data}
          onFixSync={setFixSyncDependency}
        />
      </div>
      <Dialog
        open={!!fixSyncInfo}
        onOpenChange={(open) => !open && setFixSyncDependency(undefined)}
      >
        <DialogOverlay className="bg-background/90" />
        <FixSyncDependency
          key={fixSyncInfo ? "true" : "false"}
          fixSyncInfo={fixSyncInfo}
        />
      </Dialog>
    </div>
  );
};
