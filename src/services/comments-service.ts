import axios from "axios";
import type { Comment } from "@/types/comment";
import AuthService from "@/services/auth-service";

const API_URL = `${import.meta.env.VITE_API_URL}projects/`;

class CommentsService {
  // POST /projects/{projectId}/issues/{issueId}/comments
  async createComment(
    projectId: number,
    issueId: number,
    request: { body: string },
  ): Promise<Comment> {
    const response = await axios.post<Comment>(
      API_URL + projectId + "/issues/" + issueId + "/comments",
      request,
      {
        headers: AuthService.getAuthHeader(),
      },
    );
    return response.data;
  }

  // GET /projects/{projectId}/issues/{issueId}/comments
  async getComments(projectId: number, issueId: number): Promise<Comment[]> {
    const response = await axios.get<Comment[]>(
      API_URL + projectId + "/issues/" + issueId + "/comments",
      {
        headers: AuthService.getAuthHeader(),
      },
    );
    return response.data;
  }

  // DELETE /projects/{projectId}/issues/{issueId}/comments/{commentId}
  async deleteComment(
    projectId: number,
    issueId: number,
    commentId: number,
  ): Promise<void> {
    await axios.delete(
      API_URL + projectId + "/issues/" + issueId + "/comments/" + commentId,
      {
        headers: AuthService.getAuthHeader(),
      },
    );
  }

  // PATCH /projects/{projectId}/issues/{issueId}/comments/{commentId}
  async editComment(
    projectId: number,
    issueId: number,
    commentId: number,
    request: { body: string },
  ): Promise<Comment> {
    const response = await axios.patch<Comment>(
      API_URL + projectId + "/issues/" + issueId + "/comments/" + commentId,
      request,
      {
        headers: AuthService.getAuthHeader(),
      },
    );
    return response.data;
  }
}

export default new CommentsService();
