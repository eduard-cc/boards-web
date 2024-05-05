import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { getInitials } from "@/utils/get-initials";
import AuthService from "@/services/auth-service";
import ProjectService from "@/services/project-service";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import type { Project } from "@/types/project";
import { useProjectContext } from "@/providers/project-provider";

export default function IssueProjectSelect() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const form = useFormContext();
  const { projectData } = useProjectContext();

  useEffect(() => {
    const fetchProjects = async () => {
      const userId = AuthService.getUserId();
      if (userId) {
        try {
          const projects = await ProjectService.getProjectsByUserId(userId);
          setProjects(projects);
          if (projects.length === 0) {
            form.setError("projectId", {
              type: "manual",
              message: "You don't have any projects. Create one first.",
            });
          }
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description:
              "There was a problem with your request. Please try again.",
          });
        }
      }
    };
    fetchProjects();

    if (projectData?.id) {
      form.setValue("projectId", projectData.id);
    }
  }, []);

  return (
    <FormField
      control={form.control}
      name="projectId"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>
            Project<span className="text-destructive">*</span>
          </FormLabel>
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  disabled={projects.length === 0}
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "justify-between font-normal hover:bg-transparent",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  {field.value ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5 rounded-md">
                        <AvatarImage
                          src={`data:image/png;base64,${projects.find(
                            (project) => project.id === field.value,
                          )?.icon}`}
                        />
                        <AvatarFallback className="rounded-md text-xs font-normal">
                          {getInitials(
                            projects.find(
                              (project) => project.id === field.value,
                            )?.name ?? "",
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        {
                          projects.find((project) => project.id === field.value)
                            ?.name
                        }
                        <span className="text-muted-foreground">
                          {" "}
                          (
                          {
                            projects.find(
                              (project) => project.id === field.value,
                            )?.key
                          }
                          )
                        </span>
                      </div>
                    </div>
                  ) : (
                    "Select project"
                  )}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
              <Command>
                <CommandInput placeholder="Search project..." />
                <CommandEmpty>No project found.</CommandEmpty>
                <CommandGroup>
                  {projects.map((project) => (
                    <CommandItem
                      value={project.name}
                      key={project.id}
                      onSelect={() => {
                        form.setValue("projectId", project.id);
                        form.resetField("assigneeMemberId");
                        form.clearErrors("projectId");
                        setIsPopoverOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      <div className="flex w-full items-center justify-between gap-2">
                        <div className="flex gap-2">
                          <Avatar className="h-5 w-5 rounded-md">
                            <AvatarImage
                              src={`data:image/png;base64,${project.icon}`}
                            />
                            <AvatarFallback className="rounded-md text-xs font-normal">
                              {getInitials(project.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            {project.name}
                            <span className="text-muted-foreground">
                              {" "}
                              ({project.key})
                            </span>
                          </div>
                        </div>
                        <CheckIcon
                          className={cn(
                            "h-4 w-4",
                            project.id === field.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
