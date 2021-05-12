export interface UserDataDTO {
  name: string;
  email: string;
  password: string;
  is_confirmed_email: boolean;
  role: number;
}

export interface DBUserDataDTO {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface JwtUserInfmDTO {
  id: number;
  name: string;
  email: string;
}
