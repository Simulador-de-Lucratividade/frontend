"use client";

import { useState } from "react";
import { Input, Select, Button, Typography, Space, Row, Col, Grid } from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  PlusOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { ApplicationLayout } from "@/shared/components/application-layout";
import { ProtectedRoute } from "@/shared/components/protected-route";
import { Section } from "@/features/settings/components/section";
import { ProductCard } from "../components/product-card";
import { NewProductModal } from "../modals/new-product";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export default function ProductScreen() {
  const screens = useBreakpoint();

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

  const products = [
    {
      id: "1",
      name: "Notebook Premium XPS",
      sku: "NB-XPS-15",
      price: 5999.9,
      originalPrice: 6499.9,
      category: "electronics",
      stock: 15,
      status: "active",
      createdAt: "15/03/2024",
      image: "/placeholder.svg",
    },
    {
      id: "2",
      name: "Cadeira Ergonômica Office Pro",
      sku: "CH-ERG-001",
      price: 899.9,
      originalPrice: 999.9,
      category: "furniture",
      stock: 8,
      status: "active",
      createdAt: "10/03/2024",
      image: "/placeholder.svg",
    },
    {
      id: "3",
      name: 'Monitor Ultrawide 34"',
      sku: "MN-UW-34",
      price: 2499.9,
      originalPrice: 2499.9,
      category: "electronics",
      stock: 0,
      status: "out_of_stock",
      createdAt: "05/03/2024",
      image: "/placeholder.svg",
    },
    {
      id: "4",
      name: "Kit Teclado e Mouse Sem Fio",
      sku: "KB-MS-001",
      price: 299.9,
      originalPrice: 349.9,
      category: "electronics",
      stock: 23,
      status: "active",
      createdAt: "18/03/2024",
      image: "/placeholder.svg",
    },
    {
      id: "5",
      name: "Mesa de Escritório Ajustável",
      sku: "DS-ADJ-120",
      price: 1299.9,
      originalPrice: 1499.9,
      category: "furniture",
      stock: 5,
      status: "low_stock",
      createdAt: "12/03/2024",
      image: "/placeholder.svg",
    },
  ];

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort products based on selected sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (selectedSort) {
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "stock_asc":
        return a.stock - b.stock;
      case "oldest":
        return 1; // In a real app, you would compare dates
      default:
        return -1; // recent is default
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
                />
              </Col>
            </Row>

            <Section title="">
              <Space direction="vertical" size="middle" className="w-full">
                {sortedProducts.length > 0 ? (
                  sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Space direction="vertical" align="center">
                      <InboxOutlined style={{ fontSize: 48, opacity: 0.5 }} />
                      <Text type="secondary">Nenhum produto encontrado</Text>
                    </Space>
                  </div>
                )}
              </Space>
            </Section>
          </Space>
        </div>
        <NewProductModal
          isOpen={isModalAddVisible}
          onClose={() => setIsModalAddVisible(false)}
        />
      </ApplicationLayout>
    </ProtectedRoute>
  );
}
