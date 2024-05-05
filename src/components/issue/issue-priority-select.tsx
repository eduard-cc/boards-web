import {
  ChevronDownIcon,
  ChevronUpIcon,
  DoubleArrowDownIcon,
  DoubleArrowUpIcon,
} from "@radix-ui/react-icons";
import {
  FormControl,
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
import { EqualIcon } from "lucide-react";
import { IssuePriority } from "@/types/issue";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { type Member, Role } from "@/types/member";

export default function IssuePrioritySelect({
  editMode,
  value,
  currentMember,
}: {
  value?: IssuePriority;
  editMode?: boolean;
  currentMember?: Member | null;
}) {
  const form = useFormContext();
  const [isFocused, setIsFocused] = useState(false);

  function renderSelectContent() {
    return (
      <SelectContent>
        <SelectGroup>
          <SelectItem
            value={IssuePriority.HIGHEST}
            className="hover:cursor-pointer"
          >
            <div className="flex items-center gap-2 text-red-800 dark:text-red-600">
              <DoubleArrowUpIcon />
              <span>Highest</span>
            </div>
          </SelectItem>
          <SelectItem
            value={IssuePriority.HIGH}
            className="hover:cursor-pointer"
          >
            <div className="flex items-center gap-2 text-orange-800 dark:text-orange-600">
              <ChevronUpIcon />
              <span>High</span>
            </div>
          </SelectItem>
          <SelectItem
            value={IssuePriority.MEDIUM}
            className="hover:cursor-pointer"
          >
            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-600">
              <EqualIcon size={15} />
              <span>Medium</span>
            </div>
          </SelectItem>
          <SelectItem
            value={IssuePriority.LOW}
            className="hover:cursor-pointer"
          >
            <div className="flex items-center gap-2 text-green-800 dark:text-green-600">
              <ChevronDownIcon />
              <span>Low</span>
            </div>
          </SelectItem>
          <SelectItem
            value={IssuePriority.LOWEST}
            className="hover:cursor-pointer"
          >
            <div className="flex items-center gap-2 text-teal-800 dark:text-teal-600">
              <DoubleArrowDownIcon />
              <span>Lowest</span>
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    );
  }

  return (
    <FormField
      control={form.control}
      name="priority"
      render={({ field }) => (
        <FormItem>
          <FormLabel className={cn(editMode && "pl-3")}>Priority</FormLabel>
          {currentMember?.role === Role.VIEWER ? (
            <div className="px-3 py-2 text-sm">
              {field.value === IssuePriority.HIGHEST && (
                <div className="flex items-center gap-2 text-red-800 dark:text-red-600">
                  <DoubleArrowUpIcon />
                  <span>Highest</span>
                </div>
              )}
              {field.value === IssuePriority.HIGH && (
                <div className="flex items-center gap-2 text-orange-800 dark:text-orange-600">
                  <ChevronUpIcon />
                  <span>High</span>
                </div>
              )}
              {field.value === IssuePriority.MEDIUM && (
                <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-600">
                  <EqualIcon size={15} />
                  <span>Medium</span>
                </div>
              )}
              {field.value === IssuePriority.LOW && (
                <div className="flex items-center gap-2 text-green-800 dark:text-green-600">
                  <ChevronDownIcon />
                  <span>Low</span>
                </div>
              )}
              {field.value === IssuePriority.LOWEST && (
                <div className="flex items-center gap-2 text-teal-800 dark:text-teal-600">
                  <DoubleArrowDownIcon />
                  <span>Lowest</span>
                </div>
              )}
            </div>
          ) : (
            <FormControl>
              {editMode ? (
                <Select
                  defaultValue={value ? value : IssuePriority.MEDIUM}
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
                    <SelectValue placeholder="Select issue priority" />
                  </SelectTrigger>
                  {renderSelectContent()}
                </Select>
              ) : (
                <Select
                  defaultValue={value ? value : IssuePriority.MEDIUM}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue priority" />
                  </SelectTrigger>
                  {renderSelectContent()}
                </Select>
              )}
            </FormControl>
          )}
          {editMode ? isFocused && <FormMessage /> : <FormMessage />}
        </FormItem>
      )}
    />
  );
}
