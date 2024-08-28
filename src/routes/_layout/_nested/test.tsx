import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "~/src/components/ui/button.tsx";
import { trpc } from "~/trpc/client.ts";

export const Route = createFileRoute("/_layout/_nested/test")({
  component: Component,
});

function Component() {
  const [state, setState] = useState(
    "/Users/kishorepolamarasetty/CAREER/NUMA/numa-web"
  );
  const { data: repoInfo } = trpc.getRepoInfo.useQuery(
    {
      type: "filepath",
      value: state,
    },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    }
  );

  return (
    <div>
      <div>URL::: {state}</div>
      <Button onClick={() => setState(prompt("url")!)}>Change</Button>
      <pre>{JSON.stringify(repoInfo, null, "  ")}</pre>
    </div>
  );
}
