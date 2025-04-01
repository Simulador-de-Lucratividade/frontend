export interface ICustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  user_id: string;
  created_at: string;
}

export interface ICreateCustomerDTO {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  user_id?: string;
}

export interface ICustomerResponse {
  success: boolean;
  customer: ICustomer;
}

export interface IGetAllCustomersResponse {
  success: boolean;
  customer: ICustomer[];
}
