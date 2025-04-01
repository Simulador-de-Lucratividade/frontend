import { AxiosResponse } from "axios";
import api from "@/shared/services/api.service";
import {
  ICreateCustomerDTO,
  ICustomerResponse,
  IGetAllCustomersResponse,
} from "../interface/ICustomer";

const create = async ({
  name,
  email,
  phone,
  address,
  city,
  country,
  state,
  zip_code,
}: ICreateCustomerDTO): Promise<AxiosResponse<ICustomerResponse>> =>
  await api.post("/customer", {
    name,
    email,
    phone,
    address,
    city,
    country,
    state,
    zip_code,
  });

const update = async (
  customer_id: string,
  {
    name,
    email,
    phone,
    address,
    city,
    country,
    state,
    zip_code,
  }: ICreateCustomerDTO
): Promise<AxiosResponse<ICustomerResponse>> =>
  await api.put(`/customer/${customer_id}`, {
    name,
    email,
    phone,
    address,
    city,
    country,
    state,
    zip_code,
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
