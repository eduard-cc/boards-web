import { useFormContext } from "react-hook-form";
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
import { IssueType } from "@/types/issue";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Role, type Member } from "@/types/member";
import taskSvg from "@/assets/task.svg";
import bugSvg from "@/assets/bug.svg";
import epicSvg from "@/assets/epic.svg";

export default function IssueTypeSelect({
  value,
  editMode,
  currentMember,
}: {
  value?: IssueType;
  editMode?: boolean;
  currentMember?: Member | null;
}) {
  const form = useFormContext();
  const [isFocused, setIsFocused] = useState(false);

  function renderSelectContent() {
    return (
      <SelectContent>
        <SelectGroup>
          <SelectItem value={IssueType.TASK} className="hover:cursor-pointer">
            <div className="flex items-center gap-2">
              <img src={taskSvg} className="w-5 rounded-[0.2rem]" />
              <span>Task</span>
            </div>
          </SelectItem>
          <SelectItem value={IssueType.EPIC} className="hover:cursor-pointer">
            <div className="flex items-center gap-2">
              <img src={epicSvg} className="w-5 rounded-[0.2rem]" />
              <span>Epic</span>
            </div>
          </SelectItem>
          <SelectItem value={IssueType.BUG} className="hover:cursor-pointer">
            <div className="flex items-center gap-2">
              <img src={bugSvg} className="w-5 rounded-[0.2rem]" />
              <span>Bug</span>
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    );
  }

  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          {!editMode && <FormLabel>Issue type</FormLabel>}
          {currentMember?.role === Role.VIEWER ? (
            field.value === IssueType.TASK ? (
              <img src={taskSvg} className="w-5 rounded-[0.2rem] pr-1" />
            ) : field.value === IssueType.BUG ? (
              <img src={bugSvg} className="w-5 rounded-[0.2rem] pr-1" />
            ) : field.value === IssueType.EPIC ? (
              <img src={epicSvg} className="w-5 rounded-[0.2rem] pr-1" />
            ) : null
          ) : (
            <FormControl>
              {editMode ? (
                <Select
                  defaultValue={value ? value : IssueType.TASK}
                  onValueChange={field.onChange}
                  onOpenChange={(isOpen) => {
                    setIsFocused(isOpen);
                  }}
                >
                  <SelectTrigger
                    className={cn(
                      "border-0 p-2 text-foreground shadow-none hover:bg-muted focus:bg-transparent",
                      isFocused && "bg-muted",
                    )}
                    hideCaret
                  >
                    <SelectValue placeholder="Select issue type">
                      {field.value === IssueType.TASK ? (
                        <img src={taskSvg} className="w-5 rounded-[0.2rem]" />
                      ) : field.value === IssueType.BUG ? (
                        <img src={bugSvg} className="w-5 rounded-[0.2rem]" />
                      ) : field.value === IssueType.EPIC ? (
                        <img src={epicSvg} className="w-5 rounded-[0.2rem]" />
                      ) : null}
                    </SelectValue>
                  </SelectTrigger>
                  {renderSelectContent()}
                </Select>
              ) : (
                <Select
                  defaultValue={value ? value : IssueType.TASK}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue type" />
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
