import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/issues-list-view/data-table-view-options";
import {
  types,
  priorities,
  statuses,
} from "@/components/issues-list-view/data.ts";
import { DataTableFacetedFilter } from "@/components/issues-list-view/data-table-faceted-filter";
import CreateIssueForm from "@/components/issue/create-issue-form";
import { useProjectContext } from "@/providers/project-provider";
import { Role } from "@/types/member";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  homePage?: boolean | null;
}

export function DataTableToolbar<TData>({
  table,
  homePage,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { currentMember } = useProjectContext();

  return (
    <div className="flex items-center justify-between">
      <div className="-mx-2 flex flex-1 items-center space-x-2 md:mx-0">
        <Input
          placeholder="Filter issues by title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="hidden h-8 w-[250px] text-foreground md:flex"
          type="search"
        />
        {table.getColumn("type") && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Type"
            options={types}
            height="h-8"
          />
        )}
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
            height="h-8"
          />
        )}
        {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities}
            height="h-8"
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 text-foreground lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex">
        <DataTableViewOptions table={table} />
        {currentMember?.role != Role.VIEWER && !homePage && (
          <CreateIssueForm
            trigger={
              <Button size="sm" className="ml-2 whitespace-nowrap">
                Create issue
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
