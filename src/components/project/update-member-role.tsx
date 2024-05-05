import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Member, Role } from "@/types/member";
import { toast } from "@/components/ui/use-toast";
import MemberService from "@/services/member-service";
import { useState } from "react";
import { useProjectContext } from "@/providers/project-provider";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { formatRole } from "@/utils/format-role";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/get-initials";

export default function UpdateMemberRole({ row }: { row: Member }) {
  const [selectedRole, setSelectedRole] = useState(row.role);
  const { currentMember, setUpdate, setCurrentMember } = useProjectContext();
  const [openReassignOwnerDialog, setOpenReassignOwnerDialog] = useState(false);

  const handleUpdateRole = async (role: Role) => {
    try {
      await MemberService.updateMemberRole(row.id, role);
      setSelectedRole(role);
      if (role === Role.OWNER) {
        toast({
          title: "Member role updated.",
          description: `Owner has been reassigned to ${row.user.name}. You are now an Admin.`,
        });
        if (currentMember) {
          setCurrentMember({ ...currentMember, role: Role.ADMIN });
        }
      } else {
        toast({
          title: "Member role updated.",
          description: `${
            row.user.name
          }'s role has been updated to ${formatRole(role)}.`,
        });
      }
      setUpdate((update) => !update);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Please try again.",
      });
    }
  };

  const handleReassignOwnerClick = () => {
    handleUpdateRole(Role.OWNER);
  };

  const handleCheckIfOwner = (role: Role) => {
    if (role === Role.OWNER) {
      setOpenReassignOwnerDialog(true);
    } else {
      handleUpdateRole(role);
    }
  };

  function renderTooltip(tooltipContent: string) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger>
            <Select defaultValue={selectedRole} disabled>
              <SelectTrigger disabled className="w-40 bg-secondary !opacity-70">
                <SelectValue>
                  {currentMember?.id === row.id
                    ? formatRole(currentMember?.role)
                    : formatRole(selectedRole)}
                </SelectValue>
              </SelectTrigger>
            </Select>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  function renderRoles() {
    if (
      currentMember?.role === Role.OWNER ||
      currentMember?.role === Role.ADMIN
    ) {
      if (currentMember?.id === row.id) {
        if (currentMember?.role === Role.OWNER) {
          return renderTooltip("Choose another member to reassign the Owner.");
        } else {
          return renderTooltip("You can't change your own role.");
        }
      } else if (
        currentMember?.role === Role.ADMIN &&
        selectedRole === Role.OWNER
      ) {
        return renderTooltip("You can't change the Owner's role.");
      } else if (
        currentMember?.role === Role.ADMIN &&
        selectedRole === Role.ADMIN
      ) {
        return renderTooltip("You can't change the role of other Admins.");
      } else {
        return (
          <Select value={selectedRole} onValueChange={handleCheckIfOwner}>
            <SelectTrigger className="w-40 bg-secondary">
              <SelectValue>{formatRole(selectedRole)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                disabled={currentMember?.role === Role.ADMIN}
                value={Role.OWNER}
                className="hover:cursor-pointer"
              >
                <p>Owner</p>
                <p className="text-muted-foreground">
                  Project-wide access across all resources.
                </p>
              </SelectItem>
              <SelectItem value={Role.ADMIN} className="hover:cursor-pointer">
                <p>Admin</p>
                <p className="text-muted-foreground">
                  Can update settings and manage other members.
                </p>
              </SelectItem>
              <SelectItem
                value={Role.DEVELOPER}
                className="hover:cursor-pointer"
              >
                <p>Developer</p>
                <p className="text-muted-foreground">
                  Can add, edit and delete issues.
                </p>
              </SelectItem>
              <SelectItem value={Role.VIEWER} className="hover:cursor-pointer">
                <p>Viewer</p>
                <p className="text-muted-foreground">
                  Can view and comment on issues.
                </p>
              </SelectItem>
            </SelectContent>
          </Select>
        );
      }
    } else {
      return <Badge variant="secondary">{formatRole(selectedRole)}</Badge>;
    }
  }

  return (
    <>
      {renderRoles()}
      <AlertDialog
        open={openReassignOwnerDialog}
        onOpenChange={setOpenReassignOwnerDialog}
      >
        <AlertDialogContent className="max-w-[32rem] text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle>Reassign Owner?</AlertDialogTitle>
            <AlertDialogDescription>
              <p className="mb-4">
                This member will be reassigned as the Owner of this project.
                Your role will default to Admin.
              </p>
              <div className="flex items-center gap-2">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={`data:image/png;base64,${row.user.picture}`}
                  />
                  <AvatarFallback className="font-normal">
                    {getInitials(row.user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="max-w-[200px] truncate font-medium text-foreground">
                    {row.user.name}
                  </p>
                  <p className="max-w-[200px] truncate font-normal text-muted-foreground">
                    {row.user.email}
                  </p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              autoFocus
              className="bg-destructive"
              onClick={handleReassignOwnerClick}
            >
              Reassign Owner
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
