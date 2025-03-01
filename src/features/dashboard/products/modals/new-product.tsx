import { useState } from "react";
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
  InputNumber,
  Upload,
  Switch,
} from "antd";
import {
  InboxOutlined,
  DollarOutlined,
  BarcodeOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewProductModal = ({ isOpen, onClose }: NewProductModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [hasDiscount, setHasDiscount] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await form.validateFields();
      const values = form.getFieldsValue();
      console.log("Form values:", values);

      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadProps: UploadProps = {
    name: "file",
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        console.log(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        console.log(`${info.file.name} file upload failed.`);
      }
    },
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
              name="category"
              label="Categoria"
              rules={[{ required: true, message: "Selecione a categoria" }]}
            >
              <Select placeholder="Selecione a categoria">
                <Option value="electronics">Eletrônicos</Option>
                <Option value="furniture">Móveis</Option>
                <Option value="clothing">Vestuário</Option>
                <Option value="office">Material de escritório</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="price"
              label="Preço (R$)"
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
              name="stock"
              label="Estoque"
              rules={[
                { required: true, message: "Por favor, informe o estoque" },
              ]}
            >
              <InputNumber style={{ width: "100%" }} min={0} placeholder="0" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Selecione o status" }]}
            >
              <Select placeholder="Selecione o status">
                <Option value="active">Ativo</Option>
                <Option value="inactive">Inativo</Option>
                <Option value="out_of_stock">Sem estoque</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Produto em promoção">
              <Switch
                checked={hasDiscount}
                onChange={(checked) => setHasDiscount(checked)}
              />
              <Text type="secondary" style={{ marginLeft: 8 }}>
                {hasDiscount ? "Sim" : "Não"}
              </Text>
            </Form.Item>
          </Col>
        </Row>

        {hasDiscount && (
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="originalPrice"
                label="Preço original (R$)"
                rules={[
                  {
                    required: hasDiscount,
                    message: "Por favor, informe o preço original",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  step={0.01}
                  precision={2}
                  placeholder="0,00"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="discountEndDate" label="Data final da promoção">
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>
        )}

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

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="brand" label="Marca">
              <Input placeholder="Marca do produto" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="model" label="Modelo">
              <Input placeholder="Modelo do produto" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item name="weight" label="Peso (kg)">
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                step={0.01}
                precision={2}
                placeholder="0,00"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="width" label="Largura (cm)">
              <InputNumber style={{ width: "100%" }} min={0} placeholder="0" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="height" label="Altura (cm)">
              <InputNumber style={{ width: "100%" }} min={0} placeholder="0" />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Imagens</Divider>

        <Form.Item
          name="images"
          label="Imagens do produto"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e?.fileList;
          }}
        >
          <Upload.Dragger {...uploadProps} multiple listType="picture">
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Clique ou arraste arquivos para esta área para fazer upload
            </p>
            <p className="ant-upload-hint">
              Suporte para upload único ou em massa. Formatos suportados: JPG,
              PNG, WEBP
            </p>
          </Upload.Dragger>
        </Form.Item>
      </Form>
    </Modal>
  );
};
