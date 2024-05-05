import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  IssueType,
  type Issue,
  IssueStatus,
  IssuePriority,
} from "@/types/issue";
import { useEffect, useState } from "react";
import IssueService from "@/services/issue-service";
import { useProjectContext } from "@/providers/project-provider";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import IssueTypeSelect from "./issue-type-select";
import IssueTitleInput from "./issue-title-input";
import IssueDescriptionInput from "./issue-description-input";
import IssueAssigneeSelect from "./issue-assignee-select";
import IssueStatusSelect from "./issue-status-select";
import IssuePrioritySelect from "./issue-priority-select";
import { IssueDueDateSelect } from "./issue-due-date-select";
import { Form } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/get-initials";
import { toast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { DateTime } from "luxon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DotsHorizontalIcon, TrashIcon } from "@radix-ui/react-icons";
import DeleteIssueDialog from "./delete-issue-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import CommentContainer from "@/components/comments/comment-container";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Role } from "@/types/member";
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
  assigneeMemberId: z.number().nullish(),
  type: z.nativeEnum(IssueType).default(IssueType.TASK),
  status: z.nativeEnum(IssueStatus).default(IssueStatus.TO_DO),
  priority: z.nativeEnum(IssuePriority).default(IssuePriority.MEDIUM),
  dueOn: z.date().nullish(),
  projectId: z.number({
    required_error: "Select a project for this issue.",
  }),
});

type IssueFormValues = z.infer<typeof issueFormSchema>;

type IssueDialogProps = {
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  issueId: number;
};

