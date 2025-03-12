import { AxiosResponse } from "axios";

import api from "@/shared/services/api.service";
import {
  ICreateService,
  ICreateServiceResponse,
  IGetAllServicesResponse,
  IGetServiceByIdResponse,
} from "../interface/IServices";

const create = async ({
  name,
  description,
  cost,
}: ICreateService): Promise<AxiosResponse<ICreateServiceResponse>> =>
  await api.post("/service", {
    name,
    description,
    cost,
  });

const update = async (
  service_id: string,
  { name, description, cost }: ICreateService
): Promise<AxiosResponse<ICreateServiceResponse>> =>
  await api.put(`/service/${service_id}`, {
    name,
    description,
    cost,
  });

const getProductById = async (
  service_id: string
): Promise<AxiosResponse<IGetServiceByIdResponse>> =>
  await api.get(`/service/${service_id}`);

const remove = async (service_id: string): Promise<void> =>
  await api.delete(`/service/${service_id}`);

const list = async (): Promise<AxiosResponse<IGetAllServicesResponse>> =>
  await api.get("/service");

export const additionalServicesService = {
  create,
  update,
  getProductById,
  remove,
  list,
};
