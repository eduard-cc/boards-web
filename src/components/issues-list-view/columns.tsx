import { ColumnDef } from "@tanstack/react-table";
import { priorities, statuses } from "@/components/issues-list-view/data.ts";
import { Issue, IssuePriority, IssueStatus, IssueType } from "@/types/issue";
import { DataTableColumnHeader } from "@/components/issues-list-view/data-table-column-header";
import { Member } from "@/types/member";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/utils/get-initials";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CircleBackslashIcon } from "@radix-ui/react-icons";
import { formatDate } from "@/utils/format-date";
import { UserHoverCard } from "@/components/user-hover-card";
import { DataTableRowActions } from "./data-table-row-actions";
import taskSvg from "@/assets/task.svg";
import bugSvg from "@/assets/bug.svg";
import epicSvg from "@/assets/epic.svg";

export const columns: ColumnDef<Issue>[] = [
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => (
      <div className="flex max-w-[80px] items-center gap-2 text-foreground">
        {(row.getValue("type") === "TASK" && (
          <img alt={"TASK"} src={taskSvg} className="w-5 rounded-[0.2rem]" />
        )) ||
          (row.getValue("type") === "EPIC" && (
            <img alt={"EPIC"} src={epicSvg} className="w-5 rounded-[0.2rem]" />
          )) ||
          (row.getValue("type") === "BUG" && (
            <img alt={"BUG"} src={bugSvg} className="w-5 rounded-[0.2rem]" />
          ))}
        <span>
          {row.getValue("type") === "TASK"
            ? "Task"
            : row.getValue("type") === "BUG"
            ? "Bug"
            : row.getValue("type") === "EPIC"
            ? "Epic"
            : null}
        </span>
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    sortingFn: (rowA, rowB, id) => {
      const typeValues = {
        EPIC: 0,
        BUG: 1,
        TASK: 2,
      };

      const rowAValue = rowA.getValue(id) as IssueType;
      const rowBValue = rowB.getValue(id) as IssueType;

      return typeValues[rowAValue] - typeValues[rowBValue];
    },
  },
  {
    accessorKey: "key",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Key" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[100px] whitespace-nowrap text-foreground">
        {row.getValue("key")}
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      const createdOn = row.getValue("createdOn") as string;
      const createdDate = new Date(createdOn);
      const now = new Date();
      const timeDifference = Number(now) - Number(createdDate);
      const hoursDifference = timeDifference / (1000 * 60 * 60);
      return (
        <>
          <div className="flex space-x-2 text-foreground">
            <span className="max-w-[450px] truncate font-medium">
              {row.getValue("title")}
              {hoursDifference < 24 && <Badge className="ml-2">New</Badge>}
            </span>
          </div>
        </>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status"),
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex max-w-[120px] items-center">
          {status.icon && (
            <Badge
              className={cn(
                "whitespace-nowrap",
                status.value == "TO_DO" &&
                  "bg-zinc-500/20 text-zinc-950 dark:bg-zinc-500/40 dark:text-zinc-200",
                status.value == "IN_PROGRESS" &&
                  "bg-sky-500/20 text-sky-950 dark:bg-sky-500/40 dark:text-sky-200",
                status.value == "DONE" &&
                  "bg-green-500/20 text-green-950 dark:bg-green-500/40 dark:text-green-200",
                status.value == "CANCELED" &&
                  "bg-red-500/20 text-red-950 dark:bg-red-500/40 dark:text-red-200",
              )}
              variant="secondary"
            >
              {status.value == "IN_PROGRESS"}
              <status.icon className="mr-2 h-4 w-4" />
              <span>{status.label}</span>
            </Badge>
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = priorities.find(
        (priority) => priority.value === row.getValue("priority"),
      );

      if (!priority) {
        return null;
      }

      return (
        <div className="flex max-w-[120px] items-center">
          {priority.icon && (
            <Badge
              className={cn(
                "whitespace-nowrap",
                priority.value == "HIGHEST" &&
                  "bg-red-500/20 text-red-950 dark:bg-red-500/40 dark:text-red-200",
                priority.value == "HIGH" &&
                  "bg-orange-500/20 text-orange-950 dark:bg-orange-500/40 dark:text-orange-200",
                priority.value == "MEDIUM" &&
                  "bg-yellow-500/20 text-yellow-950 dark:bg-yellow-500/40 dark:text-yellow-200",
                priority.value == "LOW" &&
                  "bg-green-500/20 text-green-950 dark:bg-green-500/40 dark:text-green-200",
                priority.value == "LOWEST" &&
                  "bg-teal-500/20 text-teal-950 dark:bg-teal-500/40 dark:text-teal-200",
              )}
              variant="secondary"
            >
              <priority.icon className="mr-2 h-4 w-4" />
              <span>{priority.label}</span>
            </Badge>
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    sortingFn: (rowA, rowB, id) => {
      const priorityValues = {
        HIGHEST: 0,
        HIGH: 1,
        MEDIUM: 2,
        LOW: 3,
        LOWEST: 4,
      };

      const rowAValue = rowA.getValue(id) as IssuePriority;
      const rowBValue = rowB.getValue(id) as IssuePriority;

      return priorityValues[rowAValue] - priorityValues[rowBValue];
    },
  },
  {
    accessorKey: "assignee",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assignee" />
    ),
    cell: ({ row }) => {
      const assignee = (row.getValue("assignee") as Member)?.user;
      if (assignee) {
        return (
          <div className="max-w-[180px] text-foreground">
            <UserHoverCard member={row.getValue("assignee")}>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={`data:image/png;base64,${assignee.picture}`}
                  />
                  <AvatarFallback className="text-xs">
                    {getInitials(assignee.name)}
                  </AvatarFallback>
                </Avatar>
                <p className="overflow-hidden text-ellipsis">{assignee.name}</p>
              </div>
            </UserHoverCard>
          </div>
        );
      } else {
        return (
          <div className="group">
            <div className="invisible flex items-center gap-2 text-muted-foreground group-hover:visible">
              <CircleBackslashIcon className="h-6 w-6" />
              <p>Unassigned</p>
            </div>
          </div>
        );
      }
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "dueOn",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due on" />
    ),
    cell: ({ row }) => {
      if (row.getValue("dueOn")) {
        const { formattedDate, hasPassed } = formatDate(row.getValue("dueOn"));
        return (
          <div className="max-w-[120px] text-foreground">
            <Badge
              variant={
                hasPassed && row.getValue("status") != IssueStatus.DONE
                  ? "destructive"
                  : "outline"
              }
            >
              <p
                className={
                  hasPassed && row.getValue("status") != IssueStatus.DONE
                    ? "text-destructive-foreground"
                    : ""
                }
              >
                {formattedDate}
              </p>
            </Badge>
          </div>
        );
      } else {
        return (
          <div className="group w-[100px]">
            <div className="invisible flex items-center gap-2 text-muted-foreground group-hover:visible">
              <p className="whitespace-nowrap">No due date</p>
            </div>
          </div>
        );
      }
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "createdBy",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created by" />
    ),
    cell: ({ row }) => {
      const creator = (row.getValue("createdBy") as Member)?.user;
      if (creator) {
        return (
          <div className="max-w-[180px] text-foreground">
            <UserHoverCard member={row.getValue("createdBy")}>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={`data:image/png;base64,${creator.picture}`}
                  />
                  <AvatarFallback className="text-xs">
                    {getInitials(creator.name)}
                  </AvatarFallback>
                </Avatar>
                <p className="overflow-hidden text-ellipsis">{creator.name}</p>
              </div>
            </UserHoverCard>
          </div>
        );
      } else {
        return (
          <div className="group">
            <div className="invisible flex items-center gap-2 text-muted-foreground group-hover:visible">
              <CircleBackslashIcon className="h-6 w-6" />
              <p>Unknown</p>
            </div>
          </div>
        );
      }
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "createdOn",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created on" />
    ),
    cell: ({ row }) => {
      const { formattedDate } = formatDate(row.getValue("createdOn"));
      return (
        <div className="max-w-[100px] whitespace-nowrap text-foreground">
          <Badge variant="outline">{formattedDate}</Badge>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
