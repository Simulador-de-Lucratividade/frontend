import { useEffect, useState } from "react";
import { IBudget, IGetAllBudgetsResponse } from "../interfaces/IBudget";
import { budgetService } from "../services/budget.service";
import { AxiosError, AxiosResponse } from "axios";
import { notification } from "antd";

interface BudgetResponse {
  budgets: IBudget[];
  budgetLoading: boolean;
  budgetRefresh: () => void;
}

export const useBudgets = (): BudgetResponse => {
  const [budgets, setBudgets] = useState<IBudget[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = () => {
    if (loading) return;

    setLoading(true);

    budgetService
      .getAll()
      .then((res: AxiosResponse<IGetAllBudgetsResponse>) =>
        setBudgets(res.data.budgets)
      )
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
    fetchData();
  }, []);

  return {
    budgets,
    budgetLoading: loading,
    budgetRefresh: fetchData,
  };
};
