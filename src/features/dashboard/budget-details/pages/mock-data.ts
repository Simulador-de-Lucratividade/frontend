export const mockBudgetData = {
  id: "ORÇ-2024-0001",
  title: "Orçamento para Empresa A",
  status: "pending",
  createdAt: "15/02/2024",
  validUntil: "15/03/2024",
  client: {
    name: "Empresa A Ltda.",
    contact: "João Silva",
    email: "joao.silva@empresaa.com",
    phone: "(11) 98765-4321",
    address: "Av. Paulista, 1000, São Paulo - SP",
  },
  items: [
    {
      id: 1,
      description: "Desenvolvimento de Website",
      quantity: 1,
      unit: "serviço",
      unitPrice: 5000,
      total: 5000,
    },
    {
      id: 2,
      description: "Hospedagem Anual",
      quantity: 1,
      unit: "ano",
      unitPrice: 1200,
      total: 1200,
    },
    {
      id: 3,
      description: "Manutenção Mensal",
      quantity: 12,
      unit: "mês",
      unitPrice: 500,
      total: 6000,
    },
  ],
  subtotal: 12200,
  discount: 1220,
  tax: 610,
  total: 11590,
  notes:
    "Este orçamento inclui todos os serviços de desenvolvimento, hospedagem e manutenção por 12 meses.",
  history: [
    { date: "15/02/2024 | 18:39", user: "Adrian", action: "Orçamento criado" },
    {
      date: "16/02/2024 | 09:15",
      user: "Adrian",
      action: "Enviado por e-mail para o cliente",
    },
  ],
  comments: [
    {
      id: 1,
      user: "Adrian",
      date: "16/02/2024 | 10:30",
      text: "Cliente solicitou revisão do valor de manutenção mensal.",
    },
    {
      id: 2,
      user: "Mariana",
      date: "16/02/2024 | 14:45",
      text: "Entrei em contato por telefone, cliente está avaliando a proposta.",
    },
  ],
};
