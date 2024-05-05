import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import CommentsService from "@/services/comments-service";
import { useProjectContext } from "@/providers/project-provider";
import { Comment } from "@/types/comment";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CommentCard from "./comment-card";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/providers/user-provider";
import { getInitials } from "@/utils/get-initials";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const commentFormSchema = z.object({
  comment: z
    .string({ required_error: "Enter a comment." })
    .max(500, { message: "Must not exceed 500 characters." }),
});

type CommentFormValues = z.infer<typeof commentFormSchema>;

export default function CommentContainer({ issueId }: { issueId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const { projectData } = useProjectContext();
  const { imageUrl: contextImageUrl, name: contextName } = useUser();

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    mode: "onSubmit",
    defaultValues: {
      comment: "",
    },
  });

  const { watch, trigger } = form;
  const comment = watch("comment");
  const [isFocused, setIsFocused] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (projectData) {
          const comments = await CommentsService.getComments(
            projectData.id,
            issueId,
          );
          setComments(comments);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "There was a problem with your request. Please try again.",
        });
      }
    };

    fetchComments();
  }, [issueId, projectData]);

  const handleSendClick = async () => {
    const isValid = await trigger("comment");

    if (isValid && comment) {
      try {
        if (projectData) {
          const response = await CommentsService.createComment(
            projectData.id,
            issueId,
            { body: comment },
          );
          setComments([response, ...comments]);
          form.reset();
          toast({
            title: "Comment sent.",
            description: `"${response.body}"`,
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

  const toggleSortOrder = () => {
    setSortOrder((prevSortOrder) =>
      prevSortOrder === "newest" ? "oldest" : "newest",
    );
    setComments((prevComments) => [...prevComments].reverse());
  };

  return (
    <>
      <Form {...form}>
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex flex-col gap-4 px-3">
                  <div className="flex items-center justify-between">
                    <FormLabel className="ml-3">Comments</FormLabel>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleSortOrder();
                            }}
                            className="text-foreground"
                          >
                            <span className="mr-2">
                              {sortOrder === "newest" ? "Newest" : "Oldest"}{" "}
                              first
                            </span>
                            {sortOrder === "newest" ? (
                              <ArrowDownIcon />
                            ) : (
                              <ArrowUpIcon />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Reverse sort direction</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex gap-3">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={contextImageUrl ? contextImageUrl : ""}
                      />
                      <AvatarFallback className="text-xs font-normal">
                        {contextName ? getInitials(contextName) : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex w-full gap-4">
                      <Textarea
                        placeholder="Add a comment..."
                        className="max-h-44 text-foreground hover:bg-accent focus:bg-transparent"
                        {...field}
                        onFocus={() => {
                          setIsFocused(true);
                        }}
                        onBlur={() => {
                          setIsFocused(false);
                        }}
                      />
                      {(comment || isFocused) && (
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            handleSendClick();
                          }}
                        >
                          Send
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </FormControl>
              <FormMessage className="px-3" />
            </FormItem>
          )}
        />
      </Form>
      {projectData && (
        <div className="h-full text-sm text-foreground">
          <div>
            {comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                projectId={projectData.id}
                issueId={issueId}
                setComments={setComments}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
