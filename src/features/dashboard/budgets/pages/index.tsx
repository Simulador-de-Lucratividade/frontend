"use client";

import { useState } from "react";
import { Input, Select, Button, Typography, Space, Row, Col, Grid } from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { ApplicationLayout } from "@/shared/components/application-layout";
import { ProtectedRoute } from "@/shared/components/protected-route";
import { Section } from "@/features/dashboard/budgets/components/section";
import { DocumentCard } from "@/features/dashboard/budgets/components/document-card";
import { NewBudgetModal } from "../modals/new-budget";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export default function BudgetsScreen() {
  const screens = useBreakpoint();

  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>("recent");
  const [isModalAddVisible, setIsModalAddVisible] = useState<boolean>(false);

  const statusOptions = [
    { value: "all", label: "Todos" },
    { value: "pending", label: "Pendentes" },
    { value: "approved", label: "Aprovados" },
    { value: "rejected", label: "Rejeitados" },
  ];

  const dateOptions = [
    { value: "recent", label: "Mais recentes" },
    { value: "oldest", label: "Mais antigos" },
    { value: "lastWeek", label: "Última semana" },
    { value: "lastMonth", label: "Último mês" },
  ];

  return (
    <ProtectedRoute>
      <ApplicationLayout>
        <div className="p-4 sm:p-6">
          <Space direction="vertical" size="large" className="w-full">
            <Row gutter={[16, 16]} justify="space-between" align="middle" wrap>
              <Col xs={24} sm={24} md={16}>
                <Title level={screens.sm ? 2 : 3} className="mb-0">
                  Orçamentos
                </Title>
                <Text type="secondary" className="text-gray-800">
                  Gerencie todos os seus orçamentos em um só lugar
                </Text>
              </Col>
              <Col xs={24} sm={24} md={8} className="text-left md:text-right">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size={screens.sm ? "large" : "middle"}
                  onClick={() => setIsModalAddVisible(!isModalAddVisible)}
                  block={!screens.md}
                >
                  Novo orçamento
                </Button>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={8}>
                <Input
                  placeholder="Buscar orçamento"
                  prefix={<SearchOutlined />}
                  size={screens.sm ? "large" : "middle"}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Select
                  placeholder="Status"
                  style={{ width: "100%" }}
                  options={statusOptions}
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  suffixIcon={<FilterOutlined />}
                  size={screens.sm ? "large" : "middle"}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Select
                  placeholder="Ordenar por data"
                  style={{ width: "100%" }}
                  options={dateOptions}
                  value={selectedDate}
                  onChange={setSelectedDate}
                  suffixIcon={<SortAscendingOutlined />}
                  size={screens.sm ? "large" : "middle"}
                />
              </Col>
            </Row>

            <Section title="">
              <Space direction="vertical" size="middle" className="w-full">
                {[
                  {
                    id: 1,
                    title: "Orçamento para Empresa A",
                    datetime: "15/02/2024 | 18:39",
                  },
                  {
                    id: 2,
                    title: "Orçamento para Empresa B",
                    datetime: "16/02/2024 | 14:20",
                  },
                  {
                    id: 3,
                    title: "Orçamento para Empresa C",
                    datetime: "17/02/2024 | 09:15",
                  },
                  {
                    id: 4,
                    title: "Orçamento para Empresa D",
                    datetime: "17/02/2024 | 11:30",
                  },
                ].map((doc, index) => (
                  <DocumentCard
                    key={index}
                    title={doc.title}
                    datetime={doc.datetime}
                  />
                ))}
              </Space>
            </Section>
          </Space>
        </div>
        <NewBudgetModal
          isOpen={isModalAddVisible}
          onClose={() => setIsModalAddVisible(false)}
        />
      </ApplicationLayout>
    </ProtectedRoute>
  );
}
