export interface IService {
  id: string;
  name: string;
  description: string;
  cost: number;
  user_id?: string;
}

export interface ICreateService {
  name: string;
  description: string;
  cost: number;
}

export interface ICreateServiceResponse {
  success: boolean;
  service: IService;
}

export interface IGetServiceByIdResponse {
  service: IService;
}

export interface IGetAllServicesResponse {
  service: IService[];
}
