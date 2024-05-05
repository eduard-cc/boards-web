import {
  DotsHorizontalIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import CommentsService from "@/services/comments-service";
import type { Comment } from "@/types/comment";
import { toast } from "@/components/ui/use-toast";

type CommentActionsProps = {
  projectId: number;
  issueId: number;
  commentId: number;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CommentActions({
  projectId,
  issueId,
  commentId,
  setComments,
  setEditMode,
}: CommentActionsProps) {
  const handleDeleteComment = async () => {
    try {
      await CommentsService.deleteComment(projectId, issueId, commentId);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId),
      );
      toast({
        title: "Comment deleted.",
        description: "Your comment has been permanently deleted.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Please try again.",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-2 text-foreground data-[state=open]:bg-muted"
          size="icon"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={() => setEditMode(true)}
        >
          Edit
          <DropdownMenuShortcut>
            <Pencil1Icon className="h-4 w-4" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive hover:cursor-pointer focus:bg-destructive focus:text-destructive-foreground"
          onClick={handleDeleteComment}
        >
          Delete
          <DropdownMenuShortcut className={cn("opacity-100")}>
            <TrashIcon className="h-4 w-4" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
