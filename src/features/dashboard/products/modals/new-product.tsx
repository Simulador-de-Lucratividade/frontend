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
  InputNumber,
  notification,
} from "antd";
import { DollarOutlined, BarcodeOutlined } from "@ant-design/icons";
import { productService } from "../services/product.service";
import { AxiosError, AxiosResponse } from "axios";
import { ICreateProductResponse } from "../interface/IProduct";

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

    productService
      .create({
        name: values.name,
        acquisition_cost: values.acquisition_cost,
        sale_price: values.sale_price,
        description: values.description,
        reference_code: values.sku || null,
      })
      .then((res: AxiosResponse<ICreateProductResponse>) => {
        notification.success({
          message: "Produto cadastrado com sucesso",
          description: `O produto ${res.data.product.name} foi cadastrado com sucesso!`,
        });
        onClose();
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
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                step={0.01}
                precision={2}
                prefix={<DollarOutlined />}
                placeholder="0,00"
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
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                step={0.01}
                precision={2}
                prefix={<DollarOutlined />}
                placeholder="0,00"
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
                  required: true,
                  message: "Por favor, informe a descrição do produto",
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
