import { useState, useCallback } from "react";
import { notification } from "antd";
import { BudgetItemViewModel } from "../interfaces/IBudget";
import { IProduct } from "../../products/interface/IProduct";

import { FormInstance } from "antd/lib/form";

export const useBudgetItems = (products: IProduct[], form: FormInstance) => {
  const [budgetItems, setBudgetItems] = useState<BudgetItemViewModel[]>([]);

  const handleAddItem = useCallback(() => {
    const product_id = form.getFieldValue("product_id");
    const quantity = form.getFieldValue("quantity") || 1;
    const discount = form.getFieldValue("discount") || 0;

    if (!product_id) {
      notification.error({
        message: "Produto não selecionado",
        description:
          "Por favor, selecione um produto para adicionar ao orçamento.",
      });
      return;
    }

    const selectedProduct = products.find((p) => p.id === product_id);
    if (!selectedProduct) return;

    const unit_price = selectedProduct.acquisition_cost;
    const total_price = unit_price * quantity - discount;

    const newItem: BudgetItemViewModel = {
      id: Date.now().toString(),
      product_name: selectedProduct.name,
      product_id,
      unit_price,
      quantity,
      total_price,
      discount: discount || undefined,
    };

    setBudgetItems((prev) => [...prev, newItem]);

    form.setFieldsValue({
      product_id: undefined,
      quantity: 1,
      discount: 0,
    });
  }, [form, products]);

  const handleRemoveItem = useCallback((key: string) => {
    setBudgetItems((prev) => prev.filter((item) => item.id !== key));
  }, []);

  const resetBudgetItems = useCallback(() => {
    setBudgetItems([]);
  }, []);

  return {
    budgetItems,
    setBudgetItems,
    handleAddItem,
    handleRemoveItem,
    resetBudgetItems,
  };
};
