"use client";

import { useState, useCallback, useEffect } from "react";
import { notification } from "antd";
import type { IOtherCost } from "../interfaces/IProfitabilityCalculator";
import Masks from "@/shared/utils/masks";

export const useBudgetCosts = () => {
  const [otherCosts, setOtherCosts] = useState<IOtherCost[]>([]);
  const [costName, setCostName] = useState("");
  const [costAmount, setCostAmount] = useState<number | null>(null);
  const [costType, setCostType] = useState<"fixed" | "percentage">("fixed");
  const [displayValue, setDisplayValue] = useState<string | number>("");

  useEffect(() => {
    if (costAmount === null) {
      setDisplayValue("");
      return;
    }

    if (costType === "fixed") {
      setDisplayValue(costAmount);
    } else {
      setDisplayValue(costAmount);
    }
  }, [costAmount, costType]);

  const handleCostAmountChange = useCallback((value: number | null) => {
    setCostAmount(value);
  }, []);

  const getFormattedAmount = useCallback(() => {
    if (costAmount === null) return "";

    if (costType === "fixed") {
      return Masks.money(costAmount.toString());
    }
    return costAmount.toString();
  }, [costAmount, costType]);

  const handleCostTypeChange = useCallback((type: "fixed" | "percentage") => {
    setCostType(type);
  }, []);

  const formatInputValue = useCallback(
    (value: number | null) => {
      if (value === null) return "";

      if (costType === "fixed") {
        return `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }

      return value;
    },
    [costType]
  );

  const parseInputValue = useCallback(
    (value: string | undefined) => {
      if (!value) return null;

      if (costType === "fixed") {
        return Number.parseFloat(value.replace(/[^\d.-]/g, ""));
      }

      return Number.parseFloat(value);
    },
    [costType]
  );

  const handleAddCost = useCallback(() => {
    if (!costName || costAmount === null) {
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
    setDisplayValue("");
    setCostType("fixed");
  }, [
    costName,
    costAmount,
    costType,
    setOtherCosts,
    setCostName,
    setCostAmount,
    setDisplayValue,
    setCostType,
  ]);

  const handleRemoveCost = useCallback((id: string) => {
    setOtherCosts((prev) => prev.filter((cost) => cost.id !== id));
  }, []);

  const resetBudgetCosts = useCallback(() => {
    setOtherCosts([]);
    setCostName("");
    setCostAmount(null);
    setDisplayValue("");
    setCostType("fixed");
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
    displayValue,
    handleCostAmountChange,
    handleCostTypeChange,
    formatInputValue,
    parseInputValue,
    getFormattedAmount,
    handleAddCost,
    handleRemoveCost,
    resetBudgetCosts,
  };
};
