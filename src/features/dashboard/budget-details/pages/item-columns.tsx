import { Breakpoint, Button, Space, Typography } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Text } = Typography;

export const itemColumns = [
  {
    title: "Descrição",
    dataIndex: "description",
    key: "description",
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
    title: "Un.",
    dataIndex: "unit",
    key: "unit",
    align: "center" as const,
    responsive: ["lg" as Breakpoint],
  },
  {
    title: "Valor Un.",
    dataIndex: "unitPrice",
    key: "unitPrice",
    align: "right" as const,
    render: (value: number) =>
      `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
    responsive: ["md" as Breakpoint],
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    align: "right" as const,
    render: (value: number) =>
      `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
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
