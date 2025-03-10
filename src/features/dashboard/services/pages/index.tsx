"use client";

import { useState } from "react";
import { Input, Select, Button, Typography, Space, Row, Col, Grid } from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  PlusOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { ApplicationLayout } from "@/shared/components/application-layout";
import { ProtectedRoute } from "@/shared/components/protected-route";
import { Section } from "@/features/dashboard/budgets/components/section";
import { ServiceCard } from "../components/service-card";
import { NewServiceModal } from "../modals/new-service";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export default function ServicesScreen() {
  const screens = useBreakpoint();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>("recent");
  const [isModalAddVisible, setIsModalAddVisible] = useState<boolean>(false);

  const categoryOptions = [
    { value: "all", label: "Todas categorias" },
    { value: "consulting", label: "Consultoria" },
    { value: "maintenance", label: "Manutenção" },
    { value: "development", label: "Desenvolvimento" },
    { value: "support", label: "Suporte" },
    { value: "training", label: "Treinamento" },
  ];

  const sortOptions = [
    { value: "recent", label: "Mais recentes" },
    { value: "oldest", label: "Mais antigos" },
    { value: "price_asc", label: "Menor preço" },
    { value: "price_desc", label: "Maior preço" },
    { value: "name_asc", label: "Nome (A-Z)" },
  ];

  const services = [
    {
      id: 1,
      name: "Consultoria em Gestão de Projetos",
      code: "CONS-001",
      price: 250.0,
      category: "consulting",
      description: "Consultoria especializada em gestão de projetos",
    },
    {
      id: 2,
      name: "Manutenção Preventiva de Sistemas",
      code: "MAN-002",
      price: 180.0,
      category: "maintenance",
      description: "Serviço mensal de manutenção preventiva",
    },
    {
      id: 3,
      name: "Desenvolvimento de Software Personalizado",
      code: "DEV-003",
      price: 350.0,
      category: "development",
      description: "Desenvolvimento de soluções sob medida",
    },
    {
      id: 4,
      name: "Suporte Técnico Premium",
      code: "SUP-004",
      price: 120.0,
      category: "support",
      description: "Suporte técnico especializado 24/7",
    },
    {
      id: 5,
      name: "Treinamento em Novas Tecnologias",
      code: "TRN-005",
      price: 200.0,
      category: "training",
      description: "Capacitação em tecnologias emergentes",
    },
  ];

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || service.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (selectedSort) {
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "oldest":
        return 1;
      default:
        return -1;
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
                  Serviços
                </Title>
                <Text type="secondary" className="text-gray-800">
                  Gerencie seu catálogo de serviços e preços
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
                  Novo serviço
                </Button>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={8}>
                <Input
                  placeholder="Buscar serviço ou código"
                  prefix={<SearchOutlined />}
                  size={screens.sm ? "large" : "middle"}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10 w-full"
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Select
                  placeholder="Categoria"
                  options={categoryOptions}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  suffixIcon={<FilterOutlined />}
                  size={screens.sm ? "large" : "middle"}
                  className="h-10 w-full"
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Select
                  placeholder="Ordenar por"
                  options={sortOptions}
                  value={selectedSort}
                  onChange={setSelectedSort}
                  suffixIcon={<SortAscendingOutlined />}
                  size={screens.sm ? "large" : "middle"}
                  className="h-10 w-full"
                />
              </Col>
            </Row>

            <Section title="">
              <Space direction="vertical" size="middle" className="w-full">
                {sortedServices.length > 0 ? (
                  sortedServices.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Space direction="vertical" align="center">
                      <AppstoreOutlined
                        style={{ fontSize: 48, opacity: 0.5 }}
                      />
                      <Text type="secondary">Nenhum serviço encontrado</Text>
                    </Space>
                  </div>
                )}
              </Space>
            </Section>
          </Space>
        </div>
        <NewServiceModal
          isOpen={isModalAddVisible}
          onClose={() => setIsModalAddVisible(false)}
        />
      </ApplicationLayout>
    </ProtectedRoute>
  );
}
