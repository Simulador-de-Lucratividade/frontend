import { useEffect, useState } from "react";
import { ICustomer, ICustomerResponse } from "../interface/ICustomer";
import { customerService } from "../services/customer.service";
import { AxiosError, AxiosResponse } from "axios";
import { notification } from "antd";

interface ICustomerHookResponse {
  customer: ICustomer | undefined;
  customerLoading: boolean;
  customerRefresh: () => void;
}

export const useCostumerById = (id: string): ICustomerHookResponse => {
  const [customer, setCustomer] = useState<ICustomer | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = () => {
    if (loading || !id) return;

    setLoading(true);

    customerService
      .getById(id)
      .then((res: AxiosResponse<ICustomerResponse>) =>
        setCustomer(res.data.customer)
      )
      .catch((error) => {
        if (error instanceof AxiosError) {
          const errorMessage = error.response?.data?.message || error.message;
          notification.error({
            message: "Falha ao buscar cliente",
            description: errorMessage,
          });
        } else {
          notification.error({
            message: "Falha ao buscar cliente",
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
    if (id) {
      fetchData();
    }
  }, [id]);

  return {
    customer,
    customerLoading: loading,
    customerRefresh: fetchData,
  };
};
