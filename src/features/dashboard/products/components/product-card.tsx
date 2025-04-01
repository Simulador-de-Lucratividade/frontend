import type React from "react";

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
  type MenuProps,
  Tooltip,
} from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";

import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { IProduct } from "../interface/IProduct";
import { useState } from "react";
import { ConfirmDeleteModal } from "@/shared/components/delete-modal";
import { productService } from "../services/product.service";
import Masks from "@/shared/utils/masks";
import { EditProductModal } from "../modals/edit-product";

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
    className: "px-10 py-3",
  },
  {
    key: "3",
    label: "Excluir",
    icon: <DeleteOutlined />,
    danger: true,
    className: "px-10 py-3",
  },
];

export const ProductCard = ({ product, productRefresh }: IProductCard) => {
  const screens = useBreakpoint();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const handleMenuClick = (e: {
    key: string;
    domEvent: React.MouseEvent<Element> | React.KeyboardEvent<Element>;
  }) => {
    e.domEvent.stopPropagation();

    if (e.key === "3") {
      setIsDeleteModalOpen(true);
    } else if (e.key === "1") {
      setIsEditModalOpen(true);
    }
  };

  const profitMargin = product.sale_price - product.acquisition_cost;
  const profitPercentage = (profitMargin / product.acquisition_cost) * 100;
  const formattedProfitPercentage = profitPercentage.toFixed(0);

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
            <Tooltip
              title={`Margem de lucro: ${formattedProfitPercentage}%`}
              placement="bottom"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Text strong className={screens.sm ? "text-base" : "text-sm"}>
                    {Masks.money(product.sale_price.toString())}
                  </Text>
                  <Tag color="success" className="m-0">
                    {formattedProfitPercentage}%
                  </Tag>
                </div>
                <Text
                  type="secondary"
                  className={screens.sm ? "text-sm" : "text-base"}
                >
                  Custo: {Masks.money(product.acquisition_cost.toString())}
                </Text>
              </div>
            </Tooltip>
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
                aria-label="Opções do produto"
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
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={product}
        productRefresh={productRefresh}
      />
    </Card>
  );
};
