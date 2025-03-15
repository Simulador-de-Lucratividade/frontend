import { useEffect, useState } from "react";
import { IBudget, IBudgetResponse } from "../interfaces/IBudget";
import { budgetService } from "../services/budget.service";
import { AxiosError, AxiosResponse } from "axios";
import { notification } from "antd";

interface BudgetResponse {
  budget: IBudget | null;
  budgetLoading: boolean;
  budgetRefresh: () => void;
}

export const useBudgetById = (budget_id: string): BudgetResponse => {
  const [budget, setBudget] = useState<IBudget | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = () => {
    if (loading || !budget_id) return;

    setLoading(true);

    budgetService
      .getById(budget_id)
      .then((res: AxiosResponse<IBudgetResponse>) => setBudget(res.data.budget))
      .catch((error) => {
        if (error instanceof AxiosError) {
          const errorMessage = error.response?.data?.message || error.message;
          notification.error({
            message: "Falha ao listar produto",
            description: errorMessage,
          });
        } else {
          notification.error({
            message: "Falha ao listar o produto",
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
    if (budget_id) {
      fetchData();
      console.log(budget);
    }
  }, [budget_id]);

  return {
    budget,
    budgetLoading: loading,
    budgetRefresh: fetchData,
  };
};
