"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { uniq } from "lodash-es";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { TrpcRouterOutputs } from "~/src/client";

declare module "@tanstack/react-table" {
  // @ts-expect-error - To avoid error.
  interface TableMeta {
    onSyncFix: (depName: string) => void;
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
        return (
          <div className="flex flex-nowrap items-center gap-2">
            <div className="text-nowrap">⛔️ Mixed</div>
            <Button
              variant="destructive"
              className="h-auto py-1"
              size="sm"
              onClick={() =>
                table.options.meta?.onSyncFix(row.original.dependencyName)
              }
            >
              FIX
            </Button>
          </div>
        );
      }
    },
  }),
];
