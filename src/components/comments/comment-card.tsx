import type { Comment } from "@/types/comment";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/utils/get-initials";
import { DateTime } from "luxon";
import AuthService from "@/services/auth-service";
import CommentActions from "./comment-actions";
import { UserHoverCard } from "@/components/user-hover-card";
import { useState } from "react";
import CommentEditInput from "./comment-edit-input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type CommentCardProps = {
  comment: Comment;
  projectId: number;
  issueId: number;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
};

export default function CommentCard({
  comment,
  projectId,
  issueId,
  setComments,
}: CommentCardProps) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const currentUserId = AuthService.getUserId();

  return (
    <>
      <div className="flex gap-3 p-3">
        <UserHoverCard member={comment.createdBy}>
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={`data:image/png;base64,${comment.createdBy.user.picture}`}
            />
            <AvatarFallback className="text-xs font-normal">
              {getInitials(comment.createdBy.user.name)}
            </AvatarFallback>
          </Avatar>
        </UserHoverCard>
        <div className="flex w-full justify-between gap-2">
          <div className="w-full">
            <div className="mb-1 flex items-center">
              <UserHoverCard member={comment.createdBy}>
                <p className="font-medium">{comment.createdBy.user.name}</p>
              </UserHoverCard>
              <p className="ml-2 text-xs text-muted-foreground">
                {DateTime.fromISO(comment.createdOn).toFormat(
                  "d LLLL yyyy 'at' HH:mm",
                )}{" "}
                {comment.lastUpdatedOn != null && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="hover:cursor-default">
                        <span> (edited)</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {DateTime.fromISO(comment.lastUpdatedOn).toFormat(
                            "d LLLL yyyy 'at' HH:mm",
                          )}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </p>
            </div>
            {editMode ? (
              <CommentEditInput
                setEditMode={setEditMode}
                comment={comment}
                issueId={issueId}
                setComments={setComments}
              />
            ) : (
              <p className="max-w-md whitespace-pre-wrap break-words break-all">
                {comment.body}
              </p>
            )}
          </div>
          {comment.createdBy.user.id === currentUserId && (
            <CommentActions
              projectId={projectId}
              issueId={issueId}
              commentId={comment.id}
              setComments={setComments}
              setEditMode={setEditMode}
            />
          )}
        </div>
      </div>
    </>
  );
}
