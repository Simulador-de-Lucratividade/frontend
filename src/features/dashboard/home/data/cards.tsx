import { ReactNode } from "react";
import { AiOutlineProduct } from "react-icons/ai";
import { BsFileEarmarkPlus, BsPerson, BsBriefcase } from "react-icons/bs";

interface CardProps {
  key: number;
  title: string;
  icon: ReactNode;
  goTo: string;
}

export const cards: CardProps[] = [
  {
    key: 1,
    title: "Novo orçamento",
    icon: <BsFileEarmarkPlus size={20} />,
    goTo: "/auth",
  },
  {
    key: 2,
    title: "Cadastrar cliente",
    icon: <BsPerson size={20} />,
    goTo: "/auth",
  },
  {
    key: 3,
    title: "Cadastrar produto",
    icon: <AiOutlineProduct size={20} />,
    goTo: "/auth",
  },
  {
    key: 4,
    title: "Novo serviço",
    icon: <BsBriefcase size={20} />,
    goTo: "/auth",
  },
];
