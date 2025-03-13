"use client";

import { useState } from "react";
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
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { ApplicationLayout } from "@/shared/components/application-layout";
import { ProtectedRoute } from "@/shared/components/protected-route";
import { Section } from "@/features/dashboard/budgets/components/section";
import { CustomerCard } from "../components/customer-card";
import { NewCustomerModal } from "../modals/new-customer";
import { useCustomers } from "../hooks/useCustomers";
import { LoadingOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export default function CustomerScreen() {
  const screens = useBreakpoint();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>("recent");
  const [isModalAddVisible, setIsModalAddVisible] = useState<boolean>(false);

  const statusOptions = [
    { value: "all", label: "Todos" },
    { value: "active", label: "Ativos" },
    { value: "inactive", label: "Inativos" },
    { value: "prospect", label: "Prospectos" },
  ];

  const sortOptions = [
    { value: "recent", label: "Mais recentes" },
    { value: "oldest", label: "Mais antigos" },
    { value: "alphabetical", label: "Ordem alfabética" },
    { value: "lastContact", label: "Último contato" },
  ];

  const { customers, customerLoading, customerRefresh } = useCustomers();

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    switch (selectedSort) {
      case "alphabetical":
        return a.name.localeCompare(b.name);
      case "oldest":
        return -1;
      case "lastContact":
        return -1;
      default:
        return 1;
    }
  });

  return (
    <ProtectedRoute>
      <ApplicationLayout>
        <div className="p-4 sm:p-6">
          <Space direction="vertical" size="large" className="w-full">
            <Row gutter={[16, 16]} justify="space-between" align="middle" wrap>
              <Col xs={24} sm={24} md={16}>
                <Title level={screens.sm ? 2 : 3} className="mb-0">
                  Clientes
                </Title>
                <Text type="secondary" className="text-gray-800">
                  Gerencie todos os seus clientes e prospectos em um só lugar
                </Text>
              </Col>
              <Col xs={24} sm={24} md={8} className="text-left md:text-right">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size={screens.sm ? "large" : "middle"}
                  onClick={() => setIsModalAddVisible(true)}
                  block={!screens.md}
                  className="h-10"
                >
                  Novo cliente
                </Button>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={8}>
                <Input
                  placeholder="Buscar cliente"
                  prefix={<SearchOutlined />}
                  size={screens.sm ? "large" : "middle"}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10"
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
                  className="h-10"
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Select
                  placeholder="Ordenar por"
                  style={{ width: "100%" }}
                  options={sortOptions}
                  value={selectedSort}
                  onChange={setSelectedSort}
                  suffixIcon={<SortAscendingOutlined />}
                  size={screens.sm ? "large" : "middle"}
                  className="h-10"
                />
              </Col>
            </Row>

            <Section title="">
              <Space direction="vertical" size="middle" className="w-full">
                {customerLoading ? (
                  <div className="flex justify-center items-center">
                    <Spin indicator={<LoadingOutlined />} />
                  </div>
                ) : (
                  <>
                    {sortedCustomers.length > 0 ? (
                      sortedCustomers.map((customer) => (
                        <CustomerCard key={customer.id} {...customer} />
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Space direction="vertical" align="center">
                          <UserOutlined
                            style={{ fontSize: 48, opacity: 0.5 }}
                          />
                          <Text type="secondary">
                            Nenhum cliente encontrado
                          </Text>
                        </Space>
                      </div>
                    )}
                  </>
                )}
              </Space>
            </Section>
          </Space>
        </div>
        <NewCustomerModal
          isOpen={isModalAddVisible}
          onClose={() => setIsModalAddVisible(false)}
          customerRefresh={customerRefresh}
        />
      </ApplicationLayout>
    </ProtectedRoute>
  );
}
