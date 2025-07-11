export interface RegisterVetRequest {
  username: string;
  password: string;
  clinicId: number;
  celNum?: string;
  email?: string;
}
