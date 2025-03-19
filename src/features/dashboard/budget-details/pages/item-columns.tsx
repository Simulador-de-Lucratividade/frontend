import { Breakpoint, Button, Space, Typography } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Text } = Typography;

export const itemColumns = [
  {
    title: "Descrição",
    dataIndex: "product_id",
    key: "product_id",
    render: (text: string) => <Text strong>{text}</Text>,
  },
  {
    title: "Qtd.",
    dataIndex: "quantity",
    key: "quantity",
    align: "center" as const,
    responsive: ["md" as Breakpoint],
  },
  {
    title: "Valor Un.",
    dataIndex: "unit_price",
    key: "unit_price",
    align: "right" as const,
    render: (value: number) =>
      value !== undefined
        ? `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
        : "R$ 0,00",
    responsive: ["md" as Breakpoint],
  },
  {
    title: "Total",
    dataIndex: "total_price",
    key: "total_price",
    align: "right" as const,
    render: (value: number) =>
      value !== undefined
        ? `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
        : "R$ 0,00",
  },
  {
    title: "",
    key: "actions",
    width: 80,
    render: () => (
      <Space>
        <Button
          type="text"
          icon={<EditOutlined />}
          size="small"
          className="text-primary"
        />
        <Button
          type="text"
          icon={<DeleteOutlined />}
          size="small"
          className="text-red-500"
        />
      </Space>
    ),
    responsive: ["md" as Breakpoint],
  },
];
