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
  InboxOutlined,
} from "@ant-design/icons";
import { ApplicationLayout } from "@/shared/components/application-layout";
import { ProtectedRoute } from "@/shared/components/protected-route";
import { Section } from "@/features/dashboard/budgets/components/section";
import { ProductCard } from "../components/product-card";
import { NewProductModal } from "../modals/new-product";
import { useProducts } from "../hooks/useProducts";
import { LoadingOutlined } from "@ant-design/icons";
import { useSearchParams } from "next/navigation";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

function ProductContent() {
  const screens = useBreakpoint();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>("recent");
  const [isModalAddVisible, setIsModalAddVisible] = useState<boolean>(false);

  const categoryOptions = [
    { value: "all", label: "Todas categorias" },
    { value: "electronics", label: "Eletrônicos" },
    { value: "furniture", label: "Móveis" },
    { value: "clothing", label: "Vestuário" },
    { value: "office", label: "Material de escritório" },
  ];

  const sortOptions = [
    { value: "recent", label: "Mais recentes" },
    { value: "oldest", label: "Mais antigos" },
    { value: "price_asc", label: "Menor preço" },
    { value: "price_desc", label: "Maior preço" },
    { value: "name_asc", label: "Nome (A-Z)" },
    { value: "stock_asc", label: "Menor estoque" },
  ];

  const { products, productLoading, productRefresh } = useProducts();

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.reference_code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (selectedSort) {
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "price_asc":
        return a.sale_price - b.sale_price;
      case "price_desc":
        return b.sale_price - a.sale_price;
      case "oldest":
        return 1;
      default:
        return -1;
    }
  });

  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "3") {
      setIsModalAddVisible(true);
    }
  }, [searchParams]);

  return (
    <div className="p-4 sm:p-6">
      <Space direction="vertical" size="large" className="w-full">
        <Row gutter={[16, 16]} justify="space-between" align="middle" wrap>
          <Col xs={24} sm={24} md={16}>
            <Title level={screens.sm ? 2 : 3} className="mb-0">
              Produtos
            </Title>
            <Text type="secondary" className="text-gray-800">
              Gerencie seu catálogo de produtos e controle de estoque
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
              Novo produto
            </Button>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={8}>
            <Input
              placeholder="Buscar produto ou SKU"
              prefix={<SearchOutlined />}
              size={screens.sm ? "large" : "middle"}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10"
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Categoria"
              style={{ width: "100%" }}
              options={categoryOptions}
              value={selectedCategory}
              onChange={setSelectedCategory}
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
            {productLoading ? (
              <div className="flex justify-center items-center">
                <Spin indicator={<LoadingOutlined />} />
              </div>
            ) : (
              <>
                {sortedProducts.length > 0 ? (
                  sortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      productRefresh={productRefresh}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Space direction="vertical" align="center">
                      <InboxOutlined style={{ fontSize: 48, opacity: 0.5 }} />
                      <Text type="secondary">Nenhum produto encontrado</Text>
                    </Space>
                  </div>
                )}
              </>
            )}
          </Space>
        </Section>
      </Space>
      <NewProductModal
        isOpen={isModalAddVisible}
        onClose={() => setIsModalAddVisible(false)}
        productRefresh={productRefresh}
      />
    </div>
  );
}

export default function ProductScreen() {
  return (
    <ProtectedRoute>
      <ApplicationLayout>
        <Suspense fallback={<Spin tip="Carregando..." />}>
          <ProductContent />
        </Suspense>
      </ApplicationLayout>
    </ProtectedRoute>
  );
}
