import { useEffect, useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { notification } from "antd";
import { IGetAllServicesResponse, IService } from "../interface/IServices";
import { additionalServicesService } from "../services/services.service";

interface IServiceResponse {
  services: IService[];
  serviceLoading: boolean;
  serviceRefresh: () => void;
}

export const useServices = (): IServiceResponse => {
  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = () => {
    if (loading) return;

    setLoading(true);

    additionalServicesService
      .list()
      .then((res: AxiosResponse<IGetAllServicesResponse>) =>
        setServices(res.data.service)
      )
      .catch((error) => {
        if (error instanceof AxiosError) {
          const errorMessage = error.response?.data?.message || error.message;
          notification.error({
            message: "Falha ao cadastrar serviço",
            description: errorMessage,
          });
        } else {
          notification.error({
            message: "Falha ao cadastrar o serviço",
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
    services,
    serviceLoading: loading,
    serviceRefresh: fetchData,
  };
};
