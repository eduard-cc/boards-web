import axios from "axios";
import jwtDecode from "jwt-decode";

const API_URL = `${import.meta.env.VITE_API_URL}auth/`;

type AuthResponse = {
  accessToken: string;
};

class AuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(API_URL + "login", {
      email,
      password,
    });
    localStorage.setItem("jwt", JSON.stringify(response.data.accessToken));

    return response.data;
  }

  async signup(
    name: string,
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(API_URL + "signup", {
      name,
      email,
      password,
    });
    localStorage.setItem("jwt", JSON.stringify(response.data.accessToken));

    return response.data;
  }

  logout(): void {
    localStorage.removeItem("jwt");
  }

  getUserId(): number | null {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      try {
        const decodedToken: { userId: number } = jwtDecode(jwt);
        return decodedToken.userId;
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    return null;
  }

  getRole(): string | null {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      try {
        const decodedToken: { role: string } = jwtDecode(jwt);
        return decodedToken.role;
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    return null;
  }

  // Includes JWT in request headers for routes that require authentication
  getAuthHeader() {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      return { Authorization: "Bearer " + JSON.parse(jwt) };
    } else {
      return { Authorization: "" };
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("jwt");
  }
}

export default new AuthService();
