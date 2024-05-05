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
import { Role, type Member } from "@/types/member";
import ReassignOwner from "./reassign-owner";
import MemberService from "@/services/member-service";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useProjectContext } from "@/providers/project-provider";
import { useEffect, useState } from "react";
import { useProjectListContext } from "@/providers/project-list-provider";

type LeaveProjectProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  member: Member;
  projectId?: number;
};

export default function LeaveProject({
  open,
  setOpen,
  member,
  projectId,
}: LeaveProjectProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const { projectData, memberCount, setMemberCount } = useProjectContext();
  const [localMemberCount, setLocalMemberCount] = useState<number | null>(null);
  const { setUpdate } = useProjectListContext();

  const handleLeaveProject = async () => {
    try {
      await MemberService.deleteMember(member.id);
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
      console.log(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Please try again.",
      });
    }
  };

  useEffect(() => {
    const fetchMemberCount = async () => {
      if (projectData) {
        const members = await MemberService.getMembersByProjectId(
          projectData?.id,
        );
        setMemberCount(members.length);
      } else if (projectId) {
        const members = await MemberService.getMembersByProjectId(projectId);
        setLocalMemberCount(members.length);
      }
    };

    if (memberCount == null && localMemberCount == null) {
      fetchMemberCount();
    }
  }, [localMemberCount, memberCount, projectData, projectId, setMemberCount]);

  return (
    <>
      {(member.role === Role.OWNER && memberCount && memberCount > 1) ||
      (member.role === Role.OWNER &&
        localMemberCount &&
        localMemberCount > 1) ? (
        <ReassignOwner
          open={open}
          setOpen={setOpen}
          projectId={projectId}
          localCurrentMember={member}
        />
      ) : (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent className="max-w-[36rem] text-foreground">
            <AlertDialogHeader>
              <AlertDialogTitle>Leave project?</AlertDialogTitle>
              <AlertDialogDescription>
                {memberCount == 1 || localMemberCount == 1
                  ? "You are the only member of this project. If you leave, the project will be deleted."
                  : "You will no longer have access to this project, but issues created by you will remain."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                autoFocus
                className="bg-destructive"
                onClick={handleLeaveProject}
              >
                Leave project
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
