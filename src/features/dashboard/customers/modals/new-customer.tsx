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
  notification,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { customerService } from "../services/customer.service";
import { AxiosError, AxiosResponse } from "axios";
import { ICustomerResponse } from "../interface/ICustomer";
import Masks from "@/shared/utils/masks";

const { Title } = Typography;
const { Option } = Select;

interface NewCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerRefresh: () => void;
}

export const NewCustomerModal = ({
  isOpen,
  onClose,
  customerRefresh,
}: NewCustomerModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === null) return;
      const formattedValue = Masks.phone(value.toString());
      form.setFieldsValue({ phone: formattedValue });
    },
    [form]
  );

  const handleCepChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === null) return;

      const formattedValue = Masks.cep(value.toString());
      form.setFieldsValue({ zipCode: formattedValue });
    },
    [form]
  );

  const handleSubmit = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();

    if (loading || !values) return;

    setLoading(true);

    customerService
      .create({
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        city: values.city,
        country: values.country,
        state: values.state,
        zip_code: values.zipCode,
      })
      .then((res: AxiosResponse<ICustomerResponse>) => {
        notification.success({
          message: "Cliente cadastrado com sucesso",
          description: `O cliente ${res.data.customer.name} foi cadastrado com sucesso!`,
        });
        onClose();
        customerRefresh();
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
      title={<Title level={4}>Novo Cliente</Title>}
      open={isOpen}
      onCancel={onClose}
      width={700}
      footer={[
        <Button
          key="back"
          onClick={onClose}
          variant="outlined"
          className="bg-transparent text-primary"
        >
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
          <Col xs={"100%"}>
            <Form.Item
              name="name"
              label="Nome da Empresa"
              rules={[
                {
                  required: true,
                  message: "Por favor, informe o nome da empresa",
                },
              ]}
              className="w-full"
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Nome da empresa"
                className="h-10 w-full"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: false },
                { type: "email", message: "Email inválido" },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email de contato"
                className="h-10"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="phone"
              label="Telefone"
              rules={[{ required: false }]}
            >
              <Input
                prefix={<PhoneOutlined />}
                onChange={(e) => handlePhoneChange(e)}
                placeholder="(00) 00000-0000"
                className="h-10"
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Endereço</Divider>

        <Row gutter={16}>
          <Col xs={24} md={16}>
            <Form.Item name="address" label="Endereço">
              <Input
                prefix={<HomeOutlined />}
                placeholder="Rua, número"
                className="h-10"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="city" label="Cidade">
              <Input placeholder="Cidade" className="h-10" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item name="state" label="Estado">
              <Select placeholder="Selecione o estado" className="h-10">
                <Option value="AC">Acre</Option>
                <Option value="AL">Alagoas</Option>
                <Option value="AP">Amapá</Option>
                <Option value="AM">Amazonas</Option>
                <Option value="BA">Bahia</Option>
                <Option value="CE">Ceará</Option>
                <Option value="DF">Distrito Federal</Option>
                <Option value="ES">Espírito Santo</Option>
                <Option value="GO">Goiás</Option>
                <Option value="MA">Maranhão</Option>
                <Option value="MT">Mato Grosso</Option>
                <Option value="MS">Mato Grosso do Sul</Option>
                <Option value="MG">Minas Gerais</Option>
                <Option value="PA">Pará</Option>
                <Option value="PB">Paraíba</Option>
                <Option value="PR">Paraná</Option>
                <Option value="PE">Pernambuco</Option>
                <Option value="PI">Piauí</Option>
                <Option value="RJ">Rio de Janeiro</Option>
                <Option value="RN">Rio Grande do Norte</Option>
                <Option value="RS">Rio Grande do Sul</Option>
                <Option value="RO">Rondônia</Option>
                <Option value="RR">Roraima</Option>
                <Option value="SC">Santa Catarina</Option>
                <Option value="SP">São Paulo</Option>
                <Option value="SE">Sergipe</Option>
                <Option value="TO">Tocantins</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="zipCode" label="CEP">
              <Input
                placeholder="00000-000"
                className="h-10"
                onChange={(e) => handleCepChange(e)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="country" label="País" initialValue="Brasil">
              <Input className="h-10" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
