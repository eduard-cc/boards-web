import { getInitials } from "@/utils/get-initials";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useProjectContext } from "@/providers/project-provider";
import { useEffect, useState } from "react";
import { Role, type Member } from "@/types/member";
import MemberService from "@/services/member-service";
import { toast } from "@/components/ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLocation, useNavigate } from "react-router-dom";
import { useProjectListContext } from "@/providers/project-list-provider";

const reassignFormSchema = z.object({
  memberId: z.number({
    required_error: "Select a member to reassign the Owner to.",
  }),
});

type ReassignFormValues = z.infer<typeof reassignFormSchema>;

type ReassignOwnerProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  projectId?: number;
  localCurrentMember?: Member | null;
};

export default function ReassignOwner({
  open,
  setOpen,
  projectId,
  localCurrentMember,
}: ReassignOwnerProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { projectData } = useProjectContext();
  const [members, setMembers] = useState<Member[]>([]);
  const { currentMember } = useProjectContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { setUpdate } = useProjectListContext();

  const form = useForm<ReassignFormValues>({
    resolver: zodResolver(reassignFormSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        let members: Member[] = [];
        if (projectData) {
          members = await MemberService.getMembersByProjectId(projectData.id);
        } else if (projectId) {
          members = await MemberService.getMembersByProjectId(projectId);
        }
        let membersWithoutCurrentMember = members;
        if (currentMember) {
          membersWithoutCurrentMember = members.filter(
            (member) => member.id !== currentMember.id,
          );
        } else if (localCurrentMember) {
          membersWithoutCurrentMember = members.filter(
            (member) => member.id !== localCurrentMember.id,
          );
        }

        setMembers(membersWithoutCurrentMember);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "There was a problem with your request. Please try again.",
        });
      }
    };

    if (open) {
      fetchMembers();
    }
  }, [currentMember, localCurrentMember, open, projectData, projectId]);

  async function onSubmit(data: ReassignFormValues) {
    try {
      await MemberService.updateMemberRole(data.memberId, Role.OWNER);

      if (currentMember) {
        await MemberService.deleteMember(currentMember.id);
      } else if (localCurrentMember) {
        await MemberService.deleteMember(localCurrentMember.id);
      }
      if (location.pathname != "/projects") {
        navigate("/projects");
      } else {
        setUpdate((update) => !update);
      }
      toast({
        title: "Project left",
        description: `${
          projectData
            ? `You no longer have access to ${projectData.name}.`
            : "You have left a project."
        }`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Please try again.",
      });
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-[36rem] text-foreground">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AlertDialogHeader>
              <AlertDialogTitle>Before you leave</AlertDialogTitle>
              <AlertDialogDescription className="space-y-4">
                <p>
                  You are the Owner of this project. You must choose another
                  member to be the Owner before leaving.
                </p>
                <FormField
                  control={form.control}
                  name="memberId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <Popover
                        open={isPopoverOpen}
                        onOpenChange={setIsPopoverOpen}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              disabled={members.length === 0}
                              variant="outline"
                              role="combobox"
                              className={cn("justify-between font-normal")}
                            >
                              {field.value ? (
                                <div className="flex w-full justify-between text-foreground">
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
                                            (member) =>
                                              member.id === field.value,
                                          )?.user.name ??
                                            members.length.toString(),
                                        )}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      {
                                        members.find(
                                          (member) => member.id === field.value,
                                        )?.user.name
                                      }
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                "Select a member..."
                              )}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                          <Command>
                            <CommandInput placeholder="Search member..." />
                            <CommandEmpty>No member found.</CommandEmpty>
                            <CommandGroup>
                              {members.map((member) => (
                                <CommandItem
                                  value={member.user.name}
                                  key={member.id}
                                  onSelect={() => {
                                    form.setValue("memberId", member.id);
                                    setIsPopoverOpen(false);
                                    form.trigger("memberId");
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
                                          <Badge
                                            variant="outline"
                                            className="ml-2"
                                          >
                                            {member.role
                                              .charAt(0)
                                              .toUpperCase() +
                                              member.role
                                                .slice(1)
                                                .toLowerCase()}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-4">
              <AlertDialogCancel
                onClick={() => {
                  setOpen(false);
                  form.reset();
                  form.resetField("memberId");
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction autoFocus className="bg-destructive" asChild>
                <Button
                  variant="destructive"
                  type="submit"
                  disabled={!form.formState.isValid}
                >
                  Leave project
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
