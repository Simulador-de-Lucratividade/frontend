import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Button,
  Dropdown,
  Grid,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IService } from "../interface/IServices";
import { ConfirmDeleteModal } from "@/shared/components/delete-modal";
import { useState } from "react";
import Masks from "@/shared/utils/masks";
import { additionalServicesService } from "../services/services.service";
import { EditServiceModal } from "../modals/edit-service";

const { Text } = Typography;
const { useBreakpoint } = Grid;

interface IServiceCardProps {
  service: IService;
  serviceRefresh: () => void;
}

export const ServiceCard = ({ service, serviceRefresh }: IServiceCardProps) => {
  const screens = useBreakpoint();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const dropdownItems: MenuProps["items"] = [
    {
      key: "2",
      label: "Editar serviço",
      icon: <EditOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "3",
      label: "Excluir",
      icon: <DeleteOutlined />,
      danger: true,
    },
  ];

  const handleMenuClick = (e: {
    key: string;
    domEvent: React.MouseEvent<Element> | React.KeyboardEvent<Element>;
  }) => {
    e.domEvent.stopPropagation();

    if (e.key === "3") {
      setIsDeleteModalOpen(true);
    } else if (e.key === "2") {
      setIsEditModalOpen(true);
    }
  };

  return (
    <Card className="w-full transition-all duration-200 py-1 px-2 md:py-3 md:px-4">
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
              title={service.name}
            >
              {service.name}
            </Text>
            <Space size={8} className="items-center flex-wrap">
              <Text
                type="secondary"
                className={screens.sm ? "text-sm" : "text-xs"}
              >
                {service.description ?? "Nenhuma descrição informada"}
              </Text>
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
              {Masks.money(service.cost.toString())}
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
        onSuccess={serviceRefresh}
        itemId={service.id}
        itemName={service.description}
        itemType="Serviço"
        identifierValue={service.name}
        deleteFunction={additionalServicesService.remove}
      />
      <EditServiceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        service={service}
        serviceRefresh={serviceRefresh}
      />
    </Card>
  );
};
