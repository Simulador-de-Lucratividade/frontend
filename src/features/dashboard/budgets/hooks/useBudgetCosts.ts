import { useState, useCallback } from "react";
import { notification } from "antd";
import { IOtherCost } from "../interfaces/IProfitabilityCalculator";

export const useBudgetCosts = () => {
  const [otherCosts, setOtherCosts] = useState<IOtherCost[]>([]);
  const [costName, setCostName] = useState("");
  const [costAmount, setCostAmount] = useState<number | null>(null);
  const [costType, setCostType] = useState<"fixed" | "percentage">("fixed");

  const handleAddCost = useCallback(() => {
    if (!costName || !costAmount) {
      notification.error({
        message: "Dados incompletos",
        description: "Por favor, preencha o nome e o valor do custo adicional.",
      });
      return;
    }

    const newCost: IOtherCost = {
      id: Date.now().toString(),
      description: costName,
      amount: costAmount,
      cost_type: costType,
    };

    setOtherCosts((prev) => [...prev, newCost]);

    setCostName("");
    setCostAmount(null);
    setCostType("fixed");
  }, [costName, costAmount, costType]);

  const handleRemoveCost = useCallback((id: string) => {
    setOtherCosts((prev) => prev.filter((cost) => cost.id !== id));
  }, []);

  return {
    otherCosts,
    setOtherCosts,
    costName,
    setCostName,
    costAmount,
    setCostAmount,
    costType,
    setCostType,
    handleAddCost,
    handleRemoveCost,
  };
};
