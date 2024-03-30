import { uniqueId } from "lodash-es";
import mermaid from "mermaid";
import { useEffect, useRef } from "react";
import { TrpcRouterOutputs } from "../client";

export const MermaidState = ({
  data,
}: {
  data: Exclude<TrpcRouterOutputs["getOverview"], undefined>;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const workspaceMap = data.workspaces.reduce(
    (acc, workspace) => {
      acc[workspace.name] = workspace;
      return acc;
    },
    {} as Record<string, (typeof data.workspaces)[0]>,
  );

  const workspaceInfoMap: Record<string, { id: string; name: string }> = {};
  const getWorkspaceInfo = (workspaceName: string) => {
    if (workspaceInfoMap[workspaceName]) {
      return workspaceInfoMap[workspaceName];
    }

    const id = uniqueId("workspace_");
    workspaceInfoMap[workspaceName] = { id, name: workspaceName };

    return workspaceInfoMap[workspaceName];
  };

  const links = data.workspaces.flatMap((workspace) => {
    const internalDeps = workspace.dependencies.filter(
      (dep) => !!workspaceMap[dep.name],
    );

    return internalDeps.map((dep) => {
      const source = getWorkspaceInfo(workspace.name);
      const target = getWorkspaceInfo(
        data.workspaces.find((w) => w.name === dep.name)!.name,
      );

      return {
        source,
        target,
      };
    });
  });

  useEffect(() => {
    const fn = async () => {
      mermaid.initialize({
        theme: "default",
        securityLevel: "loose",
        flowchart: {
          htmlLabels: true,
          // curve: "linear",
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).callback = () => {
        alert("callback!");
      };
      const mermaidLogic = links.flatMap(({ source, target }) => {
        const sourceInfo = workspaceInfoMap[source.name];
        const targetInfo = workspaceInfoMap[target.name];

        const sourceNode = `${sourceInfo.id}("${sourceInfo.name}")`;
        const targetNode = `${targetInfo.id}("${targetInfo.name}")`;

        return [`${sourceNode} --> ${targetNode}`].map((v) => `  ${v}`);
      });
      const mermaidDiagram = ["graph LR", ...mermaidLogic].join("\n");

      const { svg, bindFunctions } = await mermaid.render(
        "mermaid",
        mermaidDiagram,
        ref.current!,
      );
      console.log({ ref, svg, bindFunctions });
      ref.current!.innerHTML = svg;
      bindFunctions?.(ref.current!);
    };
    void fn();
  });
  return <div ref={ref} id="mermaid-elem" className="grow p-10"></div>;
};
