
import axiosClient from "./axiosClient";

export const registerApi = (payload) => axiosClient.post("/auth/register", payload);
export const loginApi = (payload) => axiosClient.post("/auth/login", payload);
export const logoutApi = (refreshToken) => axiosClient.post("/auth/logout", { refreshToken });


// OTP
export const sendVerificationOtpApi = (email) =>
  axiosClient.post("/auth/send-verification-otp", { email });

export const verifyEmailOtpApi = (email, otp) =>
  axiosClient.post("/auth/verify-email-otp", { email, otp });

// Password reset
export const forgotPasswordApi = (email) =>
  axiosClient.post("/auth/forgot-password", { email });

export const resetPasswordApi = (payload) =>
  axiosClient.post("/auth/reset-password", payload);

// Change password (auth required)
export const changePasswordApi = (payload) =>
  axiosClient.post("/auth/change-password", payload);