import { createLazyFileRoute } from "@tanstack/react-router";
import { GroupingState } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useReward } from "react-rewards";
import { Badge } from "~/components/ui/badge";
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
      <Loaded data={data} />
    </div>
  );
}

const Loaded = ({
  data: data,
}: {
  data: Exclude<TrpcRouterOutputs["getSyncUpdates"], null>;
}) => {
  const { reward } = useReward("rewardId", "confetti", {
    spread: 360,
    elementCount: 200,
  });
  const utils = trpc.useUtils();
  const { isPending, mutate } = trpc.syncDependencies.useMutation({
    onSuccess() {
      utils.getSyncUpdates.invalidate(
        "/Users/kishorepolamarasetty/CAREER/NUMA/numa-web",
      );
    },
  });
  const syncErrors = useMemo(() => getOutofSyncDependencies(data), [data]);
  const filteredData = useMemo(
    () => syncErrors.flatMap((v) => v.dependencies),
    [syncErrors],
  );
  const [grouping, setGrouping] = useState<GroupingState>(["dependencyName"]);

  const [scheduledSyncFixes, setScheduledSyncFixes] = useState<
    Record<string, string>
  >({});

  const [selectedDependency, setSelectedDependency] = useState<
    string | undefined
  >();

  const fixSyncInfo = syncErrors.find(
    (v) => v.dependencyName === selectedDependency,
  );

  const scheduledFixCount = Object.keys(scheduledSyncFixes).length;

  return (
    <div className="flex h-min flex-col gap-4 overflow-auto">
      <div className="flex justify-between">
        <div>
          <Badge
            className={cn({})}
            variant={syncErrors.length > 1 ? "destructive" : "default"}
          >
            {syncErrors.length > 0 ? (
              <span>{syncErrors.length} sync errors.</span>
            ) : (
              <span>No sync errors 🚀.</span>
            )}
          </Badge>
        </div>
        <div>
          <Button
            variant={scheduledFixCount > 0 ? "default" : "outline" || isPending}
            disabled={scheduledFixCount === 0}
            className="relative flex items-center gap-2"
            onClick={() => {
              reward();
              setScheduledSyncFixes({});

              mutate({
                dirPath: "/Users/kishorepolamarasetty/CAREER/NUMA/numa-web",
                updates: Object.entries(scheduledSyncFixes).map(
                  ([dependencyName, versionRange]) => ({
                    dependencyName,
                    versionRange,
                  }),
                ),
              });
            }}
          >
            Fix Sync Errors
            {scheduledFixCount > 0 && (
              <Badge variant="secondary">{scheduledFixCount}</Badge>
            )}
            <span
              id="rewardId"
              onClick={reward}
              className="absolute left-1/2 top-1/2"
            />
          </Button>
        </div>
      </div>
      <div className="overflow-auto">
        <DataTable
          scheduledSyncFixes={scheduledSyncFixes}
          grouping={grouping}
          setGrouping={setGrouping}
          columns={columns}
          data={filteredData}
          onFixSync={setSelectedDependency}
        />
      </div>
      <Dialog
        open={!!fixSyncInfo}
        onOpenChange={(open) => !open && setSelectedDependency(undefined)}
      >
        <DialogOverlay className="bg-background/90" />
        <FixSyncDependency
          key={fixSyncInfo ? "true" : "false"}
          initialFixVersion={
            scheduledSyncFixes[fixSyncInfo?.dependencyName ?? ""]
          }
          fixSyncInfo={fixSyncInfo}
          onFix={(versionRange) => {
            if (!fixSyncInfo) {
              return;
            }
            if (versionRange) {
              scheduledSyncFixes[fixSyncInfo.dependencyName] = versionRange;
            } else {
              delete scheduledSyncFixes[fixSyncInfo.dependencyName];
            }

            setScheduledSyncFixes({ ...scheduledSyncFixes });
            setSelectedDependency(undefined);
          }}
        />
      </Dialog>
    </div>
  );
};
