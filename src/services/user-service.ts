import axios from "axios";
import AuthService from "./auth-service";
import type { User } from "@/types/user";

const API_URL = `${import.meta.env.VITE_API_URL}users`;

type UserUpdateRequest = {
  name: string;
  company?: string | null;
  location?: string | null;
};

type PasswordUpdateRequest = {
  currentPassword: string;
  newPassword: string;
};

class UserService {
  // GET /users
  async getUsers(): Promise<User[]> {
    const response = await axios.get<User[]>(API_URL, {
      headers: AuthService.getAuthHeader(),
    });
    return response.data;
  }

  // GET /users/{id}
  async getUserById(id: number): Promise<User> {
    const response = await axios.get<User>(API_URL + "/" + id, {
      headers: AuthService.getAuthHeader(),
    });
    return response.data;
  }

  // GET /users/email?email={email}
  async getUserByEmail(email: string): Promise<User> {
    const response = await axios.get<User>(API_URL + "/" + "email", {
      params: { email },
      headers: AuthService.getAuthHeader(),
    });
    return response.data;
  }

  // DELETE /users/{id}
  async deleteUser(id: number): Promise<void> {
    await axios.delete(API_URL + "/" + id, {
      headers: AuthService.getAuthHeader(),
    });
  }

  // PATCH /users/{id}
  async updateUserDetails(
    id: number,
    request: UserUpdateRequest,
  ): Promise<User> {
    const response = await axios.patch<User>(API_URL + "/" + id, request, {
      headers: AuthService.getAuthHeader(),
    });
    return response.data;
  }

  // PATCH /users/{id}/email
  async updateUserEmail(id: number, newEmail: string): Promise<string> {
    const response = await axios.patch(
      API_URL + "/" + id + "/email",
      { newEmail },
      {
        headers: AuthService.getAuthHeader(),
      },
    );
    return response.data.accessToken;
  }

  // PATCH /users/{id}/password
  async updateUserPassword(
    id: number,
    request: PasswordUpdateRequest,
  ): Promise<void> {
    const response = await axios.patch(
      API_URL + "/" + id + "/password",
      request,
      {
        headers: AuthService.getAuthHeader(),
      },
    );
    return response.data;
  }

  // PATCH /users/{id}/picture
  async updateUserPicture(id: number, pictureData: FormData): Promise<Blob> {
    const response = await axios.patch<Blob>(
      API_URL + "/" + id + "/picture",
      pictureData,
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

  // DELETE /users/{id}/picture
  async deleteUserPicture(id: number): Promise<void> {
    await axios.delete(API_URL + "/" + id + "/picture", {
      headers: AuthService.getAuthHeader(),
    });
  }
}

export default new UserService();
