import { ReactNode } from "react";
import { AiOutlineProduct } from "react-icons/ai";
import { BsFileEarmarkPlus, BsPerson, BsBriefcase } from "react-icons/bs";

export interface CardProps {
  id: number;
  title: string;
  icon: ReactNode;
  redirect: string;
}

export const cards: CardProps[] = [
  {
    id: 1,
    title: "Novo orçamento",
    icon: <BsFileEarmarkPlus size={20} />,
    redirect: "/orcamentos",
  },
  {
    id: 2,
    title: "Cadastrar cliente",
    icon: <BsPerson size={20} />,
    redirect: "/clientes",
  },
  {
    id: 3,
    title: "Cadastrar produto",
    icon: <AiOutlineProduct size={20} />,
    redirect: "/produtos",
  },
  {
    id: 4,
    title: "Novo serviço",
    icon: <BsBriefcase size={20} />,
    redirect: "/servicos",
  },
];
