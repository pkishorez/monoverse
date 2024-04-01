import { uniq } from "lodash-es";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { DialogContent, DialogFooter } from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { getOutofSyncDependencies } from "./utils";

export const FixSyncDependency = ({
  fixSyncInfo,
  onFix,
}: {
  fixSyncInfo?: ReturnType<typeof getOutofSyncDependencies>[0];
  onFix: (versionRange: string) => void;
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

          <ScrollArea>
            <div className="max-h-[calc(320px)]">
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
            </div>
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
            <Button
              type="button"
              disabled={!fix}
              onClick={() => {
                if (fix) {
                  onFix(fix);
                }
              }}
            >
              Mark Changes
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </>
  );
};
