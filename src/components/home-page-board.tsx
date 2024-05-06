import { IssueStatus, type Issue } from "@/types/issue";
import { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import KanbanColumn from "@/components/issue/kanban-column";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import taskSvg from "@/assets/task.svg";
import bugSvg from "@/assets/bug.svg";
import epicSvg from "@/assets/epic.svg";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const issueTypeToSvg = {
  task: taskSvg,
  bug: bugSvg,
  epic: epicSvg,
};

export default function HomePageBoard({ issues }: { issues: Issue[] }) {
  const [toDoIssues, setToDoIssues] = useState<Issue[]>([]);
  const [inProgressIssues, setInProgressIssues] = useState<Issue[]>([]);
  const [doneIssues, setDoneIssues] = useState<Issue[]>([]);

  useEffect(() => {
    const fetchIssues = async () => {
      setToDoIssues(
        issues.filter((issue) => issue.status === IssueStatus.TO_DO),
      );
      setInProgressIssues(
        issues.filter((issue) => issue.status === IssueStatus.IN_PROGRESS),
      );
      setDoneIssues(
        issues.filter((issue) => issue.status === IssueStatus.DONE),
      );
    };

    fetchIssues();
  }, []);

  async function handleDragEnd(result: DropResult) {
    const { source, destination } = result;

    // If dropped outside the list, do nothing
    if (!destination) {
      return;
    }

    // If dropped in the same place, do nothing
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Find the issue based on draggableId
    const issueId = parseInt(result.draggableId, 10);
    const sourceIssues = getColumnIssues(source.droppableId);
    const [removedIssue] = sourceIssues.splice(source.index, 1);
    const destinationIssues = getColumnIssues(destination.droppableId);

    // If it's the same column, re-insert the issue at the new index
    if (source.droppableId === destination.droppableId) {
      sourceIssues.splice(destination.index, 0, removedIssue);
      setColumnIssues(sourceIssues, source.droppableId);
    } else {
      // If dragging to a different column, update the issue's status
      removedIssue.status = getNewStatusFromDroppableId(
        destination.droppableId,
      );
      destinationIssues.splice(destination.index, 0, removedIssue);
      setColumnIssues(sourceIssues, source.droppableId);
      setColumnIssues(destinationIssues, destination.droppableId);
      const updatedIssue = issues.find((issue) => issue.id === issueId);
      toast({
        title: "Issue updated.",
        description: (
          <div className="flex flex-wrap items-center whitespace-pre">
            <div className="inline-block">
              <Avatar className="h-4 w-4 rounded-[0.2rem]">
                <AvatarImage
                  src={
                    issueTypeToSvg[
                      updatedIssue?.type.toLowerCase() as keyof typeof issueTypeToSvg
                    ]
                  }
                />
              </Avatar>
            </div>
            <span className="ml-1 text-primary underline-offset-4 group-hover:underline dark:text-pink-600">
              {updatedIssue?.key}
            </span>
            <span> has been updated.</span>
          </div>
        ),
      });
    }
  }

  function getNewStatusFromDroppableId(droppableId: string) {
    switch (droppableId) {
      case "toDo":
        return IssueStatus.TO_DO;
      case "inProgress":
        return IssueStatus.IN_PROGRESS;
      case "done":
        return IssueStatus.DONE;
      default:
        throw new Error(`Unknown droppableId: ${droppableId}`);
    }
  }

  function setColumnIssues(issues: Issue[], columnId: string) {
    switch (columnId) {
      case "toDo":
        setToDoIssues(issues);
        break;
      case "inProgress":
        setInProgressIssues(issues);
        break;
      case "done":
        setDoneIssues(issues);
        break;
      default:
        break;
    }
  }

  function getColumnIssues(columnId: string) {
    switch (columnId) {
      case "toDo":
        return [...toDoIssues];
      case "inProgress":
        return [...inProgressIssues];
      case "done":
        return [...doneIssues];
      default:
        return [];
    }
  }

  return (
    <ScrollArea type="scroll">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex justify-between gap-4 text-foreground">
          <KanbanColumn issues={toDoIssues} columnId="toDo" title="To Do" />
          <KanbanColumn
            issues={inProgressIssues}
            columnId="inProgress"
            title="In Progress"
          />
          <KanbanColumn issues={doneIssues} columnId="done" title="Done" />
        </div>
      </DragDropContext>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
