// "use server";
import axios, { isAxiosError } from "axios";

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v2`,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

async function getToken(tokenName: string): Promise<string | null> {
  try {
    return (
      (await cookieStore.get(tokenName))?.value ||
      localStorage.getItem(tokenName)
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error getting token:", error.message);
    }
    return null;
  }
}

// Add interceptors for request and response
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getToken("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle errors globally
    if (error.response) {
      console.error(
        "API Error:",
        error.response.data.message || error.response.statusText
      );
    } else {
      console.error("Network Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
export { isAxiosError, getToken };
