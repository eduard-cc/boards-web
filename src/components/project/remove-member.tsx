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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/get-initials";
import { Member } from "@/types/member";
import { toast } from "@/components/ui/use-toast";
import MemberService from "@/services/member-service";
import { useEffect, useState } from "react";
import { useProjectContext } from "@/providers/project-provider";

type RemoveMemberProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  memberId: number;
};

export default function RemoveMember({
  open,
  setOpen,
  memberId,
}: RemoveMemberProps) {
  const [member, setMember] = useState<Member>();
  const { setUpdate } = useProjectContext();

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const member = await MemberService.getMemberById(memberId);
        setMember(member);
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
      fetchMember();
    }
  }, [memberId, open]);

  async function handleRemoveMember() {
    try {
      await MemberService.deleteMember(memberId);
      toast({
        title: "Member removed.",
        description: `${member?.user.name} no longer has access to this project.`,
      });
      setUpdate((update) => !update);
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
        <AlertDialogHeader>
          <AlertDialogTitle>Remove member?</AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col">
            <p className="mb-4">
              This user will no longer have access to this project, but issues
              created by them will remain.
            </p>
            <div className="flex items-center gap-2">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={`data:image/png;base64,${member?.user.picture}`}
                />
                <AvatarFallback className="font-normal">
                  {member?.user.name ? getInitials(member.user.name) : "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="max-w-[200px] truncate font-medium text-foreground">
                  {member?.user.name}
                </p>
                <p className="max-w-[200px] truncate font-normal text-muted-foreground">
                  {member?.user.email}
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
            onClick={handleRemoveMember}
          >
            Remove member
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
