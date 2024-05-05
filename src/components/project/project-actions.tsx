import {
  DotsHorizontalIcon,
  ExitIcon,
  GearIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import LeaveProject from "./leave-project";
import DeleteProject from "./delete-project";
import { Link } from "react-router-dom";
import { UsersIcon } from "lucide-react";
import { useProjectContext } from "@/providers/project-provider";
import { Member, Role } from "@/types/member";
import AuthService from "@/services/auth-service";
import MemberService from "@/services/member-service";
import { toast } from "@/components/ui/use-toast";

type ProjectActionsProps = { projectId?: number; additionalItems?: boolean };

export default function ProjectActions({
  projectId,
  additionalItems,
}: ProjectActionsProps) {
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [isOpenLeaveDialog, setIsOpenLeaveDialog] = useState(false);
  const { currentMember } = useProjectContext();
  const [localCurrentMember, setLocalCurrentMember] = useState<Member | null>(
    null,
  );

  useEffect(() => {
    const fetchCurrentMember = async () => {
      const currentUserId = AuthService.getUserId();
      if (projectId && currentUserId) {
        try {
          const currentMember = await MemberService.getCurrentMember(
            currentUserId,
            projectId,
          );
          setLocalCurrentMember(currentMember);
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

    if (currentMember == null) {
      fetchCurrentMember();
    }
  }, [currentMember, projectId]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 text-foreground data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[160px]">
          {additionalItems && (
            <>
              <DropdownMenuItem asChild>
                <Link
                  to={"/projects/" + projectId + "/settings"}
                  className="hover:cursor-pointer"
                >
                  Settings
                  <DropdownMenuShortcut>
                    <GearIcon className="h-4 w-4" />
                  </DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to={"/projects/" + projectId + "/members"}
                  className="hover:cursor-pointer"
                >
                  Members
                  <DropdownMenuShortcut>
                    <UsersIcon className="h-4 w-4" />
                  </DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem
            className="text-destructive hover:cursor-pointer focus:bg-destructive focus:text-destructive-foreground"
            onClick={() => setIsOpenLeaveDialog(true)}
          >
            Leave project
            <DropdownMenuShortcut className={cn("opacity-100")}>
              <ExitIcon className="h-4 w-4" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          {currentMember?.role === Role.OWNER ||
          localCurrentMember?.role === Role.OWNER ? (
            <DropdownMenuItem
              className="text-destructive hover:cursor-pointer focus:bg-destructive focus:text-destructive-foreground"
              onClick={() => setIsOpenDeleteDialog(true)}
            >
              Delete project
              <DropdownMenuShortcut className={cn("opacity-100")}>
                <TrashIcon className="h-4 w-4" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      {currentMember ? (
        <LeaveProject
          open={isOpenLeaveDialog}
          setOpen={setIsOpenLeaveDialog}
          member={currentMember}
        />
      ) : localCurrentMember ? (
        <LeaveProject
          open={isOpenLeaveDialog}
          setOpen={setIsOpenLeaveDialog}
          member={localCurrentMember}
          projectId={projectId}
        />
      ) : null}
      <DeleteProject
        open={isOpenDeleteDialog}
        setOpen={setIsOpenDeleteDialog}
        projectId={projectId}
      />
    </>
  );
}
