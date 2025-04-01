import { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Row,
  Col,
  Divider,
  Typography,
  notification,
} from "antd";
import { DollarOutlined, BarcodeOutlined } from "@ant-design/icons";
import { productService } from "../services/product.service";
import { AxiosError, AxiosResponse } from "axios";
import { ICreateProductResponse } from "../interface/IProduct";
import Masks from "@/shared/utils/masks";

const { Title } = Typography;
const { TextArea } = Input;

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productRefresh: () => void;
}

export const NewProductModal = ({
  isOpen,
  onClose,
  productRefresh,
}: NewProductModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();

    if (loading || !values) return;

    setLoading(true);

    const acquisitionCost = values.acquisition_cost
      ? Masks.clearMoney(values.acquisition_cost)
      : 0;

    const salePrice = values.sale_price
      ? Masks.clearMoney(values.sale_price)
      : 0;

    productService
      .create({
        name: values.name,
        acquisition_cost: acquisitionCost,
        sale_price: salePrice,
        description: values.description,
        reference_code: values.sku || null,
      })
      .then((res: AxiosResponse<ICreateProductResponse>) => {
        notification.success({
          message: "Produto cadastrado com sucesso",
          description: `O produto ${res.data.product.name} foi cadastrado com sucesso!`,
        });
        onClose();
        form.resetFields();
        productRefresh();
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          const errorMessage = error.response?.data?.message || error.message;
          notification.error({
            message: "Falha ao cadastrar produto",
            description: errorMessage,
          });
        } else {
          notification.error({
            message: "Falha ao cadastrar o produto",
            description:
              "Ocorreu um erro inesperado. Tente novamente mais tarde.",
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleMoneyInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const { value } = e.target;

    const numericValue = value.replace(/\D/g, "");

    if (numericValue === "") {
      form.setFieldValue(fieldName, "");
      return;
    }

    form.setFieldValue(fieldName, Masks.money(numericValue));
  };

  return (
    <Modal
      title={<Title level={4}>Novo Produto</Title>}
      open={isOpen}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancelar
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Cadastrar Produto
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: "active",
          category: "electronics",
          stock: 1,
        }}
      >
        <Divider orientation="left">Informações Básicas</Divider>

        <Row gutter={16}>
          <Col xs={24} md={16}>
            <Form.Item
              name="name"
              label="Nome do Produto"
              rules={[
                {
                  required: true,
                  message: "Por favor, informe o nome do produto",
                },
              ]}
            >
              <Input placeholder="Nome do produto" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="sku"
              label="SKU"
              rules={[{ required: true, message: "Por favor, informe o SKU" }]}
            >
              <Input prefix={<BarcodeOutlined />} placeholder="SKU-001" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              name="acquisition_cost"
              label="Preço de custo (R$)"
              rules={[
                { required: true, message: "Por favor, informe o preço" },
              ]}
            >
              <Input
                prefix={<DollarOutlined />}
                placeholder="R$ 0,00"
                onChange={(e) => handleMoneyInput(e, "acquisition_cost")}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="sale_price"
              label="Preço de venda (R$)"
              rules={[
                { required: true, message: "Por favor, informe o preço" },
              ]}
            >
              <Input
                prefix={<DollarOutlined />}
                placeholder="R$ 0,00"
                onChange={(e) => handleMoneyInput(e, "sale_price")}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Detalhes do Produto</Divider>

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              name="description"
              label="Descrição"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <TextArea rows={4} placeholder="Descrição detalhada do produto" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
