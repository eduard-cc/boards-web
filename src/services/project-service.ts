import axios from "axios";
import AuthService from "./auth-service";
import type { Project } from "@/types/project";

const API_URL = `${import.meta.env.VITE_API_URL}projects`;

type ProjectUpdateRequest = {
  name?: string | null;
  key?: string | null;
};

class ProjectService {
  // POST /projects
  async createProject(formData: FormData): Promise<Project> {
    const response = await axios.post<Project>(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...AuthService.getAuthHeader(),
      },
    });
    return response.data;
  }

  // GET /projects?userId={userId}
  async getProjectsByUserId(userId: number): Promise<Project[]> {
    const response = await axios.get<Project[]>(API_URL, {
      params: { userId },
      headers: AuthService.getAuthHeader(),
    });
    return response.data;
  }

  // GET /projects/{id}
  async getProjectById(id: string | number): Promise<Project> {
    const response = await axios.get<Project>(API_URL + "/" + id, {
      headers: AuthService.getAuthHeader(),
    });
    return response.data;
  }

  // PATCH /projects/{id}
  async updateProjectDetails(
    id: number,
    request: ProjectUpdateRequest,
  ): Promise<Project> {
    const response = await axios.patch<Project>(API_URL + "/" + id, request, {
      headers: AuthService.getAuthHeader(),
    });
    return response.data;
  }

  // PATCH /projects/{id}/icon
  async updateProjectIcon(id: number, iconData: FormData): Promise<Blob> {
    const response = await axios.patch<Blob>(
      API_URL + "/" + id + "/icon",
      iconData,
      {
        responseType: "blob",
        headers: {
          "Content-Type": "multipart/form-data",
          ...AuthService.getAuthHeader(),
        },
      },
    );
    return response.data;
  }

  // DELETE /projects/{id}/icon
  async deleteProjectIcon(id: number): Promise<void> {
    await axios.delete(API_URL + "/" + id + "/icon", {
      headers: AuthService.getAuthHeader(),
    });
  }

  // DELETE /projects/{id}
  async deleteProject(id: number): Promise<void> {
    await axios.delete(API_URL + "/" + id, {
      headers: AuthService.getAuthHeader(),
    });
  }
}

export default new ProjectService();
