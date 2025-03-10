"use client";

import type React from "react";

import { Input, Spin } from "antd";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import { DocumentCard } from "@/features/dashboard/budgets/components/document-card";
import { Document } from "@/features/settings/interfaces/IDocument";

interface DocumentListProps {
  documents: Document[];
  loading?: boolean;
  onSearch?: (value: string) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  loading = false,
  onSearch,
}) => {
  return (
    <div className="space-y-6 sm:space-y-8 w-full">
      <div className="flex w-full">
        <Input
          placeholder="Buscar documentos..."
          prefix={<FiSearch className="text-gray-400" />}
          className="w-full sm:max-w-md rounded-xl text-base py-2 px-4"
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>

      <div className="space-y-4 w-full">
        {loading ? (
          <div className="flex justify-center py-8 sm:py-12">
            <Spin size="large" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid w-full gap-3 sm:gap-4"
          >
            {documents.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="w-full"
              >
                <DocumentCard
                  title={doc.title}
                  datetime={doc.datetime}
                  id={doc.id}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};
