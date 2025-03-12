export interface ILogin {
  email: string;
  password: string;
}

export interface ILoginResponse {
  success: boolean;
  login: {
    user: {
      name: string;
      email: string;
    };
    token: string;
    refreshToken: string;
  };
}

export interface IRegister {
  name: string;
  email: string;
  password: string;
  document: string;
}

export interface IRegisterResponse {
  id: string;
  name: string;
  email: string;
  document: string;
  profile: string;
  status: string;
}
