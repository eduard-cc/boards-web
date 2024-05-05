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
import { toast } from "@/components/ui/use-toast";
import { useProjectContext } from "@/providers/project-provider";
import type { Issue } from "@/types/issue";
import IssueService from "@/services/issue-service";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import bugSvg from "@/assets/bug.svg";
import epicSvg from "@/assets/epic.svg";
import taskSvg from "@/assets/task.svg";

const issueTypeToSvg = {
  bug: bugSvg,
  epic: epicSvg,
  task: taskSvg,
};

type DeleteIssueDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  issue: Issue;
  setParentDialogOpen?:
    | React.Dispatch<React.SetStateAction<boolean>>
    | undefined;
};

export default function DeleteIssueDialog({
  open,
  setOpen,
  issue,
  setParentDialogOpen,
}: DeleteIssueDialogProps) {
  const { projectData, setUpdate } = useProjectContext();

  async function handleDeleteIssue() {
    try {
      if (projectData) {
        await IssueService.deleteIssue(projectData?.id, issue.id);
        toast({
          title: "Issue deleted.",
          description: (
            <div className="flex flex-wrap items-center whitespace-pre">
              <div className="inline-flex items-center">
                <div className="inline-block">
                  <Avatar className="h-4 w-4 rounded-[0.2rem]">
                    <AvatarImage
                      src={
                        issueTypeToSvg[
                          issue.type.toLowerCase() as keyof typeof issueTypeToSvg
                        ]
                      }
                    />
                  </Avatar>
                </div>
                <span className="ml-1 underline-offset-4">{issue.key}</span>
              </div>
              <span> has been deleted.</span>
            </div>
          ),
        });
        setParentDialogOpen && setParentDialogOpen(false);
        setUpdate((update) => !update);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Please try again.",
      });
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-[36rem] text-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {issue.key}?</AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col">
            <p className="mb-4">
              This issue will be permanently deleted, including all data
              associated with it.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            autoFocus
            className="bg-destructive"
            onClick={handleDeleteIssue}
          >
            Delete issue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
