import { useState, useEffect, useCallback } from "react";
import { notification } from "antd";
import Masks from "@/shared/utils/masks";
import { BudgetItemViewModel } from "../interfaces/IBudget";
import {
  IOtherCost,
  IProfitabilityRequest,
} from "../interfaces/IProfitabilityCalculator";
import { IService } from "../../additional-services/interface/IServices";
import { FormInstance } from "antd/lib";
import { profitabilityService } from "../services/profitability.service";

export const useBudgetFinancials = (
  budgetItems: BudgetItemViewModel[],
  otherCosts: IOtherCost[],
  selectedServices: IService[],
  form: FormInstance
) => {
  const [totalCost, setTotalCost] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [profitability, setProfitability] = useState<number | null>(null);
  const [profitabilityLoading, setProfitabilityLoading] = useState(false);
  const [suggestedPrice, setSuggestedPrice] = useState<string | null>(null);

  const calculateTotalCost = useCallback(() => {
    const itemsCost = budgetItems.reduce(
      (sum, item) => sum + item.total_price,
      0
    );

    const fixedCosts = otherCosts
      .filter((cost) => cost.cost_type === "fixed")
      .reduce((acc, cost) => acc + Number(cost.amount), 0);

    const percentageCosts = otherCosts
      .filter((cost) => cost.cost_type === "percentage")
      .reduce((acc, cost) => acc + (itemsCost * Number(cost.amount)) / 100, 0);

    const serviceCosts = selectedServices.reduce(
      (acc, service) => acc + Number(service.cost),
      0
    );

    const newTotalCost =
      itemsCost + fixedCosts + percentageCosts + serviceCosts;
    setTotalCost(newTotalCost);

    if (newTotalCost > 0) {
      const suggested = newTotalCost * 1.2; // 20% de margem de lucro
      const formattedSuggested = Masks.money((suggested * 100).toString());
      setSuggestedPrice(formattedSuggested);
      setTotalValue(suggested);
      form.setFieldsValue({
        total_value: Masks.money((suggested * 100).toString()),
      });
    } else {
      setSuggestedPrice(null);
    }
  }, [budgetItems, otherCosts, selectedServices, form]);

  const calculateProfitability = useCallback(() => {
    if (budgetItems.length === 0 || totalCost === 0 || totalValue === 0) {
      setProfitability(null);
      return;
    }

    setProfitabilityLoading(true);

    const formattedItems = budgetItems.map((item) => ({
      product_id: item.product_id,
      unit_price: Number(item.unit_price),
      quantity: Number(item.quantity),
      total_price: Number(item.total_price),
      discount: item.discount ? Number(item.discount) : 0,
    }));

    const formattedCosts = otherCosts.map((cost) => ({
      id: cost.id,
      description: cost.description,
      amount: Number(cost.amount),
      cost_type: cost.cost_type,
    }));

    const formattedServices = selectedServices.map((service) => ({
      id: service.id,
      name: service.name,
      description: service.description,
      cost: Number(service.cost),
    }));

    const requestPayload: IProfitabilityRequest = {
      items: formattedItems,
      total_value: totalValue,
      other_costs: formattedCosts,
      services: formattedServices,
    };
    profitabilityService
      .calculateProfitability(requestPayload)
      .then((response) => {
        if (response.data.success) {
          setProfitability(response.data.profitability);
        } else {
          notification.error({
            message: "Erro no cálculo de lucratividade",
            description: "Não foi possível calcular a lucratividade",
          });
          setProfitability(null);
        }
      })
      .catch((error) => {
        console.error("Error calculating profitability:", error);
        setProfitability(null);
      })
      .finally(() => {
        setProfitabilityLoading(false);
      });
  }, [budgetItems, otherCosts, selectedServices, totalValue, totalCost]);

  const handleTotalValueInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value.replace(/[R$\s]/g, "");
      form.setFieldsValue({ total_value: Masks.money(inputValue) });

      const normalizedValue = inputValue.replace(/\./g, "").replace(",", ".");
      const numericValue = Number.parseFloat(normalizedValue);

      if (inputValue === "" || inputValue === "0") {
        setTotalValue(0);
      } else {
        setTotalValue(numericValue);
        setTimeout(() => calculateProfitability(), 0);
      }
    },
    [form, calculateProfitability]
  );

  const getProfitabilityColor = useCallback((value: number | null) => {
    if (value === null) return "";
    if (value < 0) return "#f5222d";
    if (value < 10) return "#faad14";
    if (value < 20) return "#52c41a";
    return "#1890ff";
  }, []);

  const resetFinancials = useCallback(() => {
    setTotalCost(0);
    setTotalValue(0);
    setProfitability(null);
    setSuggestedPrice(null);
  }, []);

  useEffect(() => {
    calculateTotalCost();
  }, [budgetItems, otherCosts, selectedServices, calculateTotalCost]);

  useEffect(() => {
    const timer = setTimeout(() => {
      calculateProfitability();
    }, 300);
    return () => clearTimeout(timer);
  }, [totalValue, calculateProfitability]);

  return {
    totalCost,
    totalValue,
    profitability,
    profitabilityLoading,
    suggestedPrice,
    getProfitabilityColor,
    resetFinancials,
    handleTotalValueInput,
  };
};
