import { Draggable, Droppable } from "@hello-pangea/dnd";
import IssueCard from "./issue-card";
import { IssueStatus, type Issue } from "@/types/issue";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CreateIssueForm from "./create-issue-form";
import { useProjectContext } from "@/providers/project-provider";
import { Role } from "@/types/member";

type KanbanColumnProps = {
  issues: Issue[];
  columnId: string;
  title: string;
};

const BORDER_COLORS = {
  toDo: "border-t-zinc-500/60 dark:border-t-zinc-500 bg-zinc-200/30 dark:bg-zinc-800/30",
  inProgress:
    "border-t-sky-500/60 dark:border-t-sky-500/70 bg-sky-200/10 dark:bg-sky-950/10",
  done: "border-t-green-500/60 dark:border-t-green-500/70 bg-green-200/10 dark:bg-green-950/10",
  canceled:
    "border-t-red-500/60 dark:border-t-red-500/70 bg-red-200/10 dark:bg-red-950/10",
};

function getNewStatusFromDroppableId(droppableId: string) {
  switch (droppableId) {
    case "toDo":
      return IssueStatus.TO_DO;
    case "inProgress":
      return IssueStatus.IN_PROGRESS;
    case "done":
      return IssueStatus.DONE;
    case "canceled":
      return IssueStatus.CANCELED;
    default:
      throw new Error(`Unknown droppableId: ${droppableId}`);
  }
}

export default function KanbanColumn({
  issues,
  columnId,
  title,
}: KanbanColumnProps) {
  const { currentMember } = useProjectContext();
  return (
    <div
      className={cn(
        "group/column rounded-md border border-t-4 border-border p-2",
        BORDER_COLORS[columnId as keyof typeof BORDER_COLORS],
      )}
    >
      <div className="mb-4 mt-2 flex w-full items-center justify-between gap-2 font-semibold tracking-wide">
        <div className="flex items-center gap-2">
          <span className="ml-4">{title}</span>
          <Badge variant="secondary">{issues.length}</Badge>
        </div>
        {currentMember?.role != Role.VIEWER && location.pathname != "/" && (
          <TooltipProvider>
            <Tooltip>
              <CreateIssueForm
                status={getNewStatusFromDroppableId(columnId)}
                trigger={
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="invisible flex items-center gap-2 group-hover/column:visible"
                    >
                      <PlusIcon className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                }
              />
              <TooltipContent className="font-normal">
                <p>Create issue: {title}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="w-80"></div>
      <Droppable droppableId={columnId}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="h-full space-y-2"
          >
            {issues.map((issue, index) => (
              <Draggable
                key={issue.id}
                draggableId={issue.id.toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                  >
                    <IssueCard issue={issue} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
