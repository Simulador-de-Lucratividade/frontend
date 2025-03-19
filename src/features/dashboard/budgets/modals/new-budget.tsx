import { useState, useCallback } from "react";
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
  InfoCircleOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useProducts } from "../../products/hooks/useProducts";
import { useCustomers } from "../../customers/hooks/useCustomers";
import { budgetService } from "../services/budget.service";
import { getBudgetItemColumns } from "./columns/budget-item-columns";
import type { IService } from "../../additional-services/interface/IServices";
import { useServices } from "../../additional-services/hooks/useServices";
import { useBudgetItems } from "../hooks/useBudgetItems";
import { useBudgetCosts } from "../hooks/useBudgetCosts";
import { useBudgetFinancials } from "../hooks/useBudgetFinancials";
import Masks from "@/shared/utils/masks";
import { getServiceColumns } from "./columns/service-columns";
import { getCostColumns } from "./columns/cost-columns";

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
  const [selectedServices, setSelectedServices] = useState<IService[]>([]);

  const { products } = useProducts();
  const { customers } = useCustomers();
  const { services } = useServices();

  const { budgetItems, handleAddItem, handleRemoveItem, resetBudgetItems } =
    useBudgetItems(products, form);

  const {
    otherCosts,
    costName,
    setCostName,
    costAmount,
    setCostAmount,
    costType,
    setCostType,
    handleAddCost,
    handleRemoveCost,
    resetBudgetCosts,
  } = useBudgetCosts();

  const {
    totalCost,
    totalValue,
    profitability,
    profitabilityLoading,
    suggestedPrice,
    getProfitabilityColor,
    resetFinancials,
    handleTotalValueInput,
  } = useBudgetFinancials(budgetItems, otherCosts, selectedServices, form);

  const handleReset = useCallback(() => {
    form.resetFields();

    setSelectedServices([]);
    setLoading(false);

    resetBudgetItems();
    resetBudgetCosts();
    resetFinancials();

    form.setFieldsValue({
      status: "draft",
      issue_date: dayjs(),
      validity_date: dayjs().add(30, "day"),
      quantity: 1,
      discount: 0,
    });

    setCostName("");
    setCostAmount(null);
    setCostType("fixed");
  }, [
    form,
    resetBudgetItems,
    resetBudgetCosts,
    resetFinancials,
    setCostName,
    setCostAmount,
    setCostType,
  ]);

  const handleModalClose = useCallback(() => {
    handleReset();
    onClose();
  }, [handleReset, onClose]);

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

      const currentServiceIds = form.getFieldValue("service_ids") || [];
      form.setFieldsValue({
        service_ids: currentServiceIds.filter(
          (serviceId: string) => serviceId !== id
        ),
      });
    },
    [selectedServices, form]
  );

  const handleMoneyChange = useCallback(
    (value: string | number | null) => {
      if (value === null) return;
      const formattedValue = Masks.money(value.toString());
      form.setFieldsValue({ discount: formattedValue });
    },
    [form]
  );

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

        if (totalValue < 0) {
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
          unit_price:
            typeof item.unit_price === "string"
              ? Masks.clearMoney(item.unit_price)
              : item.unit_price,
          quantity: item.quantity,
          total_price:
            typeof item.total_price === "string"
              ? Masks.clearMoney(item.total_price)
              : item.total_price,
          discount:
            typeof item.discount === "string"
              ? Masks.clearMoney(item.discount)
              : item.discount,
        }));

        const budgetData = {
          customer_id: values.customer_id,
          issue_date,
          validity_date,
          total_value: totalValue,
          total_cost: totalCost,
          status: values.status || "draft",
          title: values.title,
          observations: values.observations ?? "",
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
        handleReset();
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
    handleReset,
  ]);

  const budgetItemColumns = getBudgetItemColumns(handleRemoveItem);
  const serviceColumns = getServiceColumns(handleRemoveService);
  const costColumns = getCostColumns(handleRemoveCost);

  const handleCostAmountChange = useCallback(
    (value: number | null) => {
      setCostAmount(value);
    },
    [setCostAmount]
  );

  const handleCostTypeChange = useCallback(
    (value: "fixed" | "percentage") => {
      setCostType(value);
      // Não precisamos reformatar explicitamente aqui, pois o formatter do InputNumber
      // será chamado automaticamente quando o costType mudar
    },
    [setCostType]
  );

  return (
    <Modal
      title={<Title level={4}>Novo Orçamento</Title>}
      open={isOpen}
      onCancel={handleModalClose}
      width={900}
      footer={[
        <Button
          key="back"
          onClick={handleModalClose}
          className="h-10"
          variant="outlined"
        >
          Cancelar
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
          icon={<SaveOutlined />}
          className="h-10"
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

        <Form.Item name="title" label="Título do Orçamento">
          <Input placeholder="Insira o título do orçamento" className="h-10" />
        </Form.Item>
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
                className="h-10"
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
              <Select placeholder="Selecione o status" className="h-10">
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
                format="DD/MM/YYYY"
                placeholder="Selecione a data"
                prefix={<CalendarOutlined />}
                className="h-10 w-full"
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
                format="DD/MM/YYYY"
                placeholder="Selecione a data"
                prefix={<CalendarOutlined />}
                className="h-10 w-full"
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
                className="h-10"
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
              <InputNumber
                min={1}
                className="h-10 w-full flex items-center justify-center"
              />
            </Form.Item>
          </Col>
          <Col xs={12} md={5}>
            <Form.Item name="discount" label="Desconto (R$)">
              <Input
                className="h-10 w-full"
                placeholder="R$ 0,00"
                onChange={(value) => handleMoneyChange(value.target.value)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={4} className="flex items-end">
            <Form.Item label=" ">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddItem}
                className="h-10 w-full"
              >
                Adicionar
              </Button>
            </Form.Item>
          </Col>
        </Row>

        <Table
          dataSource={budgetItems}
          columns={budgetItemColumns}
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
                className="h-10"
              />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item label="Valor">
              <InputNumber
                min={0}
                placeholder="Valor"
                value={costAmount}
                onChange={handleCostAmountChange}
                formatter={(value) => {
                  if (value === null || value === undefined) return "";
                  if (costType === "fixed") {
                    return `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  }
                  return `${value}`;
                }}
                parser={(value) => {
                  if (!value) return 0;
                  if (costType === "fixed") {
                    return (
                      Number.parseFloat(value.replace(/[^\d.-]/g, "")) || 0
                    );
                  }
                  return Number.parseFloat(value) || 0;
                }}
                prefix={
                  costType === "percentage" ? (
                    <PercentageOutlined />
                  ) : (
                    <DollarOutlined />
                  )
                }
                className="h-10 w-full"
              />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item label="Tipo de Custo">
              <Select
                value={costType}
                onChange={handleCostTypeChange}
                className="h-10"
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
                className="h-10 w-full"
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
            onChange={handleServiceSelection}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children as unknown as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            className="h-10 w-full"
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
                {
                  validator: (_, value) => {
                    const numericValue = Number(Masks.clearMoney(value));
                    if (numericValue >= 0) return Promise.resolve();
                    return Promise.reject("O valor não pode ser negativo");
                  },
                },
              ]}
              tooltip="Este é o valor que será cobrado do cliente. Defina um valor que garanta a lucratividade desejada."
            >
              <Input
                placeholder="R$ 0,00"
                onChange={handleTotalValueInput}
                className="h-10 w-full"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="observations" label="Observações">
          <Input.TextArea
            rows={4}
            placeholder="Observações sobre o orçamento"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
