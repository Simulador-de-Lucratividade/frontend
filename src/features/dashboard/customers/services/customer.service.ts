import { AxiosResponse } from "axios";
import api from "@/shared/services/api.service";
import {
  ICreateCustomer,
  ICustomerResponse,
  IGetAllCustomersResponse,
} from "../interface/ICustomer";

const create = async ({
  name,
  email,
  phone,
}: ICreateCustomer): Promise<AxiosResponse<ICustomerResponse>> =>
  await api.post("/customer", {
    name,
    email,
    phone,
  });

const update = async (
  customer_id: string,
  { name, email, phone }: ICreateCustomer
): Promise<AxiosResponse<ICustomerResponse>> =>
  await api.put(`/customer/${customer_id}`, {
    name,
    email,
    phone,
  });

const getById = async (
  customer_id: string
): Promise<AxiosResponse<ICustomerResponse>> =>
  await api.get(`/customer/${customer_id}`);

const remove = async (customer_id: string): Promise<void> =>
  await api.delete(`/customer/${customer_id}`);

const list = async (): Promise<AxiosResponse<IGetAllCustomersResponse>> =>
  await api.get("/customer");

export const customerService = { create, update, getById, remove, list };
