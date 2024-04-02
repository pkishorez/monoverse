import * as d3 from "d3";
import { MutableRefObject, useMemo, useRef } from "react";
import { cn } from "~/components/utils";
import { ConnectorRef } from "./connector";

interface Props {
  className?: string;
  selected?: string[];
  connectorRefMap: MutableRefObject<Record<string, ConnectorRef>>;
  links: { from: string; to: string }[];
}

export const Canvas = ({
  connectorRefMap,
  selected,
  className,
  links,
}: Props) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const d3Link = d3
    .linkVertical()
    .x((d) => d[0])
    .y((d) => d[1]);

  const linkPositions = useMemo(() => {
    try {
      return links.map(
        (
          d,
        ): {
          from: [number, number];
          to: [number, number];
          type: "from" | "to";
        } => {
          const fromTop =
            connectorRefMap.current[d.from].top.current?.offsetTop ?? 0;
          const toTop =
            connectorRefMap.current[d.to].top.current?.offsetTop ?? 0;

          const from =
            connectorRefMap.current[d.from][
              fromTop < toTop ? "bottom" : fromTop === toTop ? "top" : "top"
            ].current;
          const to =
            connectorRefMap.current[d.to][
              fromTop < toTop ? "top" : fromTop === toTop ? "top" : "bottom"
            ].current;

          if (!from || !to) {
            return {
              from: [0, 0] as const,
              to: [0, 0] as const,

              type: selected?.includes(d.from) ? "from" : "to",
            };
          }

          if (fromTop < toTop) {
            return {
              from: [from.offsetLeft - 10, from.offsetTop - 10] as const,
              to: [to.offsetLeft + 10, to.offsetTop + 10] as const,
              type: selected?.includes(d.from) ? "from" : "to",
            };
          } else if (fromTop === toTop) {
            return {
              from: [from.offsetLeft - 10, from.offsetTop + 10] as const,
              to: [to.offsetLeft + 10, to.offsetTop + 10] as const,
              type: selected?.includes(d.from) ? "from" : "to",
            };
          }
          return {
            from: [from.offsetLeft - 10, from.offsetTop + 10] as const,
            to: [to.offsetLeft + 10, to.offsetTop - 10] as const,
            type: selected?.includes(d.from) ? "from" : "to",
          };
        },
      );
    } catch {
      return [];
    }
  }, [connectorRefMap, links, selected]);

  const { markerSize: markerSize } = {
    markerSize: 5,
  };

  return (
    <svg ref={svgRef} className={cn("size-full", className)}>
      <defs>
        {["from", "to"].map((type) => (
          <marker
            id={`arrow-${type}`}
            viewBox={`0 0 ${markerSize} ${markerSize}`}
            refX={markerSize / 2}
            refY={markerSize / 2}
            markerWidth={markerSize}
            markerHeight={markerSize}
            orient="auto-start-reverse"
          >
            <path
              fill={`var(--link-${type})`}
              d={
                d3.line()([
                  [0, 0],
                  [0, markerSize],
                  [markerSize, markerSize / 2],
                ])!
              }
            />
          </marker>
        ))}
      </defs>
      {linkPositions.map((link, i) => {
        const { from, to, type } = link;
        const d = d3Link({ source: from, target: to });

        if (d === null) {
          return null;
        }

        return (
          <g>
            <circle
              cx={from[0]}
              cy={from[1]}
              r={6}
              fill={`var(--link-${type})`}
            />
            <path
              key={i}
              markerEnd={`url(#arrow-${type})`}
              d={d}
              style={{
                stroke: type === "from" ? "var(--link-from)" : "var(--link-to)",
                strokeWidth: 3,
                fill: "none",
              }}
            />
          </g>
        );
      })}
    </svg>
  );
};
