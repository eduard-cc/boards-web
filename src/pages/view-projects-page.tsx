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
import ProjectService from "@/services/project-service";
import AuthService from "@/services/auth-service";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/get-initials";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import type { Project } from "@/types/project";
import ProjectActions from "@/components/project/project-actions";
import { useProjectListContext } from "@/providers/project-list-provider";

const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "name",
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
      <div className="group flex items-center gap-2">
        <Avatar className="h-7 w-7 rounded-md">
          <AvatarImage src={`data:image/png;base64,${row.original.icon}`} />
          <AvatarFallback className="rounded-md text-xs font-normal">
            {getInitials(row.original.name)}
          </AvatarFallback>
        </Avatar>
        <div className="group-hover:underline">{row.getValue("name")}</div>
      </div>
    ),
  },
  {
    accessorKey: "key",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3"
        >
          Key
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("key")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const project = row.original;

      return <ProjectActions additionalItems projectId={project.id} />;
    },
  },
];

export default function ViewProjectsPage() {
  const [data, setData] = useState<Project[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const { update } = useProjectListContext();
  const [projectCount, setProjectCount] = useState<number>(0);

  useEffect(() => {
    const fetchProjects = async () => {
      const userId = AuthService.getUserId();
      if (userId) {
        try {
          const projects = await ProjectService.getProjectsByUserId(userId);

          setData(projects);
          setProjectCount(projects.length);
          document.title = "Boards | All projects";
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
      }
    };

    fetchProjects();
  }, [update]);

  const table = useReactTable({
    data,
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
      globalFilter,
    },
  });

  return (
    <div className="p-7">
      <h1 className="text-2xl font-medium tracking-tight text-foreground">
        Projects
      </h1>
      <div className="w-full">
        <div className="flex items-center justify-between py-4">
          <Input
            type="search"
            placeholder="Filter projects by name or key..."
            value={globalFilter}
            onChange={(event) =>
              setGlobalFilter(event.target.value.toLowerCase())
            }
            className="max-w-sm text-foreground"
            disabled={
              table.getRowModel().rows?.length === 0 && data.length === 0
            }
          />
          <Button asChild>
            <Link
              className="whitespace-nowrap text-foreground"
              to="/create-project"
            >
              Create project
            </Link>
          </Button>
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
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell key={cell.id}>
                        {index === 0 ? ( // Check if it's the 'name' column
                          <Link to={`/projects/${row.original.id}/list`}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </Link>
                        ) : (
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )
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
                    {loading ? "" : "No projects found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {projectCount === 1
              ? `${
                  table.getRowModel().rows.length
                } of ${projectCount} row visible.`
              : `${
                  table.getRowModel().rows.length
                } of ${projectCount} rows visible.`}
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
    </div>
  );
}
