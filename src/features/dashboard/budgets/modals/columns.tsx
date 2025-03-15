import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import type { TableColumnType } from "antd";
import { BudgetItemViewModel } from "../interfaces/IBudget";

export const getBudgetItemColumns = (
  handleRemoveItem: (key: string) => void
): TableColumnType<BudgetItemViewModel>[] => [
  {
    title: "Produto",
    dataIndex: "product_name",
    key: "product_name",
  },
  {
    title: "Preço Unitário",
    dataIndex: "unit_price",
    key: "unit_price",
    render: (value: number) => {
      const numValue = typeof value === "number" ? value : Number(value);
      return isNaN(numValue) ? "R$ 0,00" : `R$ ${numValue.toFixed(2)}`;
    },
  },
  {
    title: "Quantidade",
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "Desconto",
    dataIndex: "discount",
    key: "discount",
    render: (value?: number) => {
      if (!value) return "R$ 0,00";
      const numValue = typeof value === "number" ? value : Number(value);
      return isNaN(numValue) ? "R$ 0,00" : `R$ ${numValue.toFixed(2)}`;
    },
  },
  {
    title: "Total",
    dataIndex: "total_price",
    key: "total_price",
    render: (value: number) => {
      const numValue = typeof value === "number" ? value : Number(value);
      return isNaN(numValue) ? "R$ 0,00" : `R$ ${numValue.toFixed(2)}`;
    },
  },
  {
    title: "Ações",
    key: "action",
    render: (_: unknown, record: BudgetItemViewModel) => (
      <Button
        type="text"
        danger
        icon={<DeleteOutlined />}
        onClick={() => handleRemoveItem(record.id)}
      />
    ),
  },
];
