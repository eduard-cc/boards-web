import {
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { IssueStatus } from "@/types/issue";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Role, type Member } from "@/types/member";

export default function IssueStatusSelect({
  value,
  editMode,
  currentMember,
}: {
  value?: IssueStatus;
  editMode?: boolean;
  currentMember?: Member | null;
}) {
  const form = useFormContext();
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (value) {
      form.setValue("status", value);
    }
  }, []);

  function renderSelectContent() {
    return (
      <SelectContent>
        <SelectGroup>
          <SelectItem
            value={IssueStatus.TO_DO}
            className="hover:cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <CircleIcon />
              <span>To do</span>
            </div>
          </SelectItem>
          <SelectItem
            value={IssueStatus.IN_PROGRESS}
            className="hover:cursor-pointer"
          >
            <div className="flex items-center gap-2 text-sky-800 dark:text-sky-600">
              <StopwatchIcon />
              <span>In progress</span>
            </div>
          </SelectItem>
          <SelectItem value={IssueStatus.DONE} className="hover:cursor-pointer">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-600">
              <CheckCircledIcon />
              <span>Done</span>
            </div>
          </SelectItem>
          <SelectItem
            value={IssueStatus.CANCELED}
            className="hover:cursor-pointer"
          >
            <div className="flex items-center gap-2 text-red-800 dark:text-red-600">
              <CrossCircledIcon />
              <span>Canceled</span>
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    );
  }

  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem>
          <FormLabel className={cn(editMode && "pl-3")}>Status</FormLabel>
          {currentMember?.role === Role.VIEWER ? (
            <div className="px-3 py-2 text-sm">
              {field.value === IssueStatus.TO_DO && (
                <div className="flex items-center gap-2">
                  <CircleIcon />
                  <span>To do</span>
                </div>
              )}
              {field.value === IssueStatus.IN_PROGRESS && (
                <div className="flex items-center gap-2 text-sky-800 dark:text-sky-600">
                  <StopwatchIcon />
                  <span>In progress</span>
                </div>
              )}
              {field.value === IssueStatus.DONE && (
                <div className="flex items-center gap-2 text-green-800 dark:text-green-600">
                  <CheckCircledIcon />
                  <span>Done</span>
                </div>
              )}
              {field.value === IssueStatus.CANCELED && (
                <div className="flex items-center gap-2 text-red-800 dark:text-red-600">
                  <CrossCircledIcon />
                  <span>Canceled</span>
                </div>
              )}
            </div>
          ) : (
            <FormControl>
              {editMode ? (
                <Select
                  defaultValue={value ? value : IssueStatus.TO_DO}
                  onValueChange={field.onChange}
                  onOpenChange={(isOpen) => {
                    setIsFocused(isOpen);
                  }}
                >
                  <SelectTrigger
                    className={cn(
                      !isFocused &&
                        "border-0 text-foreground shadow-none hover:bg-accent focus:bg-transparent",
                    )}
                    hideCaret
                  >
                    <SelectValue placeholder="Select issue status" />
                  </SelectTrigger>
                  {renderSelectContent()}
                </Select>
              ) : (
                <Select
                  defaultValue={value ? value : IssueStatus.TO_DO}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue status" />
                  </SelectTrigger>
                  {renderSelectContent()}
                </Select>
              )}
            </FormControl>
          )}
          {!value && (
            <FormDescription>
              This is the issue's initial status upon creation.
            </FormDescription>
          )}
          {editMode ? isFocused && <FormMessage /> : <FormMessage />}
        </FormItem>
      )}
    />
  );
}
