import { CalendarIcon, Cross2Icon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFormContext } from "react-hook-form";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { Member, Role } from "@/types/member";

export function IssueDueDateSelect({
  editMode,
  currentMember,
}: {
  editMode?: boolean;
  currentMember?: Member | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="dueOn"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className={cn(editMode && "pl-3")}>Due date</FormLabel>
          {currentMember?.role === Role.VIEWER ? (
            <div className="px-3 py-2 text-sm">
              {field.value ? (
                format(field.value, "PPP")
              ) : (
                <span>{editMode ? "None" : "Select due date"}</span>
              )}
            </div>
          ) : (
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger
                asChild
                className={cn(
                  editMode &&
                    !isOpen &&
                    "border-0 text-foreground shadow-none hover:bg-accent",
                )}
              >
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "pl-3 text-left font-normal hover:bg-transparent ",
                      !field.value && "text-muted-foreground",
                      field.value && "pr-0",
                      editMode && !isOpen && "hover:bg-accent",
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>{editMode ? "None" : "Select due date"}</span>
                    )}
                    {field.value ? (
                      <TooltipProvider delayDuration={400}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              onClick={(e) => {
                                e.preventDefault();
                                form.resetField("dueOn");
                                form.setValue("dueOn", null);
                              }}
                              className={cn("group ml-auto")}
                            >
                              <Cross2Icon className="h-4 w-4 opacity-50 group-hover:text-destructive group-hover:opacity-100" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Remove due date</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <CalendarIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          editMode && "invisible",
                        )}
                      />
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => {
                    field.onChange(date);
                    setIsOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
          {editMode ? isOpen && <FormMessage /> : <FormMessage />}
        </FormItem>
      )}
    />
  );
}
