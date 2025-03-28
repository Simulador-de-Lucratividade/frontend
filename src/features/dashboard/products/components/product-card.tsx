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
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDeleteModal } from "@/shared/components/delete-modal";
import { productService } from "../services/product.service";
import Masks from "@/shared/utils/masks";

const { Text } = Typography;

const { useBreakpoint } = Grid;

interface IProductCard {
  product: IProduct;
  productRefresh: () => void;
}

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

export const ProductCard = ({ product, productRefresh }: IProductCard) => {
  const screens = useBreakpoint();
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const handleMenuClick = (e: {
    key: string;
    domEvent: React.MouseEvent<Element> | React.KeyboardEvent<Element>;
  }) => {
    e.domEvent.stopPropagation();

    if (e.key === "3") {
      setIsDeleteModalOpen(true);
    } else if (e.key === "1") {
      router.push(`/orcamentos/${product.id}/editar`);
    }
  };

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
              {Masks.money(product.acquisition_cost.toString())}
            </Text>
            <Dropdown
              menu={{ items: dropdownItems, onClick: handleMenuClick }}
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
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={productRefresh}
        itemId={product.id}
        itemName={product.name}
        itemType="Produto"
        identifierValue={product.name}
        deleteFunction={productService.remove}
      />
    </Card>
  );
};
