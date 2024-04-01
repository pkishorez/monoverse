"use client";

import {
  ColumnDef,
  GroupingState,
  OnChangeFn,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/components/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onFixSync: (depName: string) => void;
  grouping: GroupingState;
  setGrouping: OnChangeFn<GroupingState>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onFixSync,
  grouping,
  setGrouping,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    state: {
      grouping,
    },
    columnResizeMode: "onEnd",
    columnResizeDirection: "ltr",
    enableColumnResizing: true,
    onGroupingChange: setGrouping,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),

    meta: {
      onSyncFix: onFixSync,
    },
  });

  return (
    <div className="rounded-md border">
      <Table className="lg:table-fixed">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => {
                const headerCls = cn("min-w-[140px]");
                if (header.isPlaceholder) {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn("h-auto p-0", headerCls)}
                    />
                  );
                }
                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "h-auto p-0 text-nowrap whitespace-nowrap",
                      headerCls,
                    )}
                  >
                    {
                      <div
                        className={cn(
                          "flex items-center gap-3 bg-secondary pl-4 text-secondary-foreground",
                        )}
                      >
                        <button
                          className={cn("py-2", {
                            "font-bold": header.column.getIsGrouped(),
                            "cursor-default":
                              !header.column.getCanGroup() ||
                              header.column.getIsGrouped(),
                            "hover:opacity-80":
                              header.column.getCanGroup() &&
                              !header.column.getIsGrouped(),
                          })}
                          onClick={() => {
                            if (header.column.getCanGroup()) {
                              table.setGrouping([]);
                              header.column.toggleGrouping();
                            }
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </button>
                        <div className="grow" />
                      </div>
                    }
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="select-none hover:bg-transparent"
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => {
                  if (cell.getIsPlaceholder()) {
                    return <TableCell key={cell.id} />;
                  }
                  return (
                    <TableCell
                      className={cn("py-2", {
                        "bg-accent cursor-pointer hover:text-opacity-50 overflow-hidden text-ellipsis":
                          cell.getIsGrouped(),
                      })}
                      onClick={() => {
                        if (cell.getIsGrouped()) {
                          row.getToggleExpandedHandler()();
                        }
                      }}
                      key={cell.id}
                    >
                      {flexRender(
                        cell.getIsAggregated()
                          ? cell.column.columnDef.aggregatedCell ??
                              cell.column.columnDef.cell
                          : cell.column.columnDef.cell,
                        { ...cell.getContext() },
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
