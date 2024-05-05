import { columns } from "@/components/issues-list-view/columns";
import { DataTable } from "@/components/issues-list-view/data-table";
import { toast } from "@/components/ui/use-toast";
import IssueService from "@/services/issue-service";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Issue } from "@/types/issue";
import { useProjectContext } from "@/providers/project-provider";

export default function ProjectIssueListPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const { id } = useParams();
  const { update, setIssueCount, projectData } = useProjectContext();

  useEffect(() => {
    const fetchIssues = async () => {
      if (id) {
        try {
          const issues = await IssueService.getIssuesByProjectId(id);
          console.log(JSON.stringify(issues));
          setIssues(issues);
          setIssueCount(issues.length);
          document.title = `Boards | ${projectData?.name}`;
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description:
              "There was a problem with your request. Please try again.",
          });
        }
      }
      return [];
    };

    fetchIssues();
  }, [id, update]);

  return <DataTable data={issues} columns={columns} />;
}
