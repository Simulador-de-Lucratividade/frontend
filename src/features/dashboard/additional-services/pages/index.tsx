"use client";

import { Suspense, useEffect, useState } from "react";
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
  AppstoreOutlined,
} from "@ant-design/icons";
import { ApplicationLayout } from "@/shared/components/application-layout";
import { ProtectedRoute } from "@/shared/components/protected-route";
import { Section } from "@/features/dashboard/budgets/components/section";
import { ServiceCard } from "../components/service-card";
import { NewServiceModal } from "../modals/new-service";
import { useServices } from "../hooks/useServices";
import { LoadingOutlined } from "@ant-design/icons";
import { useSearchParams } from "next/navigation";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export default function ServicesScreen() {
  const screens = useBreakpoint();
  const searchParams = useSearchParams();

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

  const { services, serviceLoading, serviceRefresh } = useServices();

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (selectedSort) {
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "price_asc":
        return a.cost - b.cost;
      case "price_desc":
        return b.cost - a.cost;
      case "oldest":
        return 1;
      default:
        return -1;
    }
  });

  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "4") {
      setIsModalAddVisible(true);
    }
  }, [searchParams]);

  return (
    <Suspense fallback={<Spin tip="Carregando..." />}>
      <ProtectedRoute>
        <ApplicationLayout>
          <div className="p-4 sm:p-6">
            <Space direction="vertical" size="large" className="w-full">
              <Row
                gutter={[16, 16]}
                justify="space-between"
                align="middle"
                wrap
              >
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
                  {serviceLoading ? (
                    <div className="flex justify-center items-center">
                      <Spin indicator={<LoadingOutlined />} />
                    </div>
                  ) : (
                    <>
                      {sortedServices.length > 0 ? (
                        sortedServices.map((service) => (
                          <ServiceCard
                            key={service.id}
                            service={service}
                            serviceRefresh={serviceRefresh}
                          />
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Space direction="vertical" align="center">
                            <AppstoreOutlined
                              style={{ fontSize: 48, opacity: 0.5 }}
                            />
                            <Text type="secondary">
                              Nenhum serviço encontrado
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
          <NewServiceModal
            isOpen={isModalAddVisible}
            onClose={() => setIsModalAddVisible(false)}
            serviceRefresh={serviceRefresh}
          />
        </ApplicationLayout>
      </ProtectedRoute>
    </Suspense>
  );
}
