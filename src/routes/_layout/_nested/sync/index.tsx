import { createFileRoute, redirect } from "@tanstack/react-router";
import { useReward } from "react-rewards";

import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Dialog, DialogOverlay } from "@components/ui/dialog";
import { cn } from "@components/utils";
import { GroupingState } from "@tanstack/react-table";
import { Info } from "lucide-react";
import { useMemo, useState } from "react";
import invariant from "tiny-invariant";
import { Loading } from "~/src/components";
import { ENV } from "~/src/env";
import { store, useStore } from "~/src/store";
import { TrpcRouterOutputs, trpc } from "~/trpc/client";
import {
  DataTable,
  FixSyncDependency,
  columns,
  getOutofSyncDependencies,
} from "./-components";

export const Route = createFileRoute("/_layout/_nested/sync/")({
  component: Sync,
  beforeLoad: () => {
    if (!store.getState().projects.selected) {
      throw redirect({
        to: "/",
      });
    }
  },
});

function Sync() {
  const selectedProject = useStore((s) => s.projects.selected);
  invariant(!!selectedProject, "selectedProject should be defined");

  const { isLoading, error, data } = trpc.getSyncUpdates.useQuery(
    selectedProject,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );

  if (isLoading) {
    return (
      <div className="mt-10">
        <Loading />
      </div>
    );
  }

  if (error || !data) {
    return <div>Error loading data</div>;
  }

  const syncResult = data.result;
  if (!syncResult) {
    return <div>No sync results found.</div>;
  }

  return (
    <div className="container grow px-0 py-10">
      <Loaded data={syncResult} />
    </div>
  );
}

const Loaded = ({
  data: data,
}: {
  data: Exclude<
    Extract<TrpcRouterOutputs["getSyncUpdates"], { success: true }>["result"],
    null
  >;
}) => {
  const { reward } = useReward("rewardId", "confetti", {
    spread: 360,
    elementCount: 200,
  });
  const utils = trpc.useUtils();
  const selectedProject = useStore((s) => s.projects.selected);
  invariant(!!selectedProject, "selectedProject should be defined");

  const { isPending, mutate } = trpc.syncDependencies.useMutation({
    onSuccess() {
      utils.getSyncUpdates.invalidate(selectedProject);
    },
  });
  const syncErrors = useMemo(() => getOutofSyncDependencies(data), [data]);
  const filteredData = useMemo(
    () => syncErrors.flatMap((v) => v.dependencies),
    [syncErrors]
  );
  const [grouping, setGrouping] = useState<GroupingState>(["dependencyName"]);

  const [scheduledSyncFixes, setScheduledSyncFixes] = useState<
    Record<string, string>
  >({});

  const [selectedDependency, setSelectedDependency] = useState<
    string | undefined
  >();

  const fixSyncInfo = syncErrors.find(
    (v) => v.dependencyName === selectedDependency
  );

  const scheduledFixCount = Object.keys(scheduledSyncFixes).length;

  const headerSection = useMemo(() => {
    return (
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
        <div className="flex flex-col items-end">
          <Button
            variant={scheduledFixCount > 0 ? "default" : "outline" || isPending}
            disabled={scheduledFixCount === 0 || ENV.PROJECT_MODE === "online"}
            className="relative flex items-center gap-2"
            onClick={() => {
              reward();
              setScheduledSyncFixes({});

              const selectedProject = store.getState().projects.selected;
              if (!selectedProject) {
                return;
              }

              mutate({
                dirPath: selectedProject.value,
                updates: Object.entries(scheduledSyncFixes).map(
                  ([dependencyName, versionRange]) => ({
                    dependencyName,
                    versionRange,
                  })
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
          {ENV.PROJECT_MODE === "online" && (
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
              <Info size={12} />
              <span>Applying sync is only available on offline mode.</span>
            </div>
          )}
        </div>
      </div>
    );
  }, [
    isPending,
    mutate,
    reward,
    scheduledFixCount,
    scheduledSyncFixes,
    syncErrors.length,
  ]);

  if (filteredData.length === 0) {
    return (
      <div>
        {headerSection}
        <h1 className="mt-8 text-center text-4xl text-foreground opacity-30">
          No dependency sync issues found 🙌🏻
        </h1>
      </div>
    );
  }

  return (
    <div className="flex h-min flex-col gap-4 overflow-auto">
      {headerSection}
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
