import { useCallback, useState } from "react";
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
import { TagOutlined } from "@ant-design/icons";
import Masks from "@/shared/utils/masks";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface NewServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewServiceModal = ({ isOpen, onClose }: NewServiceModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleMoneyChange = useCallback(
    (value: string | number | null) => {
      if (value === null) return;
      const formattedValue = Masks.money(value.toString());
      form.setFieldsValue({ price: formattedValue });
    },
    [form]
  );

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
      title={<Title level={4}>Novo Serviço</Title>}
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
          Cadastrar Serviço
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          category: "consulting",
        }}
      >
        <Row gutter={16}>
          <Col xs={24} md={16}>
            <Form.Item
              name="name"
              label="Nome do Serviço"
              rules={[
                {
                  required: true,
                  message: "Por favor, informe o nome do serviço",
                },
              ]}
            >
              <Input placeholder="Nome do serviço" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="code"
              label="Código"
              rules={[
                { required: true, message: "Por favor, informe o código" },
              ]}
            >
              <Input prefix={<TagOutlined />} placeholder="SRV-001" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="category"
              label="Categoria"
              rules={[{ required: true, message: "Selecione a categoria" }]}
            >
              <Select placeholder="Selecione a categoria">
                <Option value="consulting">Consultoria</Option>
                <Option value="maintenance">Manutenção</Option>
                <Option value="development">Desenvolvimento</Option>
                <Option value="support">Suporte</Option>
                <Option value="training">Treinamento</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="price"
              label="Preço (R$)"
              rules={[
                { required: true, message: "Por favor, informe o preço" },
              ]}
            >
              <Input
                className="w-full"
                placeholder="R$ 0,00"
                onChange={(value) => handleMoneyChange(value.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="Descrição"
          rules={[
            {
              required: true,
              message: "Por favor, informe a descrição do serviço",
            },
          ]}
        >
          <TextArea rows={4} placeholder="Descreva os detalhes do serviço" />
        </Form.Item>

        <Divider />

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="duration" label="Duração estimada">
              <Input placeholder="Ex: 2 horas, 1 semana, etc" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="unit" label="Unidade de cobrança">
              <Select placeholder="Selecione a unidade">
                <Option value="hour">Por hora</Option>
                <Option value="project">Por projeto</Option>
                <Option value="monthly">Mensal</Option>
                <Option value="daily">Diária</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="requirements" label="Requisitos ou observações">
          <TextArea
            rows={3}
            placeholder="Requisitos específicos ou observações importantes"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
