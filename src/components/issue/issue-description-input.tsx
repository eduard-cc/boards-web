import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Role, type Member } from "@/types/member";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

export default function IssueDescriptionInput({
  editMode,
  currentMember,
}: {
  editMode?: boolean;
  currentMember?: Member | null;
}) {
  const form = useFormContext();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem className={cn(editMode && "px-3")}>
          <FormLabel className={cn(editMode && "pl-3")}>Description</FormLabel>
          {currentMember?.role === Role.VIEWER ? (
            <p className={cn("border-0 px-3 py-1 text-foreground shadow-none")}>
              {field.value}
            </p>
          ) : (
            <FormControl>
              {editMode ? (
                <Textarea
                  className={cn(
                    "border-0 text-foreground shadow-none hover:bg-accent focus:bg-transparent",
                  )}
                  placeholder="Enter the issue's description"
                  {...field}
                  onFocus={() => {
                    setIsFocused(true);
                  }}
                  onBlur={() => {
                    setIsFocused(false);
                    const trimmedValue = form.getValues("description").trim();
                    form.setValue("description", trimmedValue);
                    form.trigger("description");
                  }}
                />
              ) : (
                <Textarea
                  className="h-32 text-foreground"
                  placeholder="Enter the issue's description"
                  {...field}
                />
              )}
            </FormControl>
          )}
          {editMode ? isFocused && <FormMessage /> : <FormMessage />}
        </FormItem>
      )}
    />
  );
}
