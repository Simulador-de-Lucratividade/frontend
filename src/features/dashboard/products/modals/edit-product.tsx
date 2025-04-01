import { useState, useEffect } from "react";
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
  Spin,
} from "antd";
import { DollarOutlined, BarcodeOutlined } from "@ant-design/icons";
import { productService } from "../services/product.service";
import { AxiosError, AxiosResponse } from "axios";
import { ICreateProductResponse, IProduct } from "../interface/IProduct";
import Masks from "@/shared/utils/masks";

const { Title } = Typography;
const { TextArea } = Input;

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productRefresh: () => void;
  product: IProduct | undefined;
}

export const EditProductModal = ({
  isOpen,
  onClose,
  productRefresh,
  product,
}: EditProductModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(false);

  const fetchProductData = async () => {
    setFetchingProduct(true);
    try {
      form.setFieldsValue({
        name: product?.name,
        description: product?.description,
        sku: product?.reference_code,
        acquisition_cost: product?.acquisition_cost
          ? Masks.money(product.acquisition_cost.toString())
          : "",
        sale_price: product?.sale_price
          ? Masks.money(product.sale_price.toString())
          : "",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || error.message;
        notification.error({
          message: "Falha ao carregar dados do produto",
          description: errorMessage,
        });
      } else {
        notification.error({
          message: "Falha ao carregar dados do produto",
          description:
            "Ocorreu um erro inesperado. Tente novamente mais tarde.",
        });
      }
      onClose();
    } finally {
      setFetchingProduct(false);
    }
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

  const handleSubmit = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();

    if (loading || !values || !product) return;

    setLoading(true);

    const acquisitionCost = values.acquisition_cost
      ? Masks.clearMoney(values.acquisition_cost)
      : 0;

    const salePrice = values.sale_price
      ? Masks.clearMoney(values.sale_price)
      : 0;

    productService
      .update(product.id, {
        name: values.name,
        description: values.description,
        acquisition_cost: acquisitionCost,
        sale_price: salePrice,
        reference_code: values.sku || undefined,
      })
      .then((res: AxiosResponse<ICreateProductResponse>) => {
        notification.success({
          message: "Produto atualizado com sucesso",
          description: `O produto ${res.data.product.name} foi atualizado com sucesso!`,
        });
        onClose();
        productRefresh();
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          const errorMessage = error.response?.data?.message || error.message;
          notification.error({
            message: "Falha ao atualizar produto",
            description: errorMessage,
          });
        } else {
          notification.error({
            message: "Falha ao atualizar o produto",
            description:
              "Ocorreu um erro inesperado. Tente novamente mais tarde.",
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (isOpen && product) {
      fetchProductData();
    }
  }, [isOpen, product]);

  return (
    <Modal
      title={<Title level={4}>Editar Produto</Title>}
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
          Atualizar Produto
        </Button>,
      ]}
    >
      {fetchingProduct ? (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" tip="Carregando dados do produto..." />
        </div>
      ) : (
        <Form form={form} layout="vertical">
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
                rules={[
                  { required: true, message: "Por favor, informe o SKU" },
                ]}
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
                <TextArea
                  rows={4}
                  placeholder="Descrição detalhada do produto"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
    </Modal>
  );
};
