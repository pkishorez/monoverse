"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { uniq } from "lodash-es";
import { Info } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { cn } from "~/components/utils";
import { TrpcRouterOutputs } from "~/trpc/client";

declare module "@tanstack/react-table" {
  // @ts-expect-error - To avoid error.
  interface TableMeta {
    onSyncFix: (depName: string) => void;
    scheduledSyncFixes: Record<string, string>;
  }
}

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Dependency = Exclude<
  TrpcRouterOutputs["getSyncUpdates"],
  null
>[number];

const columnHelper = createColumnHelper<Dependency>();

export const columns = [
  columnHelper.accessor("dependencyName", {
    header: () => <div>Dependency</div>,
    cell: (info) => (
      <div className="flex items-center gap-1">
        <Info
          size={16}
          className={cn({
            "opacity-100": info.row.original.isInternalDependency,
            "pointer-events-none opacity-0":
              !info.row.original.isInternalDependency,
          })}
        />
        <span>{info.getValue()}</span>
      </div>
    ),
    aggregationFn: "count",
  }),
  columnHelper.accessor("workspaceName", {
    header: () => <div>Workspace</div>,
    cell: (info) => info.getValue(),
    aggregationFn: "count",
  }),
  columnHelper.accessor("versionRange", {
    enableGrouping: false,
    header: () => <div>Version</div>,
    cell: (info) => <Badge variant="outline">{info.getValue()}</Badge>,

    aggregatedCell: ({ row, table }) => {
      const sameDep =
        uniq(row.subRows.map((v) => v.original.dependencyName)).length === 1;
      const sameVersion =
        uniq(row.subRows.map((v) => v.original.versionRange)).length === 1;

      if (!sameDep) {
        return "-";
      }
      if (sameDep && !sameVersion) {
        const scheduledFix =
          table.options.meta?.scheduledSyncFixes[row.original.dependencyName];

        return (
          <div className=" flex flex-nowrap items-center gap-2">
            <div className="text-nowrap">
              {scheduledFix ? "✅ Marked fix" : "⛔️ Mixed"}
            </div>
            <Button
              variant={scheduledFix ? "default" : "destructive"}
              className="h-auto py-1 opacity-0 transition-opacity group-hover:opacity-100"
              size="sm"
              onClick={() =>
                table.options.meta?.onSyncFix(row.original.dependencyName)
              }
            >
              {scheduledFix ? "update" : "fix"}
            </Button>
          </div>
        );
      }
    },
  }),
];
