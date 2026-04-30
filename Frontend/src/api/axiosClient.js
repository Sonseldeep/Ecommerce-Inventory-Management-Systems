import axios from "axios";

const API_BASE_URL = "https://localhost:7278/api";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
});

// ── Request Interceptor ───────────────────────────────────────────────────────
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Token-refresh queue ───────────────────────────────────────────────────────
let isRefreshing = false;
let queue = [];

const processQueue = (error, token = null) => {
  queue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token)
  );
  queue = [];
};

// ✅ No window.location here — just fire the event, React Router handles redirect
const forceLogout = (error) => {
  processQueue(error, null);
  localStorage.clear();
  window.dispatchEvent(new Event("auth:logout"));
};

// ── Response Interceptor ──────────────────────────────────────────────────────
axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error?.config;

    if (error?.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken || originalRequest._retry) {
      forceLogout(error);
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) =>
        queue.push({ resolve, reject })
      ).then((newToken) => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const resp = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refreshToken,
      });

      const newAccess = resp.data?.data?.accessToken;
      const newRefresh = resp.data?.data?.refreshToken;

      if (!newAccess || !newRefresh) {
        throw new Error("Invalid tokens received from refresh endpoint");
      }

      localStorage.setItem("accessToken", newAccess);
      localStorage.setItem("refreshToken", newRefresh);

      window.dispatchEvent(
        new CustomEvent("auth:refreshed", { detail: { accessToken: newAccess } })
      );

      processQueue(null, newAccess);
      originalRequest.headers.Authorization = `Bearer ${newAccess}`;
      return axiosClient(originalRequest);
    } catch (e) {
      forceLogout(e);
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosClient;
