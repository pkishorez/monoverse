import { createLazyFileRoute } from "@tanstack/react-router";
import { uniq } from "lodash-es";
import { useRef, useState } from "react";
import { cn } from "~/components/utils";
import { trpc } from "~/src/client";
import {
  Canvas,
  Connector,
  ConnectorRef,
  transformOverviewData,
} from "./-components";
export const Route = createLazyFileRoute("/overview/")({
  component: Overview,
});

function Overview() {
  const { data, isLoading, isError } = trpc.getOverview.useQuery(
    "/Users/kishorepolamarasetty/CAREER/NUMA/numa-web",
  );
  const connectorRefMap = useRef<Record<string, ConnectorRef>>({});
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelected = (workspaceName: string) => () => {
    setSelected((prev) => {
      if (prev.includes(workspaceName)) {
        return prev.filter((a) => a !== workspaceName);
      }
      return [...prev, workspaceName];
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError || !data) {
    return <div>Error loading data</div>;
  }

  const { overview, links } = transformOverviewData(data);

  const selectedLinks = links.filter(
    ({ from, to }) => selected.includes(from) || selected.includes(to),
  );
  const highlighted = uniq(selectedLinks.flatMap((v) => [v.from, v.to]));

  return (
    <div className="relative mt-10 grow pb-10">
      <div className="flex flex-col gap-5">
        {overview.map(({ label, workspaces }) => (
          <div className="flex flex-col gap-3" key={label}>
            <h2 className="text-center text-xl font-bold">{label}</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {workspaces.map((v) => (
                <Connector
                  ref={(r) => {
                    if (!r) return;

                    connectorRefMap.current[v.workspaceName] = r;
                  }}
                  key={v.workspaceName}
                >
                  <div
                    className={cn(
                      "bg-accent p-4 text-accent-foreground border-2 box-border transition-all cursor-pointer hover:opacity-95",
                      {
                        "bg-primary text-primary-foreground": selected.includes(
                          v.workspaceName,
                        ),
                        "border-primary":
                          highlighted.includes(v.workspaceName) &&
                          !selected.includes(v.workspaceName),
                        "opacity-50":
                          selected.length > 0 &&
                          !selected.includes(v.workspaceName) &&
                          !highlighted.includes(v.workspaceName),
                      },
                    )}
                    onClick={toggleSelected(v.workspaceName)}
                  >
                    <div>{v.workspaceName}</div>
                  </div>
                </Connector>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Canvas
        selected={selected}
        connectorRefMap={connectorRefMap}
        className="pointer-events-none absolute inset-0"
        links={selectedLinks}
      />
    </div>
  );
}
