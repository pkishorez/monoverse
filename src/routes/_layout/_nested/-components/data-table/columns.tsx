"use client";

import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { cn } from "@components/utils";
import { createColumnHelper } from "@tanstack/react-table";
import { uniq } from "lodash-es";
import { Info } from "lucide-react";
import { TrpcRouterOutputs } from "~/trpc/client";

export interface TableProps {
  props:
    | {
        type: "dependencySync";
        onSyncFix: (depName: string, versionRange?: string) => void;
        scheduledSyncFixes: Record<string, string>;
      }
    | {
        type: "dependencyUpdates";
      };
}

declare module "@tanstack/react-table" {
  // @ts-expect-error - To avoid error.
  interface TableMeta extends TableProps {}
}

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Dependency = Exclude<
  TrpcRouterOutputs["getSyncUpdates"]["result"],
  null
>["outOfSyncDependencies"][number];

const columnHelper = createColumnHelper<Dependency>();

export const columns = [
  columnHelper.accessor("dependencyName", {
    header: () => <div>Dependency</div>,
    cell: (info) => {
      const isInternalDependency = info.row.original.isInternalDependency;
      return (
        <div
          className="flex items-center gap-1"
          title={
            isInternalDependency
              ? "This is a workspace within the monorepo."
              : undefined
          }
        >
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
      );
    },
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
      const meta = table.options.meta;

      if (meta?.props?.type === "dependencySync") {
        const sameDep =
          uniq(row.subRows.map((v) => v.original.dependencyName)).length === 1;
        const versionRanges = uniq(
          row.subRows.map((v) => v.original.versionRange)
        );

        // Grouped other than the dependency.
        if (!sameDep) {
          return "-";
        }
        if (sameDep && versionRanges.length > 1) {
          const scheduledFix =
            meta.props.scheduledSyncFixes?.[row.original.dependencyName];

          return (
            <div className=" flex flex-nowrap items-center gap-2">
              <div className="flex gap-x-2">
                {versionRanges.map((v) => (
                  <Button
                    variant={scheduledFix === v ? "default" : "ghost"}
                    key={v}
                    size="sm"
                    onClick={() => {
                      if (meta?.props?.type === "dependencySync") {
                        meta.props.onSyncFix?.(
                          row.original.dependencyName,
                          scheduledFix === v ? undefined : v
                        );
                      }
                    }}
                  >
                    {v}
                  </Button>
                ))}
              </div>
            </div>
          );
        }
      } else {
        return null;
      }
    },
  }),
];
