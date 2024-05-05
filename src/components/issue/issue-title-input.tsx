import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { Member, Role } from "@/types/member";

export default function IssueTitleInput({
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
      name="title"
      render={({ field }) => (
        <>
          {currentMember?.role === Role.VIEWER ? (
            <p
              className={cn(
                "min-w-[30rem] border-0 px-6 py-1 text-lg font-medium tracking-tight text-foreground",
              )}
            >
              {field.value}
            </p>
          ) : (
            <FormItem>
              {!editMode && (
                <FormLabel>
                  Title<span className="text-destructive">*</span>
                </FormLabel>
              )}
              <FormControl>
                {editMode ? (
                  <Input
                    className={cn(
                      "min-w-[30rem] border-0 text-lg font-medium tracking-tight text-foreground shadow-none hover:bg-accent focus:bg-transparent",
                    )}
                    placeholder="Enter the issue's title"
                    {...field}
                    onFocus={() => {
                      setIsFocused(true);
                    }}
                    onBlur={() => {
                      setIsFocused(false);
                      form.trigger("title");
                    }}
                  />
                ) : (
                  <Input
                    className="text-foreground"
                    placeholder="Enter the issue's title"
                    {...field}
                  />
                )}
              </FormControl>
              {editMode ? isFocused && <FormMessage /> : <FormMessage />}
            </FormItem>
          )}
        </>
      )}
    />
  );
}
