import { ICustomer } from "../../customers/interface/ICustomer";
import { IProduct } from "../../products/interface/IProduct";

export interface DocumentCardProps {
  title: string;
  datetime: string;
  onEdit?: () => void;
  onDelete?: () => void;
  loading?: boolean;
}

export interface IBudgetItem {
  id: string;
  budget_id?: string;
  product_id: string;
  product?: IProduct;
  unit_price: number;
  quantity: number;
  total_price: number;
  discount?: number;
}

export interface BudgetItemViewModel extends Omit<IBudgetItem, "budget_id"> {
  product_name: string;
}

export interface IBudget {
  id: string;
  customer_id: string;
  customer: ICustomer;
  user_id: string;
  issue_date: string;
  validity_date: string;
  total_value: number;
  status: "draft" | "pending" | "approved";
  title: string;
  observations?: string;
  sequence_number?: number;
  items: IBudgetItem[];
  created_at: string;
  updated_at: string;
}

export interface ICreateBudget {
  customer_id: string;
  issue_date: string;
  validity_date: string;
  total_value: number;
  status: "draft" | "pending" | "approved";
  title: string;
  observations?: string;
  items: Omit<IBudgetItem, "id" | "budget_id">[];
}

export interface IBudgetResponse {
  success: boolean;
  budget: IBudget;
}

export interface IGetAllBudgetsResponse {
  success: boolean;
  budgets: IBudget[];
}
