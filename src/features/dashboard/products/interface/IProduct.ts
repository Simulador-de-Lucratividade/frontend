export interface IProduct {
  id: string;
  name: string;
  description: string;
  reference_code: string;
  acquisition_cost: number;
  sale_price: number;
  user_id: string;
}

export interface ICreateProduct {
  name: string;
  description: string;
  acquisition_cost: number;
  sale_price: number;
  reference_code?: string;
}

export interface ICreateProductResponse {
  success: boolean;
  product: IProduct;
}

export interface IGetAllProductsResponse {
  product: IProduct[];
}

export interface IGetProductResponse {
  product: IProduct;
}
