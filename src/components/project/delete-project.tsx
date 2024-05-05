import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useProjectContext } from "@/providers/project-provider";
import { useLocation, useNavigate } from "react-router-dom";
import ProjectService from "@/services/project-service";
import { toast } from "@/components/ui/use-toast";
import { useProjectListContext } from "@/providers/project-list-provider";

type LeaveProjectProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  projectId?: number;
};

export default function DeleteProject({
  open,
  setOpen,
  projectId,
}: LeaveProjectProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectData } = useProjectContext();
  const { setUpdate } = useProjectListContext();

  const handleDeleteProject = async () => {
    try {
      if (projectData) {
        await ProjectService.deleteProject(projectData?.id);
      } else if (projectId) {
        await ProjectService.deleteProject(projectId);
      }
      if (location.pathname != "/projects") {
        navigate("/projects");
      } else {
        setUpdate((update) => !update);
      }
      toast({
        title: `${
          projectData ? projectData.name : "Project"
        } has been deleted.`,
        description: "All data associated with this project has been deleted.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Please try again.",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(open) => setOpen(open)}>
      <AlertDialogContent className="max-w-[36rem] text-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogDescription>
            All data associated with this project will be lost. This action is
            irreversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            autoFocus
            className="bg-destructive"
            onClick={handleDeleteProject}
          >
            Delete project
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
