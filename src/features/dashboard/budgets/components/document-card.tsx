import type React from "react";
import { Button, Dropdown } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiFileText, FiEdit, FiTrash, FiDownload } from "react-icons/fi";
import type { IBudget } from "../interfaces/IBudget";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { useState } from "react";
import { ConfirmDeleteModal } from "@/shared/components/delete-modal";
import { budgetService } from "../services/budget.service";

interface DocumentCardProps extends IBudget {
  budgetRefresh?: () => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  id,
  title,
  sequence_number,
  customer,
  created_at,
  budgetRefresh = () => {},
}) => {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const formattedDate = dayjs(created_at).format("DD/MM/YYYY");

  const handleCardClick = () => {
    router.push(`/orcamentos/${id}`);
  };

  const handleMenuClick = (e: {
    key: string;
    domEvent: React.MouseEvent<Element> | React.KeyboardEvent<Element>;
  }) => {
    e.domEvent.stopPropagation();

    if (e.key === "3") {
      setIsDeleteModalOpen(true);
    } else if (e.key === "1") {
      router.push(`/orcamentos/${id}/editar`);
    }
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <div
        className="group flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 bg-white border border-borderSecondary p-3 sm:p-5 rounded-2xl w-full cursor-pointer hover:shadow-lg hover:border-primary/10 transition-all duration-300"
        onClick={handleCardClick}
      >
        <Button className="py-3 sm:py-6 px-2 sm:px-4 bg-primary/5 border-none text-textBase min-w-[40px] sm:min-w-[48px] group-hover:bg-primary/10 transition-colors shrink-0">
          <FiFileText size={18} className="text-primary" />
        </Button>

        <div className="flex-1 min-w-0 order-3 sm:order-2 w-full sm:w-auto">
          <p className="font-medium text-gray-800 text-sm sm:text-base mb-1 sm:mb-2 truncate max-w-full">
            {title} - Orçamento Nº{sequence_number}
          </p>
          <p className="text-gray-800 font-light">
            {customer && customer.name}
          </p>
          <span className="text-gray-500 text-xs sm:text-sm block truncate mt-1">
            {formattedDate}
          </span>
        </div>

        <div className="order-2 sm:order-3 ml-auto sm:ml-0 shrink-0">
          <Dropdown
            trigger={["click"]}
            menu={{
              items: [
                {
                  label: (
                    <div className="flex items-center gap-3 px-4 py-2 hover:bg-primary/5 rounded-lg transition-colors">
                      <FiEdit size={16} className="text-primary" />
                      <p>Editar</p>
                    </div>
                  ),
                  key: "1",
                },
                {
                  label: (
                    <div className="flex items-center gap-3 px-4 py-2 hover:bg-primary/5 rounded-lg transition-colors">
                      <FiDownload size={16} className="text-primary" />
                      <p>Exportar</p>
                    </div>
                  ),
                  key: "2",
                },
                {
                  label: (
                    <div className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 rounded-lg transition-colors">
                      <FiTrash size={16} className="text-red-500" />
                      <p className="text-red-500">Excluir</p>
                    </div>
                  ),
                  key: "3",
                },
              ],
              onClick: handleMenuClick,
            }}
          >
            <Button
              className="bg-transparent border-none text-gray-400 p-1 sm:p-2 hover:text-primary transition-colors"
              onClick={handleDropdownClick}
            >
              <BsThreeDotsVertical size={18} className="sm:w-5 sm:h-5" />
            </Button>
          </Dropdown>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={budgetRefresh}
        itemId={id}
        itemName={title}
        itemType="Orçamento"
        identifierLabel="Nº"
        identifierValue={sequence_number}
        deleteFunction={budgetService.remove}
      />
    </>
  );
};
