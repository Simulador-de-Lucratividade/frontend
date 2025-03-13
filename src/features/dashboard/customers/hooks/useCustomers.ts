import { useEffect, useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { notification } from "antd";
import { ICustomer, IGetAllCustomersResponse } from "../interface/ICustomer";
import { customerService } from "../services/customer.service";

interface ICustomerResponse {
  customers: ICustomer[];
  customerLoading: boolean;
  customerRefresh: () => void;
}

export const useCustomers = (): ICustomerResponse => {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = () => {
    if (loading) return;

    setLoading(true);

    customerService
      .list()
      .then((res: AxiosResponse<IGetAllCustomersResponse>) =>
        setCustomers(res.data.customer)
      )
      .catch((error) => {
        if (error instanceof AxiosError) {
          const errorMessage = error.response?.data?.message || error.message;
          notification.error({
            message: "Falha ao buscar clientes",
            description: errorMessage,
          });
        } else {
          notification.error({
            message: "Falha ao buscar clientes",
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
    customers,
    customerLoading: loading,
    customerRefresh: fetchData,
  };
};
