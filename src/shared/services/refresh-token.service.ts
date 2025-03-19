import axios from "axios";

interface RefreshPayload {
  accessToken: string;
}

interface RefreshResponse {
  payload: RefreshPayload;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function getRefreshToken(): Promise<RefreshResponse> {
  try {
    const response = await axios.get(`${BASE_URL}/refresh-token`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
