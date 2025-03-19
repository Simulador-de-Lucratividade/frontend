"use client";

import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { IOtherCost } from "../../interfaces/IProfitabilityCalculator";

export const getCostColumns = (handleRemoveCost: (id: string) => void) => [
  {
    title: "Nome",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Valor",
    dataIndex: "amount",
    key: "amount",
    render: (value: number, record: IOtherCost) =>
      record.cost_type === "percentage"
        ? `${value}%`
        : `R$ ${value.toFixed(2)}`,
  },
  {
    title: "Tipo",
    dataIndex: "cost_type",
    key: "cost_type",
    render: (value: string) => (value === "fixed" ? "Fixo" : "Percentual"),
  },
  {
    title: "Ações",
    key: "action",
    render: (_: unknown, record: IOtherCost) => (
      <Button
        type="text"
        danger
        icon={<DeleteOutlined />}
        onClick={() => handleRemoveCost(record.id)}
      />
    ),
  },
];
