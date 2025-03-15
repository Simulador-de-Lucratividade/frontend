import { AxiosResponse } from "axios";
import {
  IBudgetResponse,
  ICreateBudget,
  IGetAllBudgetsResponse,
} from "../interfaces/IBudget";
import api from "@/shared/services/api.service";

const create = async ({
  customer_id,
  issue_date,
  validity_date,
  total_value,
  status,
  items,
}: ICreateBudget): Promise<AxiosResponse<IBudgetResponse>> =>
  await api.post("/budget", {
    customer_id,
    issue_date,
    validity_date,
    total_value,
    status,
    items,
  });

const getAll = async (): Promise<AxiosResponse<IGetAllBudgetsResponse>> =>
  await api.get("/budget");

const getById = async (id: string): Promise<AxiosResponse<IBudgetResponse>> =>
  await api.get(`/budget/${id}`);

const update = async (
  id: string,
  { issue_date, validity_date, total_value, status, items }: ICreateBudget
): Promise<AxiosResponse<IBudgetResponse>> =>
  await api.put(`/budget/${id}`, {
    issue_date,
    validity_date,
    total_value,
    status,
    items,
  });

const remove = async (id: string): Promise<AxiosResponse<IBudgetResponse>> =>
  await api.delete(`/budget/${id}`);

export const budgetService = {
  create,
  getAll,
  getById,
  update,
  remove,
};
