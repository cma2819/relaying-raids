export type User = {
  id: string;
  login: string;
  email: string;
  name: string;
  avatar: string;
  accessToken?: string;
  refreshToken?: string | null;
};