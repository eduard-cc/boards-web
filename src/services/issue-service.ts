import axios from "axios";
import AuthService from "./auth-service";
import type { Issue } from "@/types/issue";
import type { IssueType } from "@/types/issue";
import type { IssueStatus } from "@/types/issue";
import type { IssuePriority } from "@/types/issue";

const API_URL = `${import.meta.env.VITE_API_URL}projects`;

type IssueCreateRequest = {
  title: string;
  description?: string | undefined;
  assigneeMemberId?: number | undefined;
  type: IssueType;
  status: IssueStatus;
  priority: IssuePriority;
  dueOn?: Date | null;
  createdByUserId: number;
};

type IssueUpdateRequest = {
  title: string;
  description?: string | null;
  assigneeMemberId?: number | null;
  type: IssueType;
  status: IssueStatus;
  priority: IssuePriority;
  dueOn?: Date | null;
};

type IssueStatusUpdateRequest = {
  status: IssueStatus;
};

class IssueService {
  // POST /projects/{projectId}/issues
  async createIssue(
    projectId: number,
    issueRequest: IssueCreateRequest,
    creatorId: number,
  ): Promise<Issue> {
    issueRequest.createdByUserId = creatorId;

    if (issueRequest.dueOn) {
      issueRequest.dueOn = this.adjustDate(issueRequest.dueOn);
    }

    const response = await axios.post<Issue>(
      API_URL + "/" + projectId + "/issues",
      issueRequest,
      {
        headers: AuthService.getAuthHeader(),
      },
    );
    return response.data;
  }

  // GET /projects/{projectId}/issues
  async getIssuesByProjectId(projectId: string): Promise<Issue[]> {
    const response = await axios.get<Issue[]>(
      API_URL + "/" + projectId + "/issues",
      {
        headers: AuthService.getAuthHeader(),
      },
    );
    return response.data;
  }

  //GET /projects/{projectId}/issues/{issueId}
  async getIssueById(projectId: number, issueId: number): Promise<Issue> {
    const response = await axios.get<Issue>(
      API_URL + "/" + projectId + "/issues/" + issueId,
      {
        headers: AuthService.getAuthHeader(),
      },
    );
    return response.data;
  }

  // PUT /projects/{projectId}/issues/{issueId}
  async updateIssue(
    projectId: number,
    issueId: number,
    issueRequest: IssueUpdateRequest,
  ): Promise<Issue> {
    if (issueRequest.dueOn) {
      issueRequest.dueOn = this.adjustDate(issueRequest.dueOn);
    }
    const response = await axios.put<Issue>(
      API_URL + "/" + projectId + "/issues/" + issueId,
      issueRequest,
      {
        headers: AuthService.getAuthHeader(),
      },
    );
    return response.data;
  }

  // PATCH /projects/{projectId}/issues/{issueId}/status
  async updateIssueStatus(
    projectId: number,
    issueId: number,
    status: IssueStatus,
  ): Promise<Issue> {
    const request: IssueStatusUpdateRequest = { status };
    const response = await axios.patch<Issue>(
      API_URL + "/" + projectId + "/issues/" + issueId + "/status",
      request,
      {
        headers: AuthService.getAuthHeader(),
      },
    );
    return response.data;
  }

  // DELETE /projects/{projectId}/issues/{issueId}
  async deleteIssue(projectId: number, issueId: number): Promise<void> {
    await axios.delete(API_URL + "/" + projectId + "/issues/" + issueId, {
      headers: AuthService.getAuthHeader(),
    });
  }

  adjustDate(date: Date): Date {
    // This is not time-zone safe, but it's good enough for now
    const hoursDiff = date.getHours() - date.getTimezoneOffset() / 60;
    const minutesDiff = (date.getHours() - date.getTimezoneOffset()) % 60;
    date.setHours(hoursDiff);
    date.setMinutes(minutesDiff);

    return date;
  }
}

export default new IssueService();
