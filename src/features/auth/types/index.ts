export type RegisterFormValues = {
  fullName: string;
  email: string;
  password: string;
}

export type LoginFormValues = {
  email: string;
  password: string;
}

export type MessageType = {
  message: string;
  success: boolean;
}
