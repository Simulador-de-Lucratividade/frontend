import { AxiosResponse } from "axios";
import {
  ILogin,
  ILoginResponse,
  IRegister,
  IRegisterResponse,
} from "../interfaces/ISession";
import api from "@/shared/services/api.service";

const login = async ({
  email,
  password,
}: ILogin): Promise<AxiosResponse<ILoginResponse>> =>
  await api.post("/sessions", { email, password });

const register = async ({
  email,
  password,
  name,
  document,
}: IRegister): Promise<AxiosResponse<IRegisterResponse>> =>
  await api.post("/user", { name, email, password, document });

export const sessionService = { login, register };
