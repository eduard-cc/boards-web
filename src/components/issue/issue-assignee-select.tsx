import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CaretSortIcon,
  CheckIcon,
  CircleBackslashIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { getInitials } from "@/utils/get-initials";
import MemberService from "@/services/member-service";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import AuthService from "@/services/auth-service";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import { Member, Role } from "@/types/member";

export default function IssueAssigneeSelect({
  editMode,
  currentMember,
}: {
  editMode?: boolean;
  currentMember?: Member | null;
}) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const form = useFormContext();
  const projectId = form.watch("projectId");

  const fetchMembers = async () => {
    try {
      const members = await MemberService.getMembersByProjectId(projectId);
      setMembers(members);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Please try again.",
      });
    }
  };

  useEffect(() => {
    if (projectId) {
      form.clearErrors("assigneeMemberId");
      fetchMembers();
    } else {
      form.setError("assigneeMemberId", {
        type: "manual",
        message: "Select a project first.",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const handleAssignToMe = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const user = members.find(
      (member) => member.user.id === AuthService.getUserId(),
    );
    if (user) {
      form.setValue("assigneeMemberId", user.id);
    }
  };

  const handleUnassign = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    form.resetField("assigneeMemberId");
    form.setValue("assigneeMemberId", null);
  };

  return (
    <FormField
      control={form.control}
      name="assigneeMemberId"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className={cn(editMode && "pl-3")}>Assignee</FormLabel>
          <div>
            {currentMember?.role === Role.VIEWER ? (
              <p className="px-3 py-2 text-sm">
                {field.value ? (
                  <div className="flex w-full justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage
                          src={`data:image/png;base64,${members.find(
                            (member) => member.id === field.value,
                          )?.user.picture}`}
                        />
                        <AvatarFallback className="text-xs font-normal">
                          {getInitials(
                            members.find((member) => member.id === field.value)
                              ?.user.name ?? members.length.toString(),
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        {
                          members.find((member) => member.id === field.value)
                            ?.user.name
                        }
                        {members.find((member) => member.id === field.value)
                          ?.user.id === AuthService.getUserId() && (
                          <Badge className="ml-2">You</Badge>
                        )}
                      </div>
                    </div>
                    <TooltipProvider delayDuration={400}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            className={cn("group")}
                            onClick={handleUnassign}
                          >
                            <Cross2Icon className="h-4 w-4 pr-0 opacity-50 group-hover:text-destructive group-hover:opacity-100" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Unassign</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CircleBackslashIcon height={15} width={15} />
                    <p>Unassigned</p>
                  </div>
                )}
                {!editMode && (
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                )}
              </p>
            ) : (
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger
                  asChild
                  className={cn(
                    "w-full px-3",
                    editMode &&
                      !isPopoverOpen &&
                      "border-0 text-foreground shadow-none hover:bg-muted",
                  )}
                >
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between font-normal hover:bg-transparent",
                        !field.value && "text-muted-foreground",
                        editMode && !isPopoverOpen && "hover:bg-accent",
                        editMode && "pr-0",
                      )}
                    >
                      {field.value ? (
                        <div className="flex w-full justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarImage
                                src={`data:image/png;base64,${members.find(
                                  (member) => member.id === field.value,
                                )?.user.picture}`}
                              />
                              <AvatarFallback className="text-xs font-normal">
                                {getInitials(
                                  members.find(
                                    (member) => member.id === field.value,
                                  )?.user.name ?? members.length.toString(),
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              {
                                members.find(
                                  (member) => member.id === field.value,
                                )?.user.name
                              }
                              {members.find(
                                (member) => member.id === field.value,
                              )?.user.id === AuthService.getUserId() && (
                                <Badge className="ml-2">You</Badge>
                              )}
                            </div>
                          </div>
                          <TooltipProvider delayDuration={400}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className={cn("group")}
                                  onClick={handleUnassign}
                                >
                                  <Cross2Icon className="h-4 w-4 pr-0 opacity-50 group-hover:text-destructive group-hover:opacity-100" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Unassign</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CircleBackslashIcon height={15} width={15} />
                          <p>Unassigned</p>
                        </div>
                      )}
                      {!editMode && (
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  className={cn(
                    "min-w-[26rem] p-0",
                    !editMode && "w-[var(--radix-popover-trigger-width)]",
                  )}
                >
                  <Command>
                    <CommandInput placeholder="Search members..." />
                    <CommandEmpty>No members found.</CommandEmpty>
                    <CommandGroup>
                      {members.map((member) => (
                        <CommandItem
                          value={`${member.user.name} ${member.user.email}`}
                          key={member.id}
                          onSelect={() => {
                            form.setValue("assigneeMemberId", member.id);
                            setIsPopoverOpen(false);
                          }}
                          className="cursor-pointer"
                        >
                          <div className="flex w-full items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-9 w-9">
                                <AvatarImage
                                  src={`data:image/png;base64,${member.user.picture}`}
                                />
                                <AvatarFallback>
                                  {getInitials(member.user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium leading-none">
                                  {member.user.name}
                                  {member.user.id ===
                                    AuthService.getUserId() && (
                                    <Badge className="ml-2">You</Badge>
                                  )}
                                  <Badge variant="outline" className="ml-2">
                                    {member.role.charAt(0).toUpperCase() +
                                      member.role.slice(1).toLowerCase()}
                                  </Badge>
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {member.user.email}
                                </p>
                              </div>
                            </div>
                            <CheckIcon
                              className={cn(
                                "h-4 w-4",
                                member.id === field.value
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
            )}
            {projectId && currentMember?.role != Role.VIEWER && (
              <FormDescription className={cn(editMode ? "pl-3" : "pt-2")}>
                <Button
                  variant="link"
                  className="h-0 p-0 text-xs"
                  onClick={handleAssignToMe}
                >
                  Assign to me
                </Button>
              </FormDescription>
            )}
          </div>
          {editMode ? isPopoverOpen && <FormMessage /> : <FormMessage />}
        </FormItem>
      )}
    />
  );
}
