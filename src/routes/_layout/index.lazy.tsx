import { Button } from "@components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
} from "@components/ui/dialog.tsx";
import { Input } from "@components/ui/input.tsx";
import { Label } from "@components/ui/label.tsx";
import { createLazyFileRoute, useRouter } from "@tanstack/react-router";
import { CirclePlus, File, Info, Link, Trash2Icon } from "lucide-react";
import { useMemo, useState } from "react";
import invariant from "tiny-invariant";
import { Logo } from "~/src/components/index.ts";
import { ENV } from "~/src/env.ts";
import { useStore } from "../../store/index.ts";

export const Route = createLazyFileRoute("/_layout/")({
  component: Index,
});

function Index() {
  const { projects, removeProject, selectProject } = useStore();
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  return (
    <div className="mt-10">
      <div className="text-center">
        <Logo className="cursor-default" />
      </div>
      <div className="mx-auto mt-10 max-w-xl">
        <div className="flex flex-col items-stretch gap-4">
          <Button
            variant="link"
            className="flex items-center justify-center gap-2"
            onClick={() => {
              setShowModal(true);
            }}
          >
            <CirclePlus />
            Add project
          </Button>
          {ENV.PROJECT_MODE === "online" && (
            <div className="flex items-center gap-2 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
              <Info size={12} />
              <span>
                Local filesystem projects cannot be accessed in online mode.
              </span>
            </div>
          )}
          {projects.list.length > 0 ? (
            projects.list.map((project, i) => (
              <div key={i} className="group flex items-center gap-3">
                <Button
                  disabled={
                    ENV.PROJECT_MODE === "online" && project.type === "filepath"
                  }
                  onClick={() => {
                    selectProject(project);
                    router.navigate({
                      to: "/overview",
                    });
                  }}
                  variant="ghost"
                  className="flex grow items-center justify-start gap-2 text-center"
                >
                  {project.type === "filepath" ? <File /> : <Link />}
                  {project.value}
                </Button>
                <Button
                  className="opacity-30 transition-opacity group-hover:opacity-100"
                  variant="ghost"
                  onClick={() => {
                    removeProject(project);
                  }}
                >
                  <Trash2Icon />
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center text-2xl font-bold text-[gray] dark:text-muted">
              No projects added yet.
            </div>
          )}
        </div>
      </div>
      {showModal && (
        <AddProjectModal open={showModal} onOpenChange={setShowModal} />
      )}
    </div>
  );
}

function AddProjectModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [value, setValue] = useState("");
  const { type } = useMemo(() => {
    // Regex for URL validation
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name and extension
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator

    // Regex for absolute file path validation (simplified version)
    // Note: This is a basic version and might need adjustments based on the specific requirements
    const filePathPattern = /^(\/|([a-zA-Z]:\\)).*$/;

    if (urlPattern.test(value)) {
      return { type: "url" as const };
    } else if (filePathPattern.test(value)) {
      return { type: "filepath" as const };
    } else {
      return { type: "invalid" as const };
    }
  }, [value]);

  const { addProject } = useStore();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-background/80" />
      <DialogContent>
        <DialogHeader>Add Project</DialogHeader>
        <div className="space-y-3">
          <Label htmlFor="name">Directory Path | Github URL</Label>
          <Input
            id="name"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        </div>
        <DialogFooter>
          <Button
            disabled={type === "invalid"}
            onClick={() => {
              invariant(type !== "invalid", "Invalid project type");

              addProject({ type, value });
              onOpenChange(false);
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