export default function EditIssueDialog({
  open,
  setOpen,
  issueId,
}: IssueDialogProps) {
  const [issue, setIssue] = useState<Issue | null>(null);
  const { projectData, setUpdate, currentMember } = useProjectContext();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const form = useForm<IssueFormValues>({
    resolver: zodResolver(issueFormSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        if (projectData) {
          const issue = await IssueService.getIssueById(
            projectData.id,
            issueId,
          );
          setIssue(issue);
          form.setValue("projectId", projectData.id);
          form.setValue("type", issue.type);
          form.setValue("title", issue.title);
          form.setValue("status", issue.status);
          form.setValue("priority", issue.priority);
          if (issue.assignee) {
            form.setValue("assigneeMemberId", issue.assignee.id);
          }
          if (issue.description) {
            form.setValue("description", issue.description);
          }
          if (issue.dueOn) {
            form.setValue("dueOn", new Date(issue.dueOn));
          }
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "There was a problem with your request. Please try again.",
        });
      }
    };

    if (open) {
      fetchIssue();
    }
  }, [issueId, projectData, open, form]);

  async function onSubmit(data: IssueFormValues) {
    try {
      if (projectData) {
        const updatedIssue = await IssueService.updateIssue(
          projectData.id,
          issueId,
          {
            title: data.title,
            description: data.description,
            type: data.type,
            status: data.status,
            priority: data.priority,
            assigneeMemberId: data.assigneeMemberId,
            dueOn: data.dueOn,
          },
        );
        setIssue(updatedIssue);
        setUpdate((update) => !update);
        setOpen && setOpen(false);
        toast({
          title: "Issue updated.",
          description: (
            <div className="flex flex-wrap items-center whitespace-pre">
              <Link
                to={`/projects/${projectData.id}/list`}
                className="group inline-flex items-center"
              >
                <div className="inline-block">
                  <Avatar className="h-4 w-4 rounded-[0.2rem]">
                    <AvatarImage
                      src={
                        issueTypeToSvg[
                          updatedIssue.type.toLowerCase() as keyof typeof issueTypeToSvg
                        ]
                      }
                    />
                  </Avatar>
                </div>
                <span className="ml-1 text-primary underline-offset-4 group-hover:underline dark:text-pink-600">
                  {updatedIssue.key}
                </span>
              </Link>
              <span> has been updated.</span>
            </div>
          ),
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Please try again.",
      });
    }
  }

  function handleClose() {
    setOpen && setOpen(false);
    form.reset();
  }

  return (
    <>
      {open && issue && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
            className="min-h-[30rem] min-w-fit sm:max-w-[425px]"
            hideCloseIcon
          >
            <FormProvider {...form}>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="mb-2 flex justify-between text-sm text-foreground">
                    <div className="flex items-center gap-2">
                      {projectData && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className="group flex cursor-pointer items-center gap-2"
                                onClick={handleClose}
                              >
                                <Avatar className="h-5 w-5 rounded-md">
                                  <AvatarImage
                                    src={`data:image/png;base64,${projectData.icon}`}
                                  />
                                  <AvatarFallback className="rounded-md text-xs font-normal">
                                    {getInitials(projectData.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <p className="underline-offset-4 group-hover:text-primary group-hover:underline">
                                  {projectData.name}
                                </p>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Go back to project</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      <div className="text-muted-foreground">/</div>
                      {currentMember?.role === Role.VIEWER ? (
                        <div className="flex items-center gap-1">
                          <IssueTypeSelect
                            editMode
                            value={issue.type}
                            currentMember={currentMember}
                          />
                          <p>{issue.key}</p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <TooltipProvider delayDuration={100}>
                            <Tooltip>
                              <TooltipTrigger>
                                <IssueTypeSelect editMode value={issue.type} />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Change issue type</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <p>{issue.key}</p>
                        </div>
                      )}
                    </div>
                    {currentMember?.role != Role.VIEWER && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="flex h-8 w-8 p-0 text-foreground data-[state=open]:bg-muted"
                          >
                            <DotsHorizontalIcon className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            className="text-destructive hover:cursor-pointer focus:bg-destructive focus:text-destructive-foreground"
                            onClick={(e) => {
                              e.preventDefault();
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            Delete
                            <DropdownMenuShortcut className={cn("opacity-100")}>
                              <TrashIcon className="h-4 w-4" />
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                    <DeleteIssueDialog
                      open={isDeleteDialogOpen}
                      setOpen={setIsDeleteDialogOpen}
                      issue={issue}
                      setParentDialogOpen={setOpen}
                    />
                  </div>
                  <div className="mb-5 flex justify-between gap-4">
                    <div className="flex w-[34rem] flex-col space-y-[1rem]">
                      <IssueTitleInput editMode currentMember={currentMember} />
                      <ScrollArea className="h-[28rem] rounded-md border border-border">
                        <div className="flex w-[34rem] flex-col gap-4 pt-4">
                          <IssueDescriptionInput
                            editMode
                            currentMember={currentMember}
                          />
                          <CommentContainer issueId={issue.id} />
                        </div>
                      </ScrollArea>
                    </div>
                    <div>
                      <Card className="min-w-[20rem] space-y-8 px-2 pb-2 pt-4">
                        <IssueAssigneeSelect
                          editMode
                          currentMember={currentMember}
                        />
                        <IssueStatusSelect
                          editMode
                          value={issue.status}
                          currentMember={currentMember}
                        />
                        <IssuePrioritySelect
                          editMode
                          value={issue.priority}
                          currentMember={currentMember}
                        />
                        <IssueDueDateSelect
                          editMode
                          currentMember={currentMember}
                        />
                      </Card>
                      <p className="ml-5 mt-4 text-xs text-muted-foreground">
                        Created {DateTime.fromISO(issue.createdOn).toRelative()}
                        {issue.createdBy && " by " + issue.createdBy.user.name}
                      </p>
                      {issue.updatedOn && (
                        <p className="ml-5 mt-2 text-xs text-muted-foreground">
                          Updated{" "}
                          {DateTime.fromISO(issue.updatedOn).toRelative()}
                        </p>
                      )}
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-foreground"
                      >
                        Close
                      </Button>
                    </DialogClose>
                    <Button type="submit" autoFocus>
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </FormProvider>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
