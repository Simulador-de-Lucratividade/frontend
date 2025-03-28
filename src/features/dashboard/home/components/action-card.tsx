"use client";

import type React from "react";

import { useRouter } from "next/navigation";
import { Button } from "antd";
import { FiPlus } from "react-icons/fi";
import type { CardProps } from "../data/cards";

export const ActionCard: React.FC<CardProps> = ({
  title,
  icon,
  id,
  redirect,
}) => {
  const router = useRouter();

  const handleCardClick = () => {
    if (redirect) {
      router.push(`${redirect}?action=${id}`);
    }
  };

  return (
    <div
      className="group w-full h-full bg-white border border-borderSecondary rounded-2xl p-4 sm:p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/10 hover:scale-[1.02]"
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-center">
        <Button className="py-4 sm:py-6 bg-primary/80 border-none group-hover:bg-primary/90 transition-colors">
          {icon}
        </Button>
        <FiPlus className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
      </div>
      <p className="text-gray-800 text-sm sm:text-base font-medium mt-4 sm:mt-5">
        {title}
      </p>
    </div>
  );
};
