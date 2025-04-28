import cookies from "js-cookie";

interface AuthData {
  token: string;
  userId: string;
}

const COOKIE_CONFIG = {
  AUTH_TOKEN: process.env.NEXT_PUBLIC_AUTH_TOKEN_NAME || "auth_token",
  USER_ID: process.env.NEXT_PUBLIC_USER_ID_NAME || "user_id",
  EXPIRES: Number(process.env.NEXT_PUBLIC_COOKIE_EXPIRES_IN_DAYS || 2),
};

export const cookieUtils = {
  setAuthData: ({ token, userId }: AuthData) => {
    cookies.set(COOKIE_CONFIG.AUTH_TOKEN, token, {
      expires: COOKIE_CONFIG.EXPIRES,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    cookies.set(COOKIE_CONFIG.USER_ID, userId, {
      expires: COOKIE_CONFIG.EXPIRES,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  },

  getAuthData: (): AuthData | null => {
    const token = cookies.get(COOKIE_CONFIG.AUTH_TOKEN);
    const userId = cookies.get(COOKIE_CONFIG.USER_ID);

    if (!token || !userId) return null;

    return { token, userId };
  },

  removeAuthData: () => {
    cookies.remove(COOKIE_CONFIG.AUTH_TOKEN, { path: "/" });
    cookies.remove(COOKIE_CONFIG.USER_ID, { path: "/" });
  },
};
