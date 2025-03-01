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
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

interface NewCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewCustomerModal = ({
  isOpen,
  onClose,
}: NewCustomerModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

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

  return (
    <Modal
      title={<Title level={4}>Novo Cliente</Title>}
      open={isOpen}
      onCancel={onClose}
      width={700}
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
          Cadastrar Cliente
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: "active",
          type: "Corporativo",
        }}
      >
        <Divider orientation="left">Informações Básicas</Divider>

        <Row gutter={16}>
          <Col xs={24} md={16}>
            <Form.Item
              name="name"
              label="Nome da Empresa"
              rules={[
                {
                  required: true,
                  message: "Por favor, informe o nome da empresa",
                },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Nome da empresa" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="type"
              label="Tipo de Cliente"
              rules={[
                { required: true, message: "Selecione o tipo de cliente" },
              ]}
            >
              <Select placeholder="Selecione o tipo">
                <Option value="Corporativo">Corporativo</Option>
                <Option value="Varejo">Varejo</Option>
                <Option value="Industrial">Industrial</Option>
                <Option value="Serviços">Serviços</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Por favor, informe o email" },
                { type: "email", message: "Email inválido" },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email de contato" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="phone"
              label="Telefone"
              rules={[
                { required: true, message: "Por favor, informe o telefone" },
              ]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="(00) 00000-0000" />
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
                <Option value="prospect">Prospecto</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="document" label="CNPJ/CPF">
              <Input placeholder="00.000.000/0000-00" />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Endereço</Divider>

        <Row gutter={16}>
          <Col xs={24} md={16}>
            <Form.Item name="address" label="Endereço">
              <Input prefix={<HomeOutlined />} placeholder="Rua, número" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="city" label="Cidade">
              <Input placeholder="Cidade" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item name="state" label="Estado">
              <Select placeholder="Selecione o estado">
                <Option value="SP">São Paulo</Option>
                <Option value="RJ">Rio de Janeiro</Option>
                <Option value="MG">Minas Gerais</Option>
                <Option value="RS">Rio Grande do Sul</Option>
                <Option value="PR">Paraná</Option>
                <Option value="SC">Santa Catarina</Option>
                {/* Adicione outros estados conforme necessário */}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="zipCode" label="CEP">
              <Input placeholder="00000-000" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="country" label="País" initialValue="Brasil">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Informações Adicionais</Divider>

        <Form.Item name="notes" label="Observações">
          <Input.TextArea rows={4} placeholder="Observações sobre o cliente" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
