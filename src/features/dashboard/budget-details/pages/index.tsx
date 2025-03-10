"use client";

import { useState } from "react";
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
  Tabs,
  Avatar,
  Input,
  Form,
  Statistic,
  Popconfirm,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  PrinterOutlined,
  MailOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CommentOutlined,
  HistoryOutlined,
  FileTextOutlined,
  UserOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { ApplicationLayout } from "@/shared/components/application-layout";
import { ProtectedRoute } from "@/shared/components/protected-route";
import { Section } from "@/features/settings/components/section";

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;
const { TextArea } = Input;

// Dados simulados para o orçamento
const mockBudgetData = {
  id: "ORÇ-2024-0001",
  title: "Orçamento para Empresa A",
  status: "pending", // pending, approved, rejected
  createdAt: "15/02/2024",
  validUntil: "15/03/2024",
  client: {
    name: "Empresa A Ltda.",
    contact: "João Silva",
    email: "joao.silva@empresaa.com",
    phone: "(11) 98765-4321",
    address: "Av. Paulista, 1000, São Paulo - SP",
  },
  items: [
    {
      id: 1,
      description: "Desenvolvimento de Website",
      quantity: 1,
      unit: "serviço",
      unitPrice: 5000,
      total: 5000,
    },
    {
      id: 2,
      description: "Hospedagem Anual",
      quantity: 1,
      unit: "ano",
      unitPrice: 1200,
      total: 1200,
    },
    {
      id: 3,
      description: "Manutenção Mensal",
      quantity: 12,
      unit: "mês",
      unitPrice: 500,
      total: 6000,
    },
  ],
  subtotal: 12200,
  discount: 1220,
  tax: 610,
  total: 11590,
  notes:
    "Este orçamento inclui todos os serviços de desenvolvimento, hospedagem e manutenção por 12 meses.",
  history: [
    { date: "15/02/2024 | 18:39", user: "Adrian", action: "Orçamento criado" },
    {
      date: "16/02/2024 | 09:15",
      user: "Adrian",
      action: "Enviado por e-mail para o cliente",
    },
  ],
  comments: [
    {
      id: 1,
      user: "Adrian",
      date: "16/02/2024 | 10:30",
      text: "Cliente solicitou revisão do valor de manutenção mensal.",
    },
    {
      id: 2,
      user: "Mariana",
      date: "16/02/2024 | 14:45",
      text: "Entrei em contato por telefone, cliente está avaliando a proposta.",
    },
  ],
};

