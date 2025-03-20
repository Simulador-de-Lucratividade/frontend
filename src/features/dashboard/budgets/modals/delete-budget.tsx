import type React from "react";

import { useState } from "react";
import { Modal, Typography, Button, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { budgetService } from "../services/budget.service";

const { Text, Title } = Typography;

interface DeleteBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgetId: string;
  budgetTitle: string;
  sequenceNumber: number;
  budgetRefresh: () => void;
}

export const DeleteBudgetModal: React.FC<DeleteBudgetModalProps> = ({
  isOpen,
  onClose,
  budgetId,
  budgetTitle,
  sequenceNumber,
  budgetRefresh,
}) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await budgetService.remove(budgetId);
      message.success("Orçamento excluído com sucesso");
      budgetRefresh();
      onClose();
    } catch (error) {
      console.error("Erro ao excluir orçamento:", error);
      message.error("Não foi possível excluir o orçamento. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={480}
      className="rounded-2xl"
    >
      <div className="py-4 px-2 text-center">
        <div className="flex justify-center mb-4">
          <ExclamationCircleOutlined className="text-red-500 text-5xl" />
        </div>

        <Title level={4} className="mb-2">
          Excluir orçamento
        </Title>

        <Text className="block mb-6 text-gray-600">
          Tem certeza que deseja excluir o orçamento{" "}
          <strong>
            {budgetTitle} - Orçamento Nº{sequenceNumber}
          </strong>
          ? Esta ação não poderá ser desfeita.
        </Text>

        <div className="flex gap-3 justify-center">
          <Button size="large" onClick={onClose} className="min-w-[120px]">
            Cancelar
          </Button>

          <Button
            type="primary"
            danger
            size="large"
            onClick={handleDelete}
            loading={isDeleting}
            className="min-w-[120px]"
          >
            Excluir
          </Button>
        </div>
      </div>
    </Modal>
  );
};
