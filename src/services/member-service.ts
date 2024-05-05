import axios from "axios";
import AuthService from "./auth-service";
import { Member, Role } from "@/types/member";

const API_URL = import.meta.env.VITE_API_URL;

type UpdateRoleResponse = {
  role: Role;
};

type InviteUsersRequest = {
  members: {
    email: string;
    role: Role;
  }[];
};

class MemberService {
  // GET /members/{memberId}
  async getMemberById(memberId: number): Promise<Member> {
    const response = await axios.get<Member>(API_URL + "members/" + memberId, {
      headers: AuthService.getAuthHeader(),
    });
    return response.data;
  }

  // GET /projects/{projectId}/members
  async getMembersByProjectId(projectId: number): Promise<Member[]> {
    const response = await axios.get<Member[]>(
      API_URL + "projects/" + projectId + "/members",
      {
        headers: AuthService.getAuthHeader(),
      },
    );
    return response.data;
  }

  // PATCH /projects/{projectId}/members
  async inviteMembers(
    projectId: number,
    inviteUsersRequest: InviteUsersRequest,
  ): Promise<Member[]> {
    const response = await axios.patch<Member[]>(
      API_URL + "projects/" + projectId + "/members",
      inviteUsersRequest,
      {
        headers: AuthService.getAuthHeader(),
      },
    );
    return response.data;
  }

  // GET /projects/{projectId}/members/{userId}
  async getCurrentMember(
    userId: number,
    projectId: number | string,
  ): Promise<Member> {
    const response = await axios.get<Member>(
      API_URL + "projects/" + projectId + "/members/" + userId,
      {
        headers: AuthService.getAuthHeader(),
      },
    );
    return response.data;
  }

  // DELETE /members/{memberId}
  async deleteMember(memberId: number): Promise<void> {
    await axios.delete(API_URL + "members/" + memberId, {
      headers: AuthService.getAuthHeader(),
    });
  }

  // PATCH /members/{memberId}
  async updateMemberRole(
    memberId: number,
    role: Role,
  ): Promise<UpdateRoleResponse> {
    const response = await axios.patch<UpdateRoleResponse>(
      API_URL + "members/" + memberId,
      {
        role,
      },
      {
        headers: AuthService.getAuthHeader(),
      },
    );
    return response.data;
  }
}

export default new MemberService();
