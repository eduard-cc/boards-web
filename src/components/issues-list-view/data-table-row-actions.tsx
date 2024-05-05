import {
  DotsHorizontalIcon,
  EyeOpenIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Issue } from "@/types/issue";
import { cn } from "@/lib/utils";
import { useState } from "react";
import EditIssueDialog from "@/components/issue/edit-issue-dialog";
import DeleteIssueDialog from "@/components/issue/delete-issue-dialog";
import { useProjectContext } from "@/providers/project-provider";
import { Role } from "@/types/member";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const issue = row.original as Issue;
  const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const { currentMember } = useProjectContext();

  return (
    <>
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
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={() => setIsOpenEditDialog(true)}
          >
            {currentMember?.role != Role.VIEWER ? "Edit" : "View"}
            <DropdownMenuShortcut>
              {currentMember?.role != Role.VIEWER ? (
                <Pencil1Icon className="h-4 w-4" />
              ) : (
                <EyeOpenIcon className="h-4 w-4" />
              )}
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          {currentMember?.role != Role.VIEWER && (
            <DropdownMenuItem
              className="text-destructive hover:cursor-pointer focus:bg-destructive focus:text-destructive-foreground"
              onClick={() => setIsOpenDeleteDialog(true)}
            >
              Delete
              <DropdownMenuShortcut className={cn("opacity-100")}>
                <TrashIcon className="h-4 w-4" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <EditIssueDialog
        open={isOpenEditDialog}
        setOpen={setIsOpenEditDialog}
        issueId={issue.id}
      />
      {location.pathname != "/" && (
        <DeleteIssueDialog
          open={isOpenDeleteDialog}
          setOpen={setIsOpenDeleteDialog}
          issue={issue}
        />
      )}
    </>
  );
}
