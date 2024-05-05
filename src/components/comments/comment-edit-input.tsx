import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import type { Comment } from "@/types/comment";
import { useEffect } from "react";
import CommentsService from "@/services/comments-service";
import { useProjectContext } from "@/providers/project-provider";
import { toast } from "@/components/ui/use-toast";

const commentEditFormSchema = z.object({
  comment: z
    .string({ required_error: "Enter a comment." })
    .max(500, { message: "Must not exceed 500 characters." }),
});

type CommentEditInputProps = {
  issueId: number;
  comment: Comment;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
};

type CommentEditFormValues = z.infer<typeof commentEditFormSchema>;

export default function CommentEditInput({
  issueId,
  comment,
  setEditMode,
  setComments,
}: CommentEditInputProps) {
  const form = useForm<CommentEditFormValues>({
    resolver: zodResolver(commentEditFormSchema),
    mode: "onSubmit",
    defaultValues: {
      comment: "",
    },
  });
  const { trigger } = form;
  const { projectData } = useProjectContext();

  useEffect(() => {
    form.setValue("comment", comment.body);
  }, [comment.body, form]);

  const handleCancelEdit = () => {
    setEditMode(false);
    form.reset();
  };

  const handleEdit = async () => {
    const isValid = await trigger("comment");
    if (!isValid) return;

    if (form.getValues("comment").trim() === "") {
      form.setError("comment", {
        type: "manual",
        message: "Must not be empty.",
      });
      return;
    }

    try {
      if (projectData) {
        const response = await CommentsService.editComment(
          projectData.id,
          issueId,
          comment.id,
          {
            body: form.getValues("comment"),
          },
        );
        toast({
          title: "Comment edited.",
          description: `"${response.body}"`,
        });
        setEditMode(false);
        setComments((comments) =>
          comments.map((c) =>
            c.id === comment.id
              ? {
                  ...c,
                  body: response.body,
                  lastUpdatedOn: response.lastUpdatedOn,
                }
              : c,
          ),
        );
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Please try again.",
      });
    }
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
                <div className="flex flex-col gap-2">
                  <Textarea
                    placeholder="Edit comment..."
                    {...field}
                    autoFocus
                  />
                  <FormMessage />
                  <div className="flex justify-end gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        handleCancelEdit();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        handleEdit();
                      }}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </Form>
    </>
  );
}
