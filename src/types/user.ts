export interface User {
  id: string;
  name?: string;
  photo?: string;
  email?: string;
  token?: string;

  [key: string]: unknown;
}
