import { cn } from "~/components/utils";

export const Loading = ({ className = "" }) => {
  return (
    <div
      className={cn(
        "size-12 animate-spin rounded-md border-4 border-primary",
        className,
      )}
    />
  );
};
