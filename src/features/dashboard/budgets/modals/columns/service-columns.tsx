"use client";

import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { IService } from "@/features/dashboard/additional-services/interface/IServices";

export const getServiceColumns = (
  handleRemoveService: (id: string) => void
) => [
  {
    title: "Nome do Serviço",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Descrição",
    dataIndex: "description",
    key: "description",
    ellipsis: true,
  },
  {
    title: "Custo",
    dataIndex: "cost",
    key: "cost",
    render: (value: number) => `R$ ${value}`,
  },
  {
    title: "Ações",
    key: "action",
    render: (_: unknown, record: IService) => (
      <Button
        type="text"
        danger
        icon={<DeleteOutlined />}
        onClick={() => handleRemoveService(record.id)}
      />
    ),
  },
];
