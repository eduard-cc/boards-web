import type { Issue } from "@/types/issue";
import { priorities } from "@/components/issues-list-view/data.ts";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { UserHoverCard } from "@/components/user-hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/get-initials";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/format-date";
import EditIssueDialog from "./edit-issue-dialog";
import { useState } from "react";
import { DotsHorizontalIcon, TrashIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteIssueDialog from "./delete-issue-dialog";
import { useProjectContext } from "@/providers/project-provider";
import { Role } from "@/types/member";
import bugSvg from "@/assets/bug.svg";
import epicSvg from "@/assets/epic.svg";
import taskSvg from "@/assets/task.svg";

const issueTypeToSvg = {
  bug: bugSvg,
  epic: epicSvg,
  task: taskSvg,
};

type IssueCardProps = {
  issue: Issue;
};

export default function IssueCard({ issue }: IssueCardProps) {
  const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const { currentMember } = useProjectContext();

  function getPriorityIcon() {
    const priority = priorities.find(
      (priority) => priority.value === issue.priority,
    );

    if (!priority) {
      return null;
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            {" "}
            <priority.icon
              className={cn(
                "h-6 w-6 rounded-full p-1",
                priority.color,
                priority.bgColor,
              )}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Priority:{" "}
              {issue.priority.charAt(0).toUpperCase() +
                issue.priority.slice(1).toLowerCase()}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  function getDueDate() {
    if (!issue.dueOn) return;
    const { formattedDate, hasPassed } = formatDate(issue.dueOn);
    return (
      <div className="max-w-[120px] text-foreground">
        <Badge variant={hasPassed ? "destructive" : "outline"}>
          <p className={hasPassed ? "text-destructive-foreground" : ""}>
            {formattedDate}
          </p>
        </Badge>
      </div>
    );
  }

  return (
    <>
      <Card
        className="group flex w-80 flex-col justify-between border border-border p-4 hover:cursor-pointer hover:bg-white dark:hover:bg-muted/40"
        onClick={() => setIsOpenEditDialog(true)}
      >
        <div className="flex items-start justify-between pb-6">
          <p className="max-w-[15rem] text-sm leading-5 underline-offset-2 group-hover:underline">
            {issue.title}
          </p>
          {currentMember?.role != Role.VIEWER && location.pathname != "/" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="invisible flex h-8 w-8 p-0 text-foreground group-hover:visible data-[state=open]:bg-muted"
                  onClick={(e) => {
                    {
                      e.stopPropagation();
                    }
                  }}
                >
                  <DotsHorizontalIcon className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive hover:cursor-pointer focus:bg-destructive focus:text-destructive-foreground"
                  onClick={(e) => {
                    {
                      e.stopPropagation();
                      setIsOpenDeleteDialog(true);
                    }
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
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              alt={issue.type}
              src={
                issueTypeToSvg[
                  issue.type.toLowerCase() as keyof typeof issueTypeToSvg
                ]
              }
              className="w-5 rounded-[0.2rem]"
            />
            <p className="text-xs font-medium">{issue.key}</p>
          </div>
          <div className="flex items-center gap-2">
            {getDueDate()}
            {getPriorityIcon()}
            {issue.assignee && (
              <UserHoverCard member={issue.assignee}>
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={`data:image/png;base64,${issue.assignee.user.picture}`}
                  />
                  <AvatarFallback className="text-xs">
                    {getInitials(issue.assignee.user.name)}
                  </AvatarFallback>
                </Avatar>
              </UserHoverCard>
            )}
          </div>
        </div>
      </Card>

      <EditIssueDialog
        open={isOpenEditDialog}
        setOpen={setIsOpenEditDialog}
        issueId={issue.id}
      />

      <DeleteIssueDialog
        open={isOpenDeleteDialog}
        setOpen={setIsOpenDeleteDialog}
        issue={issue}
      />
    </>
  );
}
