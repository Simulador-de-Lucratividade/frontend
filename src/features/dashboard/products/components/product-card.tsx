import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Space,
  Button,
  Dropdown,
  Grid,
  MenuProps,
} from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";

import {
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { IProduct } from "../interface/IProduct";

const { Text } = Typography;

const { useBreakpoint } = Grid;

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

export const ProductCard = (product: IProduct) => {
  const screens = useBreakpoint();

  return (
    <Card className="w-full transition-all duration-200 px-4 py-3">
      <Row
        gutter={[screens.sm ? 16 : 8, 0]}
        align="middle"
        justify="space-between"
        wrap={screens.xs}
        className="w-full"
      >
        <Col flex={screens.xs ? "1 1 100%" : "1 1 auto"} className="min-w-0">
          <Space
            direction="vertical"
            size={screens.sm ? 4 : 2}
            className="w-full"
          >
            <Text
              strong
              className={`block truncate ${
                screens.sm ? "text-base" : "text-sm"
              }`}
              title={product.name}
            >
              {product.name}
            </Text>
            <Space size={8} className="items-center flex-wrap">
              <Text
                type="secondary"
                className={screens.sm ? "text-sm" : "text-xs"}
              >
                {product.reference_code}
              </Text>
              <Text
                type="secondary"
                className={screens.sm ? "text-sm" : "text-xs"}
              >
                •
              </Text>
              <Tag
                className={`
                  m-0 border-none bg-gray-50 text-gray-600
                  ${screens.sm ? "text-sm" : "text-xs"}
                `}
              >
                Produtos
              </Tag>
            </Space>
          </Space>
        </Col>

        <Col
          flex={screens.xs ? "1 1 100%" : "0 0 auto"}
          className={`
            ${screens.xs ? "mt-3" : ""}
            ${screens.xs ? "border-t pt-3" : ""}
          `}
        >
          <Space
            size={16}
            className={`items-center ${
              screens.xs ? "w-full justify-between" : ""
            }`}
          >
            <Text strong className={screens.sm ? "text-base" : "text-sm"}>
              {product.acquisition_cost}
            </Text>
            <Dropdown
              menu={{ items: dropdownItems }}
              placement={screens.xs ? "bottomCenter" : "bottomRight"}
              trigger={["click"]}
            >
              <Button
                className="
                  bg-transparent border-none text-gray-400 
                  hover:text-primary transition-colors
                  p-1 flex items-center justify-center
                "
                style={{
                  height: screens.sm ? 40 : 32,
                  width: screens.sm ? 40 : 32,
                }}
              >
                <BsThreeDotsVertical
                  className={screens.sm ? "w-5 h-5" : "w-4 h-4"}
                />
              </Button>
            </Dropdown>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};
