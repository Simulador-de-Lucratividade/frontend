import axios from "axios";

interface RefreshPayload {
  accessToken: string;
}

interface RefreshResponse {
  payload: RefreshPayload;
}

export async function getRefreshToken(): Promise<RefreshResponse> {
  try {
    const response = await axios.get("/refresh-token", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
