export type User = {
  id: string;
  fullName: string;
  email: string;
  role: "admin" | "learner";
};
export type LoginInput = {
  email: string;
  password: string;
  remember: boolean;
};

export type RegisterInput = {
  fullName: string;
  email: string;
  password: string;
};
