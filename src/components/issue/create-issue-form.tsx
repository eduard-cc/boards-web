import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import IssueAssigneeSelect from "./issue-assignee-select";
import IssueStatusSelect from "./issue-status-select";
import IssueTypeSelect from "./issue-type-select";
import IssueProjectSelect from "./issue-project-select";
import { useState } from "react";
import IssuePrioritySelect from "./issue-priority-select";
import { IssueDueDateSelect } from "./issue-due-date-select";
import IssueDescriptionInput from "./issue-description-input";
import IssueTitleInput from "./issue-title-input";
import IssueService from "@/services/issue-service";
import AuthService from "@/services/auth-service";
import { toast } from "@/components/ui/use-toast";
import { IssueStatus } from "@/types/issue";
import { IssueType } from "@/types/issue";
import { IssuePriority } from "@/types/issue";
import { useProjectContext } from "@/providers/project-provider";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import bugSvg from "@/assets/bug.svg";
import epicSvg from "@/assets/epic.svg";
import taskSvg from "@/assets/task.svg";

const issueTypeToSvg = {
  bug: bugSvg,
  epic: epicSvg,
  task: taskSvg,
};

const issueFormSchema = z.object({
  title: z
    .string({ required_error: "Issue title is required." })
    .max(100, {
      message: "Must not exceed 100 characters.",
    })
    .refine((name) => name.trim() !== "", {
      message: "Must not be blank.",
    }),
  description: z
    .string()
    .max(2000, {
      message: "Must not exceed 2000 characters.",
    })
    .optional(),
  assigneeMemberId: z.number().optional(),
  type: z.nativeEnum(IssueType).default(IssueType.TASK),
  status: z.nativeEnum(IssueStatus).default(IssueStatus.TO_DO),
  priority: z.nativeEnum(IssuePriority).default(IssuePriority.MEDIUM),
  dueOn: z.date().optional(),
  projectId: z.number({
    required_error: "Select a project for this issue.",
  }),
});

type IssueFormValues = z.infer<typeof issueFormSchema>;

export default function CreateIssueForm({
  trigger,
  status,
}: {
  trigger: React.ReactNode;
  status?: IssueStatus;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useForm<IssueFormValues>({
    resolver: zodResolver(issueFormSchema),
    mode: "onTouched",
  });
  const { setUpdate } = useProjectContext();
  const navigate = useNavigate();
  const location = useLocation();

  async function onSubmit(data: IssueFormValues) {
    try {
      if (data.description) {
        data.description = data.description.trim();
      }
      const { projectId, ...issueData } = data;
      const creatorId = AuthService.getUserId();
      if (creatorId) {
        const createdIssue = await IssueService.createIssue(
          projectId,
          { ...issueData, createdByUserId: creatorId },
          creatorId,
        );
        setIsDialogOpen(false);
        setUpdate((update) => !update);
        toast({
          title: "Issue created.",
          description: (
            <div className="flex flex-wrap items-center whitespace-pre">
              <Link
                to={`/projects/${projectId}/list`}
                className="group inline-flex items-center"
              >
                <div className="inline-block">
                  <Avatar className="h-4 w-4 rounded-[0.2rem]">
                    <AvatarImage
                      src={
                        issueTypeToSvg[
                          createdIssue.type.toLowerCase() as keyof typeof issueTypeToSvg
                        ]
                      }
                    />
                  </Avatar>
                </div>
                <span className="ml-1 text-primary underline-offset-4 group-hover:underline dark:text-pink-600">
                  {createdIssue.key}
                </span>
              </Link>
              <span> has been created.</span>
            </div>
          ),
        });
        form.reset();
        if (
          location.pathname === `/projects/${projectId}/list` ||
          location.pathname === `/projects/${projectId}/board`
        ) {
          return;
        } else {
          navigate(`/projects/${projectId}/list`);
        }
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
    <>
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            form.reset();
          }
        }}
      >
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        {isDialogOpen && (
          <DialogContent className={cn("!max-w-xl text-foreground")}>
            <FormProvider {...form}>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <DialogHeader>
                    <DialogTitle>Create issue</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[32rem]">
                    <div className="space-y-8 px-4 py-8">
                      <IssueProjectSelect />
                      <IssueTypeSelect />
                      <IssueTitleInput />
                      <IssueDescriptionInput />
                      <IssueAssigneeSelect />
                      <IssueStatusSelect value={status ? status : undefined} />
                      <IssuePrioritySelect />
                      <IssueDueDateSelect />
                    </div>
                  </ScrollArea>
                  <DialogFooter className="gap-2">
                    <DialogClose asChild>
                      <Button type="button" variant="ghost">
                        Close
                      </Button>
                    </DialogClose>
                    <Button type="submit">Create</Button>
                  </DialogFooter>
                </form>
              </Form>
            </FormProvider>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
