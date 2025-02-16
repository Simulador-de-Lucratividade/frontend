"use client";
import { ApplicationLayout } from "@/shared/components/layout";
import { ProtectedRoute } from "@/shared/components/protected-route";
import { Button } from "antd";
import { AiOutlinePlus, AiOutlineFile } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { cards } from "../data/cards";

export default function HomeScreen() {
  return (
    <ProtectedRoute>
      <ApplicationLayout>
        <div className="flex flex-col gap-16">
          <div className="flex gap-6 items-center">
            {cards.map((card) => (
              <div
                key={card.key}
                className="flex-1 border border-borderSecondary rounded-xl p-4 cursor-pointer transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.09)] hover:bg-gray-50"
              >
                <div className="flex justify-between">
                  <Button className="py-5">{card.icon}</Button>
                  <AiOutlinePlus />
                </div>
                <p className="text-black text-base font-medium mt-4">
                  {card.title}
                </p>
              </div>
            ))}
          </div>
          <div>
            <h2 className="font-bold text-lg mb-4">Orçamentos recentes</h2>
            <div className="flex flex-wrap gap-4 flex-3">
              <div className="flex items-center justify-between border border-borderSecondary p-4 rounded-xl flex-1 max-w-[30%] cursor-pointer hover:bg-gray-50">
                <Button className="py-5 bg-borderSecondary border-none text-textBase">
                  <AiOutlineFile size={20} />
                </Button>
                <div>
                  <p className="font-medium text-base mb-1">
                    Climatização da igreja de XYZ
                  </p>
                  <span className="font-light text-sm">15/02/2024 | 18:39</span>
                </div>
                <Button className="bg-transparent border-none text-textBase">
                  <BsThreeDotsVertical size={20} />
                </Button>
              </div>
              <div className="flex items-center justify-between border border-borderSecondary p-4 rounded-xl flex-1 max-w-[30%] cursor-pointer hover:bg-gray-50">
                <Button className="py-5 bg-borderSecondary border-none text-textBase">
                  <AiOutlineFile size={20} />
                </Button>
                <div>
                  <p className="font-medium text-base mb-1">
                    Climatização da igreja de XYZ
                  </p>
                  <span className="font-light text-sm">15/02/2024 | 18:39</span>
                </div>
                <Button className="bg-transparent border-none text-textBase">
                  <BsThreeDotsVertical size={20} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ApplicationLayout>
    </ProtectedRoute>
  );
}
