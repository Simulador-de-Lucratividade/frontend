"use client";

import { useParams, useRouter } from "next/navigation";
import {
  Typography,
  Space,
  Row,
  Col,
  Grid,
  Button,
  Descriptions,
  Tag,
  Card,
  Table,
  Divider,
  Popconfirm,
  message,
  Tabs,
  Avatar,
  Spin,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  PrinterOutlined,
  MailOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  FileTextOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  LockOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { ApplicationLayout } from "@/shared/components/application-layout";
import { ProtectedRoute } from "@/shared/components/protected-route";
import { itemColumns } from "./item-columns";
import { mockBudgetData } from "./mock-data";
import type { TabsProps } from "antd";
import { useBudgetById } from "../../budgets/hooks/useBudgetById";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

export default function BudgetDetailsScreen() {
  const screens = useBreakpoint();
  const router = useRouter();
  const id = useParams().id;

  const { budget, budgetLoading } = useBudgetById(id as string);

  const formattedDate = dayjs(budget?.created_at).format("DD/MM/YYYY");

  const handleGoBack = () => {
    router.push("/orcamentos");
  };

  const handleApprove = () => {
    message.success("Orçamento aprovado com sucesso!");
  };

  const handleReject = () => {
    message.error("Orçamento rejeitado.");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "pending":
      default:
        return "warning";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved":
        return "Aprovado";
      case "rejected":
        return "Rejeitado";
      case "pending":
      default:
        return "Pendente";
    }
  };

  const tabItems: TabsProps["items"] = [
    {
      key: "1",
      label: "Itens",
      children: (
        <Card className="mt-4">
          <div className="overflow-x-auto">
            <Table
              dataSource={mockBudgetData.items}
              columns={itemColumns}
              pagination={false}
              rowKey="id"
              size={screens.sm ? "middle" : "small"}
              footer={() => (
                <Row gutter={[16, 16]} justify="space-between" align="middle">
                  <Col xs={24} md={12}>
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      size={screens.sm ? "middle" : "small"}
                    >
                      Adicionar Item
                    </Button>
                  </Col>
                  <Col xs={24} md={12}>
                    <div className="flex flex-col items-end gap-1">
                      <Text>
                        Subtotal: R${" "}
                        {mockBudgetData.subtotal.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </Text>
                      <Text>
                        Desconto: R${" "}
                        {mockBudgetData.discount.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </Text>
                      <Text>
                        Impostos: R${" "}
                        {mockBudgetData.tax.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </Text>
                      <Text strong className="text-lg">
                        Total: R${" "}
                        {mockBudgetData.total.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </Text>
                    </div>
                  </Col>
                </Row>
              )}
            />
          </div>
        </Card>
      ),
    },
    {
      key: "2",
      label: "Informações",
      children: (
        <Card className="mt-4">
          <Descriptions
            layout={screens.md ? "horizontal" : "vertical"}
            column={{ xs: 1, sm: 1, md: 2 }}
            bordered={false}
            size={screens.sm ? "default" : "small"}
          >
            <Descriptions.Item label="Cliente">
              {mockBudgetData.client.name}
            </Descriptions.Item>
            <Descriptions.Item label="Contato">
              {mockBudgetData.client.contact}
            </Descriptions.Item>
            <Descriptions.Item label="E-mail">
              {mockBudgetData.client.email}
            </Descriptions.Item>
            <Descriptions.Item label="Telefone">
              {mockBudgetData.client.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Endereço" span={2}>
              {mockBudgetData.client.address}
            </Descriptions.Item>
            <Descriptions.Item label="Data de Criação">
              {mockBudgetData.createdAt}
            </Descriptions.Item>
            <Descriptions.Item label="Válido até">
              {mockBudgetData.validUntil}
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <div>
            <Text strong>Observações</Text>
            <Paragraph className="mt-2">
              {mockBudgetData.notes ||
                "Nenhuma observação adicional para este orçamento."}
            </Paragraph>
          </div>
        </Card>
      ),
    },
    {
      key: "3",
      label: "Histórico",
      children: (
        <Card className="mt-4 text-center py-8">
          <Space direction="vertical" align="center">
            <LockOutlined style={{ fontSize: 48, opacity: 0.5 }} />
            <Text type="secondary">
              Nenhum histórico de alteração disponível
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
          {budgetLoading || !budget ? (
            <div className="flex h-full items-center justify-center">
              <Spin indicator={<LoadingOutlined />} size="large" />
            </div>
          ) : (
            <Space direction="vertical" size="large" className="w-full">
              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} md={16}>
                  <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={handleGoBack}
                    type="text"
                    className="mb-2 pl-0"
                  >
                    Voltar para orçamentos
                  </Button>
                  <Title level={screens.sm ? 2 : 3} className="mb-0">
                    Orçamento - {budget.customer.name} {formattedDate}
                  </Title>
                </Col>
                <Col xs={24} md={8} className="text-left md:text-right">
                  <Space wrap>
                    <Button
                      icon={<EditOutlined />}
                      size={screens.sm ? "large" : "middle"}
                    >
                      Editar
                    </Button>
                    <Button
                      icon={<PrinterOutlined />}
                      size={screens.sm ? "large" : "middle"}
                    >
                      Imprimir
                    </Button>
                    <Button
                      type="primary"
                      icon={<MailOutlined />}
                      size={screens.sm ? "large" : "middle"}
                    >
                      Enviar
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
                      icon={<FileTextOutlined />}
                    />
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
                          Orçamento #{budget.id}
                        </Title>
                        <Space size="small" wrap>
                          <Tag color={getStatusColor(budget.status)}>
                            {getStatusLabel(budget.status)}
                          </Tag>
                          <Tag color="blue">{budget.customer.name}</Tag>
                        </Space>
                      </div>

                      <Space size="large" wrap>
                        <Space size="small">
                          <CalendarOutlined />
                          <Text>Criado em: {formattedDate}</Text>
                        </Space>
                        <Space size="small">
                          <LockOutlined />
                          <Text>Válido até: {budget.issue_date}</Text>
                        </Space>
                      </Space>
                    </Space>
                  </Col>
                  <Col xs={24} sm={4} md={3} lg={3} className="text-right">
                    {budget.status === "pending" && (
                      <Popconfirm
                        title="Aprovar orçamento"
                        description="Tem certeza que deseja aprovar este orçamento?"
                        onConfirm={handleApprove}
                        okText="Sim"
                        cancelText="Não"
                      >
                        <Button
                          type="primary"
                          icon={<CheckCircleOutlined />}
                          size="middle"
                          className="mr-2"
                        />
                      </Popconfirm>
                    )}
                    {budget.status === "pending" && (
                      <Popconfirm
                        title="Rejeitar orçamento"
                        description="Tem certeza que deseja rejeitar este orçamento?"
                        onConfirm={handleReject}
                        okText="Sim"
                        cancelText="Não"
                        okButtonProps={{ danger: true }}
                      >
                        <Button
                          danger
                          icon={<CloseCircleOutlined />}
                          size="middle"
                        />
                      </Popconfirm>
                    )}
                  </Col>
                </Row>
              </Card>

              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={8} lg={6}>
                  <Card>
                    <Space
                      direction="vertical"
                      size="middle"
                      className="w-full"
                    >
                      <div>
                        <Text type="secondary">Cliente</Text>
                        <div className="flex items-center mt-1">
                          <UserOutlined className="mr-2 text-gray-500" />
                          <Text strong>{budget.customer.name}</Text>
                        </div>
                      </div>

                      <div>
                        <Text type="secondary">Contato</Text>
                        <div className="flex items-center mt-1">
                          <MailOutlined className="mr-2 text-gray-500" />
                          <Text strong>{budget.customer.phone}</Text>
                        </div>
                      </div>

                      <div>
                        <Text type="secondary">Valor Total</Text>
                        <div className="flex items-center mt-1">
                          <DollarOutlined className="mr-2 text-gray-500" />
                          <Text strong className="text-lg">
                            R${" "}
                            {mockBudgetData.total.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </Text>
                        </div>
                      </div>

                      {mockBudgetData.status === "pending" && (
                        <>
                          <Divider className="my-2" />
                          <Button
                            type="primary"
                            icon={<CheckCircleOutlined />}
                            size="large"
                            block
                            onClick={handleApprove}
                          >
                            Aprovar Orçamento
                          </Button>

                          <Popconfirm
                            title="Rejeitar orçamento"
                            description="Tem certeza que deseja rejeitar este orçamento?"
                            onConfirm={handleReject}
                            okText="Sim"
                            cancelText="Não"
                            okButtonProps={{ danger: true }}
                          >
                            <Button
                              danger
                              icon={<CloseCircleOutlined />}
                              size="large"
                              block
                            >
                              Rejeitar Orçamento
                            </Button>
                          </Popconfirm>
                        </>
                      )}
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
          )}
        </div>
      </ApplicationLayout>
    </ProtectedRoute>
  );
}
