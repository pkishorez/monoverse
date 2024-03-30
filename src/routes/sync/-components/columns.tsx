"use client";

import { ColumnDef } from "@tanstack/react-table";
import { take } from "lodash-es";
import invariant from "tiny-invariant";
import { z } from "zod";
import { Badge } from "~/components/ui/badge";
import { TrpcRouterOutputs } from "~/src/client";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Dependency = Exclude<
  TrpcRouterOutputs["getSyncUpdates"],
  null
>[number];

export const columns: ColumnDef<Dependency>[] = [
  {
    accessorKey: "name",
    header: () => <div>Dependency Name</div>,
    cell: ({ row }) => {
      return <div>{row.getValue("name")}</div>;
    },
  },
  {
    id: "workspaces",
    accessorFn: ({ workspaces }) =>
      workspaces.map((workspace) => workspace.name),
    header: () => <div>Workspaces</div>,
    cell: ({ row }) => {
      const workspaces = z
        .array(z.string())
        .safeParse(row.getValue("workspaces"));

      invariant(workspaces.success, "workspaces should be an array of strings");

      return (
        <div>
          {take(workspaces.data, 3).map((name) => (
            <Badge key={name}>{name}</Badge>
          ))}
          {workspaces.data.length > 3 && (
            <Badge>+{workspaces.data.length - 3}</Badge>
          )}
        </div>
      );
    },
  },
];
