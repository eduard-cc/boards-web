import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/get-initials";
import { toast } from "@/components/ui/use-toast";
import { useProjectContext } from "@/providers/project-provider";
import MemberService from "@/services/member-service";
import { Member, Role } from "@/types/member";
import { UserHoverCard } from "@/components/user-hover-card";
import MemberActions from "@/components/project/member-actions";
import UpdateMemberRole from "@/components/project/update-member-role";
import { Badge } from "@/components/ui/badge";
import AuthService from "@/services/auth-service";
import { formatDate } from "@/utils/format-date";
import { DataTableFacetedFilter } from "@/components/issues-list-view/data-table-faceted-filter";
import InviteMembersDialog from "@/components/project/invite-members-dialog";

const columns: ColumnDef<Member>[] = [
  {
    id: "user.name",
    accessorKey: "user.name",
    header: ({ column }) => {
      return (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3"
          >
            Name
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="flex min-w-[150px] items-center gap-2">
        <UserHoverCard member={row.original} alignment="start">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7 rounded-md">
              <AvatarImage
                src={`data:image/png;base64,${row.original.user.picture}`}
              />
              <AvatarFallback className="rounded-md text-xs font-normal">
                {getInitials(row.original.user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="max-w-[400px] truncate">
              {row.original.user.name}
              {row.original.user.id === AuthService.getUserId() && (
                <Badge className="ml-2">You</Badge>
              )}
            </div>
          </div>
        </UserHoverCard>
      </div>
    ),
  },
  {
    accessorKey: "user.email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3"
        >
          Email
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="min-w-[150px] max-w-[500px] truncate">
        {row.original.user.email}
      </div>
    ),
  },
  {
    accessorKey: "joinedOn",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3"
        >
          Joined on
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="max-w-[400px] truncate">
        {formatDate(row.getValue("joinedOn")).formattedDate}
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3"
        >
          Role
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>
        <UpdateMemberRole row={row.original} />
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    sortingFn: (rowA, rowB, id) => {
      const rolePriorityValues = {
        OWNER: 0,
        ADMIN: 1,
        DEVELOPER: 2,
        VIEWER: 3,
      };

      const rowAValue = rowA.getValue(id) as Role;
      const rowBValue = rowB.getValue(id) as Role;

      return rolePriorityValues[rowAValue] - rolePriorityValues[rowBValue];
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <MemberActions row={row.original} />;
    },
  },
];

const roles = [
  {
    value: "OWNER",
    label: "Owner",
  },
  {
    value: "ADMIN",
    label: "Admin",
  },
  {
    value: "DEVELOPER",
    label: "Developer",
  },
  {
    value: "VIEWER",
    label: "Viewer",
  },
];

export default function ProjectMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [loading, setLoading] = useState(true);
  const { currentMember, projectData, update, setMemberCount, memberCount } =
    useProjectContext();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const id = projectData?.id;
        if (id) {
          const members = await MemberService.getMembersByProjectId(id);
          setMembers(members);
          setMemberCount(members.length);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "There was a problem with your request. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [projectData?.id, update]);

  useEffect(() => {
    document.title = `Boards | ${projectData?.name}`;
  }, [projectData?.name]);

  const table = useReactTable({
    data: members,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Input
            type="search"
            placeholder="Filter members by name..."
            value={
              (table.getColumn("user.name")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("user.name")?.setFilterValue(event.target.value)
            }
            className="h-8 w-[250px] text-foreground"
            disabled={
              table.getRowModel().rows?.length === 0 && members.length === 0
            }
          />
          {table.getColumn("role") && (
            <DataTableFacetedFilter
              column={table.getColumn("role")}
              title="Role"
              options={roles}
              height="h-8"
            />
          )}
        </div>
        {(currentMember?.role === Role.OWNER ||
          currentMember?.role === Role.ADMIN) && (
          <InviteMembersDialog
            trigger={
              <Button className="whitespace-nowrap" size="sm">
                Add users
              </Button>
            }
          />
        )}
      </div>
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-inherit">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="text-foreground hover:bg-inherit"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-foreground"
                >
                  {loading ? "" : "No members found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {memberCount === 1
            ? `${
                table.getRowModel().rows.length
              } of ${memberCount} row visible.`
            : `${
                table.getRowModel().rows.length
              } of ${memberCount} rows visible.`}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="text-foreground"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="text-foreground"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
