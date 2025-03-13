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
  Spin,
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
  HistoryOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { BsThreeDotsVertical } from "react-icons/bs";
import type { MenuProps, TabsProps } from "antd";
import { ApplicationLayout } from "@/shared/components/application-layout";
import { ProtectedRoute } from "@/shared/components/protected-route";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCostumerById } from "../../customers/hooks/useCostumerById";

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

export default function CustomerDetailsPage() {
  const screens = useBreakpoint();
  const id = useParams().id;

  const { customer, customerLoading } = useCostumerById(id as string);

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
            <Descriptions.Item label="Nome">{customer?.name}</Descriptions.Item>
            <Descriptions.Item label="Email">
              {customer?.email}
            </Descriptions.Item>
            <Descriptions.Item label="Telefone">
              {customer?.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Tipo">Industrial</Descriptions.Item>
            <Descriptions.Item label="Endereço">
              Endereço não informado
            </Descriptions.Item>
            <Descriptions.Item label="Contato">
              Contato não informado
            </Descriptions.Item>
            <Descriptions.Item label="Cliente desde">
              {customer?.created_at}
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <div>
            <Text strong>Observações</Text>
            <Paragraph className="mt-2">Nenhuma observação</Paragraph>
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
          {customerLoading ? (
            <div className="flex justify-center items-center">
              <Spin indicator={<LoadingOutlined />} />
            </div>
          ) : (
            <Space direction="vertical" size="large" className="w-full">
              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} md={16}>
                  <Link href="/clientes">
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
                      {getInitials(customer?.name ?? "Não informado")}
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
                          {customer?.name}
                        </Title>
                        <Space size="small" wrap>
                          <Tag color={"success"}>Ativo</Tag>
                          <Tag color="blue">Industrial</Tag>
                        </Space>
                      </div>

                      <Space size="large" wrap>
                        <Space size="small">
                          <MailOutlined />
                          <Text>{customer?.email}</Text>
                        </Space>
                        <Space size="small">
                          <PhoneOutlined />
                          <Text>{customer?.phone}</Text>
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
                    <Space
                      direction="vertical"
                      size="middle"
                      className="w-full"
                    >
                      <div>
                        <Text type="secondary">Último contato</Text>
                        <div className="flex items-center mt-1">
                          <CalendarOutlined className="mr-2 text-gray-500" />
                          <Text strong>00/00/0000</Text>
                        </div>
                      </div>

                      <div>
                        <Text type="secondary">Cliente desde</Text>
                        <div className="flex items-center mt-1">
                          <UserOutlined className="mr-2 text-gray-500" />
                          <Text strong>{customer?.created_at}</Text>
                        </div>
                      </div>

                      <div>
                        <Text type="secondary">Endereço</Text>
                        <div className="flex items-center mt-1">
                          <HomeOutlined className="mr-2 text-gray-500" />
                          <Text strong>Endereço não informado</Text>
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
          )}
        </div>
      </ApplicationLayout>
    </ProtectedRoute>
  );
}
