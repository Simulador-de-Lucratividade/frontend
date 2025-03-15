"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Divider,
  Typography,
  notification,
  DatePicker,
  Table,
  InputNumber,
  Card,
  Statistic,
  Tooltip,
  Space,
  Tag,
  Alert,
} from "antd";
import {
  CalendarOutlined,
  DollarOutlined,
  PlusOutlined,
  SaveOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  PercentageOutlined,
  CalculatorOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import Masks from "@/shared/utils/masks";
import { useProducts } from "../../products/hooks/useProducts";
import { useCustomers } from "../../customers/hooks/useCustomers";
import { budgetService } from "../services/budget.service";
import { profitabilityService } from "../services/profitability.service";
import { getBudgetItemColumns } from "./columns";
import type { BudgetItemViewModel } from "../interfaces/IBudget";
import type {
  IOtherCost,
  IProfitabilityRequest,
} from "../interfaces/IProfitabilityCalculator";
import type { IService } from "../../additional-services/interface/IServices";
import { useServices } from "../../additional-services/hooks/useServices";

const { Title, Text } = Typography;
const { Option } = Select;

interface NewBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgetRefresh: () => void;
}

export const NewBudgetModal = ({
  isOpen,
  onClose,
  budgetRefresh,
}: NewBudgetModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [budgetItems, setBudgetItems] = useState<BudgetItemViewModel[]>([]);
  const [otherCosts, setOtherCosts] = useState<IOtherCost[]>([]);
  const [selectedServices, setSelectedServices] = useState<IService[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [profitability, setProfitability] = useState<number | null>(null);
  const [profitabilityLoading, setProfitabilityLoading] = useState(false);
  const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null);

  const [costName, setCostName] = useState("");
  const [costAmount, setCostAmount] = useState<number | null>(null);
  const [costType, setCostType] = useState<"fixed" | "percentage">("fixed");

  const { products } = useProducts();
  const { customers } = useCustomers();
  const { services } = useServices();

  // Calculate total cost whenever items, costs, or services change
  useEffect(() => {
    calculateTotalCost();
  }, [budgetItems, otherCosts, selectedServices]);

  // Calculate profitability whenever total value or total cost changes
  useEffect(() => {
    calculateProfitability();
  }, [totalValue, totalCost]);

  // Calculate the total cost of all items, additional costs, and services
  const calculateTotalCost = useCallback(() => {
    // Calculate cost of all product items
    const itemsCost = budgetItems.reduce(
      (sum, item) => sum + item.total_price,
      0
    );

    // Calculate fixed costs
    const fixedCosts = otherCosts
      .filter((cost) => cost.cost_type === "fixed")
      .reduce((acc, cost) => acc + Number(cost.amount), 0);

    // Calculate percentage-based costs
    const percentageCosts = otherCosts
      .filter((cost) => cost.cost_type === "percentage")
      .reduce((acc, cost) => acc + (itemsCost * Number(cost.amount)) / 100, 0);

    // Calculate service costs
    const serviceCosts = selectedServices.reduce(
      (acc, service) => acc + Number(service.cost),
      0
    );

    // Sum all costs
    const newTotalCost =
      itemsCost + fixedCosts + percentageCosts + serviceCosts;
    setTotalCost(newTotalCost);

    // Set a suggested price with 20% profit margin if we have costs
    if (newTotalCost > 0) {
      const suggested = newTotalCost * 1.2; // 20% profit margin
      setSuggestedPrice(suggested);

      // If total value hasn't been set by user yet, use the suggested price
      if (totalValue === 0) {
        setTotalValue(suggested);
        form.setFieldsValue({
          total_value: Masks.money(suggested.toString()),
        });
      }
    } else {
      setSuggestedPrice(null);
    }
  }, [budgetItems, otherCosts, selectedServices, form, totalValue]);

  const calculateProfitability = useCallback(() => {
    if (budgetItems.length === 0 || totalCost === 0 || totalValue === 0) {
      setProfitability(null);
      return;
    }

    setProfitabilityLoading(true);

    // Formata os itens conforme esperado pela API
    const formattedItems = budgetItems.map((item) => ({
      product_id: item.product_id,
      unit_price: Number(item.unit_price),
      quantity: Number(item.quantity),
      total_price: Number(item.total_price),
      discount: item.discount ? Number(item.discount) : 0,
    }));

    const formattedCosts = otherCosts.map((cost) => ({
      id: cost.id,
      description: cost.description,
      amount: Number(cost.amount),
      cost_type: cost.cost_type,
    }));

    const formattedServices = selectedServices.map((service) => ({
      id: service.id,
      name: service.name,
      description: service.description,
      cost: Number(service.cost),
    }));

    const requestPayload: IProfitabilityRequest = {
      items: formattedItems,
      total_value: totalValue,
      other_costs: formattedCosts,
      services: formattedServices,
    };

    profitabilityService
      .calculateProfitability(requestPayload)
      .then((response) => {
        if (response.data.success) {
          setProfitability(response.data.profitability);
        } else {
          notification.error({
            message: "Erro no cálculo de lucratividade",
            description: "Não foi possível calcular a lucratividade",
          });
          setProfitability(null);
        }
      })
      .catch((error) => {
        console.error("Error calculating profitability:", error);

        const errorMessage =
          error?.response?.data?.message ||
          "Ocorreu um erro ao calcular a lucratividade";

        notification.error({
          message: "Falha no cálculo",
          description: errorMessage,
        });

        setProfitability(null);
      })
      .finally(() => {
        setProfitabilityLoading(false);
      });
  }, [budgetItems, otherCosts, selectedServices, totalValue, totalCost]);

  const handleAddItem = useCallback(() => {
    const product_id = form.getFieldValue("product_id");
    const quantity = form.getFieldValue("quantity") || 1;
    const discount = form.getFieldValue("discount") || 0;

    if (!product_id) {
      notification.error({
        message: "Produto não selecionado",
        description:
          "Por favor, selecione um produto para adicionar ao orçamento.",
      });
      return;
    }

    const selectedProduct = products.find((p) => p.id === product_id);
    if (!selectedProduct) return;

    const unit_price = selectedProduct.acquisition_cost;
    const total_price = unit_price * quantity - discount;

    const newItem: BudgetItemViewModel = {
      id: Date.now().toString(),
      product_name: selectedProduct.name,
      product_id,
      unit_price,
      quantity,
      total_price,
      discount: discount || undefined,
    };

    const newItems = [...budgetItems, newItem];
    setBudgetItems(newItems);

    form.setFieldsValue({
      product_id: undefined,
      quantity: 1,
      discount: 0,
    });
  }, [form, products, budgetItems]);

  const handleRemoveItem = useCallback(
    (key: string) => {
      const newItems = budgetItems.filter((item) => item.id !== key);
      setBudgetItems(newItems);
    },
    [budgetItems]
  );

  const handleTotalValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (!value) {
        setTotalValue(0);
        return;
      }

      // Remove formatting and convert to number
      const numericValue = Number(value.replace(/[^\d]/g, "")) / 100;
      setTotalValue(numericValue);

      // Format the value for display
      const formattedValue = Masks.money(numericValue.toString());
      form.setFieldsValue({ total_value: formattedValue });
    },
    [form]
  );

  const handleAddCost = useCallback(() => {
    if (!costName || !costAmount) {
      notification.error({
        message: "Dados incompletos",
        description: "Por favor, preencha o nome e o valor do custo adicional.",
      });
      return;
    }

    const newCost: IOtherCost = {
      id: Date.now().toString(),
      description: costName,
      amount: costAmount,
      cost_type: costType,
    };

    setOtherCosts([...otherCosts, newCost]);

    setCostName("");
    setCostAmount(null);
    setCostType("fixed");
  }, [costName, costAmount, costType, otherCosts]);

  const handleRemoveCost = useCallback(
    (id: string) => {
      setOtherCosts(otherCosts.filter((cost) => cost.id !== id));
    },
    [otherCosts]
  );

  const handleServiceSelection = useCallback(
    (serviceIds: string[]) => {
      const selected = services
        .filter((service) => serviceIds.includes(service.id))
        .map((service) => ({ ...service }));

      setSelectedServices(selected);
    },
    [services]
  );

  const handleRemoveService = useCallback(
    (id: string) => {
      setSelectedServices(
        selectedServices.filter((service) => service.id !== id)
      );

      // Update the form's service_ids field to reflect the removal
      const currentServiceIds = form.getFieldValue("service_ids") || [];
      form.setFieldsValue({
        service_ids: currentServiceIds.filter(
          (serviceId: string) => serviceId !== id
        ),
      });
    },
    [selectedServices, form]
  );

  const handleUseSuggestedPrice = useCallback(() => {
    if (suggestedPrice) {
      setTotalValue(suggestedPrice);
      form.setFieldsValue({
        total_value: Masks.money(suggestedPrice.toString()),
      });
    }
  }, [suggestedPrice, form]);

  const handleSubmit = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        if (budgetItems.length === 0) {
          notification.error({
            message: "Nenhum item adicionado",
            description: "Por favor, adicione pelo menos um item ao orçamento.",
          });
          return Promise.reject("No items added");
        }

        if (totalValue <= 0) {
          notification.error({
            message: "Valor total inválido",
            description: "Por favor, defina um valor total para o orçamento.",
          });
          return Promise.reject("Invalid total value");
        }

        setLoading(true);

        const issue_date = values.issue_date.format("YYYY-MM-DD");
        const validity_date = values.validity_date.format("YYYY-MM-DD");

        const items = budgetItems.map((item) => ({
          product_id: item.product_id,
          unit_price: item.unit_price,
          quantity: item.quantity,
          total_price: item.total_price,
          discount: item.discount,
        }));

        const budgetData = {
          customer_id: values.customer_id,
          issue_date,
          validity_date,
          total_value: totalValue,
          total_cost: totalCost,
          status: values.status || "draft",
          items,
          other_costs: otherCosts,
          services: selectedServices,
          profitability: profitability || 0,
          notes: values.notes,
        };

        return budgetService.create(budgetData);
      })
      .then(() => {
        notification.success({
          message: "Orçamento criado com sucesso",
          description: `O orçamento foi cadastrado com sucesso!`,
        });
        onClose();
        budgetRefresh();
      })
      .catch((error) => {
        if (error === "No items added" || error === "Invalid total value")
          return;

        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Erro desconhecido";
        notification.error({
          message: "Falha ao criar orçamento",
          description: errorMessage,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [
    form,
    budgetItems,
    otherCosts,
    selectedServices,
    totalValue,
    totalCost,
    profitability,
    onClose,
    budgetRefresh,
  ]);

  const getProfitabilityColor = useCallback((value: number | null) => {
    if (value === null) return "";
    if (value < 0) return "#f5222d";
    if (value < 10) return "#faad14";
    if (value < 20) return "#52c41a";
    return "#1890ff";
  }, []);

  const columns = getBudgetItemColumns(handleRemoveItem);

  const serviceColumns = [
    {
      title: "Nome do Serviço",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Descrição",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Custo",
      dataIndex: "cost",
      key: "cost",
      render: (value: number) => `R$ ${value}`,
    },
    {
      title: "Ações",
      key: "action",
      render: (_: unknown, record: IService) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveService(record.id)}
        />
      ),
    },
  ];

  const costColumns = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Valor",
      dataIndex: "amount",
      key: "amount",
      render: (value: number, record: IOtherCost) =>
        record.cost_type === "percentage"
          ? `${value}%`
          : `R$ ${value.toFixed(2)}`,
    },
    {
      title: "Tipo",
      dataIndex: "cost_type",
      key: "cost_type",
      render: (value: string) => (value === "fixed" ? "Fixo" : "Percentual"),
    },
    {
      title: "Ações",
      key: "action",
      render: (_: unknown, record: IOtherCost) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveCost(record.id)}
        />
      ),
    },
  ];

  return (
    <Modal
      title={<Title level={4}>Novo Orçamento</Title>}
      open={isOpen}
      onCancel={onClose}
      width={900}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancelar
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
          icon={<SaveOutlined />}
        >
          Criar Orçamento
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: "draft",
          issue_date: dayjs(),
          validity_date: dayjs().add(30, "day"),
          quantity: 1,
          discount: 0,
        }}
      >
        <Card className="mb-4">
          <Row gutter={16} align="middle">
            <Col xs={24} md={12}>
              <Statistic
                title={
                  <Space>
                    <Text strong>Lucratividade Estimada</Text>
                    <Tooltip title="Calculada como: ((Valor Total - Custo Total) / Custo Total) * 100">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </Space>
                }
                value={profitability !== null ? profitability : "—"}
                precision={2}
                valueStyle={{
                  color: getProfitabilityColor(profitability),
                  fontSize: "28px",
                }}
                suffix="%"
                loading={profitabilityLoading}
              />
            </Col>
            <Col xs={24} md={12}>
              {profitability !== null && (
                <div>
                  {profitability < 0 && (
                    <Tag color="red">
                      Prejuízo! Revise os custos ou aumente o valor total.
                    </Tag>
                  )}
                  {profitability >= 0 && profitability < 10 && (
                    <Tag color="orange">
                      Lucratividade baixa. Considere ajustar os valores.
                    </Tag>
                  )}
                  {profitability >= 10 && profitability < 20 && (
                    <Tag color="green">Lucratividade boa.</Tag>
                  )}
                  {profitability >= 20 && (
                    <Tag color="blue">Lucratividade excelente!</Tag>
                  )}
                </div>
              )}
            </Col>
          </Row>
        </Card>

        <Divider orientation="left">Informações Básicas</Divider>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="customer_id"
              label="Cliente"
              rules={[
                {
                  required: true,
                  message: "Por favor, selecione o cliente",
                },
              ]}
            >
              <Select
                placeholder="Selecione o cliente"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {customers.map((customer) => (
                  <Option key={customer.id} value={customer.id}>
                    {customer.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="status"
              label="Status"
              rules={[
                { required: true, message: "Por favor, selecione o status" },
              ]}
            >
              <Select placeholder="Selecione o status">
                <Option value="draft">Rascunho</Option>
                <Option value="finalized">Finalizado</Option>
                <Option value="sent">Enviado</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="issue_date"
              label="Data de Emissão"
              rules={[
                {
                  required: true,
                  message: "Por favor, informe a data de emissão",
                },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                placeholder="Selecione a data"
                prefix={<CalendarOutlined />}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="validity_date"
              label="Data de Validade"
              rules={[
                {
                  required: true,
                  message: "Por favor, informe a data de validade",
                },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                placeholder="Selecione a data"
                prefix={<CalendarOutlined />}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Itens do Orçamento</Divider>

        <Row gutter={16}>
          <Col xs={24} md={10}>
            <Form.Item name="product_id" label="Produto">
              <Select
                placeholder="Selecione o produto"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {products.map((product) => (
                  <Option key={product.id} value={product.id}>
                    {product.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} md={5}>
            <Form.Item name="quantity" label="Quantidade">
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={12} md={5}>
            <Form.Item name="discount" label="Desconto (R$)">
              <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={4} className="flex items-end">
            <Form.Item label=" ">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddItem}
                style={{ width: "100%" }}
              >
                Adicionar
              </Button>
            </Form.Item>
          </Col>
        </Row>

        <Table
          dataSource={budgetItems}
          columns={columns}
          pagination={false}
          size="small"
          className="mb-4"
          rowKey="id"
        />

        <Divider orientation="left">Custos Adicionais</Divider>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item label="Nome do Custo">
              <Input
                placeholder="Ex: Frete, Impostos, etc."
                value={costName}
                onChange={(e) => setCostName(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item label="Valor">
              <InputNumber
                min={0}
                step={0.01}
                style={{ width: "100%" }}
                placeholder="Valor"
                value={costAmount}
                onChange={(value) => setCostAmount(value)}
                prefix={
                  costType === "percentage" ? (
                    <PercentageOutlined />
                  ) : (
                    <DollarOutlined />
                  )
                }
              />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item label="Tipo de Custo">
              <Select
                value={costType}
                onChange={(value: "fixed" | "percentage") => setCostType(value)}
              >
                <Option value="fixed">Fixo (R$)</Option>
                <Option value="percentage">Percentual (%)</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={4} className="flex items-end">
            <Form.Item label=" ">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddCost}
                style={{ width: "100%" }}
              >
                Adicionar
              </Button>
            </Form.Item>
          </Col>
        </Row>

        {otherCosts.length > 0 && (
          <Table
            dataSource={otherCosts}
            pagination={false}
            size="small"
            className="mb-4"
            columns={costColumns}
            rowKey="id"
          />
        )}

        <Divider orientation="left">Serviços</Divider>

        <Form.Item name="service_ids" label="Selecione os Serviços">
          <Select
            mode="multiple"
            placeholder="Selecione os serviços"
            style={{ width: "100%" }}
            onChange={handleServiceSelection}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children as unknown as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {services.map((service) => (
              <Option key={service.id} value={service.id}>
                {service.name} - R$ {service.cost}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {selectedServices.length > 0 && (
          <Table
            dataSource={selectedServices}
            pagination={false}
            size="small"
            className="mb-4"
            columns={serviceColumns}
            rowKey="id"
          />
        )}

        <Divider orientation="left">Resumo Financeiro</Divider>

        <Row gutter={16} className="mb-4">
          <Col xs={24} md={12}>
            <Card>
              <Statistic
                title="Custo Total"
                value={totalCost}
                precision={2}
                prefix={<DollarOutlined />}
                suffix="R$"
              />
              <Text type="secondary">
                Soma de todos os produtos, custos adicionais e serviços
              </Text>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            {suggestedPrice && (
              <Alert
                message="Sugestão de Preço"
                description={
                  <Space direction="vertical">
                    <Text>
                      Sugerimos um valor de R$ {suggestedPrice.toFixed(2)} para
                      obter uma margem de lucro de 20%.
                    </Text>
                    <Button
                      type="primary"
                      size="small"
                      icon={<CalculatorOutlined />}
                      onClick={handleUseSuggestedPrice}
                    >
                      Usar Valor Sugerido
                    </Button>
                  </Space>
                }
                type="info"
                showIcon
              />
            )}
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              name="total_value"
              label="Valor Total a Cobrar"
              rules={[
                {
                  required: true,
                  message: "Por favor, defina o valor total a cobrar",
                },
              ]}
              tooltip="Este é o valor que será cobrado do cliente. Defina um valor que garanta a lucratividade desejada."
            >
              <Input
                prefix={<DollarOutlined />}
                placeholder="R$ 0,00"
                onChange={handleTotalValueChange}
                style={{ fontWeight: "bold", fontSize: "16px" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="notes" label="Observações">
          <Input.TextArea
            rows={4}
            placeholder="Observações sobre o orçamento"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
