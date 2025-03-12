import { useEffect, useState } from "react";
import { IGetAllProductsResponse, IProduct } from "../interface/IProduct";
import { productService } from "../services/product.service";
import { AxiosError, AxiosResponse } from "axios";
import { notification } from "antd";

interface IProductResponse {
  products: IProduct[];
  productLoading: boolean;
  productRefresh: () => void;
}

export const useProducts = (): IProductResponse => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = () => {
    if (loading) return;

    setLoading(true);

    productService
      .list()
      .then((res: AxiosResponse<IGetAllProductsResponse>) =>
        setProducts(res.data.product)
      )
      .catch((error) => {
        if (error instanceof AxiosError) {
          const errorMessage = error.response?.data?.message || error.message;
          notification.error({
            message: "Falha ao cadastrar produto",
            description: errorMessage,
          });
        } else {
          notification.error({
            message: "Falha ao cadastrar o produto",
            description:
              "Ocorreu um erro inesperado. Tente novamente mais tarde.",
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    products,
    productLoading: loading,
    productRefresh: fetchData,
  };
};
