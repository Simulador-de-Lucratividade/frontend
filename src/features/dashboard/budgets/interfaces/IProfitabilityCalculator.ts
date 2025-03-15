import { IService } from "../../additional-services/interface/IServices";

export interface IOtherCost {
  id: string;
  description: string;
  amount: number;
  cost_type: "fixed" | "percentage";
}

export interface IProfitabilityItem {
  product_id: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  discount?: number;
}

export interface IProfitabilityRequest {
  items: IProfitabilityItem[];
  total_value: number;
  services: IService[];
  other_costs: IOtherCost[];
}

export interface IProfitabilityResponse {
  success: boolean;
  profitability: number;
}
