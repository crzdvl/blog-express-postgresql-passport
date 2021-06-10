export interface DBUserDataDTO {
  id: number;
  name?: string;
  email: string;
  password?: string;
  is_confirmed_email?: boolean;
}
