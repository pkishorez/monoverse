import { createLazyFileRoute } from "@tanstack/react-router";
import { GroupingState } from "@tanstack/react-table";
import { uniq } from "lodash-es";
import { useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogOverlay,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/components/utils";
import { TrpcRouterOutputs, trpc } from "~/src/client";
import { DataTable, columns, getOutofSyncDependencies } from "./-components";

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

const FixSyncDependency = ({
  fixSyncInfo,
}: {
  fixSyncInfo?: ReturnType<typeof getOutofSyncDependencies>[0];
}) => {
  const [fix, setFix] = useState<string>();
  if (!fixSyncInfo) {
    return null;
  }
  return (
    <>
      <DialogContent className="p-0">
        <div className="p-8">
          <h2 className="text-xl font-bold">{fixSyncInfo.dependencyName}</h2>

          <ScrollArea className="max-h-[calc(320px)] overflow-auto">
            <Table className="relative -mx-4 mt-4">
              <TableHeader className="sticky top-0">
                <TableRow>
                  <TableHead>Workspace</TableHead>
                  <TableHead>Version</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fixSyncInfo.dependencies.map((v) => (
                  <TableRow key={v.workspaceName}>
                    <TableCell>{v.workspaceName}</TableCell>
                    <TableCell>
                      {fix && fix !== v.versionRange ? (
                        <div className="flex gap-2">
                          <span className="line-through opacity-60">
                            {v.versionRange}
                          </span>
                          <span className="text-primary">{fix}</span>
                        </div>
                      ) : (
                        v.versionRange
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
          <div className="my-6">
            <h2 className="text-lg font-bold">Fix with below version</h2>
            <div className="mt-4 flex flex-wrap gap-4">
              {uniq(fixSyncInfo.dependencies.map((v) => v.versionRange)).map(
                (v) => (
                  <Button
                    variant="secondary"
                    disabled={fix === v}
                    key={v}
                    onClick={() => setFix(v)}
                  >
                    {v}
                  </Button>
                ),
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" disabled={!fix}>
              Mark Changes
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </>
  );
};