export default function BudgetDetailsScreen() {
  const screens = useBreakpoint();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("1");
  const [commentText, setCommentText] = useState("");
  const [form] = Form.useForm();

  const handleGoBack = () => {
    router.push("/orcamentos");
  };

  const handleApprove = () => {
    message.success("Orçamento aprovado com sucesso!");
  };

  const handleReject = () => {
    message.error("Orçamento rejeitado.");
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      message.success("Comentário adicionado com sucesso!");
      setCommentText("");
      form.resetFields();
    }
  };

  const renderStatus = (status: string) => {
    switch (status) {
      case "approved":
        return <Tag color="success">Aprovado</Tag>;
      case "rejected":
        return <Tag color="error">Rejeitado</Tag>;
      case "pending":
      default:
        return <Tag color="warning">Pendente</Tag>;
    }
  };

  const itemColumns = [
    {
      title: "Descrição",
      dataIndex: "description",
      key: "description",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Qtd.",
      dataIndex: "quantity",
      key: "quantity",
      align: "center" as const,
      responsive: ["md"],
    },
    {
      title: "Un.",
      dataIndex: "unit",
      key: "unit",
      align: "center" as const,
      responsive: ["lg"],
    },
    {
      title: "Valor Un.",
      dataIndex: "unitPrice",
      key: "unitPrice",
      align: "right" as const,
      render: (value: number) =>
        `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      responsive: ["md"],
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      align: "right" as const,
      render: (value: number) =>
        `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
    },
    {
      title: "",
      key: "actions",
      width: 80,
      render: () => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            className="text-primary"
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            size="small"
            className="text-red-500"
          />
        </Space>
      ),
      responsive: ["md"],
    },
  ];

  // Colunas para a tabela de histórico
  const historyColumns = [
    {
      title: "Data",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Usuário",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Ação",
      dataIndex: "action",
      key: "action",
    },
  ];

  return (
    <ProtectedRoute>
      <ApplicationLayout>
        <div className="p-4 sm:p-6">
          <Space direction="vertical" size="large" className="w-full">
            {/* Cabeçalho com botão de voltar e título */}
            <Row gutter={[16, 16]} align="middle">
              <Col>
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={handleGoBack}
                  size={screens.sm ? "middle" : "small"}
                >
                  Voltar
                </Button>
              </Col>
              <Col flex="auto">
                <Title level={screens.sm ? 3 : 4} className="mb-0">
                  {mockBudgetData.title}
                </Title>
                <Space size="small" align="center">
                  <Text type="secondary">{mockBudgetData.id}</Text>
                  {renderStatus(mockBudgetData.status)}
                </Space>
              </Col>
              <Col
                xs={24}
                sm={24}
                md="auto"
                className="flex flex-wrap gap-2 justify-start md:justify-end"
              >
                <Button
                  icon={<EditOutlined />}
                  size={screens.sm ? "middle" : "small"}
                >
                  Editar
                </Button>
                <Button
                  icon={<PrinterOutlined />}
                  size={screens.sm ? "middle" : "small"}
                >
                  Imprimir
                </Button>
                <Button
                  icon={<MailOutlined />}
                  size={screens.sm ? "middle" : "small"}
                >
                  Enviar
                </Button>
              </Col>
            </Row>

            {/* Informações principais e ações */}
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={16}>
                <Section title="Informações do Orçamento">
                  <Descriptions
                    bordered
                    size={screens.sm ? "middle" : "small"}
                    column={{ xs: 1, sm: 2, md: 2, lg: 2 }}
                    className="bg-white"
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
                </Section>
              </Col>

              <Col xs={24} lg={8}>
                <Card className="h-full">
                  <Space direction="vertical" size="middle" className="w-full">
                    <Title level={4} className="mb-0">
                      Ações
                    </Title>
                    <Divider className="my-2" />

                    {mockBudgetData.status === "pending" && (
                      <>
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

                    <Statistic
                      title="Valor Total"
                      value={mockBudgetData.total}
                      precision={2}
                      prefix="R$"
                      className="mt-4"
                    />
                  </Space>
                </Card>
              </Col>
            </Row>

            {/* Itens do orçamento */}
            <Section title="Itens do Orçamento">
              <Space direction="vertical" size="middle" className="w-full">
                <div className="overflow-x-auto">
                  <Table
                    dataSource={mockBudgetData.items}
                    columns={itemColumns}
                    pagination={false}
                    rowKey="id"
                    size={screens.sm ? "middle" : "small"}
                    footer={() => (
                      <Row
                        gutter={[16, 16]}
                        justify="space-between"
                        align="middle"
                      >
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
              </Space>
            </Section>

            {/* Abas para Observações, Histórico e Comentários */}
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              size={screens.sm ? "large" : "middle"}
              items={[
                {
                  key: "1",
                  label: (
                    <span>
                      <FileTextOutlined />
                      Observações
                    </span>
                  ),
                  children: (
                    <Card className="mt-4">
                      <Paragraph>{mockBudgetData.notes}</Paragraph>
                    </Card>
                  ),
                },
                {
                  key: "2",
                  label: (
                    <span>
                      <HistoryOutlined />
                      Histórico
                    </span>
                  ),
                  children: (
                    <Card className="mt-4">
                      <Table
                        dataSource={mockBudgetData.history}
                        columns={historyColumns}
                        pagination={false}
                        size={screens.sm ? "middle" : "small"}
                      />
                    </Card>
                  ),
                },
                {
                  key: "3",
                  label: (
                    <span>
                      <CommentOutlined />
                      Comentários
                    </span>
                  ),
                  children: (
                    <Card className="mt-4">
                      <Space
                        direction="vertical"
                        size="large"
                        className="w-full"
                      >
                        {mockBudgetData.comments.map((comment) => (
                          <div key={comment.id} className="flex gap-3">
                            <Avatar
                              icon={<UserOutlined />}
                              className="bg-primary"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <Text strong>{comment.user}</Text>
                                <Text type="secondary">{comment.date}</Text>
                              </div>
                              <Paragraph>{comment.text}</Paragraph>
                            </div>
                          </div>
                        ))}

                        <Divider />

                        <Form form={form} onFinish={handleAddComment}>
                          <Form.Item name="comment">
                            <TextArea
                              rows={3}
                              placeholder="Adicione um comentário..."
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                            />
                          </Form.Item>
                          <Form.Item className="mb-0 text-right">
                            <Button
                              type="primary"
                              icon={<CommentOutlined />}
                              onClick={handleAddComment}
                              disabled={!commentText.trim()}
                            >
                              Adicionar Comentário
                            </Button>
                          </Form.Item>
                        </Form>
                      </Space>
                    </Card>
                  ),
                },
              ]}
            />
          </Space>
        </div>
      </ApplicationLayout>
    </ProtectedRoute>
  );
}
