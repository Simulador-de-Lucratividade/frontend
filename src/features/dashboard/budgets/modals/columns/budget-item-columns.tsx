import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import type { TableColumnType } from "antd";
import { BudgetItemViewModel } from "../../interfaces/IBudget";
import Masks from "@/shared/utils/masks";

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
      const formattedValue = numValue * 100;
      return isNaN(formattedValue)
        ? "R$ 0,00"
        : Masks.money(formattedValue.toString());
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
      const formattedValue = numValue * 100;
      return isNaN(formattedValue)
        ? "R$ 0,00"
        : Masks.money(formattedValue.toString());
    },
  },
  {
    title: "Total",
    dataIndex: "total_price",
    key: "total_price",
    render: (value: number) => {
      const numValue = typeof value === "number" ? value : Number(value);
      const formattedValue = numValue * 100;
      return isNaN(formattedValue)
        ? "R$ 0,00"
        : Masks.money(formattedValue.toString());
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
