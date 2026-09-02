export type RegisterFormValues = {
  fullName: string;
  email: string;
  password: string;
}

export type LoginFormValues = {
  email: string;
  password: string;
}

export type messageType = {
  message: string;
  success: boolean;
}