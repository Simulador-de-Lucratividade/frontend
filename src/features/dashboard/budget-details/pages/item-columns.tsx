import { Breakpoint, Button, Space, Typography } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { IProduct } from "../../products/interface/IProduct";
import Masks from "@/shared/utils/masks";

const { Text } = Typography;

export const itemColumns = [
  {
    title: "Descrição",
    dataIndex: "product",
    key: "name",
    render: (product: IProduct) => (
      <Text strong>{product?.name || "Produto não encontrado"}</Text>
    ),
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
      value !== undefined ? Masks.money(value.toString()) : "R$ 0,00",
    responsive: ["md" as Breakpoint],
  },
  {
    title: "Total",
    dataIndex: "total_price",
    key: "total_price",
    align: "right" as const,
    render: (value: number) =>
      value !== undefined ? Masks.money(value.toString()) : "R$ 0,00",
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
