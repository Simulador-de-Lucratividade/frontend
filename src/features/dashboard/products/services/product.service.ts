import { AxiosResponse } from "axios";
import {
  ICreateProduct,
  ICreateProductResponse,
  IGetAllProductsResponse,
  IGetProductResponse,
} from "../interface/IProduct";
import api from "@/shared/services/api.service";

const create = async ({
  name,
  description,
  acquisition_cost,
  sale_price,
  reference_code,
}: ICreateProduct): Promise<AxiosResponse<ICreateProductResponse>> =>
  await api.post("/product", {
    name,
    description,
    acquisition_cost,
    sale_price,
    reference_code,
  });

const update = async (
  product_id: string,
  {
    name,
    description,
    acquisition_cost,
    sale_price,
    reference_code,
  }: ICreateProduct
): Promise<AxiosResponse<ICreateProductResponse>> =>
  await api.put(`/product/${product_id}`, {
    name,
    description,
    acquisition_cost,
    sale_price,
    reference_code,
  });

const getProductById = async (
  product_id: string
): Promise<AxiosResponse<IGetProductResponse>> =>
  await api.get(`/product/${product_id}`);

const remove = async (product_id: string): Promise<void> =>
  await api.delete(`/product/${product_id}`);

const list = async (): Promise<AxiosResponse<IGetAllProductsResponse>> =>
  await api.get("/product");

export const productService = { create, update, getProductById, remove, list };
