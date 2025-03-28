import type React from "react";
import { useState } from "react";
import { Modal, Typography, Button, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

interface ConfirmDeleteModalProps<T = unknown> {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;

  itemId: string;
  itemName: string;
  itemType: string;

  identifierLabel?: string;
  identifierValue?: string | number;
  deleteFunction: (id: string) => Promise<T>;

  title?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  successMessage?: string;
  errorMessage?: string;
}

export const ConfirmDeleteModal = <T = unknown,>({
  isOpen,
  onClose,
  onSuccess,
  itemId,
  itemName,
  itemType,
  identifierLabel,
  identifierValue,
  deleteFunction,
  title = "Confirmar exclusão",
  confirmButtonText = "Excluir",
  cancelButtonText = "Cancelar",
  successMessage,
  errorMessage,
}: ConfirmDeleteModalProps<T>): React.ReactElement => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteFunction(itemId);
      message.success(successMessage || `${itemType} excluído com sucesso`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error(`Erro ao excluir ${itemType}:`, error);
      message.error(
        errorMessage ||
          `Não foi possível excluir o ${itemType}. Tente novamente.`
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const identifierDisplay =
    identifierLabel && identifierValue
      ? ` - ${identifierLabel} ${identifierValue}`
      : "";

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
          {title}
        </Title>

        <Text className="block mb-6 text-gray-600">
          Tem certeza que deseja excluir {itemType.toLowerCase()}{" "}
          <strong>
            {itemName}
            {identifierDisplay}
          </strong>
          ? Esta ação não poderá ser desfeita.
        </Text>

        <div className="flex gap-3 justify-center">
          <Button size="large" onClick={onClose} className="min-w-[120px]">
            {cancelButtonText}
          </Button>

          <Button
            type="primary"
            danger
            size="large"
            onClick={handleDelete}
            loading={isDeleting}
            className="min-w-[120px]"
          >
            {confirmButtonText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
