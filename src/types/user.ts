export interface User {
  id: string;
  name?: string;
  photo?: string;
  email?: string;

  [key: string]: unknown;
}
