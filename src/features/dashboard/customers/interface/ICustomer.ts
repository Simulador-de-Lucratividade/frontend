export interface ICustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  user_id: string;
  created_at: string;
}

export interface ICreateCustomer {
  name: string;
  email: string;
  phone?: string;
}

export interface ICustomerResponse {
  success: boolean;
  customer: ICustomer;
}

export interface IGetAllCustomersResponse {
  success: boolean;
  customer: ICustomer[];
}
