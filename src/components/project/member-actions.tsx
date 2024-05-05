import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Cross2Icon, ExitIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Role, type Member } from "@/types/member";
import AuthService from "@/services/auth-service";
import LeaveProject from "./leave-project";
import RemoveMember from "./remove-member";
import { useProjectContext } from "@/providers/project-provider";

export default function MemberActions({ row }: { row: Member }) {
  const [openLeaveProject, setOpenLeaveProject] = useState(false);
  const [openRemoveMember, setOpenRemoveMember] = useState(false);
  const { currentMember } = useProjectContext();
  const memberId = row.id;
  const currentUserId = AuthService.getUserId();

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {row.user.id === currentUserId ? (
              <Button
                variant="ghost"
                onClick={() => setOpenLeaveProject(true)}
                size="icon"
                className="hover:bg-destructive hover:text-destructive-foreground"
              >
                <span className="sr-only">Leave project</span>
                <ExitIcon className="h-4 w-4" />
              </Button>
            ) : currentMember?.role === Role.OWNER ||
              (currentMember?.role === Role.ADMIN &&
                row.role != Role.ADMIN &&
                row.role != Role.OWNER) ? (
              <Button
                variant="ghost"
                onClick={() => setOpenRemoveMember(true)}
                size="icon"
                className="hover:bg-destructive hover:text-destructive-foreground"
              >
                <span className="sr-only">Remove member</span>
                <Cross2Icon className="h-4 w-4" />
              </Button>
            ) : null}
          </TooltipTrigger>
          <TooltipContent>
            {row.user.id === currentUserId ? (
              <p>Leave project</p>
            ) : (
              <p>Remove this member</p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <RemoveMember
        open={openRemoveMember}
        setOpen={setOpenRemoveMember}
        memberId={memberId}
      />
      <LeaveProject
        open={openLeaveProject}
        setOpen={setOpenLeaveProject}
        member={row}
      />
    </>
  );
}
