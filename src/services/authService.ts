import API from "./api";

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const registerUser = (data: RegisterData) => {
  return API.post("/auth/register", data);
};

export const loginUser = (data: LoginData) => {
  return API.post("/auth/login", data);
};

interface ForgotPasswordData {
  email: string;
}

interface ResetPasswordData {
  password: string;
}

export const forgotPassword = (data: ForgotPasswordData) => {
  return API.post("/auth/forgot-password", data);
};

export const resetPassword = (token: string, data: ResetPasswordData) => {
  return API.post(`/auth/reset-password/${token}`, data);
};