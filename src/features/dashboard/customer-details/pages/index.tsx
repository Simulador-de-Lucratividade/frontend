"use client";
import {
  Typography,
  Space,
  Row,
  Col,
  Card,
  Tag,
  Button,
  Tabs,
  Grid,
  Descriptions,
  Avatar,
  Divider,
  Dropdown,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PhoneOutlined,
  MailOutlined,
  FileTextOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  HomeOutlined,
  CalendarOutlined,
  DollarOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { BsThreeDotsVertical } from "react-icons/bs";
import type { MenuProps, TabsProps } from "antd";
import { ApplicationLayout } from "@/shared/components/application-layout";
import { ProtectedRoute } from "@/shared/components/protected-route";
import Link from "next/link";

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

interface CustomerType {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  lastContact: string;
  type: string;
  address?: string;
  contactPerson?: string;
  createdAt?: string;
  notes?: string;
  totalSpent?: number;
}

export default function CustomerDetailsPage() {
  const screens = useBreakpoint();

  // In a real application, you would fetch this data based on the customer ID from the URL
  const customer: CustomerType = {
    id: "1",
    name: "Empresa Alpha Tecnologia",
    email: "contato@alphatec.com",
    phone: "(11) 98765-4321",
    status: "active",
    lastContact: "18/03/2024",
    type: "Corporativo",
    address: "Av. Paulista, 1000, São Paulo - SP",
    contactPerson: "João Silva",
    createdAt: "10/01/2023",
    notes:
      "Cliente desde 2023. Interessado em soluções de automação e desenvolvimento web.",
    totalSpent: 15750.0,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "default";
      case "prospect":
        return "processing";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "inactive":
        return "Inativo";
      case "prospect":
        return "Prospecto";
      default:
        return status;
    }
  };

  const dropdownItems: MenuProps["items"] = [
    {
      key: "1",
      label: "Editar cliente",
      icon: <EditOutlined />,
    },
    {
      key: "2",
      label: "Criar orçamento",
      icon: <FileTextOutlined />,
    },
    {
      key: "3",
      label: "Excluir",
      icon: <DeleteOutlined />,
      danger: true,
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const tabItems: TabsProps["items"] = [
    {
      key: "1",
      label: "Informações",
      children: (
        <Card className="mt-4">
          <Descriptions
            layout={screens.md ? "horizontal" : "vertical"}
            column={{ xs: 1, sm: 1, md: 2 }}
            bordered={false}
            size={screens.sm ? "default" : "small"}
          >
            <Descriptions.Item label="Nome">{customer.name}</Descriptions.Item>
            <Descriptions.Item label="Email">
              {customer.email}
            </Descriptions.Item>
            <Descriptions.Item label="Telefone">
              {customer.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Tipo">{customer.type}</Descriptions.Item>
            <Descriptions.Item label="Endereço">
              {customer.address}
            </Descriptions.Item>
            <Descriptions.Item label="Contato">
              {customer.contactPerson}
            </Descriptions.Item>
            <Descriptions.Item label="Cliente desde">
              {customer.createdAt}
            </Descriptions.Item>
            <Descriptions.Item label="Último contato">
              {customer.lastContact}
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <div>
            <Text strong>Observações</Text>
            <Paragraph className="mt-2">{customer.notes}</Paragraph>
          </div>
        </Card>
      ),
    },
    {
      key: "2",
      label: "Orçamentos",
      children: (
        <Card className="mt-4 text-center py-8">
          <Space direction="vertical" align="center">
            <FileTextOutlined style={{ fontSize: 48, opacity: 0.5 }} />
            <Text type="secondary">
              Nenhum orçamento encontrado para este cliente
            </Text>
            <Button type="primary" icon={<FileTextOutlined />} className="mt-2">
              Criar orçamento
            </Button>
          </Space>
        </Card>
      ),
    },
    {
      key: "3",
      label: "Histórico",
      children: (
        <Card className="mt-4 text-center py-8">
          <Space direction="vertical" align="center">
            <HistoryOutlined style={{ fontSize: 48, opacity: 0.5 }} />
            <Text type="secondary">
              Nenhum histórico de atividade disponível
            </Text>
          </Space>
        </Card>
      ),
    },
  ];

  return (
    <ProtectedRoute>
      <ApplicationLayout>
        <div className="p-4 sm:p-6">
          <Space direction="vertical" size="large" className="w-full">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={16}>
                <Link href="/customers">
                  <Button
                    icon={<ArrowLeftOutlined />}
                    type="text"
                    className="mb-2 pl-0"
                  >
                    Voltar para clientes
                  </Button>
                </Link>
                <Title level={screens.sm ? 2 : 3} className="mb-0">
                  Detalhes do Cliente
                </Title>
              </Col>
              <Col xs={24} md={8} className="text-left md:text-right">
                <Space>
                  <Button
                    icon={<EditOutlined />}
                    size={screens.sm ? "large" : "middle"}
                  >
                    Editar
                  </Button>
                  <Button
                    type="primary"
                    icon={<FileTextOutlined />}
                    size={screens.sm ? "large" : "middle"}
                  >
                    Novo orçamento
                  </Button>
                </Space>
              </Col>
            </Row>

            <Card className="overflow-hidden">
              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} sm={4} md={3} lg={2}>
                  <Avatar
                    size={screens.sm ? 80 : 64}
                    className="bg-primary text-white flex items-center justify-center"
                  >
                    {getInitials(customer.name)}
                  </Avatar>
                </Col>
                <Col xs={24} sm={16} md={18} lg={19}>
                  <Space
                    direction="vertical"
                    size={screens.sm ? "small" : "small"}
                    className="w-full"
                  >
                    <div>
                      <Title
                        level={screens.sm ? 3 : 4}
                        style={{ marginBottom: 0 }}
                      >
                        {customer.name}
                      </Title>
                      <Space size="small" wrap>
                        <Tag color={getStatusColor(customer.status)}>
                          {getStatusLabel(customer.status)}
                        </Tag>
                        <Tag color="blue">{customer.type}</Tag>
                      </Space>
                    </div>

                    <Space size="large" wrap>
                      <Space size="small">
                        <MailOutlined />
                        <Text>{customer.email}</Text>
                      </Space>
                      <Space size="small">
                        <PhoneOutlined />
                        <Text>{customer.phone}</Text>
                      </Space>
                    </Space>
                  </Space>
                </Col>
                <Col xs={24} sm={4} md={3} lg={3} className="text-right">
                  <Dropdown
                    menu={{ items: dropdownItems }}
                    trigger={["click"]}
                    placement="bottomRight"
                  >
                    <Button className="bg-transparent border-none text-gray-400 p-1 sm:p-2 hover:text-primary transition-colors">
                      <BsThreeDotsVertical
                        size={18}
                        className="sm:w-5 sm:h-5"
                      />
                    </Button>
                  </Dropdown>
                </Col>
              </Row>
            </Card>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={8} lg={6}>
                <Card>
                  <Space direction="vertical" size="middle" className="w-full">
                    <div>
                      <Text type="secondary">Último contato</Text>
                      <div className="flex items-center mt-1">
                        <CalendarOutlined className="mr-2 text-gray-500" />
                        <Text strong>{customer.lastContact}</Text>
                      </div>
                    </div>

                    <div>
                      <Text type="secondary">Cliente desde</Text>
                      <div className="flex items-center mt-1">
                        <UserOutlined className="mr-2 text-gray-500" />
                        <Text strong>{customer.createdAt}</Text>
                      </div>
                    </div>

                    <div>
                      <Text type="secondary">Total gasto</Text>
                      <div className="flex items-center mt-1">
                        <DollarOutlined className="mr-2 text-gray-500" />
                        <Text strong>
                          R${" "}
                          {customer.totalSpent?.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </Text>
                      </div>
                    </div>

                    <div>
                      <Text type="secondary">Endereço</Text>
                      <div className="flex items-center mt-1">
                        <HomeOutlined className="mr-2 text-gray-500" />
                        <Text strong>{customer.address}</Text>
                      </div>
                    </div>
                  </Space>
                </Card>
              </Col>

              <Col xs={24} sm={24} md={16} lg={18}>
                <Tabs
                  defaultActiveKey="1"
                  items={tabItems}
                  size={screens.sm ? "large" : "middle"}
                />
              </Col>
            </Row>
          </Space>
        </div>
      </ApplicationLayout>
    </ProtectedRoute>
  );
}
