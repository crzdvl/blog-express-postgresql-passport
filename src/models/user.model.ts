export interface NewUser {
  name: string;
  email: string;
  password: string;
  is_confirmed_email: boolean;
  role: number;
}

export interface UpdatedUser {
  id: number;
  name: string;
  email: string;
  password: string;
}
