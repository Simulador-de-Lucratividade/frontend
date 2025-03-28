"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  Input,
  Select,
  Button,
  Typography,
  Space,
  Row,
  Col,
  Grid,
  Spin,
  Empty,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { ApplicationLayout } from "@/shared/components/application-layout";
import { ProtectedRoute } from "@/shared/components/protected-route";
import { Section } from "@/features/dashboard/budgets/components/section";
import { DocumentCard } from "@/features/dashboard/budgets/components/document-card";
import { NewBudgetModal } from "../modals/new-budget";
import { useBudgets } from "../hooks/useBudgets";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export default function BudgetsScreen() {
  const screens = useBreakpoint();
  const searchParams = useSearchParams();

  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>("recent");
  const [isModalAddVisible, setIsModalAddVisible] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

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

  const { budgets, budgetRefresh, budgetLoading } = useBudgets();

  const filteredBudgets = useMemo(() => {
    return budgets.filter((doc) => {
      return (
        doc.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        doc.sequence_number?.toString().includes(search) ||
        doc.title.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [budgets, search]);

  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "1") {
      setIsModalAddVisible(true);
    }
  }, [searchParams]);

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
                  onClick={() => setIsModalAddVisible(true)}
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
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
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
                {budgetLoading ? (
                  <Spin indicator={<LoadingOutlined />} />
                ) : (
                  <>
                    {filteredBudgets.length === 0 ? (
                      <Empty
                        description={<p>Nenhum orçamento registrado...</p>}
                      />
                    ) : (
                      <>
                        {filteredBudgets.map((doc, index) => (
                          <DocumentCard
                            key={index}
                            {...doc}
                            budgetRefresh={budgetRefresh}
                          />
                        ))}
                      </>
                    )}
                  </>
                )}
              </Space>
            </Section>
          </Space>
        </div>
        <NewBudgetModal
          isOpen={isModalAddVisible}
          onClose={() => setIsModalAddVisible(false)}
          budgetRefresh={budgetRefresh}
        />
      </ApplicationLayout>
    </ProtectedRoute>
  );
}
