import { FiArrowDown, FiArrowUp } from "react-icons/fi";

import { ReactElement } from "react";

interface IMenuOrderOption {
  text: string;
  icon: ReactElement;
  id: number;
}

export const orderOptions: IMenuOrderOption[] = [
  {
    text: "Mais recentes",
    icon: <FiArrowUp />,
    id: 1,
  },
  {
    text: "Mais antigos",
    icon: <FiArrowDown />,
    id: 2,
  },
];
