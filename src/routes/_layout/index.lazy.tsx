import { createLazyFileRoute, useRouter } from "@tanstack/react-router";
import { CirclePlus, File, Link, Trash2Icon } from "lucide-react";
import { useMemo, useState } from "react";
import invariant from "tiny-invariant";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Logo } from "~/src/components";
import { useStore } from "../../store";

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
          {projects.list.length > 0 ? (
            projects.list.map((project, i) => (
              <div key={i} className="group flex items-center gap-3">
                <Button
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
      "i",
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
