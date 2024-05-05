import axios from "axios";
import AuthService from "./auth-service";
import type { Notification } from "@/types/notification";

const API_URL = import.meta.env.VITE_API_URL;

class NotificationService {
  // GET /users/{userId}/notifications
  async getNotificationsByUserId(id: number): Promise<Notification[]> {
    const response = await axios.get<Notification[]>(
      API_URL + "users/" + id + "/notifications",
      {
        headers: AuthService.getAuthHeader(),
      },
    );
    return response.data;
  }

  // DELETE /users/{userId}/notifications/{notificationId}
  async deleteNotification(
    userId: number,
    notificationId: number,
  ): Promise<void> {
    await axios.delete<Notification>(
      API_URL + "users/" + userId + "/notifications/" + notificationId,
      {
        headers: AuthService.getAuthHeader(),
      },
    );
  }

  // DELETE /users/{userId}/notifications
  async deleteAllNotifications(userId: number): Promise<void> {
    await axios.delete(API_URL + "users/" + userId + "/notifications", {
      headers: AuthService.getAuthHeader(),
    });
  }

  // PATCH /users/{userId}/notifications/{notificationId}
  async toggleRead(userId: number, notificationId: number): Promise<void> {
    await axios.patch<Notification>(
      API_URL + "users/" + userId + "/notifications/" + notificationId,
      {},
      {
        headers: AuthService.getAuthHeader(),
      },
    );
  }
}

export default new NotificationService();
