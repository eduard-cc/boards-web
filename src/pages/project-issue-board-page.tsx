import { toast } from "@/components/ui/use-toast";
import { useProjectContext } from "@/providers/project-provider";
import IssueService from "@/services/issue-service";
import { IssueStatus, type Issue } from "@/types/issue";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import KanbanColumn from "@/components/issue/kanban-column";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import CreateIssueForm from "@/components/issue/create-issue-form";
import { Button } from "@/components/ui/button";
import { Role } from "@/types/member";
import taskSvg from "@/assets/task.svg";
import bugSvg from "@/assets/bug.svg";
import epicSvg from "@/assets/epic.svg";

const issueTypeToSvg = {
  task: taskSvg,
  bug: bugSvg,
  epic: epicSvg,
};

export default function ProjectIssueBoardPage() {
  const { id } = useParams();
  const { update, setIssueCount, projectData, currentMember } =
    useProjectContext();
  const [toDoIssues, setToDoIssues] = useState<Issue[]>([]);
  const [inProgressIssues, setInProgressIssues] = useState<Issue[]>([]);
  const [doneIssues, setDoneIssues] = useState<Issue[]>([]);
  const [canceledIssues, setCanceledIssues] = useState<Issue[]>([]);

  useEffect(() => {
    const fetchIssues = async () => {
      if (id) {
        try {
          const issues = await IssueService.getIssuesByProjectId(id);
          setToDoIssues(
            issues.filter((issue) => issue.status === IssueStatus.TO_DO),
          );
          setInProgressIssues(
            issues.filter((issue) => issue.status === IssueStatus.IN_PROGRESS),
          );
          setDoneIssues(
            issues.filter((issue) => issue.status === IssueStatus.DONE),
          );
          setCanceledIssues(
            issues.filter((issue) => issue.status === IssueStatus.CANCELED),
          );
          setIssueCount(issues.length);
          document.title = `Boards | ${projectData?.name}`;
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description:
              "There was a problem with your request. Please try again.",
          });
        }
      }
      return [];
    };

    fetchIssues();
  }, [id, update]);

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

      const newStatus = getNewStatusFromDroppableId(destination.droppableId);

      if (!projectData || !newStatus) return;
      try {
        const updatedIssue = await IssueService.updateIssueStatus(
          projectData.id,
          Number(issueId),
          newStatus,
        );

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
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "There was a problem with your request. Please try again.",
        });
      }
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
      case "canceled":
        return IssueStatus.CANCELED;
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
      case "canceled":
        setCanceledIssues(issues);
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
      case "canceled":
        return [...canceledIssues];
      default:
        return [];
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {currentMember?.role != Role.VIEWER && (
        <div className="flex justify-end">
          <CreateIssueForm
            trigger={
              <Button size="sm" className="ml-2 whitespace-nowrap">
                Create issue
              </Button>
            }
          />
        </div>
      )}
      <div className="flex justify-between text-foreground">
        <KanbanColumn issues={toDoIssues} columnId="toDo" title="To Do" />
        <KanbanColumn
          issues={inProgressIssues}
          columnId="inProgress"
          title="In Progress"
        />
        <KanbanColumn issues={doneIssues} columnId="done" title="Done" />
        <KanbanColumn
          issues={canceledIssues}
          columnId="canceled"
          title="Canceled"
        />
      </div>
    </DragDropContext>
  );
}
