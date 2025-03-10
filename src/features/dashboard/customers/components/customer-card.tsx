import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Space,
  Button,
  Avatar,
  Dropdown,
  Grid,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PhoneOutlined,
  MailOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRouter } from "next/navigation";

const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

interface CustomerType {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  lastContact: string;
  type: string;
}

interface CustomerCardProps {
  customer: CustomerType;
}

export const CustomerCard = ({ customer }: CustomerCardProps) => {
  const screens = useBreakpoint();
  const router = useRouter();

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
      label: "Editar",
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

  return (
    <div onClick={() => router.push(`/clientes/${customer.id}`)}>
      <Card hoverable className="w-full overflow-hidden">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={16} md={18} lg={20}>
            <Row gutter={[16, 8]} align="middle">
              <Col xs={24} sm={6} md={4} lg={3}>
                <Avatar
                  size={screens.sm ? 64 : 48}
                  className="bg-primary text-white flex items-center justify-center"
                >
                  {getInitials(customer.name)}
                </Avatar>
              </Col>
              <Col xs={24} sm={18} md={20} lg={21}>
                <Space
                  direction="vertical"
                  size={screens.sm ? "small" : "small"}
                  className="w-full"
                >
                  <div>
                    <Title
                      level={screens.sm ? 4 : 5}
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
                    <Space size="small">
                      <Text type="secondary">Último contato:</Text>
                      <Text>{customer.lastContact}</Text>
                    </Space>
                  </Space>
                </Space>
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={8} md={6} lg={4} className="text-right">
            <Space size="small" className={screens.sm ? "" : "w-full"} wrap>
              <Dropdown
                menu={{ items: dropdownItems }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <Button className="bg-transparent border-none text-gray-400 p-1 sm:p-2 hover:text-primary transition-colors">
                  <BsThreeDotsVertical size={18} className="sm:w-5 sm:h-5" />
                </Button>
              </Dropdown>
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
};
