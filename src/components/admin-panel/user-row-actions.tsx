import type { User } from "@/types/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  DotsHorizontalIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { DeleteUser } from "./delete-user";
import { EditUser } from "./edit-user";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function UserRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const user = row.original as User;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => setIsEditDialogOpen(true)}
            className="hover:cursor-pointer"
          >
            Edit
            <DropdownMenuShortcut>
              <Pencil1Icon className="h-4 w-4" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-destructive hover:cursor-pointer focus:bg-destructive focus:text-accent"
          >
            Delete
            <DropdownMenuShortcut className={cn("opacity-100")}>
              <TrashIcon className="h-4 w-4" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteUser
        state={isDeleteDialogOpen}
        setState={setIsDeleteDialogOpen}
        user={user}
      />

      <EditUser
        state={isEditDialogOpen}
        setState={setIsEditDialogOpen}
        user={user}
      />
    </>
  );
}
