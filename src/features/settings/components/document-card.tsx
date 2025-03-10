import type React from "react";
import { Button, Dropdown } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiFileText, FiEdit, FiTrash, FiDownload } from "react-icons/fi";
import { Document } from "../interfaces/IDocument";
import { useRouter } from "next/navigation";

export const DocumentCard: React.FC<Document> = ({ id, title, datetime }) => {
  const router = useRouter();

  return (
    <div
      className="group flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 bg-white border border-borderSecondary p-3 sm:p-5 rounded-2xl w-full cursor-pointer hover:shadow-lg hover:border-primary/10 transition-all duration-300"
      onClick={() => router.push(`/orcamentos/${id}`)}
    >
      <Button className="py-3 sm:py-6 px-2 sm:px-4 bg-primary/5 border-none text-textBase min-w-[40px] sm:min-w-[48px] group-hover:bg-primary/10 transition-colors shrink-0">
        <FiFileText size={18} className="text-primary" />
      </Button>

      <div className="flex-1 min-w-0 order-3 sm:order-2 w-full sm:w-auto">
        <p className="font-medium text-gray-800 text-sm sm:text-base mb-1 sm:mb-2 truncate max-w-full">
          {title}
        </p>
        <span className="text-gray-500 text-xs sm:text-sm block truncate">
          {datetime}
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
          }}
        >
          <Button className="bg-transparent border-none text-gray-400 p-1 sm:p-2 hover:text-primary transition-colors">
            <BsThreeDotsVertical size={18} className="sm:w-5 sm:h-5" />
          </Button>
        </Dropdown>
      </div>
    </div>
  );
};
